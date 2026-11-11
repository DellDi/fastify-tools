'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSystemStatus } from '@/hooks/use-system-status'

const STATE_COLOR: Record<string, string> = {
  running: 'bg-emerald-500',
  exited: 'bg-zinc-400',
  restarting: 'bg-amber-500',
  paused: 'bg-amber-500',
  dead: 'bg-destructive',
}

export function ContainersCard() {
  const { data } = useSystemStatus()
  const containers = data?.containers ?? []
  const running = containers.filter((c) => c.state === 'running').length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Docker 容器</CardTitle>
        <CardDescription>
          {data
            ? containers.length
              ? `${running}/${containers.length} 运行中`
              : '未挂载 docker.sock'
            : '--'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {containers.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${STATE_COLOR[c.state] ?? 'bg-zinc-400'}`}
            />
            <span className="truncate font-medium" title={c.image}>
              {c.name}
            </span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
              {c.status}
            </span>
          </div>
        ))}
        {data && !containers.length && (
          <p className="text-sm text-muted-foreground">
            compose 挂载 /var/run/docker.sock 后可显示容器列表
          </p>
        )}
      </CardContent>
    </Card>
  )
}
