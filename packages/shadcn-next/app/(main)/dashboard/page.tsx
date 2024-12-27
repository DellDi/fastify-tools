import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { CalendarDateRangePicker } from '@/app/(main)/dashboard/components/date-range-picker'
import { Card1 } from '@/app/(main)/dashboard/components/card-1'
import { Card2 } from '@/app/(main)/dashboard/components/card-2'
import { ProgressCards } from '@/app/(main)/dashboard/components/progress'
import { TimeCards } from '@/app/(main)/dashboard/components/time-cards'
import { ShowCloud } from '@/components/custom/ShowCloud'
import { PanelCharts } from '@/components/custom/PanelCharts'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/user'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
}

export default async function DashboardPage() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }
    return (
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker/>
            <Button size="sm">下载</Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 ">
          <div className="grid col-span-4 xl:col-span-3 flex-1 gap-4">
            <PanelCharts/>
          </div>
          <div className="flex-1 gap-4 hidden xl:grid">
            <ShowCloud/>
          </div>
        </div>
        <div
          className="chart-wrapper mx-auto flex flex-col flex-wrap items-start justify-center gap-4 sm:flex-row sm:p-1">
          {/*lg:max-w-[18rem] xl:max-w-[20rem] lg:max-w-[20rem] w-full*/}
          <div className="grid flex-1 max-w-[38rem] gap-4">
            <Card1/>
            <Card2/>
          </div>
          {/*lg:max-w-[24rem]*/}
          <div className="grid max-w-[32rem] gap-4">
            <ProgressCards/>
          </div>
          <div className="grid  flex-1 gap-4">
            <TimeCards/>
          </div>
        </div>
      </main>
    )
  } catch
    (error) {
    console.error('Error verifying token:', error)
    redirect('/login')
  }
}
