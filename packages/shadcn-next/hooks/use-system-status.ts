'use client'

import useSWR from 'swr'

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
    hostView: boolean
  } | null
  containers: { name: string; image: string; state: string; status: string }[]
  databases: { name: string; sizeBytes: number }[]
  pages: { sites: number; totalBytes: number } | null
  certificates: { domain: string; daysLeft: number | null }[]
}

// 轮询接口不走 baseFetch：失败弹 toast 会刷屏，静默抛出交给 SWR 错误态
const fetcher = async <T>(url: string): Promise<T> => {
  const nextData = (window as { __NEXT_DATA__?: { basePath?: string } }).__NEXT_DATA__
  const basePath = nextData?.basePath || process.env.NEXT_PUBLIC_BASE_PATH || ''
  const res = await fetch(`${basePath}${url}`)
  if (!res.ok) throw new Error(`status ${res.status}`)
  return res.json()
}

// 侧边栏存储卡 / 服务器状态卡 / dashboard 共用同一 SWR key，自动去重、30s 轮询
export function useSystemStatus() {
  return useSWR<SystemStatus>('/api/system/status', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: false,
    errorRetryCount: 2,
  })
}

export function useSystemHistory(hours = 24) {
  return useSWR<{ samples: SystemStatus[] }>(
    `/api/system/history?hours=${hours}`,
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: false,
      errorRetryCount: 2,
    }
  )
}
