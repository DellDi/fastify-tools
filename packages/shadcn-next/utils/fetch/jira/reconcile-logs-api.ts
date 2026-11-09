import { fetchBase } from '@/utils/fetch/fetch'

export type ReconcileLogStatus =
  | 'success'
  | 'partial_success'
  | 'failure'
  | 'unchanged'

export interface JiraReconcileLog {
  id: string
  batchId: string
  issueKey: string
  projectKey: string | null
  assignee: string | null
  status: string
  message: string | null
  details: {
    fixVersionName?: string
    devCompleteDate?: string
    transitionName?: string
    successfulSteps?: string[]
    failedSteps?: string[]
    reasoning?: string[]
    steps?: Array<{
      step: string
      success: boolean
      message: string
      data?: Record<string, unknown>
    }>
  } | null
  durationMs: number | null
  createdAt: string
}

export interface ReconcileLogQuery {
  batchId?: string
  issueKey?: string
  status?: string
  assignee?: string
  /** 单日筛选（YYYY-MM-DD），浏览器本地时区换算为 from/to 后传给后端 */
  date?: string
  from?: string
  to?: string
  take?: number
  skip?: number
}

export function fetchReconcileLogs(query: ReconcileLogQuery = {}) {
  const { date, ...rest } = query
  if (date) {
    const [y, m, d] = date.split('-').map(Number)
    rest.from = new Date(y, m - 1, d, 0, 0, 0, 0).toISOString()
    rest.to = new Date(y, m - 1, d, 23, 59, 59, 999).toISOString()
  }
  const params = new URLSearchParams()
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v))
  })
  const qs = params.toString()
  return fetchBase(`/api/jira/reconcile-logs${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  }) as Promise<{
    total: number
    values: JiraReconcileLog[]
  }>
}

/** 巡检日志中出现过经办人的去重列表 */
export function fetchReconcileLogAssignees() {
  return fetchBase('/api/jira/reconcile-logs/assignees', {
    method: 'GET',
  }) as Promise<{ values: string[] }>
}

/** 按 id 删除巡检日志（单删传单元素数组） */
export function deleteReconcileLogs(ids: string[]) {
  return fetchBase('/api/jira/reconcile-logs', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  }) as Promise<{ deleted: number }>
}
