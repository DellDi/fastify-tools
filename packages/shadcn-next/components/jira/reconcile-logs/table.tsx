'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  MinusCircle,
  RefreshCcw,
  XCircle,
} from 'lucide-react'

import {
  fetchReconcileLogs,
  type JiraReconcileLog,
  type ReconcileLogQuery,
} from '@/utils/fetch/jira/reconcile-logs-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const PAGE_SIZE = 20

const STATUS_META: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  success: { label: '已调整', variant: 'default' },
  partial_success: { label: '部分完成', variant: 'outline' },
  failure: { label: '失败', variant: 'destructive' },
  unchanged: { label: '无需改动', variant: 'secondary' },
}

const compactDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const StepIcon = ({ success }: { success: boolean }) =>
  success ? (
    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
  ) : (
    <XCircle className="h-3.5 w-3.5 text-red-500" />
  )

export const ReconcileLogsTable = () => {
  const [logs, setLogs] = useState<JiraReconcileLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [filters, setFilters] = useState<ReconcileLogQuery>({
    issueKey: '',
    status: '',
    assignee: '',
  })
  const [page, setPage] = useState(1)
  const [issueKeyInput, setIssueKeyInput] = useState('')
  const [assigneeInput, setAssigneeInput] = useState('')

  const updateFilters = (patch: ReconcileLogQuery) => {
    setPage(1)
    setFilters((f) => ({ ...f, ...patch }))
  }

  const load = useCallback(async (query: ReconcileLogQuery) => {
    setLoading(true)
    try {
      const list = await fetchReconcileLogs(query)
      if (!Array.isArray(list.values)) {
        throw new Error('加载巡检日志失败，请稍后重试')
      }
      setLogs(list.values)
      setTotal(list.total)
      if (list.values.length === 0 && (query.skip ?? 0) > 0) setPage(1)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载巡检日志失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load({ ...filters, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const reload = () =>
    load({ ...filters, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE })

  return (
    <div className="flex flex-col gap-4">
      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Input
            className="w-[160px]"
            placeholder="工单号，如 NLC-3049"
            value={issueKeyInput}
            onChange={(e) => setIssueKeyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ issueKey: issueKeyInput })
            }}
          />
          <Input
            className="w-[120px]"
            placeholder="经办人"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ assignee: assigneeInput })
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateFilters({
                issueKey: issueKeyInput,
                assignee: assigneeInput,
              })
            }
          >
            搜索
          </Button>
        </div>

        <Select
          value={filters.status || 'all'}
          onValueChange={(v) =>
            updateFilters({ status: v === 'all' ? '' : v })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="结果" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部结果</SelectItem>
            <SelectItem value="success">已调整</SelectItem>
            <SelectItem value="unchanged">无需改动</SelectItem>
            <SelectItem value="partial_success">部分完成</SelectItem>
            <SelectItem value="failure">失败</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={reload} title="刷新">
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <span className="ml-auto text-sm text-muted-foreground">
          共 {total} 条巡检记录
        </span>
      </div>

      {/* 数据表格 */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          暂无巡检记录，先跑一次 dev-reply 巡检吧
        </div>
      ) : (
        <>
          <div className="overflow-auto rounded-md border">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead className="w-[100px]">时间</TableHead>
                <TableHead className="w-[110px]">工单</TableHead>
                <TableHead className="w-[120px]">项目 / 经办人</TableHead>
                <TableHead className="w-[100px]">结果</TableHead>
                <TableHead className="min-w-[220px]">说明</TableHead>
                <TableHead className="w-[80px] text-right">耗时</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const meta = STATUS_META[log.status] ?? {
                  label: log.status,
                  variant: 'outline' as const,
                }
                const expanded = expandedId === log.id
                const steps = log.details?.steps ?? []
                return (
                  <Fragment key={log.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setExpandedId(expanded ? null : log.id)
                      }
                    >
                      <TableCell>
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {compactDate(log.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{log.issueKey}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {log.projectKey ?? '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.assignee ?? '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={meta.variant} className="text-xs">
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs" title={log.message ?? ''}>
                        {log.message ?? '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {log.durationMs != null
                          ? `${(log.durationMs / 1000).toFixed(1)}s`
                          : '—'}
                      </TableCell>
                    </TableRow>
                    {expanded && (
                      <TableRow key={`${log.id}-detail`} className="bg-muted/30">
                        <TableCell />
                        <TableCell colSpan={6}>
                          <div className="flex flex-col gap-1 py-1">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span>批次 {log.batchId.slice(0, 8)}</span>
                              {log.details?.fixVersionName && (
                                <span>版本 {log.details.fixVersionName}</span>
                              )}
                              {log.details?.devCompleteDate && (
                                <span>
                                  完成 {log.details.devCompleteDate}
                                </span>
                              )}
                              {log.details?.transitionName && (
                                <span>转换 {log.details.transitionName}</span>
                              )}
                            </div>
                            {steps.map((step, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs"
                              >
                                <StepIcon success={step.success} />
                                <span className="w-[170px] shrink-0 font-mono">
                                  {step.step}
                                </span>
                                <span className="text-muted-foreground">
                                  {step.message}
                                  {step.data?.notes ? (
                                    <span className="block pl-1 text-muted-foreground/80">
                                      {(step.data.notes as string[]).join('；')}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                            ))}
                            {steps.length === 0 && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MinusCircle className="h-3.5 w-3.5" />
                                无步骤明细
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
            <span>
              第 {page} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
