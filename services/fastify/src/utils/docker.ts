import { request as httpRequest } from 'node:http'
import { access } from 'node:fs/promises'

const SOCK = '/var/run/docker.sock'

export async function dockerAvailable(): Promise<boolean> {
  try {
    await access(SOCK)
    return true
  } catch {
    return false
  }
}

function reqRaw(
  path: string,
  method: string,
  body?: unknown,
  timeoutMs = 10_000
): Promise<{ status: number; chunks: Buffer[] }> {
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        socketPath: SOCK,
        path,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => resolve({ status: res.statusCode ?? 500, chunks }))
      }
    )
    req.on('error', reject)
    req.setTimeout(timeoutMs, () => req.destroy(new Error('docker.sock timeout')))
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

export class DockerError extends Error {
  constructor(
    message: string,
    readonly statusCode = 500
  ) {
    super(message)
  }
}

// JSON API 调用；非 2xx/3xx 抛错。老版本 docker 的 /system/df 逐层算体积
// 可能耗时十几秒，调用方可放宽 timeoutMs
export async function dockerApi<T = unknown>(
  path: string,
  method = 'GET',
  body?: unknown,
  timeoutMs?: number
): Promise<T> {
  const { status, chunks } = await reqRaw(path, method, body, timeoutMs)
  const text = Buffer.concat(chunks).toString('utf8')
  if (status >= 400) {
    throw new DockerError(`docker ${status}: ${text.slice(0, 200)}`, status)
  }
  return (text ? JSON.parse(text) : null) as T
}

// 非 TTY 容器的 logs 是 8 字节头复用帧：[stream(1)|pad(3)|size(4)|payload]
// TTY 容器直接输出裸文本（首字节不是 0/1/2 流的合法头时按裸文本处理）
export function demuxDockerLog(raw: Buffer): string {
  const out: Buffer[] = []
  let i = 0
  while (i + 8 <= raw.length) {
    const streamType = raw[i]
    if (streamType > 2 || raw[i + 1] !== 0 || raw[i + 2] !== 0 || raw[i + 3] !== 0) {
      // 不是合法帧头 → 当作裸文本
      return raw.toString('utf8')
    }
    const size = raw.readUInt32BE(i + 4)
    if (i + 8 + size > raw.length) break
    out.push(raw.subarray(i + 8, i + 8 + size))
    i += 8 + size
  }
  return Buffer.concat(out).toString('utf8')
}

export async function dockerLogs(id: string, tail = 200): Promise<string> {
  const { status, chunks } = await reqRaw(
    `/containers/${encodeURIComponent(id)}/logs?stdout=1&stderr=1&tail=${tail}&timestamps=0`,
    'GET'
  )
  const raw = Buffer.concat(chunks)
  if (status >= 400) {
    throw new DockerError(`docker ${status}: ${raw.toString('utf8').slice(0, 200)}`, status)
  }
  return demuxDockerLog(raw)
}
