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
  from?: string
  to?: string
  take?: number
  skip?: number
}

export function fetchReconcileLogs(query: ReconcileLogQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
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
