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
  Trash2,
  XCircle,
} from 'lucide-react'

import {
  deleteReconcileLogs,
  fetchReconcileLogAssignees,
  fetchReconcileLogs,
  type JiraReconcileLog,
  type ReconcileLogQuery,
} from '@/utils/fetch/jira/reconcile-logs-api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
const JIRA_BROWSE = 'http://bug.new-see.com:8088/browse'

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
  const [assigneeOptions, setAssigneeOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{
    ids: string[]
    label: string
  } | null>(null)

  const [filters, setFilters] = useState<ReconcileLogQuery>({
    issueKey: '',
    status: '',
    assignee: '',
    date: '',
  })
  const [page, setPage] = useState(1)
  const [issueKeyInput, setIssueKeyInput] = useState('')
  const [assigneeInput, setAssigneeInput] = useState('')
  const [dateInput, setDateInput] = useState('')

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

  useEffect(() => {
    fetchReconcileLogAssignees()
      .then((res) => setAssigneeOptions(res.values ?? []))
      .catch(() => {})
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const reload = () =>
    load({ ...filters, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE })

  const pageIds = logs.map((log) => log.id)
  const allChecked =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allChecked) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  }
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await deleteReconcileLogs(pendingDelete.ids)
      toast.success(`已删除 ${res.deleted ?? pendingDelete.ids.length} 条巡检记录`)
      setSelected((prev) => {
        const next = new Set(prev)
        pendingDelete.ids.forEach((id) => next.delete(id))
        return next
      })
      setPendingDelete(null)
      reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '删除失败')
    } finally {
      setDeleting(false)
    }
  }

  const FILTER_INPUT_CLS = 'border-gray-300 dark:border-gray-600'

  return (
    <div className="flex flex-col gap-4">
      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Input
            className={`w-[160px] ${FILTER_INPUT_CLS}`}
            placeholder="工单号，如 NLC-3049"
            value={issueKeyInput}
            onChange={(e) => setIssueKeyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ issueKey: issueKeyInput })
            }}
          />
          <Input
            className={`w-[140px] ${FILTER_INPUT_CLS}`}
            placeholder="经办人"
            list="reconcile-assignee-options"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ assignee: assigneeInput })
            }}
          />
          <datalist id="reconcile-assignee-options">
            {assigneeOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <Input
            type="date"
            className={`w-[150px] ${FILTER_INPUT_CLS}`}
            title="按日筛选巡检时间"
            value={dateInput}
            onChange={(e) => {
              setDateInput(e.target.value)
              updateFilters({ date: e.target.value })
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateFilters({
                issueKey: issueKeyInput,
                assignee: assigneeInput,
                date: dateInput,
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

        {selected.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              setPendingDelete({
                ids: [...selected],
                label: `${selected.size} 条记录`,
              })
            }
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            删除选中（{selected.size}）
          </Button>
        )}
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
                <TableHead className="w-[36px]">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="全选本页"
                  />
                </TableHead>
                <TableHead className="w-[36px]" />
                <TableHead className="w-[100px]">时间</TableHead>
                <TableHead className="w-[110px]">工单</TableHead>
                <TableHead className="w-[120px]">项目 / 经办人</TableHead>
                <TableHead className="w-[100px]">结果</TableHead>
                <TableHead className="min-w-[220px]">说明</TableHead>
                <TableHead className="w-[80px] text-right">耗时</TableHead>
                <TableHead className="w-[50px]" />
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
                const reasoning = log.details?.reasoning ?? []

                // 改动明细：优先取 updateFields 的字段级 from→to，
                // 老记录无 diffs 时退化为结果字段概览
                const changeLines: string[] = []
                const updateStep = steps.find(
                  (s) => s.step === 'updateFields' && s.success,
                )
                const diffs = updateStep?.data?.diffs as
                  | Record<string, { from?: unknown; to?: unknown }>
                  | undefined
                const FIELD_LABEL: Record<string, string> = {
                  fixVersions: '修复版本',
                  customfield_10022: '预计开发完成',
                }
                if (diffs) {
                  for (const [key, d] of Object.entries(diffs)) {
                    const label = FIELD_LABEL[key] ?? key
                    const from = Array.isArray(d.from)
                      ? d.from.join('、') || '未填'
                      : (d.from ?? '未填')
                    changeLines.push(`${label}  ${from} → ${d.to ?? '—'}`)
                  }
                } else {
                  if (log.details?.fixVersionName)
                    changeLines.push(`修复版本 → ${log.details.fixVersionName}`)
                  if (log.details?.devCompleteDate)
                    changeLines.push(`预计开发完成 → ${log.details.devCompleteDate}`)
                }
                const normStep = steps.find(
                  (s) => s.step === 'normalizeStartTime' && s.success,
                )
                if (normStep?.data?.planStartTime) {
                  changeLines.push(
                    `计划开始时间 → ${String(normStep.data.planStartTime).slice(0, 16).replace('T', ' ')}`,
                  )
                }
                const semanticStep = steps.find(
                  (s) => s.step === 'semanticDateReview' && s.success,
                )
                const appliedCount = Array.isArray(semanticStep?.data?.applied)
                  ? (semanticStep!.data!.applied as string[]).length
                  : 0
                if (appliedCount) {
                  changeLines.push(`语义巡检调整 ${appliedCount} 项时间字段`)
                }
                const transStep = steps.find(
                  (s) => s.step === 'doTransition' && s.success,
                )
                if (transStep?.data?.transitionName) {
                  changeLines.push(`工作流转换 → ${transStep.data.transitionName}`)
                }
                return (
                  <Fragment key={log.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setExpandedId(expanded ? null : log.id)
                      }
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected.has(log.id)}
                          onCheckedChange={() => toggleOne(log.id)}
                          aria-label={`选择 ${log.issueKey}`}
                        />
                      </TableCell>
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
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`${JIRA_BROWSE}/${log.issueKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:text-primary/80 hover:underline"
                        >
                          {log.issueKey}
                        </a>
                      </TableCell>
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
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="删除该记录"
                          onClick={() =>
                            setPendingDelete({
                              ids: [log.id],
                              label: `${log.issueKey} 的记录`,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded && (
                      <TableRow key={`${log.id}-detail`} className="bg-muted/30">
                        <TableCell />
                        <TableCell />
                        <TableCell colSpan={7}>
                          <div className="flex flex-col gap-2.5 py-1">
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

                            {changeLines.length > 0 && (
                              <div>
                                <div className="mb-1 text-xs font-medium text-foreground/80">
                                  改动内容
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  {changeLines.map((line, i) => (
                                    <span
                                      key={i}
                                      className="font-mono text-xs text-foreground/90"
                                    >
                                      {line}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {reasoning.length > 0 && (
                              <div>
                                <div className="mb-1 text-xs font-medium text-foreground/80">
                                  决策推理
                                </div>
                                <div className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                                  {reasoning.map((line, i) => {
                                    const isConclusion = line.startsWith('结论：')
                                    return (
                                      <span
                                        key={i}
                                        className={
                                          isConclusion
                                            ? 'text-xs font-medium text-foreground'
                                            : 'text-xs text-muted-foreground'
                                        }
                                      >
                                        {line}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="mb-1 text-xs font-medium text-foreground/80">
                                步骤明细
                              </div>
                              <div className="flex flex-col gap-1">
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
                            </div>
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

      {/* 删除二次确认 */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除巡检记录？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除 {pendingDelete?.label}，删除后不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
            >
              {deleting ? '删除中…' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
