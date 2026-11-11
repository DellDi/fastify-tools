'use client'

import useSWR from 'swr'

// ---------- 类型（与 fastify schema 对齐） ----------

export interface FsEntry {
  name: string
  type: 'dir' | 'file' | 'link' | 'other'
  size: number | null
  mtimeMs: number
  mode: string
  denied: boolean
}

export interface FsList {
  path: string
  writable: boolean
  entries: FsEntry[]
}

export interface FsRead {
  type: 'text' | 'binary' | 'image' | 'dir'
  content?: string
  mime?: string
  size: number
  mtimeMs: number
  truncated: boolean
}

export interface SearchHit {
  path: string
  type: 'dir' | 'file'
  size: number | null
  match: 'name' | 'content'
}

export interface DuNode {
  name: string
  path: string
  size: number
  children?: DuNode[]
}

export interface DockerDf {
  images: { count: number; size: number; reclaimable: number }
  containers: { count: number; running: number; size: number }
  volumes: { count: number; size: number }
  buildCache: { count: number; size: number }
}

export interface DockerImage {
  id: string
  repoTags: string[]
  size: number
  created: number
  containers: number
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  state: string
  status: string
  created: number
}

// ---------- fetch 工具 ----------

const basePath = () =>
  (window as { __NEXT_DATA__?: { basePath?: string } }).__NEXT_DATA__?.basePath ||
  process.env.NEXT_PUBLIC_BASE_PATH ||
  ''

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(`${basePath()}${url}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `status ${res.status}` }))
    throw new Error(body.message ?? `status ${res.status}`)
  }
  return res.json()
}

// 写操作统一出口：失败抛错（带后端 message），由调用方 toast
export async function fsApi<T = unknown>(
  url: string,
  options: { method?: string; body?: unknown; form?: FormData } = {}
): Promise<T> {
  const res = await fetch(`${basePath()}${url}`, {
    method: options.method ?? 'POST',
    headers: options.form ? undefined : { 'Content-Type': 'application/json' },
    body: options.form ?? (options.body ? JSON.stringify(options.body) : undefined),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { message?: string }).message ?? `status ${res.status}`)
  return data as T
}

export const fsUrl = (sub: string, params: Record<string, string | number>) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => q.set(k, String(v)))
  return `${basePath()}/api/fs/${sub}?${q.toString()}`
}

// ---------- hooks ----------

export const useFsList = (path: string | null) =>
  useSWR<FsList>(path === null ? null : `/api/fs/list?path=${encodeURIComponent(path)}`, fetcher)

export const useFsRead = (path: string | null, offset = 0) =>
  useSWR<FsRead>(
    path === null ? null : `/api/fs/read?path=${encodeURIComponent(path)}&offset=${offset}`,
    fetcher
  )

export const useFsDu = (path: string | null, depth = 2) =>
  useSWR<{ root: DuNode; truncated: boolean }>(
    path === null ? null : `/api/fs/du?path=${encodeURIComponent(path)}&depth=${depth}`,
    fetcher
  )

export const useDockerDf = (enabled: boolean) =>
  useSWR<DockerDf>(enabled ? '/api/docker/df' : null, fetcher)

export const useDockerImages = (enabled: boolean) =>
  useSWR<{ images: DockerImage[] }>(enabled ? '/api/docker/images' : null, fetcher)

export const useDockerContainers = (enabled: boolean) =>
  useSWR<{ containers: DockerContainer[] }>(enabled ? '/api/docker/containers' : null, fetcher, {
    refreshInterval: 15_000,
  })

export async function searchFs(params: {
  path: string
  name?: string
  content?: string
  depth?: number
}) {
  const q = new URLSearchParams({ path: params.path })
  if (params.name) q.set('name', params.name)
  if (params.content) q.set('content', params.content)
  if (params.depth) q.set('depth', String(params.depth))
  return fetcher<{ hits: SearchHit[]; truncated: boolean; timedOut: boolean }>(
    `/api/fs/search?${q.toString()}`
  )
}

export const dockerLogs = (id: string, tail = 200) =>
  fetcher<{ logs: string }>(`/api/docker/containers/${encodeURIComponent(id)}/logs?tail=${tail}`)
