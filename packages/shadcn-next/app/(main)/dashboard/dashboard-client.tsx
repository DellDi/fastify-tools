'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceTrend } from './components/resource-trend'
import { ServerInfoCard } from './components/server-info'
import { ResourceCards } from './components/resource-cards'
import { ContainersCard } from './components/containers-card'

const RANGES = [
  { hours: 1, label: '1h' },
  { hours: 6, label: '6h' },
  { hours: 24, label: '24h' },
]

function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2 border-b pb-2">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="grid grid-cols-12 gap-4">{children}</div>
    </section>
  )
}

export function DashboardClient() {
  const [hours, setHours] = useState(24)

  return (
    <main className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">服务器监控</h2>
          <p className="text-sm text-muted-foreground">宿主机实时状态 · 30s 采样</p>
        </div>
        <div className="flex items-center space-x-2">
          {RANGES.map((r) => (
            <Button
              key={r.hours}
              size="sm"
              variant={hours === r.hours ? 'default' : 'outline'}
              onClick={() => setHours(r.hours)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <Section title="资源概览" desc="整体走势与运行信息">
        <div className="col-span-12 xl:col-span-8">
          <ResourceTrend hours={hours} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <ServerInfoCard />
        </div>
      </Section>

      <Section title="资源明细" desc="CPU / 内存 / 磁盘 / 网络">
        <ResourceCards hours={hours} />
      </Section>

      <Section title="容器状态" desc="宿主机 Docker 容器运行情况">
        <div className="col-span-12">
          <ContainersCard />
        </div>
      </Section>
    </main>
  )
}
