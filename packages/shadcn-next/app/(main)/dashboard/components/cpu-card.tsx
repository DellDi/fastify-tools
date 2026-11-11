'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis } from 'recharts'
import { useSystemHistory, useSystemStatus } from '@/hooks/use-system-status'
import { bucketPerHour } from './utils'

export function CpuCard({ hours }: { hours: number }) {
  const { data: status } = useSystemStatus()
  const { data: history } = useSystemHistory(hours)
  const samples = history?.samples ?? []

  const current = status?.cpu.usagePercent ?? null
  const perCore = status?.cpu.perCore ?? null
  const hourly = bucketPerHour(samples, (s) => s.cpu.usagePercent)
  const avg = hourly.length
    ? hourly.reduce((a, b) => a + b.v, 0) / hourly.length
    : null

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardDescription>CPU 使用率</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {current != null ? current.toFixed(0) : '--'}{' '}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            % · {status?.cpu.cores ?? '-'} 核
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            v: { label: 'CPU %', color: 'hsl(var(--chart-1))' },
          }}
        >
          <BarChart data={hourly} margin={{ left: -4, right: -4 }} accessibilityLayer>
            <Bar
              dataKey="v"
              fill="var(--color-v)"
              radius={5}
              fillOpacity={0.6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="h"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              minTickGap={24}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent hideIndicator formatter={(v) => `${v}%`} />
              }
              cursor={false}
            />
            {avg != null && (
              <ReferenceLine
                y={avg}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                <Label
                  position="insideBottomLeft"
                  value="均值"
                  offset={10}
                  fill="hsl(var(--foreground))"
                />
                <Label
                  position="insideTopLeft"
                  value={`${avg.toFixed(1)}%`}
                  className="text-lg"
                  fill="hsl(var(--foreground))"
                  offset={10}
                  startOffset={100}
                />
              </ReferenceLine>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {perCore && perCore.length > 0 && (
        <CardFooter className="flex-col items-start gap-2">
          <CardDescription>每核使用率</CardDescription>
          <div className="grid w-full grid-cols-4 gap-x-4 gap-y-1.5">
            {perCore.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-7 shrink-0 tabular-nums">c{i}</span>
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, p)}%` }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums">{p.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
