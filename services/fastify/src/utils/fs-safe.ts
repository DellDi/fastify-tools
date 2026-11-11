import path from 'node:path'
import { realpath } from 'node:fs/promises'

// 宿主机根在容器内的挂载点（compose: /:/host:ro）；本地开发可用 FS_HOST_ROOT 指向测试目录
export const HOST_ROOT = process.env.FS_HOST_ROOT || '/host'

// 可写根：compose 里对 /host 嵌套 rw 挂载的宿主目录，写操作仅限其内
const WRITABLE_ROOTS = [`${HOST_ROOT}/opt`, `${HOST_ROOT}/srv`]

// 敏感路径：即使全盘可读，预览/下载/写操作一律拒绝
const DENY = [
  /(^|\/)\.ssh(\/|$)/, // ssh 密钥目录
  /(^|\/)id_[a-z0-9]+$/i, // 散落的私钥
  /(^|\/)account\.conf$/, // acme.sh 云厂商凭据
  /(^|\/)shadow(-|\.|$)/, // /etc/shadow 系列
  /(^|\/)gshadow(-|\.|$)/,
  /(^|\/)\.env(\.|$)/, // 环境密钥文件
  /(^|\/)\.git-credentials$/,
  /(^|\/)\.netrc$/,
  /(^|\/)\.pgpass$/,
  /\.(pem|p12|pfx|kdbx|key)$/i,
]

export class FsError extends Error {
  constructor(
    message: string,
    readonly statusCode = 400
  ) {
    super(message)
  }
}

export interface ResolvedPath {
  abs: string // 容器内绝对路径（/host/... 前缀）
  hostPath: string // 去掉 /host 前缀的宿主机视角路径（展示用）
  writable: boolean // 是否落在可写白名单根内
}

// 路径不存在时（mkdir/rename/upload 的目标）退而校验父目录
async function realpathOrParent(p: string): Promise<string> {
  try {
    return await realpath(p)
  } catch {
    const parent = await realpath(path.posix.dirname(p))
    return path.posix.join(parent, path.posix.basename(p))
  }
}

const isDenied = (abs: string) => DENY.some((rx) => rx.test(abs))
export { isDenied }

/**
 * 归一化并校验外部传入的路径：
 * 1. 必须位于 /host 之下（realpath 后复查，防 symlink 逃逸）
 * 2. forWrite=true 时必须位于可写白名单根
 * 3. 命中敏感黑名单一律拒绝
 */
export async function resolveHost(input: string, forWrite = false): Promise<ResolvedPath> {
  if (!input || typeof input !== 'string') throw new FsError('缺少 path 参数', 400)
  const norm = path.posix.normalize(input.startsWith('/') ? input : `/${input}`)
  if (norm !== HOST_ROOT && !norm.startsWith(`${HOST_ROOT}/`)) {
    throw new FsError('路径必须在 /host 之下', 403)
  }
  let abs: string
  try {
    abs = await realpathOrParent(norm)
  } catch {
    throw new FsError('路径不存在', 404)
  }
  if (abs !== HOST_ROOT && !abs.startsWith(`${HOST_ROOT}/`)) {
    throw new FsError('符号链接逃逸 /host', 403)
  }
  if (isDenied(abs)) throw new FsError('敏感路径，拒绝访问', 403)
  const writable = WRITABLE_ROOTS.some((r) => abs === r || abs.startsWith(`${r}/`))
  if (forWrite && !writable) throw new FsError('只读区域（可写范围：/opt、/srv)', 403)
  return { abs, hostPath: abs.slice(HOST_ROOT.length) || '/', writable }
}

// 统一错误出口：自带 statusCode 的错误（校验/sensible/FsError）原样透传，errno 兜底
export function fsErrorToHttp(e: unknown): { statusCode: number; message: string } {
  const sc = (e as { statusCode?: number })?.statusCode
  if (typeof sc === 'number' && e instanceof Error) {
    return { statusCode: sc, message: e.message }
  }
  const code = (e as NodeJS.ErrnoException)?.code
  if (code === 'ENOENT') return { statusCode: 404, message: '路径不存在' }
  if (code === 'EACCES' || code === 'EPERM') return { statusCode: 403, message: '权限不足' }
  if (code === 'ENOTDIR') return { statusCode: 400, message: '不是目录' }
  if (code === 'EISDIR') return { statusCode: 400, message: '是目录而非文件' }
  return { statusCode: 500, message: e instanceof Error ? e.message : '文件操作失败' }
}
