'use client'

import Link from 'next/link'
import { Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useSystemStatus } from '@/hooks/use-system-status'

const formatUptime = (sec: number) => {
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function ServerStatusCard() {
  const { data } = useSystemStatus()
  const online = data?.cpu != null

  return (
    <Link href="/dashboard" className="block">
      <Card className="rounded-md text-xs shadow-xs transition-colors hover:bg-accent/50">
        <CardContent className="flex items-start gap-2.5 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid flex-1 gap-1.5">
            <div className="flex items-center justify-between">
              <p className="font-medium">服务器</p>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {online ? formatUptime(data.uptimeSec) : '离线'}
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>CPU {online ? `${Math.round(data.cpu.usagePercent)}%` : '--'}</span>
              <span>内存 {online ? `${Math.round(data.memory.usagePercent)}%` : '--'}</span>
              <span>磁盘 {data?.disk ? `${Math.round(data.disk.usagePercent)}%` : '--'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
