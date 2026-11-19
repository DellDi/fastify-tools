import { request } from 'undici'
import type { getJiraConfig } from './config-helpers.js'

const CUSTOMER_FIELD_ID = 10000

export function splitJiraQuery(jql: string) {
  // Ignore parentheses and ORDER BY inside quoted text.
  const tokens = /"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'|["'()]|\border\s+by\b/gi
  let depth = 0
  let orderBy = jql.length

  for (const { 0: token, index } of jql.matchAll(tokens)) {
    if (token === '"' || token === "'") return null
    if (token === '(') depth++
    if (token === ')') {
      depth--
      if (depth < 0) return null
    }
    if (token.toLowerCase().startsWith('order')) {
      if (depth !== 0 || orderBy !== jql.length) return null
      orderBy = index
    }
  }

  if (depth !== 0) return null
  return {
    conditions: jql.slice(0, orderBy).trim(),
    sort: jql.slice(orderBy).trim(),
  }
}

export async function fetchSaasCustomerClause(config: ReturnType<typeof getJiraConfig>, cookies: string) {
  const names = new Set<string>()
  let startAt = 0

  while (true) {
    const response = await request(
      `${config.baseUrl}/rest/api/2/customFields/${CUSTOMER_FIELD_ID}/options`,
      {
        query: { startAt, maxResults: 1000 },
        headers: { Cookie: cookies, Authorization: config.auth.proxyAuthToken },
        headersTimeout: 60000,
        bodyTimeout: 120000,
      },
    )
    if (response.statusCode !== 200) {
      await response.body.dump()
      throw Object.assign(new Error(`读取 Jira 客户选项失败: HTTP ${response.statusCode}`), {
        statusCode: response.statusCode,
      })
    }

    const { options, total } = await response.body.json() as {
      options: { id: number; value: string }[]
      total: number
    }
    for (const { id, value } of options) {
      const [prefix] = value.split('-', 1)
      // Match the previous dashboard's numeric prefix rule and special-option fallback.
      const code = Number(prefix)
      if (prefix ? code >= 6000 && code <= 7000 : id === 13163) names.add(value)
    }

    startAt += options.length
    if (startAt >= total) break
    if (!options.length) throw new Error('Jira 客户选项分页未返回完整数据')
  }

  if (!names.size) return null
  const quotedNames = [...names].map((name) => JSON.stringify(name))
  return `cf[${CUSTOMER_FIELD_ID}] in (${quotedNames.join(', ')})`
}
