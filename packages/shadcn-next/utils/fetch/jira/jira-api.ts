import { fetchBase } from '@/utils/fetch/fetch'
import type { JiraResponse } from '@/app/api/jira/jira-filtered/route'

export interface jiraSaaSFetchBody {
  jql: string
  secondaryPage: number
  secondaryPageSize: number
}

export async function jiraSaaSFetch(body: jiraSaaSFetchBody): Promise<JiraResponse> {
  const data = await fetchBase('/api/jira/jira-filtered', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!Array.isArray(data?.issues)) {
    throw new Error('获取 Jira 工单失败')
  }
  return data
}
