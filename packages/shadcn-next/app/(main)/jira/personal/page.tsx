import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchJiraComponent } from '@/components/jira/search'
import { JiraSaaSTable } from '@/components/jira/table'
import { InvoicesTableSkeleton } from '@/components/jira/tableSkeleton'
import { Suspense } from 'react'
import { SAAS_JQL_3M } from '@/utils/jira/jql'
import { JiraPaginator } from '@/components/jira/paginator'
import { useSearchParams } from 'next/navigation'

export default async function JiraPage() {
  // 使用客户端搜索参数钩子
  const searchParams = useSearchParams()
  
  // 从 URL 参数中获取查询条件
  const query = searchParams?.get('query') || SAAS_JQL_3M
  const page = Number(searchParams?.get('page')) || 1
  const pageSize = Number(searchParams?.get('pageSize')) || 50

  return (
    <div className="h-full flex flex-col grow mx-auto">
      <Card className="w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            SAAS专用工单系统
            <div className="flex h-20 py-2 items-center justify-start">
              <SearchJiraComponent/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grow overflow-auto">
          <Suspense key={query + page} fallback={<InvoicesTableSkeleton pageSize={pageSize}/>}>
            <JiraSaaSTable {...{ page, query, pageSize }} />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <JiraPaginator key={query + page}/>
        </CardFooter>
      </Card>
    </div>
  )
}
