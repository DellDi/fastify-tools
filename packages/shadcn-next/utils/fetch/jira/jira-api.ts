import { fetchBase } from '@/utils/fetch/fetch'

export interface jiraSaaSFetchBody {
  jql: string
  jiraCookies: string
  secondaryPage: number
  secondaryPageSize: number
}

export function jiraLogin() {
  return fetchBase(`/api/jira/jira-login`, { method: 'POST' })
}

export function jiraPageTotal() {
  return fetchBase(`/api/jira/jira-filtered`, { method: 'GET' })
}

export function jiraSaaSFetch(body: jiraSaaSFetchBody) {
  return fetchBase(`/api/jira/jira-filtered`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
