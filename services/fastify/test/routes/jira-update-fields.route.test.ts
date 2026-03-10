import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import Fastify from 'fastify'

const require = createRequire(import.meta.url)
const jiraUpdateFieldsRoute = require('../../api/routes/jira/update-fields/index.js').default as typeof import('../../src/routes/jira/update-fields/index.js').default

test('jira update-fields route should merge structured fields, fields and extraFields', async () => {
  const fastify = Fastify()

  fastify.decorate('jiraService', {
    async updateTicket(credentials: { jiraUser: string; jiraPassword: string }, data: any) {
      assert.deepEqual(credentials, {
        jiraUser: 'zengdi',
        jiraPassword: '123456',
      })

      assert.equal(data.issueIdOrKey, 'NDE-3149')
      assert.deepEqual(data.fields, {
        priority: { id: '3' },
        labels: ['AI单', '数据中台'],
        fixVersions: [{ id: '23987' }, { id: '23988' }],
        customfield_10022: '2026-03-18',
        summary: '新的标题',
        description: '新的描述',
        assignee: { name: 'lvkailang' },
        customfield_10601: '功能现状补充说明',
      })

      return {
        message: 'ok',
      }
    },
  })

  await fastify.register(jiraUpdateFieldsRoute, { prefix: '/jira/update-fields' })
  await fastify.ready()

  const response = await fastify.inject({
    method: 'POST',
    url: '/jira/update-fields',
    payload: {
      jiraUser: 'zengdi',
      jiraPassword: '123456',
      issueIdOrKey: 'NDE-3149',
      labels: ['AI单', '数据中台'],
      fixVersionIds: ['23987', '23988'],
      devCompleteDate: '2026-03-18',
      summary: '新的标题',
      description: '新的描述',
      assignee: 'lvkailang',
      fields: {
        priority: { id: '3' },
      },
      extraFields: {
        customfield_10601: '功能现状补充说明',
      },
    },
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    message: 'ok',
  })

  await fastify.close()
})
