import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchJiraComponent } from '@/components/jira/search'
import { JiraSaaSTable } from '@/components/jira/table'
import { InvoicesTableSkeleton } from '@/components/jira/tableSkeleton'
import { Suspense } from 'react'
import { SAAS_JQL_3M } from '@/lib/jira/jql'
import { JiraPaginator } from '@/components/jira/paginator'

export const experimental_ppr = true

export default async function JiraPage({ searchParams }: { searchParams?: Promise<{ query?: string; pageSize?: string; page?: string }> }) {
  const params = await searchParams
  const query = params?.query || SAAS_JQL_3M
  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 50

  try {
    return (
      <div className="h-full flex flex-col flex-grow mx-auto">
        <Card className="w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              SAAS专用工单系统
              <div className="flex h-20 py-2 items-center justify-start">
                <SearchJiraComponent/>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
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
  } catch (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{JSON.stringify(error) || '请求异常'}</p>
        </CardContent>
      </Card>
    )
  }
}
