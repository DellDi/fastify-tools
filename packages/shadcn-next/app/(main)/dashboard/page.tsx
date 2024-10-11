import { Metadata } from "next"
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/app/(main)/dashboard/components/date-range-picker";
import { Card1 } from "@/app/(main)/dashboard/components/card-1";
import { Card2 } from "@/app/(main)/dashboard/components/card-2";
import { ProgressCards } from "@/app/(main)/dashboard/components/progress";
import { TimeCards } from "@/app/(main)/dashboard/components/time-cards";
import { ShowCloud } from "@/components/custom/ShowCloud";
import { PanelCharts } from "@/components/custom/PanelCharts";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker/>
            <Button size="sm">下载</Button>
          </div>
        </div>
        <div className="grid w-full flex-1 gap-4">
          <PanelCharts/>
        </div>
        {/*max-w-6xl*/}
        <div
            className="chart-wrapper mx-auto flex  flex-col flex-wrap items-start justify-center gap-4 sm:flex-row sm:p-1">
          {/*lg:max-w-[18rem] xl:max-w-[20rem]*/}
          <div className="grid lg:max-w-[20rem] w-full gap-4 sm:grid-cols-2  lg:grid-cols-1">
            <Card1/>
            <Card2/>
          </div>
          {/*lg:max-w-[24rem]*/}
          <div className="grid w-full flex-1 gap-4">
            <ProgressCards/>
          </div>
          <div className="grid w-full flex-1 gap-4">
            <TimeCards/>
          </div>
          <div className="grid w-full flex-1 gap-4">
            <ShowCloud/>
            <ShowCloud/>
          </div>

        </div>
      </main>
  )
}
