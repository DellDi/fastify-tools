import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { JiraService } = require('../../api/services/jira/jira.service.js') as {
  JiraService: typeof import('../../src/services/jira/jira.service.js').JiraService
}

function createMockFastify() {
  return {
    config: {
      JIRA_USERNAME: 'default-user',
      JIRA_PASSWORD: 'default-pass',
      JIRA_BASE_URL: 'http://jira.test',
      JIRA_PROXY_AUTH: 'Basic test',
      JIRA_DEFAULT_PROJECT: 'NDE',
      JIRA_DEFAULT_ISSUE_TYPE: '4',
      JIRA_DEFAULT_COMPONENT: '15775',
      JIRA_DEFAULT_PRIORITY: '3',
      BEARER_TOKEN: 'token',
      DASHSCOPE_API_KEY: '',
      LLM_BASE_URL: 'http://llm.test',
      LLM_MODEL: 'qwen-flash',
    },
    log: {
      info() {},
      warn() {},
      error() {},
    },
  } as any
}

test('devReplyBatch uses default credentials and aggregates success and failure results', async () => {
  const service = new JiraService(createMockFastify())
  const calls: Array<{ jiraUser: string; jiraPassword: string; issueKey: string }> = []

  service.getSession = (async (credentials: any) => {
    calls.push({
      jiraUser: credentials.jiraUser,
      jiraPassword: credentials.jiraPassword,
      issueKey: 'SESSION',
    })

    return {
      cookies: 'mock-cookie',
      atlToken: 'mock-token',
    }
  }) as typeof service.getSession

  service['executeDevReplyWorkflow'] = (async (session: any, data: any) => {
    if (data.issueKey === 'NDE-2') {
      return {
        success: false,
        issueKey: data.issueKey,
        message: '执行工作流转换失败',
        steps: [
          {
            step: 'doTransition',
            success: false,
            message: '执行工作流转换失败',
          },
        ],
        successfulSteps: [],
        failedSteps: ['doTransition'],
      }
    }

    return {
      success: true,
      issueKey: data.issueKey,
      message: '工单已执行开发回复',
      steps: [
        {
          step: 'doTransition',
          success: true,
          message: '执行工作流转换成功',
        },
      ],
      successfulSteps: ['doTransition'],
      failedSteps: [],
    }
  }) as any

  const result = await service.devReplyBatch(undefined, {
    issueKeys: ['NDE-1', 'NDE-2'],
    projectKey: 'NDE',
    assignee: 'alice',
  })

  assert.equal(calls.length, 1)
  assert.equal(calls[0]?.jiraUser, 'default-user')
  assert.equal(calls[0]?.jiraPassword, 'default-pass')
  assert.equal(result.total, 2)
  assert.equal(result.successCount, 1)
  assert.equal(result.failureCount, 1)
  assert.deepEqual(result.successfulIssueKeys, ['NDE-1'])
  assert.deepEqual(result.failedIssueKeys, ['NDE-2'])
})

test('devReplyBatch prefers external credentials when provided', async () => {
  const service = new JiraService(createMockFastify())
  const calls: Array<{ jiraUser: string; jiraPassword: string }> = []

  service.getSession = (async (credentials: any) => {
    calls.push({
      jiraUser: credentials.jiraUser,
      jiraPassword: credentials.jiraPassword,
    })

    return {
      cookies: 'mock-cookie',
      atlToken: 'mock-token',
    }
  }) as typeof service.getSession

  service['executeDevReplyWorkflow'] = (async (session: any, data: any) => ({
    success: true,
    issueKey: data.issueKey,
    message: 'ok',
    steps: [],
    successfulSteps: [],
    failedSteps: [],
  })) as any

  await service.devReplyBatch(
    { jiraUser: 'external-user', jiraPassword: 'external-pass' },
    {
      issueKeys: ['NDE-3'],
      projectKey: 'NDE',
      assignee: 'alice',
    },
  )

  assert.deepEqual(calls, [
    {
      jiraUser: 'external-user',
      jiraPassword: 'external-pass',
    },
  ])
})
