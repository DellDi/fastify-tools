"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { JiraResponse } from '@/app/api/jira/jira-filtered/route'
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { jiraLogin, jiraSaaSFetch } from '@/utils/fetch/jira/jira-api'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SAAS_JQL_3M } from '@/utils/jira/jql'
import { InvoicesTableSkeleton } from './tableSkeleton'

type JiraIssue = JiraResponse['issues'][0]

// 封装获取 Jira 数据的函数
const fetchJiraData = async (page: number, pageSize: number, query: string): Promise<JiraResponse> => {
  if (!query) {
    return { issues: [], total: 0 } as JiraResponse
  }

  try {
    // 获取 Jira 登录凭证
    const { cookies } = await jiraLogin()

    // 获取 Jira 数据
    const response = await jiraSaaSFetch({
      jql: query,
      jiraCookies: cookies,
      secondaryPage: page,
      secondaryPageSize: pageSize,
    })

    return response
  } catch (error) {
    console.error('获取 Jira 数据失败:', error)
    throw error
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

interface JiraSaaSTableProps {
  page: number
  pageSize: number
  query: string
  onDataLoaded?: (data: JiraResponse) => void
}

export const JiraSaaSTable: React.FC<JiraSaaSTableProps> = ({
  page: initialPage = 1,
  pageSize: initialPageSize = 50,
  query: initialQuery = SAAS_JQL_3M,
  onDataLoaded,
}) => {
  // 使用 URL 参数作为状态源
  const searchParams = useSearchParams()

  // 从 URL 参数中获取当前值
  const currentPage = +(searchParams.get('page') || initialPage)
  const currentPageSize = +(searchParams.get('pageSize') || initialPageSize)
  const currentQuery = searchParams.get('query') || initialQuery

  // 状态管理
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<JiraResponse | null>(null)

  // 使用 useMemo 创建一个稳定的请求标识符，避免重复请求
  const requestId = useMemo(() => {
    return `${currentPage}-${currentPageSize}-${currentQuery}`
  }, [currentPage, currentPageSize, currentQuery])

  // 使用 useEffect 获取数据
  useEffect(() => {
    // 创建一个 AbortController 用于取消请求
    const controller = new AbortController()
    let isMounted = true

    const loadData = async () => {
      if (!currentQuery) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await fetchJiraData(currentPage, currentPageSize, currentQuery)

        // 确保组件仍然挂载后才更新状态
        if (isMounted) {
          setData(result)
          if (onDataLoaded) {
            onDataLoaded(result)
          }
          setLoading(false)
        }
      } catch (err) {
        // 忽略取消请求的错误
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          console.error('获取 Jira 数据失败:', err)
          setError(err instanceof Error ? err.message : '未知错误')
          setLoading(false)
        }
      }
    }

    loadData()

    // 清理函数
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [requestId, onDataLoaded]) // 使用 requestId 而不是单独的参数，避免不必要的重新请求

  // 加载状态
  if (loading) {
    return (
     <InvoicesTableSkeleton pageSize={currentPageSize} />
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-500 text-center">获取数据失败: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          重试
        </Button>
      </div>
    )
  }

  // 没有数据
  if (!data || !data.issues || data.issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 space-y-4">
        <p className="text-muted-foreground">没有找到符合条件的数据</p>
      </div>
    )
  }

  // 渲染数据表格
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
        {data.issues.map((issue: JiraIssue) => (
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
