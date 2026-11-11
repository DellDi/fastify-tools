'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceTrend } from './components/resource-trend'
import { ServerInfoCard } from './components/server-info'
import { CpuCard } from './components/cpu-card'
import { LoadCard } from './components/load-card'
import { UsageCards } from './components/usage-cards'
import { RingCards } from './components/ring-cards'

const RANGES = [
  { hours: 1, label: '1h' },
  { hours: 6, label: '6h' },
  { hours: 24, label: '24h' },
]

export function DashboardClient() {
  const [hours, setHours] = useState(24)

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
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
      <div className="grid grid-cols-4 gap-4 ">
        <div className="grid col-span-4 xl:col-span-3 flex-1 gap-4">
          <ResourceTrend hours={hours} />
        </div>
        <div className="flex-1 gap-4 hidden xl:grid">
          <ServerInfoCard />
        </div>
      </div>
      <div className="chart-wrapper mx-auto flex flex-col flex-wrap items-start justify-center gap-4 sm:flex-row sm:p-1">
        <div className="grid flex-1 max-w-[38rem] gap-4">
          <CpuCard hours={hours} />
          <LoadCard hours={hours} />
        </div>
        <div className="grid max-w-[32rem] gap-4">
          <UsageCards hours={hours} />
        </div>
        <div className="grid  flex-1 gap-4">
          <RingCards hours={hours} />
        </div>
      </div>
    </main>
  )
}
