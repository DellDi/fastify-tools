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
    const rel = rawName.replace(/\\/g, '/')
    if (rel.endsWith('/')) continue // 目录条目
    const norm = path.posix.normalize(rel)
    if (
      norm.startsWith('/') ||
      norm === '..' ||
      norm.startsWith('../') ||
      norm.includes('/../')
    ) {
      throw new ValidationError(`zip 包含非法路径: ${rawName}`)
    }
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

  let finalSlug = slug?.trim() ?? ''
  if (finalSlug && !SLUG_PATTERN.test(finalSlug)) {
    throw new ValidationError(`slug 非法: ${finalSlug}`)
  }
  if (!finalSlug) {
    do {
      finalSlug = crypto.randomBytes(4).toString('hex')
    } while (fs.existsSync(path.join(sitesDir, finalSlug)))
  }

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
