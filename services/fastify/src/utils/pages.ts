import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { unzipSync } from 'fflate'
import { AppError, ValidationError } from './errors.js'

export const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/

const MAX_FILES = 2000 // 单站文件数上限
const MAX_UNCOMPRESSED = 300 * 1024 * 1024 // 解压后总量上限 300MB

export interface DeploySiteResult {
  slug: string
  files: number
  hasIndexHtml: boolean
}

/** 校验相对路径并归一化；返回 null 表示目录条目应跳过，非法路径抛错。 */
function sanitizeRelPath(rawName: string): string | null {
  const rel = rawName.replace(/\\/g, '/')
  if (rel.endsWith('/')) return null
  const norm = path.posix.normalize(rel)
  if (
    norm.startsWith('/') ||
    norm === '.' ||
    norm === '..' ||
    norm.startsWith('../') ||
    norm.includes('/../') ||
    norm.includes('\0')
  ) {
    throw new ValidationError(`包含非法路径: ${rawName}`)
  }
  return norm
}

/** 校验 slug 或生成随机 slug。 */
function resolveSlug(sitesDir: string, slug?: string): string {
  let finalSlug = slug?.trim() ?? ''
  if (finalSlug && !SLUG_PATTERN.test(finalSlug)) {
    throw new ValidationError(`slug 非法: ${finalSlug}`)
  }
  if (!finalSlug) {
    do {
      finalSlug = crypto.randomBytes(4).toString('hex')
    } while (fs.existsSync(path.join(sitesDir, finalSlug)))
  }
  return finalSlug
}

/** 把已校验的条目写入 sitesDir/<slug>（目录已存在时整体覆盖）。 */
async function writeSiteEntries(
  safe: Array<[string, Uint8Array]>,
  sitesDir: string,
  finalSlug: string
): Promise<DeploySiteResult> {
  const siteDir = path.join(sitesDir, finalSlug)
  await fs.promises.rm(siteDir, { recursive: true, force: true })
  await fs.promises.mkdir(sitesDir, { recursive: true })
  for (const [rel, content] of safe) {
    const target = path.join(siteDir, rel)
    await fs.promises.mkdir(path.dirname(target), { recursive: true })
    await fs.promises.writeFile(target, content)
  }
  return {
    slug: finalSlug,
    files: safe.length,
    hasIndexHtml: fs.existsSync(path.join(siteDir, 'index.html')),
  }
}

/**
 * 校验 zip 内容并解压到 sitesDir/<slug>。slug 为空时随机生成；
 * 指定 slug 且目录已存在时整体覆盖。
 * 校验失败抛 AppError（statusCode 400/413）。
 */
export async function deploySiteZip(
  buf: Buffer,
  sitesDir: string,
  slug?: string
): Promise<DeploySiteResult> {
  let entries: Record<string, Uint8Array>
  try {
    entries = unzipSync(new Uint8Array(buf))
  } catch {
    throw new ValidationError('无法解析 zip 文件')
  }

  // 过滤并校验 zip 内路径，防路径穿越
  const safe: Array<[string, Uint8Array]> = []
  let totalSize = 0
  for (const [rawName, content] of Object.entries(entries)) {
    const norm = sanitizeRelPath(rawName)
    if (norm === null) continue
    totalSize += content.byteLength
    if (totalSize > MAX_UNCOMPRESSED) {
      throw new AppError('解压后总体积超出 300MB 上限', 413)
    }
    if (safe.length >= MAX_FILES) {
      throw new ValidationError(`zip 内文件数超出 ${MAX_FILES} 上限`)
    }
    safe.push([norm, content])
  }
  if (safe.length === 0) {
    throw new ValidationError('zip 内没有可部署的文件')
  }

  return writeSiteEntries(safe, sitesDir, resolveSlug(sitesDir, slug))
}

/**
 * 以「路径 → 文本内容」形式直接部署（面向无 zip 能力的聊天类客户端）。
 * 文本按 utf8 写入；二进制资源请走 zip。校验规则与 zip 部署一致。
 */
export async function deploySiteFiles(
  files: Record<string, string>,
  sitesDir: string,
  slug?: string
): Promise<DeploySiteResult> {
  const safe: Array<[string, Uint8Array]> = []
  let totalSize = 0
  for (const [rawName, text] of Object.entries(files)) {
    const norm = sanitizeRelPath(rawName)
    if (norm === null) continue
    const content = new TextEncoder().encode(text)
    totalSize += content.byteLength
    if (totalSize > MAX_UNCOMPRESSED) {
      throw new AppError('文件总体积超出 300MB 上限', 413)
    }
    if (safe.length >= MAX_FILES) {
      throw new ValidationError(`文件数超出 ${MAX_FILES} 上限`)
    }
    safe.push([norm, content])
  }
  if (safe.length === 0) {
    throw new ValidationError('没有可部署的文件')
  }

  return writeSiteEntries(safe, sitesDir, resolveSlug(sitesDir, slug))
}

// ---------- 站点列表 / 删除 / 部署审计日志 ----------

export interface SiteInfo {
  slug: string
  files: number
  sizeBytes: number
  mtime: number // 目录最后更新时间，毫秒时间戳
  hasIndexHtml: boolean
}

export interface DeployLogEntry {
  ts: string
  action: 'deploy' | 'delete'
  slug: string
  files?: number
  sizeBytes?: number
  ip?: string
  via?: 'http' | 'mcp'
}

const DEPLOY_LOG_FILE = '.deploy-log.jsonl'

/** 列出 sitesDir 下全部站点目录（隐藏文件/目录跳过），按更新时间倒序。 */
export async function listSites(sitesDir: string): Promise<SiteInfo[]> {
  const names = await fs.promises
    .readdir(sitesDir, { withFileTypes: true })
    .catch(() => [])

  const sites: SiteInfo[] = []
  for (const d of names) {
    if (!d.isDirectory() || d.name.startsWith('.')) continue
    const dir = path.join(sitesDir, d.name)
    let files = 0
    let sizeBytes = 0
    const walk = async (p: string) => {
      for (const e of await fs.promises.readdir(p, { withFileTypes: true })) {
        const fp = path.join(p, e.name)
        if (e.isDirectory()) await walk(fp)
        else {
          files++
          sizeBytes += (await fs.promises.stat(fp)).size
        }
      }
    }
    await walk(dir)
    const st = await fs.promises.stat(dir)
    sites.push({
      slug: d.name,
      files,
      sizeBytes,
      mtime: st.mtimeMs,
      hasIndexHtml: fs.existsSync(path.join(dir, 'index.html')),
    })
  }
  sites.sort((a, b) => b.mtime - a.mtime)
  return sites
}

/** 删除站点目录，返回是否实际删除。slug 非法抛 ValidationError。 */
export async function deleteSite(
  sitesDir: string,
  slug: string
): Promise<boolean> {
  if (!SLUG_PATTERN.test(slug)) {
    throw new ValidationError(`slug 非法: ${slug}`)
  }
  const dir = path.join(sitesDir, slug)
  if (!fs.existsSync(dir)) return false
  await fs.promises.rm(dir, { recursive: true, force: true })
  return true
}

/** 追加一条部署审计日志（JSONL，一行一条）。 */
export async function appendDeployLog(
  sitesDir: string,
  entry: Omit<DeployLogEntry, 'ts'>
): Promise<void> {
  await fs.promises.mkdir(sitesDir, { recursive: true })
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry })
  await fs.promises.appendFile(path.join(sitesDir, DEPLOY_LOG_FILE), line + '\n')
}

/** 读取最近 limit 条审计日志，新的在前。 */
export async function readDeployLog(
  sitesDir: string,
  limit = 50
): Promise<DeployLogEntry[]> {
  try {
    const txt = await fs.promises.readFile(
      path.join(sitesDir, DEPLOY_LOG_FILE),
      'utf8'
    )
    return txt
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l) as DeployLogEntry)
      .slice(-limit)
      .reverse()
  } catch {
    return []
  }
}
