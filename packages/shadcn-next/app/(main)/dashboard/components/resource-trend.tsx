'use client'

import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import { SystemStatus, useSystemHistory } from '@/hooks/use-system-status'
import { fmtTime } from './utils'

const METRICS = [
  {
    key: 'cpu',
    label: 'CPU',
    color: 'hsl(var(--chart-1))',
    pick: (s: SystemStatus) => s.cpu.usagePercent,
  },
  {
    key: 'memory',
    label: '内存',
    color: 'hsl(var(--chart-2))',
    pick: (s: SystemStatus) => s.memory.usagePercent,
  },
  {
    key: 'disk',
    label: '磁盘',
    color: 'hsl(var(--chart-3))',
    pick: (s: SystemStatus) => s.disk?.usagePercent ?? null,
  },
] as const

type MetricKey = (typeof METRICS)[number]['key']

export function ResourceTrend({ hours }: { hours: number }) {
  const { data } = useSystemHistory(hours)
  const [active, setActive] = useState<MetricKey>('cpu')
  const samples = useMemo(() => data?.samples ?? [], [data])

  // 每个指标的当前值与区间均值，显示在切换按钮上
  const stats = useMemo(
    () =>
      METRICS.map((m) => {
        const vals = samples.map(m.pick).filter((v): v is number => v != null)
        const latest = vals.at(-1) ?? null
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
        return { key: m.key, label: m.label, latest, avg }
      }),
    [samples]
  )

  const activeMeta = METRICS.find((m) => m.key === active)!
  const chartData = useMemo(
    () => samples.map((s) => ({ t: fmtTime(s.ts), v: activeMeta.pick(s) })),
    [samples, activeMeta]
  )

  const chartConfig = {
    v: { label: `${activeMeta.label} %`, color: activeMeta.color },
  } satisfies ChartConfig

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>资源趋势</CardTitle>
          <CardDescription>
            最近 {hours} 小时 · 30s 采样 · 均值{' '}
            {stats.find((s) => s.key === active)?.avg?.toFixed(1) ?? '--'}%
          </CardDescription>
        </div>
        <div className="flex">
          {stats.map((s) => (
            <button
              key={s.key}
              data-active={active === s.key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors even:border-l hover:bg-accent/50 data-[active=true]:bg-accent sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActive(s.key)}
            >
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {s.latest != null ? `${s.latest.toFixed(0)}%` : '--'}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            暂无采样数据（采样器启动约 30s 后出现首条数据）
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-v)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-v)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="t"
                tickLine={false}
                tickMargin={8}
                minTickGap={40}
              />
              <YAxis domain={[0, 100]} hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[140px]"
                    formatter={(v) => `${Number(v).toFixed(1)}%`}
                  />
                }
              />
              <Area
                dataKey="v"
                type="natural"
                fill="url(#trendFill)"
                stroke="var(--color-v)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
