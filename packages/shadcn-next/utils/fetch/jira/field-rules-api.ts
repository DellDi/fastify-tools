import { fetchBase } from '@/utils/fetch/fetch'

export type FieldRuleStrategy = 'fixed' | 'llm' | 'computed' | 'avoid'

export interface JiraFieldRule {
  id: string
  projectKey: string
  issueTypeId: string
  fieldId: string
  fieldName: string
  kind: string
  strategy: FieldRuleStrategy | string
  learnedValue: unknown
  valueStreak: number
  required: boolean
  stale: boolean
  lastError: string | null
  successCount: number
  failCount: number
  lastSeenAt: string | null
  createdAt: string
  updatedAt: string
}

export interface FieldRuleCombo {
  projectKey: string
  issueTypeId: string
  count: number
}

export interface FieldRuleQuery {
  projectKey?: string
  issueTypeId?: string
  strategy?: string
  stale?: 'true' | 'false'
  keyword?: string
  take?: number
  skip?: number
}

export function fetchFieldRules(query: FieldRuleQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v))
  })
  const qs = params.toString()
  return fetchBase(`/api/jira/field-rules${qs ? `?${qs}` : ''}`, { method: 'GET' }) as Promise<{
    total: number
    values: JiraFieldRule[]
  }>
}

export function fetchFieldRuleCombos() {
  return fetchBase('/api/jira/field-rules/combos', { method: 'GET' }) as Promise<{
    values: FieldRuleCombo[]
  }>
}

export function patchFieldRule(id: string, patch: Partial<JiraFieldRule>) {
  return fetchBase(`/api/jira/field-rules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }) as Promise<JiraFieldRule>
}

export function deleteFieldRule(id: string) {
  return fetchBase(`/api/jira/field-rules/${id}`, { method: 'DELETE' }) as Promise<{ ok: boolean }>
}
