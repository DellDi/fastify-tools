import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import type { ProjectIssueTypeMatch } from '../../src/services/jira/types.js'

const require = createRequire(import.meta.url)
const { CreateTicketWithLabelsUseCase } = require('../../api/services/jira/use-cases/create-ticket-with-labels.use-case.js') as {
  CreateTicketWithLabelsUseCase: typeof import('../../src/services/jira/use-cases/create-ticket-with-labels.use-case.js').CreateTicketWithLabelsUseCase
}

test('createTicketWithLabels use-case should update labels and auto dev reply', async () => {
  const calls: string[] = []

  const logger = {
    info(message: string) {
      calls.push(`logger.info:${message}`)
    },
    warn(message: string) {
      calls.push(`logger.warn:${message}`)
    },
    error() {},
  } as any

  const createTicket = async (_credentials: any, _data: any) => {
    calls.push('createTicket')
    return {
      issueId: '10001',
      issueKey: 'NDE-1',
      issueUrl: 'http://jira.test/browse/NDE-1',
      updateMsg: '工单创建成功',
      matchInfo: {
        componentId: 'cmp-1',
        projectKey: 'NDE',
        projectName: 'NDE',
        issueTypeId: '10001',
        issueTypeName: 'Task',
        confidence: 'high',
      } satisfies ProjectIssueTypeMatch,
    }
  }

  const updateTicket = async (_credentials: any, data: any) => {
    calls.push('updateTicket')
    assert.equal(data.issueIdOrKey, 'NDE-1')
    assert.deepEqual(data.fields, {
      labels: ['foo', 'bar'],
    })
    return { message: 'ok' }
  }

  const devReply = async (_credentials: any, data: any) => {
    calls.push('devReply')
    assert.deepEqual(data, {
      issueKey: 'NDE-1',
      projectKey: 'NDE',
      assignee: 'alice',
    })
    return {
      success: true,
      issueKey: 'NDE-1',
      message: 'ok',
    }
  }

  const useCase = new CreateTicketWithLabelsUseCase(
    logger,
    {
      defaultProject: 'V10',
    },
    createTicket,
    updateTicket,
    devReply,
  )

  const result = await useCase.execute(
    {
      jiraUser: 'alice',
      jiraPassword: 'secret',
    },
    {
      title: 'title',
      description: 'desc',
      labels: 'foo,bar',
      autoDevReply: true,
      assignee: 'alice',
    },
  )

  assert.equal(result.issueKey, 'NDE-1')
  assert.equal(result.devReply?.success, true)
  assert.deepEqual(calls, [
    'createTicket',
    'updateTicket',
    'devReply',
    'logger.info:Dev reply completed for NDE-1',
  ])
})
