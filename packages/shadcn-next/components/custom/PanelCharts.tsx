'use client'
import { useState, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import useSWR from 'swr'

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

// 导入服务端操作但不直接使用
import { getDashboardData } from '@/app/lib/dashboard/base'

// 创建客户端包装函数
const fetchDashboardData = async () => {
  try {
    return await getDashboardData()
  } catch (error) {
    console.error('获取数据失败:', error)
    return []
  }
}

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function PanelCharts() {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('desktop')

  // 使用 useSWR 获取数据，通过客户端包装函数
  const { data: chartData = [], isLoading } = useSWR(
    'dashboard-data',
    fetchDashboardData,
    {
      // 禁用服务端渲染时的数据获取
      suspense: false,
      // 添加重试策略
      errorRetryCount: 3,
      // 添加缓存策略
      revalidateOnFocus: false,
      dedupingInterval: 10000 // 10秒内不重复请求
    }
  )

  // 计算总览
  const total = useMemo(
    () => ({
      desktop: chartData.reduce(
        (acc: number, curr: { desktop: number }) => acc + curr.desktop,
        0
      ),
      mobile: chartData.reduce(
        (acc: number, curr: { mobile: number }) => acc + curr.mobile,
        0
      ),
    }),
    [chartData]
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>活跃用户分析</CardTitle>
          <CardDescription>展示过去1个月的总访客数</CardDescription>
        </div>
        <div className="flex">
          {['desktop', 'mobile'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData || []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={8}></XAxis>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
