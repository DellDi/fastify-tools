import { Metadata } from "next"
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/app/(main)/dashboard/components/date-range-picker";
import { Card1 } from "@/app/(main)/dashboard/components/card-1";
import { Card2 } from "@/app/(main)/dashboard/components/card-2";
import { ProgressCards } from "@/app/(main)/dashboard/components/progress";
import { TimeCards } from "@/app/(main)/dashboard/components/time-cards";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
    return (
        <main className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">统计分析</h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker/>
                    <Button>下载</Button>
                </div>
            </div>
            <div
                className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 sm:flex-row sm:p-1">
                <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
                    <Card1/>
                    <Card2/>
                </div>
                <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
                    <ProgressCards/>
                </div>
                <div className="grid w-full flex-1 gap-6">
                    <TimeCards/>
                </div>
            </div>
        </main>

    )
}
