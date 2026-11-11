'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSystemStatus } from '@/hooks/use-system-status'
import { fmtBytes, fmtUptime } from './utils'

function Row({
  label,
  value,
  warn,
}: {
  label: string
  value: string
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium tabular-nums ${warn ? 'text-destructive' : ''}`}>
        {value}
      </span>
    </div>
  )
}

export function ServerInfoCard() {
  const { data } = useSystemStatus()
  const dbs = data?.databases ?? []
  const dbTotal = dbs.length ? dbs.reduce((a, d) => a + d.sizeBytes, 0) : null

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle>服务器信息</CardTitle>
        <CardDescription>宿主机 + 服务进程状态</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-2">
        <div className="grid gap-2">
          <Row
            label="运行时长"
            value={data ? fmtUptime(data.uptimeSec) : '--'}
          />
          <Row
            label="CPU / 进程"
            value={
              data
                ? `${data.cpu.cores} 核 · ${data.cpu.runningProcs ?? '-'}/${data.cpu.totalProcs ?? '-'}`
                : '--'
            }
          />
          <Row
            label="Pages 站点"
            value={
              data?.pages
                ? `${data.pages.sites} 个 · ${fmtBytes(data.pages.totalBytes)}`
                : '--'
            }
          />
          <Row label="数据库体积" value={dbTotal != null ? fmtBytes(dbTotal) : '--'} />
        </div>
        <div className="grid gap-2 border-t pt-3">
          <Row
            label="fastify 进程"
            value={data ? fmtUptime(data.process.uptimeSec) : '--'}
          />
          <Row
            label="进程内存 RSS"
            value={data ? fmtBytes(data.process.rssBytes) : '--'}
          />
          <Row
            label="事件循环延迟"
            value={
              data?.process.eventLoopDelayMs != null
                ? `${data.process.eventLoopDelayMs}ms`
                : '--'
            }
          />
        </div>
        <div className="grid gap-2 border-t pt-3">
          {(data?.certificates?.length
            ? data.certificates
            : [{ domain: '证书', daysLeft: null }]
          ).map((c) => (
            <Row
              key={c.domain}
              label={c.domain}
              value={c.daysLeft != null ? `剩余 ${c.daysLeft} 天` : '--'}
              warn={c.daysLeft != null && c.daysLeft < 15}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
