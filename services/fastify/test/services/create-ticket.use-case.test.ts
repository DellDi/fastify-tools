import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { CreateTicketUseCase } = require('../../api/services/jira/use-cases/create-ticket.use-case.js') as {
  CreateTicketUseCase: typeof import('../../src/services/jira/use-cases/create-ticket.use-case.js').CreateTicketUseCase
}

test('createTicket use-case should orchestrate smart match, meta, custom info, issue creation and follow-up update', async () => {
  const calls: string[] = []

  const logger = {
    info(...args: any[]) {
      calls.push(`logger.info:${String(args[0])}`)
    },
    warn(...args: any[]) {
      calls.push(`logger.warn:${String(args[0])}`)
    },
    error(...args: any[]) {
      calls.push(`logger.error:${String(args[0])}`)
    },
  } as any

  const jiraRestService = {
    getProjects: async (_cookies: string) => {
      calls.push('getProjects')
      return [{ key: 'NDE', name: 'NDE' }]
    },
    getIssueTypes: async (_projectKey: string, _cookies: string) => {
      calls.push('getIssueTypes')
      return { issueTypes: [{ id: '10001', name: 'Task' }] }
    },
    matchProjectAndIssueType: async () => {
      calls.push('matchProjectAndIssueType')
      return {
        componentId: 'cmp-1',
        projectKey: 'NDE',
        projectName: 'NDE',
        issueTypeId: '10001',
        issueTypeName: 'Task',
        confidence: 'high',
      }
    },
    createMeta: async () => {
      calls.push('createMeta')
      return {
        values: [{ fieldId: 'customfield_10000' }],
      }
    },
    genCustomInfo: async () => {
      calls.push('genCustomInfo')
      return {
        customfield_10000: 'auto-value',
      }
    },
    createIssue: async (payload: any, _cookies: string, options: any) => {
      calls.push('createIssue')
      assert.equal(payload.customAutoFields.customfield_10000, 'auto-value')
      assert.equal(options.projectKey, 'NDE')
      assert.equal(options.issueTypeId, '10001')
      assert.equal(options.componentId, 'cmp-1')
      return {
        id: '10086',
        key: 'NDE-10086',
      }
    },
    getCustomInfo: () => {
      calls.push('getCustomInfo')
      return {
        customfield_20000: 'customer-value',
      }
    },
  } as any

  const sessionService = {
    getSession: async (_credentials: any) => {
      calls.push('getSession')
      return {
        cookies: 'mock-cookie',
        atlToken: 'mock-token',
      }
    },
  } as any

  const updateTicket = async (_credentials: any, data: any) => {
    calls.push('updateTicket')
    assert.equal(data.issueIdOrKey, 'NDE-10086')
    assert.deepEqual(data.fields, {
      customfield_20000: 'customer-value',
    })
    return { message: 'ok' }
  }

  const useCase = new CreateTicketUseCase(
    logger,
    jiraRestService,
    sessionService,
    {
      baseUrl: 'http://jira.test',
      defaultProject: 'V10',
      defaultIssueType: '4',
    },
    updateTicket,
  )

  const result = await useCase.createTicket(
    {
      jiraUser: 'alice',
      jiraPassword: 'secret',
    },
    {
      title: 'title',
      description: 'description',
      customerName: 'customer-a',
      smartMatch: true,
    },
  )

  assert.equal(result.issueId, '10086')
  assert.equal(result.issueKey, 'NDE-10086')
  assert.equal(result.issueUrl, 'http://jira.test/browse/NDE-10086')
  assert.equal(result.matchInfo?.projectKey, 'NDE')
  assert.deepEqual(calls, [
    'getSession',
    'getProjects',
    'getIssueTypes',
    'matchProjectAndIssueType',
    'logger.info:Smart match result: componentId=cmp-1, project=NDE, issueType=10001, confidence=high',
    'createMeta',
    'genCustomInfo',
    'logger.info:[object Object]',
    'createIssue',
    'getCustomInfo',
    'logger.info:[object Object]',
    'updateTicket',
  ])
})

test('createTicket use-case should keep explicit projectKey when smartMatch fills missing issueTypeId', async () => {
  const calls: string[] = []

  const logger = {
    info(...args: any[]) {
      calls.push(`logger.info:${String(args[0])}`)
    },
    warn(...args: any[]) {
      calls.push(`logger.warn:${String(args[0])}`)
    },
    error(...args: any[]) {
      calls.push(`logger.error:${String(args[0])}`)
    },
  } as any

  const jiraRestService = {
    getProjects: async (_cookies: string) => {
      calls.push('getProjects')
      return [{ key: 'NDE', name: 'NDE' }]
    },
    getIssueTypes: async (_projectKey: string, _cookies: string) => {
      calls.push('getIssueTypes')
      return { issueTypes: [{ id: '10604', name: '新需求' }] }
    },
    matchProjectAndIssueType: async () => {
      calls.push('matchProjectAndIssueType')
      return {
        componentId: 'cmp-2',
        projectKey: 'CPYF',
        projectName: 'CPYF',
        issueTypeId: '10604',
        issueTypeName: '新需求',
        confidence: 'high',
      }
    },
    createMeta: async () => {
      calls.push('createMeta')
      return {
        values: [],
      }
    },
    genCustomInfo: async () => {
      calls.push('genCustomInfo')
      return {}
    },
    createIssue: async (payload: any, _cookies: string, options: any) => {
      calls.push('createIssue')
      assert.equal(options.projectKey, 'NDE')
      assert.equal(options.issueTypeId, '10604')
      assert.equal(options.componentId, 'cmp-2')
      return {
        id: '20001',
        key: 'NDE-20001',
      }
    },
    getCustomInfo: () => {
      calls.push('getCustomInfo')
      return {}
    },
  } as any

  const sessionService = {
    getSession: async (_credentials: any) => {
      calls.push('getSession')
      return {
        cookies: 'mock-cookie',
        atlToken: 'mock-token',
      }
    },
  } as any

  const updateTicket = async (_credentials: any, _data: any) => {
    calls.push('updateTicket')
    return { message: 'ok' }
  }

  const useCase = new CreateTicketUseCase(
    logger,
    jiraRestService,
    sessionService,
    {
      baseUrl: 'http://jira.test',
      defaultProject: 'V10',
      defaultIssueType: '4',
    },
    updateTicket,
  )

  const result = await useCase.createTicket(
    {
      jiraUser: 'alice',
      jiraPassword: 'secret',
    },
    {
      title: 'title',
      description: 'description',
      projectKey: 'NDE',
      smartMatch: true,
    },
  )

  assert.equal(result.issueKey, 'NDE-20001')
  assert.equal(result.matchInfo?.projectKey, 'NDE')
  assert.equal(result.matchInfo?.issueTypeId, '10604')
  assert.deepEqual(calls, [
    'getSession',
    'getProjects',
    'getIssueTypes',
    'matchProjectAndIssueType',
    'logger.info:Smart match result: componentId=cmp-2, project=NDE, issueType=10604, confidence=high',
    'createMeta',
    'genCustomInfo',
    'logger.info:[object Object]',
    'createIssue',
  ])
})
