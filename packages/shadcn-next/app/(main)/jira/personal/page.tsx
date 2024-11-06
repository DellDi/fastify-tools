'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { JiraIssue, JiraResponse } from '@/pages/api/jira/jira-filtered'
import { SAAS_JQL_3M } from '@/lib/jira/jql'
import { useBasePath } from '@/hooks/use-path'

export default function JiraIssuesTable() {
  const [jiraSql, setJiraSql] = useState<string>(SAAS_JQL_3M)
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalIssues, setTotalIssues] = useState(0)
  const pageSize = 50
  const { basePath } = useBasePath()

  useEffect(() => {
    fetchIssues()
  }, [page])

  async function fetchIssues() {
    setLoading(true)
    try {
      // 环境变量  部署基础路径 NEXT_PUBLIC_BASE_PATH
      const loginResponse = await fetch(`${basePath}/api/jira/jira-login`, { method: 'POST' })
      if (!loginResponse.ok) {
        return new Error('Failed to login to Jira')
      }
      const { cookies } = await loginResponse.json()

      const response = await fetch(`${basePath}/api/jira/jira-filtered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql: jiraSql,
          jiraCookies: cookies,
          secondaryPage: page,
          secondaryPageSize: pageSize,
        }),
      })

      if (!response.ok) {
        return new Error('Failed to fetch Jira issues')
      }

      const data: JiraResponse = await response.json()
      setIssues(data.issues)
      setTotalIssues(data.total)
    } catch (err) {
      setError(`Error fetching Jira issues, ${err}`)
    } finally {
      setLoading(false)
    }
  }

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
  const totalPages = Math.ceil(totalIssues / pageSize)

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="h-full flex flex-col flex-grow mx-auto">
      <Card className="w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            SAAS专用工单系统
            <div className="flex h-20 py-2 items-center justify-start">
              <Textarea
                onChange={(e) => setJiraSql(e.target.value)}
                className="mr-2 border-2 shadow-sm flex-1"
                value={jiraSql}
                placeholder="Search Jira Issues"
              />
              <Button onClick={
                async () => {
                  await fetchIssues()
                }
              }>Search</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {loading ? (
            <div className="space-y-4 w-full">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 w-full">
                  <Skeleton className="h-20 w-20 rounded-full"/>
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-full"/>
                    <Skeleton className="h-6 w-3/4"/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                    className=" hover:bg-muted/50 transition-colors"
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
                      <div className="flex flex-col  items-start ">
                        {issue.fields.labels.map((label) => (
                          <span
                            className="bg-blue-600 rounded-md p-1 not-last:mb-1 text-blue-100 text-nowrap text-center"
                            key={label}>{label}</span>
                        ))}
                      </div>
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*  <div className="flex flex-col space-x-1">*/}
                    {/*    {issue.fields.fixVersions.map((version) => (*/}
                    {/*      <span key={version.name}>{version.name}</span>*/}
                    {/*    ))}*/}
                    {/*  </div>*/}
                    {/*</TableCell>*/}
                    <TableCell className="text-center text-nowrap">{issue.fields.assignee.displayName}</TableCell>
                    <TableCell className="text-center text-nowrap">{issue.fields.creator.displayName}</TableCell>
                    <TableCell>
                      {new Date(issue.fields.created).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div>
            Showing {(page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, totalIssues)} of {totalIssues}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4"/>
            </Button>
            <div>
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4"/>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
