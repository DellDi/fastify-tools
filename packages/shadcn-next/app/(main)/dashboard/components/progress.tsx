'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, Rectangle, XAxis, YAxis } from "recharts";
import { Separator } from "@/components/ui/separator";

export function ProgressCards() {
    return (
        <>
            <Card
                className="max-w-xs" x-chunk="charts-01-chunk-2"
            >
                <CardHeader>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>
                        You're average more steps a day this year than last year.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid auto-rows-min gap-2">
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            12,453
                            <span className="text-sm font-normal text-muted-foreground">
                  steps/day
                </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="aspect-auto h-[32px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: "2024",
                                        steps: 12435,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={4}
                                    barSize={32}
                                >
                                    <LabelList
                                        position="insideLeft"
                                        dataKey="date"
                                        offset={8}
                                        fontSize={12}
                                        fill="white"
                                    />
                                </Bar>
                                <YAxis dataKey="date" type="category" tickCount={1} hide/>
                                <XAxis dataKey="steps" type="number" hide/>
                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className="grid auto-rows-min gap-2">
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            10,103
                            <span className="text-sm font-normal text-muted-foreground">
                  steps/day
                </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "hsl(var(--muted))",
                                },
                            }}
                            className="aspect-auto h-[32px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: "2023",
                                        steps: 10103,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={4}
                                    barSize={32}
                                >
                                    <LabelList
                                        position="insideLeft"
                                        dataKey="date"
                                        offset={8}
                                        fontSize={12}
                                        fill="hsl(var(--muted-foreground))"
                                    />
                                </Bar>
                                <YAxis dataKey="date" type="category" tickCount={1} hide/>
                                <XAxis dataKey="steps" type="number" hide/>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            <Card
                className="max-w-xs" x-chunk="charts-01-chunk-3"
            >
                <CardHeader className="p-4 pb-0">
                    <CardTitle>Walking Distance</CardTitle>
                    <CardDescription>
                        Over the last 7 days, your distance walked and run was 12.5 miles
                        per day.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                    <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                        12.5
                        <span className="text-sm font-normal text-muted-foreground">
                miles/day
              </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="ml-auto w-[72px]"
                    >
                        <BarChart
                            accessibilityLayer
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: "2024-01-01",
                                    steps: 2000,
                                },
                                {
                                    date: "2024-01-02",
                                    steps: 2100,
                                },
                                {
                                    date: "2024-01-03",
                                    steps: 2200,
                                },
                                {
                                    date: "2024-01-04",
                                    steps: 1300,
                                },
                                {
                                    date: "2024-01-05",
                                    steps: 1400,
                                },
                                {
                                    date: "2024-01-06",
                                    steps: 2500,
                                },
                                {
                                    date: "2024-01-07",
                                    steps: 1600,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
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
            <Card
                className="max-w-xs" x-chunk="charts-01-chunk-4"
            >
                <CardContent className="flex gap-4 p-4 pb-2">
                    <ChartContainer
                        config={{
                            move: {
                                label: "Move",
                                color: "hsl(var(--chart-1))",
                            },
                            stand: {
                                label: "Stand",
                                color: "hsl(var(--chart-2))",
                            },
                            exercise: {
                                label: "Exercise",
                                color: "hsl(var(--chart-3))",
                            },
                        }}
                        className="h-[140px] w-full"
                    >
                        <BarChart
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 10,
                            }}
                            data={[
                                {
                                    activity: "stand",
                                    value: (8 / 12) * 100,
                                    label: "8/12 hr",
                                    fill: "var(--color-stand)",
                                },
                                {
                                    activity: "exercise",
                                    value: (46 / 60) * 100,
                                    label: "46/60 min",
                                    fill: "var(--color-exercise)",
                                },
                                {
                                    activity: "move",
                                    value: (245 / 360) * 100,
                                    label: "245/360 kcal",
                                    fill: "var(--color-move)",
                                },
                            ]}
                            layout="vertical"
                            barSize={32}
                            barGap={2}
                        >
                            <XAxis type="number" dataKey="value" hide/>
                            <YAxis
                                dataKey="activity"
                                type="category"
                                tickLine={false}
                                tickMargin={4}
                                axisLine={false}
                                className="capitalize"
                            />
                            <Bar dataKey="value" radius={5}>
                                <LabelList
                                    position="insideLeft"
                                    dataKey="label"
                                    fill="white"
                                    offset={8}
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex flex-row border-t p-4">
                    <div className="flex w-full items-center gap-2">
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Move</div>
                            <div
                                className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                562
                                <span className="text-sm font-normal text-muted-foreground">
                    kcal
                  </span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-10 w-px"/>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Exercise</div>
                            <div
                                className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                73
                                <span className="text-sm font-normal text-muted-foreground">
                    min
                  </span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-10 w-px"/>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Stand</div>
                            <div
                                className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                14
                                <span className="text-sm font-normal text-muted-foreground">
                    hr
                  </span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}
