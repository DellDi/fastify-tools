import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { JiraRestService } = require('../../api/services/jira/jira-rest.service.js') as {
  JiraRestService: typeof import('../../src/services/jira/jira-rest.service.js').JiraRestService
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
      LLM_MODEL: 'qwen3.5-flash',
    },
    log: {
      info() {},
      warn() {},
      error() {},
    },
  } as any
}

test('getCustomInfo selects highest-score allowed value for tokenized customer name', async () => {
  const service = new JiraRestService(createMockFastify())

  const result = service.getCustomInfo(
    [
      {
        fieldId: 'customfield_12600',
        name: '客户信息',
        allowedValues: [
          { id: '17714', value: '714-中油阳光', children: [{ id: '21057', value: '默认子项' }] },
          { id: '17715', value: '715-阳光物业' },
        ],
      },
    ] as any,
    '中油物业',
  )

  assert.deepEqual(result, {
    customfield_12600: {
      id: '17714',
      child: { id: '21057' },
    },
  })
})

test('getCustomInfo keeps exact includes matches and child fallback behavior', async () => {
  const service = new JiraRestService(createMockFastify())

  const result = service.getCustomInfo(
    [
      {
        fieldId: 'customfield_12600',
        name: '客户名称',
        allowedValues: [
          { id: '17714', value: '714-中油阳光', children: [{ id: '21057', value: '默认子项' }] },
          { id: '17715', value: '715-阳光物业' },
        ],
      },
    ] as any,
    '中油阳光',
  )

  assert.deepEqual(result, {
    customfield_12600: {
      id: '17714',
      child: { id: '21057' },
    },
  })
})
