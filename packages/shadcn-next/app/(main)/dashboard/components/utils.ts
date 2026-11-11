import { SystemStatus } from '@/hooks/use-system-status'

export const GB = 1024 ** 3

export const fmtBytes = (b: number | null | undefined, digits = 1) => {
  if (b == null) return '--'
  if (b >= GB) return `${(b / GB).toFixed(digits)}G`
  if (b >= 1024 ** 2) return `${(b / 1024 ** 2).toFixed(digits)}M`
  if (b >= 1024) return `${(b / 1024).toFixed(0)}K`
  return `${b}B`
}

export const fmtRate = (bps: number | null | undefined) =>
  bps == null ? '--' : `${fmtBytes(bps)}/s`

export const fmtUptime = (sec: number) => {
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export const fmtTime = (ts: number) => {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 按小时聚合采样点为均值序列（最多 24 根柱）
export function bucketPerHour(
  samples: SystemStatus[],
  pick: (s: SystemStatus) => number | null
): { h: string; v: number }[] {
  const map = new Map<string, { sum: number; n: number }>()
  for (const s of samples) {
    const v = pick(s)
    if (v == null) continue
    const key = `${new Date(s.ts).getHours()}:00`
    const e = map.get(key) ?? { sum: 0, n: 0 }
    e.sum += v
    e.n += 1
    map.set(key, e)
  }
  return [...map.entries()].map(([h, { sum, n }]) => ({ h, v: Number((sum / n).toFixed(1)) }))
}
