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
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { useSystemHistory, useSystemStatus } from '@/hooks/use-system-status'
import { fmtTime } from './utils'

const chartConfig = {
  load1: { label: '1min', color: 'hsl(var(--chart-1))' },
  load5: { label: '5min', color: 'hsl(var(--chart-2))' },
  load15: { label: '15min', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export function LoadCard({ hours }: { hours: number }) {
  const { data: status } = useSystemStatus()
  const { data: history } = useSystemHistory(hours)
  const samples = useMemo(() => history?.samples ?? [], [history])

  const chartData = useMemo(
    () =>
      samples.map((s) => ({
        t: fmtTime(s.ts),
        load1: s.cpu.load1,
        load5: s.cpu.load5,
        load15: s.cpu.load15,
      })),
    [samples]
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
        <div>
          <CardDescription>Load 1min</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {status?.cpu.load1 ?? '--'}
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              / {status?.cpu.cores ?? '-'}核
            </span>
          </CardTitle>
        </div>
        <div>
          <CardDescription>进程 running/total</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {status?.cpu.runningProcs ?? '--'}
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              / {status?.cpu.totalProcs ?? '-'}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer config={chartConfig} className="w-full">
          <LineChart
            data={chartData}
            margin={{ left: 14, right: 14, top: 10 }}
            accessibilityLayer
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis hide domain={['dataMin', 'dataMax + 1']} />
            <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} minTickGap={40} />
            {(['load1', 'load5', 'load15'] as const).map((k) => (
              <Line
                key={k}
                dataKey={k}
                type="natural"
                stroke={`var(--color-${k})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
