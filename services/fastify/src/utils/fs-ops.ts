import { createReadStream } from 'node:fs'
import { spawn } from 'node:child_process'
import { open, readdir, stat, lstat } from 'node:fs/promises'
import path from 'node:path'
import { isDenied } from './fs-safe.js'

export interface FsEntry {
  name: string
  type: 'dir' | 'file' | 'link' | 'other'
  size: number | null
  mtimeMs: number
  mode: string
  denied: boolean // 命中敏感黑名单，前端加锁标
}

// 目录列表：目录优先、按名称排；单条目 stat 失败不拖垮整列
export async function listDir(abs: string): Promise<FsEntry[]> {
  const dirents = await readdir(abs, { withFileTypes: true })
  const entries = await Promise.all(
    dirents.map(async (d) => {
      const p = path.posix.join(abs, d.name)
      let st = null
      try {
        st = d.isSymbolicLink() ? await lstat(p) : await stat(p)
      } catch {
        /* 悬空软链等 */
      }
      const type = d.isSymbolicLink()
        ? 'link'
        : d.isDirectory()
          ? 'dir'
          : d.isFile()
            ? 'file'
            : 'other'
      return {
        name: d.name,
        type: type as FsEntry['type'],
        size: st?.isFile() ? st.size : null,
        mtimeMs: st?.mtimeMs ?? 0,
        mode: st ? (st.mode & 0o777).toString(8) : '---',
        denied: isDenied(p),
      }
    })
  )
  return entries.sort(
    (a, b) =>
      (a.type === 'dir' ? 0 : a.type === 'link' ? 1 : 2) -
        (b.type === 'dir' ? 0 : b.type === 'link' ? 1 : 2) || a.name.localeCompare(b.name)
  )
}

// ---------- 文件读取 ----------

const READ_LIMIT = 2 * 1024 ** 2
const IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
}

export const imageMimeOf = (p: string) => IMAGE_MIME[path.posix.extname(p).toLowerCase()]

export interface FileReadResult {
  type: 'text' | 'binary' | 'image' | 'dir'
  content?: string
  mime?: string
  size: number
  mtimeMs: number
  truncated: boolean
}

// 文本分块读；图片走 /raw 流式接口；二进制仅回元信息
export async function readFileChunk(
  abs: string,
  offset = 0,
  limit = READ_LIMIT
): Promise<FileReadResult> {
  const st = await stat(abs)
  if (st.isDirectory()) return { type: 'dir', size: 0, mtimeMs: st.mtimeMs, truncated: false }
  const mime = imageMimeOf(abs)
  if (mime) return { type: 'image', mime, size: st.size, mtimeMs: st.mtimeMs, truncated: false }

  const fh = await open(abs, 'r')
  try {
    const want = Math.max(0, Math.min(limit, st.size - offset))
    const buf = Buffer.alloc(want)
    const { bytesRead } = await fh.read(buf, 0, want, offset)
    const chunk = buf.subarray(0, bytesRead)
    // 前 8KB 含 NUL 判二进制
    if (chunk.subarray(0, 8192).includes(0)) {
      return { type: 'binary', size: st.size, mtimeMs: st.mtimeMs, truncated: false }
    }
    return {
      type: 'text',
      content: chunk.toString('utf8'),
      size: st.size,
      mtimeMs: st.mtimeMs,
      truncated: offset + bytesRead < st.size,
    }
  } finally {
    await fh.close()
  }
}

export const fileStream = (abs: string) => createReadStream(abs)

// ---------- 检索（文件名子串 + 文本内容） ----------

export interface SearchHit {
  path: string // 容器内路径（/host 前缀）
  type: 'dir' | 'file'
  size: number | null
  match: 'name' | 'content'
}

const SKIP_SEARCH = new Set(['/host/proc', '/host/sys', '/host/dev', '/host/run'])

export async function searchFiles(opts: {
  root: string
  name?: string
  content?: string
  depth?: number
  limit?: number
  timeoutMs?: number
}): Promise<{ hits: SearchHit[]; truncated: boolean; timedOut: boolean }> {
  const { root, name, content } = opts
  const depth = Math.min(Math.max(opts.depth ?? 4, 1), 8)
  const limit = Math.min(opts.limit ?? 200, 500)
  const deadline = Date.now() + Math.min(opts.timeoutMs ?? 5000, 15000)
  const hits: SearchHit[] = []
  let timedOut = false
  const nameLc = name?.toLowerCase()

  const stack: { dir: string; d: number }[] = [{ dir: root, d: 0 }]
  while (stack.length && hits.length < limit) {
    if (Date.now() > deadline) {
      timedOut = true
      break
    }
    const { dir, d } = stack.pop()!
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const e of entries) {
      const p = path.posix.join(dir, e.name)
      if (SKIP_SEARCH.has(p) || isDenied(p)) continue
      const isDir = e.isDirectory()
      if (nameLc && e.name.toLowerCase().includes(nameLc)) {
        hits.push({ path: p, type: isDir ? 'dir' : 'file', size: null, match: 'name' })
        if (hits.length >= limit) break
      }
      if (isDir && d < depth && !e.isSymbolicLink()) {
        stack.push({ dir: p, d: d + 1 })
      } else if (content && e.isFile()) {
        try {
          const st = await stat(p)
          if (st.size === 0 || st.size > 2 * 1024 ** 2) continue
          const fh = await open(p, 'r')
          const buf = Buffer.alloc(st.size)
          const { bytesRead } = await fh.read(buf, 0, st.size, 0)
          await fh.close()
          if (buf.subarray(0, Math.min(bytesRead, 8192)).includes(0)) continue
          if (buf.toString('utf8').includes(content)) {
            hits.push({ path: p, type: 'file', size: st.size, match: 'content' })
          }
        } catch {
          /* 读不了跳过 */
        }
        if (hits.length >= limit || Date.now() > deadline) break
      }
    }
  }
  return { hits, truncated: hits.length >= limit, timedOut }
}

// ---------- 磁盘占用分析（du） ----------

export interface DuNode {
  name: string
  path: string
  size: number
  children?: DuNode[]
}

const SKIP_DU = new Set(['/host/proc', '/host/sys', '/host/dev', '/host/run'])

// 优先走系统 du(-x 不跨文件系统、-d 深度、-k KB 输出、块计数与系统一致)。
// 容器内是 busybox du;83 万级文件比 JS 异步递归快一个数量级。
// spawn 失败(如本地开发无该命令)回退 JS 实现。
export async function duTree(
  root: string,
  depth = 2,
  opts: { maxNodes?: number; timeoutMs?: number } = {}
): Promise<{ root: DuNode; truncated: boolean }> {
  const viaCmd = await duTreeViaCmd(root, depth, opts.timeoutMs ?? 45000).catch(() => null)
  if (viaCmd) return viaCmd
  return duTreeJs(root, depth, opts)
}

// du 输出行 "KB\t路径"（目录在后序输出,根在最后一行）建树
function duTreeViaCmd(root: string, depth: number, timeoutMs: number) {
  return new Promise<{ root: DuNode; truncated: boolean }>((resolve, reject) => {
    const child = spawn('du', ['-x', '-k', '-d', String(depth), root])
    let out = ''
    let truncated = false
    const timer = setTimeout(() => {
      truncated = true
      child.kill('SIGKILL')
    }, timeoutMs)
    child.stdout.on('data', (c: Buffer) => (out += c.toString()))
    child.on('error', reject)
    child.on('close', () => {
      clearTimeout(timer)
      const nodes = new Map<string, DuNode>()
      for (const line of out.split('\n')) {
        const tab = line.indexOf('\t')
        if (tab <= 0) continue
        const size = Number(line.slice(0, tab)) * 1024
        const p = line.slice(tab + 1).trim()
        if (!p) continue
        nodes.set(p, { name: p === root ? path.posix.basename(p) || '/' : path.posix.basename(p), path: p, size })
      }
      const rootNode = nodes.get(root)
      if (!rootNode) return reject(new Error('du 无输出'))
      for (const [p, n] of nodes) {
        if (p === root) continue
        const parent = nodes.get(path.posix.dirname(p))
        if (parent) (parent.children ??= []).push(n)
      }
      for (const n of nodes.values()) n.children?.sort((a, b) => b.size - a.size)
      resolve({ root: rootNode, truncated })
    })
  })
}

// JS 回退实现（同 du -x 语义:不跨挂载点、按分配块计）
async function duTreeJs(
  root: string,
  depth = 2,
  opts: { maxNodes?: number; timeoutMs?: number } = {}
): Promise<{ root: DuNode; truncated: boolean }> {
  const maxNodes = opts.maxNodes ?? 30000
  const deadline = Date.now() + (opts.timeoutMs ?? 10000)
  let nodes = 0
  let truncated = false

  const rootDev = (await stat(root)).dev

  const walk = async (dir: string, d: number): Promise<DuNode> => {
    nodes++
    const self: DuNode = { name: path.posix.basename(dir) || '/', path: dir, size: 0 }
    if (nodes > maxNodes || Date.now() > deadline) {
      truncated = true
      return self
    }
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return self
    }
    const children: DuNode[] = []
    for (const e of entries) {
      const p = path.posix.join(dir, e.name)
      if (SKIP_DU.has(p) || e.isSymbolicLink()) continue
      if (e.isDirectory()) {
        try {
          if ((await lstat(p)).dev !== rootDev) continue // 挂载点，不进入
        } catch {
          continue
        }
        const sub = await walk(p, d + 1)
        self.size += sub.size
        // 超过 depth 的层级并入但不展开
        if (d < depth) children.push(sub)
      } else if (e.isFile()) {
        try {
          // st_blocks*512 = 实际分配块（du 语义），稀疏文件不虚高
          self.size += (await lstat(p)).blocks * 512
        } catch {
          /* 消失的临时文件 */
        }
      }
    }
    children.sort((a, b) => b.size - a.size)
    if (children.length) self.children = children
    return self
  }

  const tree = await walk(root, 0)
  return { root: tree, truncated }
}
