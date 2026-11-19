import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import Fastify from 'fastify'
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici'

const require = createRequire(import.meta.url)
const jiraSearch = require('../../api/routes/jira/search/index.js').default as typeof import('../../src/routes/jira/search/index.js').default

test('SaaS search reads current customer choices and delegates filtering and pagination to Jira', async (t) => {
  const dispatcher = getGlobalDispatcher()
  const mockAgent = new MockAgent()
  mockAgent.disableNetConnect()
  setGlobalDispatcher(mockAgent)
  const app = Fastify()
  t.after(async () => {
    await app.close()
    setGlobalDispatcher(dispatcher)
    await mockAgent.close()
  })

  const baseUrl = 'http://jira.example.test'
  const config = {
    PORT: '0',
    NODE_ENV: 'test',
    DATABASE_URL: '',
    JIRA_USERNAME: 'test',
    JIRA_PASSWORD: 'test',
    JIRA_BASE_URL: baseUrl,
    JIRA_PROXY_AUTH: 'Basic mock',
    BEARER_TOKEN: 'test',
  }
  app.decorate('config', config)
  await app.register(jiraSearch, { prefix: '/jira/search' })
  const jira = mockAgent.get(baseUrl)
  const options = '/rest/api/2/customFields/10000/options'
  const search = '/rest/api/2/search'
  const conditions = String.raw`created >= startOfMonth(-2) AND (status = Open OR summary ~ "order by \"example\"")`
  const sort = 'ORDER BY updated DESC'

  jira.intercept({ method: 'GET', path: `${options}?startAt=0&maxResults=1000` })
    .reply(200, {
      options: [{ id: 1, value: '6000-原客户' }, { id: 13163, value: '指定客户' }],
      total: 3,
    })
  jira.intercept({ method: 'GET', path: `${options}?startAt=2&maxResults=1000` })
    .reply(200, { options: [{ id: 2, value: '7000-边界' }], total: 3 })
  jira.intercept({ method: 'POST', path: search, body: (body) => {
    const payload = JSON.parse(body)
    return payload.jql === `cf[10000] in ("6000-原客户", "7000-边界") AND (${conditions}) ${sort}`
      && payload.startAt === 100 && payload.maxResults === 50 && payload.fields.includes('customfield_10000')
  } }).reply(200, { total: 90, issues: [] })

  jira.intercept({ method: 'GET', path: `${options}?startAt=0&maxResults=1000` })
    .reply(200, {
      options: [{ id: 2, value: '7001-移出范围' }, { id: 3, value: '6500-新增客户' }],
      total: 2,
    })
  jira.intercept({
    method: 'POST',
    path: search,
    body: (body) => JSON.parse(body).jql === `cf[10000] in ("6500-新增客户") AND (${conditions}) ${sort}`,
  }).reply(200, { total: 62, issues: [] })

  const query = (jql: string) => app.inject({
    method: 'POST',
    url: '/jira/search',
    payload: { jql, saasOnly: true, jiraCookies: 'stub=true', startAt: 100, maxResults: 50 },
  })
  const invalid = await query('status = Open) OR (status = Closed')
  assert.equal(invalid.statusCode, 400)

  const initial = await query(`${conditions} ${sort}`)
  assert.equal(initial.statusCode, 200, initial.body)
  assert.deepEqual(initial.json(), { total: 90, issues: [] })

  const updated = await query(`${conditions} ${sort}`)
  assert.equal(updated.statusCode, 200, updated.body)
  assert.deepEqual(updated.json(), { total: 62, issues: [] })
  mockAgent.assertNoPendingInterceptors()
})
