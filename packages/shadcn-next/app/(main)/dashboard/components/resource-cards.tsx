'use client'

import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import { useSystemHistory, useSystemStatus } from '@/hooks/use-system-status'
import { fmtBytes, fmtRate, fmtTime, GB } from './utils'

// 统一栅格：手机单列 / sm 两列 / xl 四列；flex-col 保证卡内趋势图沉底对齐
const span = 'col-span-12 flex flex-col sm:col-span-6 xl:col-span-3'

type TrendLine = { key: string; label: string; color: string }

// 资源卡底部 64px 迷你趋势（1~2 条序列）
function MiniTrend({
  data,
  lines,
}: {
  data: Record<string, number | string>[]
  lines: TrendLine[]
}) {
  const config = Object.fromEntries(
    lines.map((l) => [l.key, { label: l.label, color: l.color }])
  ) satisfies ChartConfig
  return (
    <ChartContainer config={config} className="mt-auto h-16 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <XAxis dataKey="t" hide />
        <YAxis hide domain={[0, 'dataMax + 1']} />
        {lines.map((l) => (
          <Area
            key={l.key}
            dataKey={l.key}
            type="natural"
            stroke={`var(--color-${l.key})`}
            fill={`var(--color-${l.key})`}
            fillOpacity={0.15}
            dot={false}
          />
        ))}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(v, name) => `${config[name]?.label ?? name} ${Number(v).toFixed(1)}`}
            />
          }
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function ResourceCards({ hours }: { hours: number }) {
  const { data: status } = useSystemStatus()
  const { data: history } = useSystemHistory(hours)
  const samples = useMemo(() => history?.samples ?? [], [history])

  const trends = useMemo(
    () => ({
      cpu: samples.map((s) => ({ t: fmtTime(s.ts), v: s.cpu.usagePercent })),
      mem: samples.map((s) => ({ t: fmtTime(s.ts), v: s.memory.usagePercent })),
      io: samples.map((s) => ({
        t: fmtTime(s.ts),
        r: (s.disk?.readBytesPerSec ?? 0) / 1024 ** 2,
        w: (s.disk?.writeBytesPerSec ?? 0) / 1024 ** 2,
      })),
      net: samples.map((s) => ({
        t: fmtTime(s.ts),
        rx: (s.network?.rxBytesPerSec ?? 0) / 1024,
        tx: (s.network?.txBytesPerSec ?? 0) / 1024,
      })),
    }),
    [samples]
  )

  const cpu = status?.cpu
  const mem = status?.memory
  const disk = status?.disk
  const net = status?.network
  const memCache = (mem?.cachedBytes ?? 0) + (mem?.buffersBytes ?? 0)
  const dbTotal = status?.databases.length
    ? status.databases.reduce((a, d) => a + d.sizeBytes, 0)
    : null

  return (
    <>
      {/* CPU：使用率 + 每核 + load */}
      <Card className={span}>
        <CardHeader className="pb-2">
          <CardDescription>
            CPU · {cpu?.cores ?? '--'} 核 · load {cpu?.load1 ?? '--'} {cpu?.load5 ?? '--'}{' '}
            {cpu?.load15 ?? '--'}
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {cpu ? `${cpu.usagePercent.toFixed(0)}%` : '--'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          {(cpu?.perCore ?? []).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 text-xs text-muted-foreground">#{i}</span>
              <Progress value={p} className="h-1.5 flex-1" />
              <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                {p.toFixed(0)}%
              </span>
            </div>
          ))}
          <MiniTrend
            data={trends.cpu}
            lines={[{ key: 'v', label: 'CPU %', color: 'hsl(var(--chart-1))' }]}
          />
        </CardContent>
      </Card>

      {/* 内存：使用率 + 构成 + Swap */}
      <Card className={span}>
        <CardHeader className="pb-2">
          <CardDescription>
            内存 · {mem ? `${fmtBytes(mem.usedBytes)} / ${fmtBytes(mem.totalBytes)}` : '--'}
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {mem ? `${mem.usagePercent.toFixed(0)}%` : '--'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          {mem && (
            <>
              <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-[hsl(var(--chart-2))]"
                  style={{ width: `${(mem.usedBytes / mem.totalBytes) * 100}%` }}
                />
                <div
                  className="bg-[hsl(var(--chart-2))]/40"
                  style={{ width: `${(memCache / mem.totalBytes) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>已用 {fmtBytes(mem.usedBytes)}</span>
                <span>缓存 {fmtBytes(memCache)}</span>
                <span>Swap {fmtBytes(mem.swapUsedBytes)}</span>
              </div>
            </>
          )}
          <MiniTrend
            data={trends.mem}
            lines={[{ key: 'v', label: '内存 %', color: 'hsl(var(--chart-2))' }]}
          />
        </CardContent>
      </Card>

      {/* 磁盘：使用率 + I/O 速率 + 库体积 */}
      <Card className={span}>
        <CardHeader className="pb-2">
          <CardDescription>
            磁盘 ·{' '}
            {disk
              ? `${(disk.usedBytes / GB).toFixed(1)} / ${(disk.totalBytes / GB).toFixed(0)} GB`
              : '--'}
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {disk ? `${disk.usagePercent.toFixed(0)}%` : '--'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>读 {fmtRate(disk?.readBytesPerSec)}</span>
            <span>写 {fmtRate(disk?.writeBytesPerSec)}</span>
            <span>库 {dbTotal != null ? fmtBytes(dbTotal) : '--'}</span>
          </div>
          <MiniTrend
            data={trends.io}
            lines={[
              { key: 'r', label: '读 MB/s', color: 'hsl(var(--chart-3))' },
              { key: 'w', label: '写 MB/s', color: 'hsl(var(--chart-4))' },
            ]}
          />
        </CardContent>
      </Card>

      {/* 网络：收发速率（hostView 区分宿主/容器口径） */}
      <Card className={span}>
        <CardHeader className="pb-2">
          <CardDescription>
            网络 · {net ? (net.hostView ? '宿主机全机流量' : '容器网卡') : '--'}
          </CardDescription>
          <CardTitle className="flex items-baseline gap-3 text-2xl tabular-nums">
            <span>↓{fmtRate(net?.rxBytesPerSec)}</span>
            <span className="text-muted-foreground">↑{fmtRate(net?.txBytesPerSec)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          <MiniTrend
            data={trends.net}
            lines={[
              { key: 'rx', label: '下行 KB/s', color: 'hsl(var(--chart-1))' },
              { key: 'tx', label: '上行 KB/s', color: 'hsl(var(--chart-5))' },
            ]}
          />
        </CardContent>
      </Card>
    </>
  )
}
