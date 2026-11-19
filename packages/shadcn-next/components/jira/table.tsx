"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { JiraIssue } from '@/app/api/jira/jira-filtered/route'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { jiraSaaSFetch } from '@/utils/fetch/jira/jira-api'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { SAAS_JQL_3M } from '@/utils/jira/jql'
import { InvoicesTableSkeleton } from './tableSkeleton'
import { JiraPaginator } from './paginator'
import { SearchJiraComponent } from './search'

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'done':
      return <CheckCircle2 className="w-5 h-5 text-green-500"/>
    case 'in progress':
      return <Clock className="w-5 h-5 text-yellow-500"/>
    default:
      return <AlertCircle className="w-5 h-5 text-red-500"/>
  }
}

export function JiraSaaSBoard({ pageSize = 50 }: { pageSize?: number }) {
  const searchParams = useSearchParams()
  const currentPage = +(searchParams.get('page') || 1)
  const currentPageSize = +(searchParams.get('pageSize') || pageSize)
  const currentQuery = searchParams.get('query') || SAAS_JQL_3M

  const { data, error, isLoading, mutate } = useSWR(
    ['jira-saas', currentQuery, currentPage, currentPageSize] as const,
    ([, jql, secondaryPage, secondaryPageSize]) => jiraSaaSFetch({ jql, secondaryPage, secondaryPageSize }),
    { dedupingInterval: 0, revalidateOnReconnect: false, shouldRetryOnError: false },
  )

  let content
  if (isLoading) {
    content = <InvoicesTableSkeleton pageSize={currentPageSize} />
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center w-full h-64 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-500 text-center">{error.message}</p>
        <Button onClick={() => void mutate()} variant="outline">
          重试
        </Button>
      </div>
    )
  } else if (data?.issues.length) {
    content = <JiraIssuesTable issues={data.issues} />
  } else {
    content = (
      <div className="flex flex-col items-center justify-center w-full h-64 space-y-4">
        <p className="text-muted-foreground">没有找到符合条件的数据</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col grow mx-auto">
      <Card className="w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            SAAS专用工单系统
            <div className="flex h-20 py-2 items-center justify-start">
              <SearchJiraComponent onRefresh={() => void mutate()} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grow overflow-auto">{content}</CardContent>
        {data && !error && (
          <CardFooter className="flex justify-between items-center">
            <JiraPaginator page={currentPage} pageSize={currentPageSize} totalIssues={data.total} />
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

function JiraIssuesTable({ issues }: { issues: JiraIssue[] }) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>单号</TableHead>
          <TableHead className="w-[100px]">客户名称</TableHead>
          <TableHead>描述</TableHead>
          <TableHead className="w-[120px]">状态</TableHead>
          <TableHead>标签</TableHead>
          <TableHead className="w-[100px]">经办人</TableHead>
          <TableHead className="w-[100px]">创建人</TableHead>
          <TableHead className="w-[100px]">创建时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow
            key={issue.key}
            className="hover:bg-muted/50 transition-colors"
          >
            <TableCell>
              <Button variant="link" asChild className="p-0">
                <a
                  href={`http://bug.new-see.com:8088/browse/${issue.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  {issue.key}
                </a>
              </Button>
            </TableCell>
            <TableCell className="font-medium text-nowrap">
              {issue.fields?.customfield_10000?.value}
            </TableCell>
            <TableCell className="font-medium">
              {issue.fields.summary}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {getStatusIcon(issue.fields.status.name)}
                <span className="text-center text-nowrap">{issue.fields.status.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col items-start">
                {issue.fields.labels.map((label) => (
                  <span
                    className="bg-blue-600 rounded-md p-1 not-last:mb-1 text-blue-100 text-nowrap text-center"
                    key={label}>{label}</span>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-center text-nowrap">{issue.fields.assignee?.displayName || '未分配'}</TableCell>
            <TableCell className="text-center text-nowrap">{issue.fields.creator?.displayName || '未知'}</TableCell>
            <TableCell>
              {new Date(issue.fields.created).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
