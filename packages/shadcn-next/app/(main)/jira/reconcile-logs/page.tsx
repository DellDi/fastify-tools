import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ReconcileLogsTable } from '@/components/jira/reconcile-logs/table'

export default function JiraReconcileLogsPage() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <Card className="mx-auto w-full space-x-2 sm:w-full md:w-5/6 lg:w-11/12 xl:w-6/7">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            巡检日志
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              dev-reply 对账巡检的逐单台账：每次巡检的状态、改动明细与耗时，点开行看步骤级详情。
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReconcileLogsTable />
        </CardContent>
      </Card>
    </div>
  )
}
