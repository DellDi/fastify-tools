import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { DevReplyUseCase } = require('../../api/services/jira/use-cases/dev-reply.use-case.js') as {
  DevReplyUseCase: typeof import('../../src/services/jira/use-cases/dev-reply.use-case.js').DevReplyUseCase
}

const fmtYmd = (d: Date): string =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

const futureVersion = (): { name: string; date: Date } => {
  const date = new Date()
  date.setDate(date.getDate() + 60)
  return { name: `DC_V10.1.${fmtYmd(date)}`, date }
}

test('devReply should still update fields when transition is unavailable', async () => {
  const calls: string[] = []
  const version = futureVersion()

  const logger = {
    info(message: string) {
      calls.push(`logger.info:${message}`)
    },
    warn(message: string) {
      calls.push(`logger.warn:${message}`)
    },
    error(message: string) {
      calls.push(`logger.error:${message}`)
    },
  } as any

  const jiraRestService = {
    searchIssuesByJql: async () => ({ issues: [] }),
    getMaxUsedDate: () => undefined,
    getProjectVersions: async () => [{ id: '23987', name: version.name }],
    selectFixVersionSmart: () => ({
      version: { id: '23987', name: version.name },
      date: version.date,
    }),
    getHolidays: async () => new Set<string>(),
    getTransitions: async () => [],
    doTransition: async () => {
      calls.push('doTransition')
    },
  } as any

  const sessionService = {
    resolveCredentials: (credentials?: any) => credentials,
    getSession: async () => ({
      cookies: 'mock-cookie',
      atlToken: 'mock-token',
    }),
  } as any

  const updateTicket = async (_credentials: any, data: any) => {
    calls.push('updateTicket')
    assert.equal(data.issueIdOrKey, 'NDE-3149')
    assert.deepEqual(data.fields, {
      fixVersions: [{ id: '23987' }],
      customfield_10022: '2026-03-18',
    })
    return { message: 'ok' }
  }

  const useCase = new DevReplyUseCase(
    logger,
    jiraRestService,
    sessionService,
    updateTicket,
  )

  const result = await useCase.devReply(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    {
      issueKey: 'NDE-3149',
      projectKey: 'NDE',
      assignee: 'lvkailang',
      devCompleteDate: '2026-03-18',
    },
  )

  assert.equal(result.success, true)
  assert.equal(result.status, 'partial_success')
  assert.equal(result.fieldUpdateSuccess, true)
  assert.equal(result.transitionSuccess, false)
  assert.equal(result.fixVersionName, version.name)
  assert.equal(result.devCompleteDate, '2026-03-18')
  assert.match(result.message, /字段已更新/)
  assert.deepEqual(calls.includes('updateTicket'), true)
  assert.deepEqual(calls.includes('doTransition'), false)
})

test('devReplyBatch should reserve allocated dev complete dates within the same batch', async () => {
  const updatedDates: string[] = []
  const version = futureVersion()

  const logger = {
    info() {},
    warn() {},
    error() {},
  } as any

  const jiraRestService = {
    searchIssuesByJql: async () => ({ issues: [] }),
    getMaxUsedDate: (usedDates: Set<string>) => {
      if (usedDates.size === 0) {
        return undefined
      }
      return Array.from(usedDates).sort()[usedDates.size - 1]
    },
    getProjectVersions: async () => [{ id: '23987', name: version.name }],
    selectFixVersionSmart: () => ({
      version: { id: '23987', name: version.name },
      date: version.date,
    }),
    getHolidays: async () => new Set<string>(),
    getTransitions: async () => [{ id: '11', name: '开发回复' }],
    doTransition: async () => ({}) ,
  } as any

  const sessionService = {
    resolveCredentials: (credentials?: any) => credentials,
    getSession: async () => ({
      cookies: 'mock-cookie',
      atlToken: 'mock-token',
    }),
  } as any

  const updateTicket = async (_credentials: any, data: any) => {
    updatedDates.push(data.fields.customfield_10022)
    return { message: 'ok' }
  }

  const useCase = new DevReplyUseCase(
    logger,
    jiraRestService,
    sessionService,
    updateTicket,
  )

  const result = await useCase.devReplyBatch(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    {
      issueKeys: ['NDE-3149', 'NDE-3150'],
      projectKey: 'NDE',
      assignee: 'lvkailang',
    },
  )

  assert.equal(result.successCount, 2)
  assert.equal(updatedDates.length, 2)
  assert.notEqual(updatedDates[0], updatedDates[1])
})

const nextWeekday = (): string => {
  const d = new Date()
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1)
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const makeHarness = (overrides: {
  issueDetails?: Record<
    string,
    {
      fixVersions?: Array<{ id: string }>
      customfield_10022?: string
      status?: { name?: string }
    }
  >
  issues?: Array<{ fields: { customfield_10022?: string } }>
  transitions?: Array<{ id: string; name: string }>
}) => {
  const calls: string[] = []
  const comments: string[] = []
  const updates: Record<string, any>[] = []
  const version = futureVersion()

  const logger = { info() {}, warn() {}, error() {} } as any

  const jiraRestService = {
    getIssueDetail: async (issueKey: string) => {
      calls.push(`getIssueDetail:${issueKey}`)
      const fields = overrides.issueDetails?.[issueKey]
      if (!fields) {
        throw new Error('issue not found')
      }
      return { fields }
    },
    searchIssuesByJql: async () => ({
      issues: overrides.issues ?? [],
    }),
    getMaxUsedDate: (usedDates: Set<string>) => {
      if (usedDates.size === 0) return undefined
      return Array.from(usedDates).sort()[usedDates.size - 1]
    },
    getProjectVersions: async () => [{ id: '23987', name: version.name }],
    selectFixVersionSmart: () => ({
      version: { id: '23987', name: version.name },
      date: version.date,
    }),
    getHolidays: async () => new Set<string>(),
    getTransitions: async () => overrides.transitions ?? [],
    doTransition: async () => {
      calls.push('doTransition')
    },
    addComment: async (_issueKey: string, _cookies: string, body: string) => {
      calls.push('addComment')
      comments.push(body)
    },
  } as any

  const sessionService = {
    resolveCredentials: (credentials?: any) => credentials,
    getSession: async () => ({ cookies: 'c', atlToken: 't' }),
  } as any

  const updateTicket = async (_credentials: any, data: any) => {
    calls.push('updateTicket')
    updates.push(data.fields)
    return { message: 'ok' }
  }

  return {
    calls,
    comments,
    updates,
    useCase: new DevReplyUseCase(
      logger,
      jiraRestService,
      sessionService,
      updateTicket,
    ),
  }
}

test('devReply reconcile should keep an already-replied compliant issue unchanged', async () => {
  const validDate = nextWeekday()
  const { calls, comments, updates, useCase } = makeHarness({
    issueDetails: {
      'NDE-3149': {
        fixVersions: [{ id: '23987' }],
        customfield_10022: validDate,
        status: { name: '开发已回复' },
      },
    },
    issues: [{ fields: { customfield_10022: validDate } }],
  })

  const result = await useCase.devReply(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    { issueKey: 'NDE-3149', projectKey: 'NDE', assignee: 'zhouxia' },
  )

  assert.equal(result.status, 'unchanged')
  assert.equal(result.success, true)
  assert.equal(updates.length, 0)
  assert.equal(calls.includes('doTransition'), false)
  assert.equal(comments.length, 0)
})

test('devReply reconcile should fix drifted fields on an already-replied issue and comment', async () => {
  const { comments, updates, useCase } = makeHarness({
    issueDetails: {
      'NDE-3150': {
        fixVersions: [{ id: '100' }, { id: '23987' }],
        customfield_10022: '2020-01-01',
        status: { name: '开发已回复' },
      },
    },
    issues: [{ fields: { customfield_10022: '2020-01-01' } }],
  })

  const result = await useCase.devReply(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    { issueKey: 'NDE-3150', projectKey: 'NDE', assignee: 'zhouxia' },
  )

  assert.equal(result.status, 'success')
  assert.match(result.message, /已是回复状态，字段已按需调整/)
  assert.equal(updates.length, 1)
  // 多选版本被整体替换为单选目标版本
  assert.deepEqual(updates[0].fixVersions, [{ id: '23987' }])
  // 过期日期被重排
  assert.notEqual(updates[0].customfield_10022, '2020-01-01')
  // 有改动 → 独立评论接口补一条说明（拟人化话术）
  assert.equal(comments.length, 1)
  assert.match(comments[0], /修复版本|预计|排期|实施/)
})

test('devReply with reconcile=false should not read current state and blind-write', async () => {
  const { calls, updates, useCase } = makeHarness({})

  await useCase.devReply(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    {
      issueKey: 'NDE-3151',
      projectKey: 'NDE',
      assignee: 'zhouxia',
      devCompleteDate: '2026-03-18',
      reconcile: false,
    },
  )

  assert.equal(calls.some((c) => c.startsWith('getIssueDetail')), false)
  assert.equal(updates.length, 1)
  assert.equal(updates[0].customfield_10022, '2026-03-18')
})

test('devReplyBatch should collect unchangedIssueKeys', async () => {
  const validDate = nextWeekday()
  const { useCase } = makeHarness({
    issueDetails: {
      'NDE-3149': {
        fixVersions: [{ id: '23987' }],
        customfield_10022: validDate,
        status: { name: '开发已回复' },
      },
      'NDE-3150': {
        fixVersions: [{ id: '999' }],
        customfield_10022: '2020-01-01',
        status: { name: '开发已回复' },
      },
    },
  })

  const result = await useCase.devReplyBatch(
    { jiraUser: 'zengdi', jiraPassword: '1' },
    {
      issueKeys: ['NDE-3149', 'NDE-3150'],
      projectKey: 'NDE',
      assignee: 'zhouxia',
    },
  )

  assert.deepEqual(result.unchangedIssueKeys, ['NDE-3149'])
  assert.equal(result.results[0].status, 'unchanged')
  assert.equal(result.results[1].status, 'success')
})
