'use client'

import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Bar, BarChart, Rectangle, XAxis, YAxis } from 'recharts'
import { useSystemHistory, useSystemStatus } from '@/hooks/use-system-status'
import { bucketPerHour, fmtBytes, GB } from './utils'

function UsageRow({ label, percent }: { label: string; percent: number | null }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xl font-bold tabular-nums">
          {percent != null ? `${percent.toFixed(0)}%` : '--'}
        </span>
      </div>
      <Progress value={percent ?? 0} />
    </div>
  )
}

// 迷你柱状图（隐藏坐标轴，与历史走势一致）
function MiniBars({ data, color }: { data: { h: string; v: number }[]; color: string }) {
  return (
    <ChartContainer
      config={{ v: { label: '', color } }}
      className="ml-auto w-[120px]"
    >
      <BarChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        <Bar
          dataKey="v"
          fill="var(--color-v)"
          radius={2}
          fillOpacity={0.3}
          activeBar={<Rectangle fillOpacity={0.8} />}
        />
        <XAxis dataKey="h" hide />
        <ChartTooltip
          content={<ChartTooltipContent hideIndicator hideLabel formatter={(v) => `${v}`} />}
          cursor={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

export function UsageCards({ hours }: { hours: number }) {
  const { data: status } = useSystemStatus()
  const { data: history } = useSystemHistory(hours)
  const samples = history?.samples ?? []

  const diskUsedGB = status?.disk ? status.disk.usedBytes / GB : null
  const diskTotalGB = status?.disk ? status.disk.totalBytes / GB : null
  const diskBars = bucketPerHour(samples, (s) =>
    s.disk ? Number((s.disk.usedBytes / GB).toFixed(2)) : null
  )
  const dbTotal = status?.databases?.length
    ? status.databases.reduce((a, d) => a + d.sizeBytes, 0)
    : null
  const dbBars = bucketPerHour(samples, (s) =>
    s.databases.length
      ? Number((s.databases.reduce((a, d) => a + d.sizeBytes, 0) / 1024 ** 2).toFixed(2))
      : null
  )

  // 内存构成：已用 / 缓存+缓冲 / 可用
  const mem = status?.memory
  const memComp = useMemo(() => {
    if (!mem) return null
    const cache = (mem.cachedBytes ?? 0) + (mem.buffersBytes ?? 0)
    const free = Math.max(0, mem.totalBytes - mem.usedBytes - cache)
    return [
      { seg: '内存', used: mem.usedBytes, cached: cache, free },
    ]
  }, [mem])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>当前占比</CardTitle>
          <CardDescription>CPU / 内存 / 磁盘 实时使用率</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <UsageRow label="CPU" percent={status?.cpu.usagePercent ?? null} />
          <UsageRow label="内存" percent={status?.memory.usagePercent ?? null} />
          <UsageRow label="磁盘" percent={status?.disk?.usagePercent ?? null} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle>存储</CardTitle>
          <CardDescription>磁盘用量与数据库体积走势</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-baseline gap-4 p-4 pt-0">
          <div className="flex w-full flex-row items-baseline justify-between">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {diskUsedGB != null ? diskUsedGB.toFixed(1) : '--'}
              <span className="text-sm font-normal text-muted-foreground">
                {diskTotalGB != null ? `/ ${diskTotalGB.toFixed(0)}G` : 'G'}
              </span>
            </div>
            <MiniBars data={diskBars} color="hsl(var(--chart-1))" />
          </div>
          <div className="flex w-full flex-row items-baseline justify-between">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {dbTotal != null ? fmtBytes(dbTotal) : '--'}
              <span className="text-sm font-normal text-muted-foreground">数据库</span>
            </div>
            <MiniBars data={dbBars} color="hsl(var(--chart-2))" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex gap-4 p-4 pb-2">
          <ChartContainer
            config={{
              used: { label: '已用', color: 'hsl(var(--chart-1))' },
              cached: { label: '缓存', color: 'hsl(var(--chart-2))' },
              free: { label: '可用', color: 'hsl(var(--muted))' },
            }}
            className="h-[60px] w-full"
          >
            <BarChart
              data={memComp ?? []}
              layout="vertical"
              barSize={32}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, mem?.totalBytes ?? 1]} hide />
              <YAxis dataKey="seg" type="category" hide />
              <Bar dataKey="used" stackId="a" fill="var(--color-used)" radius={[5, 0, 0, 5]} />
              <Bar dataKey="cached" stackId="a" fill="var(--color-cached)" />
              <Bar dataKey="free" stackId="a" fill="var(--color-free)" radius={[0, 5, 5, 0]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v, name) => `${name} ${fmtBytes(Number(v))}`}
                  />
                }
                cursor={false}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-row border-t p-4">
          <div className="flex w-full items-center gap-2">
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">已用</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {mem ? fmtBytes(mem.usedBytes) : '--'}
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">缓存</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {memComp ? fmtBytes(memComp[0].cached) : '--'}
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">Swap</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {mem ? fmtBytes(mem.swapUsedBytes) : '--'}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
