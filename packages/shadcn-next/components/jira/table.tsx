import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { JiraResponse } from '@/app/api/jira/jira-filtered/route'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { jiraLogin, jiraSaaSFetch } from '@/utils/fetch/jira/jira-api'

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

export const JiraSaaSTable: React.FC<{ page: number, pageSize: number, query: string }> = async ({
  page = 1,
  pageSize = 50,
  query,
}) => {
  try {
    const { cookies } = await jiraLogin()
    const data: JiraResponse = await jiraSaaSFetch({
      jql: query,
      jiraCookies: cookies,
      secondaryPage: page,
      secondaryPageSize: pageSize,
    })
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
          {data.issues.map((issue) => (
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
                <div className="flex flex-col items-start">
                  {issue.fields.labels.map((label) => (
                    <span
                      className="bg-blue-600 rounded-md p-1 not-last:mb-1 text-blue-100 text-nowrap text-center"
                      key={label}>{label}</span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center text-nowrap">{issue.fields.assignee.displayName}</TableCell>
              <TableCell className="text-center text-nowrap">{issue.fields.creator.displayName}</TableCell>
              <TableCell>
                {new Date(issue.fields.created).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } catch (error) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-red-500">{JSON.stringify(error)}请求异常</p>
      </div>
    )
  }


}
