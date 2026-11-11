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
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts'
import { useSystemHistory, useSystemStatus } from '@/hooks/use-system-status'
import { fmtRate, fmtTime, GB } from './utils'

const ringConfig = {
  cpu: { label: 'CPU', color: 'hsl(var(--chart-1))' },
  mem: { label: '内存', color: 'hsl(var(--chart-2))' },
  disk: { label: '磁盘', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export function RingCards({ hours }: { hours: number }) {
  const { data: status } = useSystemStatus()
  const { data: history } = useSystemHistory(hours)
  const samples = useMemo(() => history?.samples ?? [], [history])

  const rings = useMemo(
    () => [
      { name: 'cpu', value: status?.cpu.usagePercent ?? 0, fill: 'var(--color-cpu)' },
      { name: 'mem', value: status?.memory.usagePercent ?? 0, fill: 'var(--color-mem)' },
      { name: 'disk', value: status?.disk?.usagePercent ?? 0, fill: 'var(--color-disk)' },
    ],
    [status]
  )

  const memSeries = useMemo(
    () => samples.map((s) => ({ t: fmtTime(s.ts), v: s.memory.usedBytes / GB })),
    [samples]
  )

  const ioSeries = useMemo(
    () =>
      samples
        .filter((s) => s.disk?.readBytesPerSec != null)
        .map((s) => ({
          t: fmtTime(s.ts),
          r: (s.disk!.readBytesPerSec ?? 0) / 1024 ** 2,
          w: (s.disk!.writeBytesPerSec ?? 0) / 1024 ** 2,
        })),
    [samples]
  )

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="col-span-4 xl:col-span-3">
          <CardContent className="flex gap-4 p-6">
            <div className="grid items-center gap-2">
              {(['cpu', 'mem', 'disk'] as const).map((k) => (
                <div key={k} className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-sm text-muted-foreground">{ringConfig[k].label}</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    {rings.find((r) => r.name === k)!.value.toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
            <ChartContainer
              config={ringConfig}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                data={rings}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
                margin={{ left: -10, right: -10, top: -10, bottom: -10 }}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 p-2">
          <CardHeader className="p-4 pb-2">
            <CardTitle>磁盘 I/O</CardTitle>
            <CardDescription>所在块设备读写速率</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-baseline gap-4 p-4 pt-2">
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              {fmtRate(status?.disk?.readBytesPerSec)}
              <span className="pl-2 text-sm font-normal text-muted-foreground">读</span>
              {fmtRate(status?.disk?.writeBytesPerSec)}
              <span className="text-sm font-normal text-muted-foreground">写</span>
            </div>
            <ChartContainer
              config={{
                r: { label: '读 MB/s', color: 'hsl(var(--chart-1))' },
                w: { label: '写 MB/s', color: 'hsl(var(--chart-3))' },
              }}
              className="w-full"
            >
              <AreaChart data={ioSeries} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="t" hide />
                <YAxis hide domain={[0, 'dataMax + 1']} />
                <Area dataKey="r" type="natural" stroke="var(--color-r)" fill="var(--color-r)" fillOpacity={0.15} dot={false} />
                <Area dataKey="w" type="natural" stroke="var(--color-w)" fill="var(--color-w)" fillOpacity={0.15} dot={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={(v) => `${Number(v).toFixed(2)} MB/s`} />}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-xl">
        <CardHeader className="space-y-0 pb-0">
          <CardDescription>内存用量</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {status ? (status.memory.usedBytes / GB).toFixed(1) : '--'}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              / {status ? (status.memory.totalBytes / GB).toFixed(0) : '--'} GB
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{ v: { label: '内存 GB', color: 'hsl(var(--chart-2))' } }}
          >
            <AreaChart data={memSeries} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis dataKey="t" hide />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <defs>
                <linearGradient id="fillMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-v)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-v)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="v"
                type="natural"
                fill="url(#fillMem)"
                fillOpacity={0.4}
                stroke="var(--color-v)"
                dot={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(v) => `${Number(v).toFixed(2)} GB`}
                  />
                }
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
