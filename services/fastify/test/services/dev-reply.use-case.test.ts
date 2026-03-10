import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { DevReplyUseCase } = require('../../api/services/jira/use-cases/dev-reply.use-case.js') as {
  DevReplyUseCase: typeof import('../../src/services/jira/use-cases/dev-reply.use-case.js').DevReplyUseCase
}

test('devReply should still update fields when transition is unavailable', async () => {
  const calls: string[] = []

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
    getProjectVersions: async () => [{ id: '23987', name: 'DC_V10.1.20260326' }],
    selectFixVersionSmart: () => ({
      version: { id: '23987', name: 'DC_V10.1.20260326' },
      date: new Date('2026-03-26'),
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
  assert.equal(result.fixVersionName, 'DC_V10.1.20260326')
  assert.equal(result.devCompleteDate, '2026-03-18')
  assert.match(result.message, /字段已更新/)
  assert.deepEqual(calls.includes('updateTicket'), true)
  assert.deepEqual(calls.includes('doTransition'), false)
})
