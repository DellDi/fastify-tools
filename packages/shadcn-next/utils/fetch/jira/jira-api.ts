import { fetchBase } from '@/utils/fetch/fetch'

export interface jiraSaaSFetchBody {
  jql: string
  jiraCookies: string
  secondaryPage: number
  secondaryPageSize: number
}

export function jiraLogin() {
  try {
    return fetchBase(`/api/jira/jira-login`, { method: 'POST' })
  } catch (error) {
    console.error('Fetch error:', error)
    return Promise.resolve({
      cookies: '',
    })
  }
}

export function jiraPageTotal() {
  return fetchBase(`/api/jira/jira-filtered`, { method: 'GET' })
}

export function jiraSaaSFetch(body: jiraSaaSFetchBody) {
  try {
    return fetchBase(`/api/jira/jira-filtered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return Promise.resolve({
      issues: [],
      total: 0,
    })
  }
}
