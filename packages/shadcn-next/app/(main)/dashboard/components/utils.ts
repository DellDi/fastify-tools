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
