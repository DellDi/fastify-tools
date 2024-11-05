'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  XAxis,
  YAxis,
} from 'recharts'

export function TimeCards() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-5 ">
        <Card className="col-span-4 xl:col-span-3" x-chunk="charts-01-chunk-5">
          <CardContent className="flex gap-4 p-6 ">
            <div className="grid items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Move</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  562/600
                  <span className="text-sm font-normal text-muted-foreground">
                  kcal
                </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Exercise</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  73/120
                  <span className="text-sm font-normal text-muted-foreground">
                  min
                </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Stand</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  8/12
                  <span className="text-sm font-normal text-muted-foreground">
                  hr
                </span>
                </div>
              </div>
            </div>
            <ChartContainer
              config={{
                move: {
                  label: 'Move',
                  color: 'hsl(var(--chart-1))',
                },
                exercise: {
                  label: 'Exercise',
                  color: 'hsl(var(--chart-2))',
                },
                stand: {
                  label: 'Stand',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                data={[
                  {
                    activity: 'stand',
                    value: (8 / 12) * 100,
                    fill: 'var(--color-stand)',
                  },
                  {
                    activity: 'exercise',
                    value: (46 / 60) * 100,
                    fill: 'var(--color-exercise)',
                  },
                  {
                    activity: 'move',
                    value: (245 / 360) * 100,
                    fill: 'var(--color-move)',
                  },
                ]}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5}/>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card x-chunk="charts-01-chunk-6" className="xl:col-span-2 p-2">
          <CardHeader className="p-4 pb-2">
            <CardTitle>活性能量</CardTitle>
            <CardDescription>
              您每天平均燃烧 754 卡路里
              <br/>
              干得不错！
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-baseline gap-4 p-4 pt-2">
            <div className="flex flex-col items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              1,254
              <span className="text-sm pl-2 font-normal text-muted-foreground">
              kcal/day
              </span>
            </div>
            <ChartContainer
              config={{
                calories: {
                  label: 'Calories',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="w-full"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: '2024-01-01',
                    calories: 354,
                  },
                  {
                    date: '2024-01-02',
                    calories: 514,
                  },
                  {
                    date: '2024-01-03',
                    calories: 345,
                  },
                  {
                    date: '2024-01-04',
                    calories: 734,
                  },
                  {
                    date: '2024-01-05',
                    calories: 645,
                  },
                  {
                    date: '2024-01-06',
                    calories: 456,
                  },
                  {
                    date: '2024-01-07',
                    calories: 345,
                  },
                ]}
              >
                <Bar
                  dataKey="calories"
                  fill="var(--color-calories)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8}/>}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card x-chunk="charts-01-chunk-7" className="max-w-xl">
        <CardHeader className="space-y-0 pb-0">
          <CardDescription>床上时间</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            8
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              hr
            </span>
            35
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              min
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              time: {
                label: 'Time',
                color: 'hsl(var(--chart-2))',
              },
            }}
          >
            <AreaChart
              data={[
                {
                  date: '2024-01-01',
                  time: 8.5,
                },
                {
                  date: '2024-01-02',
                  time: 7.2,
                },
                {
                  date: '2024-01-03',
                  time: 8.1,
                },
                {
                  date: '2024-01-04',
                  time: 6.2,
                },
                {
                  date: '2024-01-05',
                  time: 5.2,
                },
                {
                  date: '2024-01-06',
                  time: 8.1,
                },
                {
                  date: '2024-01-07',
                  time: 7.0,
                },
              ]}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" hide/>
              <YAxis domain={['dataMin - 5', 'dataMax + 2']} hide/>
              <defs>
                <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-time)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-time)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="time"
                type="natural"
                fill="url(#fillTime)"
                fillOpacity={0.4}
                stroke="var(--color-time)"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel/>}
                formatter={(value) => (
                  <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                    Time in bed
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">
                        hr
                      </span>
                    </div>
                  </div>
                )}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
