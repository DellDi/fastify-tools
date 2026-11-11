import os from 'node:os'
import tls from 'node:tls'
import { access, readFile, statfs } from 'node:fs/promises'
import { IntervalHistogram, monitorEventLoopDelay } from 'node:perf_hooks'
import { dockerApi } from './docker.js'
import { listSites } from './pages.js'

// 容器内 /proc 未做命名空间隔离，读到的是宿主机真实指标；
// 挂载点（如 /srv/pages-sites）的 statfs/mountinfo 同样是宿主机所在盘的数据。

interface QueryRawLike {
  $queryRawUnsafe<T = unknown>(query: string): Promise<T>
}

export interface StatusOptions {
  diskPath: string
  prisma?: QueryRawLike
  baseDomain?: string
  dockerSock?: string
}

export interface SystemStatus {
  ts: number
  uptimeSec: number
  cpu: {
    cores: number
    usagePercent: number
    load1: number
    load5: number
    load15: number
    runningProcs: number | null
    totalProcs: number | null
    perCore: number[] | null
  }
  memory: {
    totalBytes: number
    usedBytes: number
    usagePercent: number
    cachedBytes: number | null
    buffersBytes: number | null
    swapTotalBytes: number | null
    swapUsedBytes: number | null
  }
  disk: {
    path: string
    totalBytes: number
    usedBytes: number
    usagePercent: number
    readBytesPerSec: number | null
    writeBytesPerSec: number | null
  } | null
  process: {
    uptimeSec: number
    rssBytes: number
    eventLoopDelayMs: number | null
  }
  network: {
    rxBytesPerSec: number | null
    txBytesPerSec: number | null
    // true = 读的是宿主机 /host/proc（全机流量），false = 容器自身网卡
    hostView: boolean
  } | null
  containers: { name: string; image: string; state: string; status: string }[]
  databases: { name: string; sizeBytes: number }[]
  pages: { sites: number; totalBytes: number } | null
  certificates: { domain: string; daysLeft: number | null }[]
}

const round = (n: number, digits = 1) => Number(n.toFixed(digits))
const clampPercent = (n: number) => Math.min(100, Math.max(0, n))
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---------- /proc 原始计数器 ----------

interface CpuTimes {
  idle: number
  total: number
}

interface RawCounters {
  cpuAll: CpuTimes | null
  perCore: CpuTimes[]
  disks: Map<string, { r: number; w: number }>
}

function parseCpuLine(line: string): CpuTimes {
  const fields = line.trim().split(/\s+/).slice(1).map(Number)
  return {
    idle: (fields[3] ?? 0) + (fields[4] ?? 0), // idle + iowait
    total: fields.reduce((sum, n) => sum + n, 0),
  }
}

async function readRawCounters(): Promise<RawCounters | null> {
  try {
    const [stat, diskstats] = await Promise.all([
      readFile('/proc/stat', 'utf8'),
      readFile('/proc/diskstats', 'utf8'),
    ])

    const cpuLines = stat.split('\n').filter((l) => /^cpu\d*\s/.test(l))
    const cpuAll = cpuLines.length ? parseCpuLine(cpuLines[0]) : null
    const perCore = cpuLines.slice(1).map(parseCpuLine)

    // 字段: major minor name rd_ios rd_merges rd_sectors rd_ms wr_ios wr_merges wr_sectors ...
    const disks = new Map<string, { r: number; w: number }>()
    for (const line of diskstats.split('\n')) {
      const f = line.trim().split(/\s+/)
      if (f.length < 10) continue
      disks.set(`${f[0]}:${f[1]}`, {
        r: Number(f[5]) * 512,
        w: Number(f[9]) * 512,
      })
    }

    return { cpuAll, perCore, disks }
  } catch {
    return null
  }
}

// ---------- 网络计数器 ----------

// 挂了 host /proc 就读宿主机全机流量（含所有网卡，排除 lo）；
// 没挂则退回容器自身 /proc/net/dev（仅容器 veth 视角）
let resolvedNetDev: { path: string; hostView: boolean } | null = null
async function netDevPath(): Promise<{ path: string; hostView: boolean }> {
  if (resolvedNetDev) return resolvedNetDev
  try {
    await access('/host/proc/net/dev')
    resolvedNetDev = { path: '/host/proc/net/dev', hostView: true }
  } catch {
    resolvedNetDev = { path: '/proc/net/dev', hostView: false }
  }
  return resolvedNetDev
}

async function readNetCounters(): Promise<{ rx: number; tx: number; hostView: boolean } | null> {
  try {
    const { path, hostView } = await netDevPath()
    const raw = await readFile(path, 'utf8')
    let rx = 0
    let tx = 0
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([^:]+):\s*(\d[\d\s]*)$/)
      if (!m || m[1].trim() === 'lo') continue
      const f = m[2].trim().split(/\s+/)
      rx += Number(f[0])
      tx += Number(f[8])
    }
    return { rx, tx, hostView }
  } catch {
    return null
  }
}

// /proc/self/mountinfo 找挂载点所属块设备 major:minor（前缀最长匹配）
async function findMountDevice(mountPath: string): Promise<string | null> {
  try {
    const mountinfo = await readFile('/proc/self/mountinfo', 'utf8')
    let bestLen = -1
    let bestDev: string | null = null
    for (const line of mountinfo.split('\n')) {
      const f = line.split(' ')
      if (f.length < 5) continue
      const mp = f[4].replace(/\\040/g, ' ')
      if ((mountPath === mp || mountPath.startsWith(mp + '/')) && mp.length > bestLen) {
        bestLen = mp.length
        bestDev = f[2]
      }
    }
    return bestDev
  } catch {
    return null
  }
}

interface RateSample {
  cpuPercent: number | null
  perCore: number[] | null
  readBps: number | null
  writeBps: number | null
  net: { rxBps: number | null; txBps: number | null; hostView: boolean } | null
}

// 一个 windowMs 窗口内双采样 /proc/stat + /proc/diskstats，
// 得到 CPU 总使用率、每核使用率和磁盘 IO 速率
async function sampleRates(mountPath: string, windowMs = 200): Promise<RateSample> {
  const none: RateSample = {
    cpuPercent: null,
    perCore: null,
    readBps: null,
    writeBps: null,
    net: null,
  }
  const [dev, t0, n0] = await Promise.all([
    findMountDevice(mountPath),
    readRawCounters(),
    readNetCounters(),
  ])
  if (!t0) return none
  await sleep(windowMs)
  const [t1, n1] = await Promise.all([readRawCounters(), readNetCounters()])
  if (!t1) return none

  const pct = (a: CpuTimes, b: CpuTimes) => {
    const dt = b.total - a.total
    const di = b.idle - a.idle
    return dt > 0 ? clampPercent(((dt - di) / dt) * 100) : null
  }

  const cpuPercent = t0.cpuAll && t1.cpuAll ? pct(t0.cpuAll, t1.cpuAll) : null
  const perCore =
    t0.perCore.length > 0 && t0.perCore.length === t1.perCore.length
      ? (t0.perCore
          .map((c, i) => pct(c, t1.perCore[i]))
          .filter((n): n is number => n != null) as number[])
      : null

  let readBps: number | null = null
  let writeBps: number | null = null
  const d0 = dev ? t0.disks.get(dev) : undefined
  const d1 = dev ? t1.disks.get(dev) : undefined
  if (d0 && d1) {
    const secs = windowMs / 1000
    const dr = (d1.r - d0.r) / secs
    const dw = (d1.w - d0.w) / secs
    readBps = Number.isFinite(dr) ? round(Math.max(0, dr)) : null
    writeBps = Number.isFinite(dw) ? round(Math.max(0, dw)) : null
  }

  const secs = windowMs / 1000
  const net =
    n0 && n1 && n0.hostView === n1.hostView
      ? {
          rxBps: round(Math.max(0, (n1.rx - n0.rx) / secs)),
          txBps: round(Math.max(0, (n1.tx - n0.tx) / secs)),
          hostView: n0.hostView,
        }
      : null

  return { cpuPercent, perCore, readBps, writeBps, net }
}

// ---------- 单次读取指标 ----------

async function readMemInfo() {
  try {
    const meminfo = await readFile('/proc/meminfo', 'utf8')
    const pick = (key: string) => {
      const m = meminfo.match(new RegExp(`^${key}:\\s+(\\d+)`, 'm'))
      return m ? Number(m[1]) * 1024 : null
    }
    const totalBytes = pick('MemTotal')
    const availBytes = pick('MemAvailable')
    if (totalBytes == null || availBytes == null) return null
    const swapTotal = pick('SwapTotal')
    const swapFree = pick('SwapFree')
    return {
      totalBytes,
      usedBytes: totalBytes - availBytes,
      cachedBytes: pick('Cached'),
      buffersBytes: pick('Buffers'),
      swapTotalBytes: swapTotal,
      swapUsedBytes: swapTotal != null && swapFree != null ? swapTotal - swapFree : null,
    }
  } catch {
    return null
  }
}

async function readProcCounts(): Promise<{ running: number; total: number } | null> {
  try {
    const loadavg = await readFile('/proc/loadavg', 'utf8')
    const m = loadavg.match(/(\d+)\/(\d+)/)
    return m ? { running: Number(m[1]), total: Number(m[2]) } : null
  } catch {
    return null
  }
}

async function readDisk(mountPath: string) {
  try {
    const s = await statfs(mountPath)
    const totalBytes = s.blocks * s.bsize
    const freeBytes = s.bavail * s.bsize
    return { path: mountPath, totalBytes, usedBytes: totalBytes - freeBytes }
  } catch {
    return null
  }
}

async function readDatabaseSizes(
  prisma: QueryRawLike
): Promise<{ name: string; sizeBytes: number }[]> {
  try {
    // double precision 避免 bigint 无法 JSON 序列化
    return await prisma.$queryRawUnsafe<{ name: string; sizeBytes: number }[]>(
      `SELECT datname AS name, CAST(pg_database_size(datname) AS double precision) AS "sizeBytes"
       FROM pg_database WHERE datname IN ('fastify_db', 'shadcn_next')`
    )
  } catch {
    return []
  }
}

async function readPagesStats(diskPath: string) {
  try {
    const sites = await listSites(diskPath)
    if (!sites.length) return null
    return { sites: sites.length, totalBytes: sites.reduce((a, s) => a + s.sizeBytes, 0) }
  } catch {
    return null
  }
}

// TLS 握手取证书剩余天数；rejectUnauthorized:false 保证过期证书也能读到日期
function probeCertDays(host: string, timeoutMs = 5000): Promise<number | null> {
  return new Promise((resolve) => {
    try {
      const sock = tls.connect(
        443,
        host,
        { servername: host, timeout: timeoutMs, rejectUnauthorized: false },
        () => {
          const cert = sock.getPeerCertificate()
          sock.end()
          if (!cert?.valid_to) return resolve(null)
          const days = Math.floor(
            (new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000
          )
          resolve(Number.isFinite(days) ? days : null)
        }
      )
      sock.on('timeout', () => {
        sock.destroy()
        resolve(null)
      })
      sock.on('error', () => resolve(null))
    } catch {
      resolve(null)
    }
  })
}

// 探测根域证书 + pages 泛域名证书（任意子域 SNI 都会命中泛域名 vhost）
async function readCertificates(baseDomain?: string) {
  if (!baseDomain) return []
  const apex = baseDomain.split('.').slice(1).join('.')
  const targets = [
    ...(apex ? [{ domain: apex, host: apex }] : []),
    { domain: `*.${baseDomain}`, host: `cert-probe.${baseDomain}` },
  ]
  return Promise.all(
    targets.map(async (t) => ({ domain: t.domain, daysLeft: await probeCertDays(t.host) }))
  )
}

// ---------- Docker 容器列表 ----------

// 需挂载 /var/run/docker.sock；未挂载返回空数组
async function readDockerContainers(sockPath: string) {
  try {
    await access(sockPath)
    const list = await dockerApi<
      { Names: string[]; Image: string; State: string; Status: string }[]
    >('/containers/json')
    return list.map((c) => ({
      name: c.Names[0]?.replace(/^\//, '') ?? 'unknown',
      image: c.Image,
      state: c.State,
      status: c.Status,
    }))
  } catch {
    return []
  }
}

// ---------- fastify 进程自身健康 ----------

let eld: IntervalHistogram | null = null
function readEventLoopDelayMs(): number | null {
  try {
    if (!eld) {
      eld = monitorEventLoopDelay()
      eld.enable()
    }
    const mean = eld.mean / 1e6
    eld.reset()
    return Number.isFinite(mean) ? round(mean, 2) : null
  } catch {
    return null
  }
}

// ---------- 汇总 ----------

export async function getSystemStatus(opts: StatusOptions): Promise<SystemStatus> {
  const [rates, memory, procs, diskStat, databases, pages, certificates, containers] =
    await Promise.all([
      sampleRates(opts.diskPath),
      readMemInfo(),
      readProcCounts(),
      readDisk(opts.diskPath).then((d) => d ?? readDisk('/')),
      opts.prisma ? readDatabaseSizes(opts.prisma) : Promise.resolve([]),
      readPagesStats(opts.diskPath),
      readCertificates(opts.baseDomain),
      readDockerContainers(opts.dockerSock ?? '/var/run/docker.sock'),
    ])

  const [load1, load5, load15] = os.loadavg()
  const cores = os.cpus().length
  const totalMem = memory?.totalBytes ?? os.totalmem()
  const usedMem = memory?.usedBytes ?? totalMem - os.freemem()

  return {
    ts: Date.now(),
    uptimeSec: Math.floor(os.uptime()),
    cpu: {
      cores,
      usagePercent: round(rates.cpuPercent ?? Math.min(100, (load1 / cores) * 100)),
      load1: round(load1, 2),
      load5: round(load5, 2),
      load15: round(load15, 2),
      runningProcs: procs?.running ?? null,
      totalProcs: procs?.total ?? null,
      perCore: rates.perCore,
    },
    memory: {
      totalBytes: totalMem,
      usedBytes: usedMem,
      usagePercent: round((usedMem / totalMem) * 100),
      cachedBytes: memory?.cachedBytes ?? null,
      buffersBytes: memory?.buffersBytes ?? null,
      swapTotalBytes: memory?.swapTotalBytes ?? null,
      swapUsedBytes: memory?.swapUsedBytes ?? null,
    },
    disk: diskStat
      ? {
          ...diskStat,
          usagePercent: round((diskStat.usedBytes / diskStat.totalBytes) * 100),
          readBytesPerSec: rates.readBps,
          writeBytesPerSec: rates.writeBps,
        }
      : null,
    process: {
      uptimeSec: Math.floor(process.uptime()),
      rssBytes: process.memoryUsage().rss,
      eventLoopDelayMs: readEventLoopDelayMs(),
    },
    network: rates.net
      ? {
          rxBytesPerSec: rates.net.rxBps,
          txBytesPerSec: rates.net.txBps,
          hostView: rates.net.hostView,
        }
      : null,
    containers,
    databases,
    pages,
    certificates,
  }
}

// ---------- 采样器：内存环形缓冲，30s × 2880 点 ≈ 24h ----------

const SAMPLE_INTERVAL_MS = 30_000
const HISTORY_LIMIT = 2880

const history: SystemStatus[] = []
let timer: NodeJS.Timeout | null = null
let sampling = false

export function startSystemSampler(opts: StatusOptions): void {
  if (timer) return
  const tick = async () => {
    if (sampling) return
    sampling = true
    try {
      history.push(await getSystemStatus(opts))
      if (history.length > HISTORY_LIMIT) {
        history.splice(0, history.length - HISTORY_LIMIT)
      }
    } catch {
      // 单次采样失败不影响后续 tick
    } finally {
      sampling = false
    }
  }
  void tick()
  timer = setInterval(tick, SAMPLE_INTERVAL_MS)
  timer.unref?.()
}

export function stopSystemSampler(): void {
  if (timer) clearInterval(timer)
  timer = null
}

export function getLatestStatus(): SystemStatus | null {
  return history.at(-1) ?? null
}

export function getStatusHistory(hours = 24): SystemStatus[] {
  const since = Date.now() - hours * 3_600_000
  return history.filter((s) => s.ts >= since)
}
