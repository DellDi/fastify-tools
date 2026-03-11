import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import Fastify from 'fastify'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const jiraRoute = require('../../api/routes/jira/index.js').default as typeof import('../../src/routes/jira/index.js').default

test('jira upload-attachment route should upload local file through jiraService', async () => {
  const fastify = Fastify()
  const filePath = path.join(os.tmpdir(), `jira-upload-test-${Date.now()}.txt`)
  await fs.promises.writeFile(filePath, 'hello jira attachment')

  fastify.decorate('jiraService', {
    async createTicket() {
      throw new Error('not used')
    },
    async getCreateMeta() {
      throw new Error('not used')
    },
    async uploadAttachment(credentials: { jiraUser: string; jiraPassword: string }, data: any) {
      assert.deepEqual(credentials, {
        jiraUser: 'zengdi',
        jiraPassword: '123456',
      })

      assert.equal(data.issueIdOrKey, 'NDE-3149')
      assert.equal(data.sourceType, 'local_path')
      assert.equal(data.fileName, path.basename(filePath))
      assert.equal(data.mimeType, 'application/octet-stream')
      assert.equal(data.content.toString(), 'hello jira attachment')
      assert.equal(data.size, Buffer.byteLength('hello jira attachment'))

      return {
        issueIdOrKey: data.issueIdOrKey,
        sourceType: data.sourceType,
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: data.size,
        attachment: {
          id: '10001',
          filename: data.fileName,
        },
        message: 'ok',
      }
    },
  })

  await fastify.register(jiraRoute, { prefix: '/jira' })
  await fastify.ready()

  const response = await fastify.inject({
    method: 'POST',
    url: '/jira/upload-attachment',
    payload: {
      jiraUser: 'zengdi',
      jiraPassword: '123456',
      issueIdOrKey: 'NDE-3149',
      sourceType: 'local_path',
      filePath,
    },
  })

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), {
    issueIdOrKey: 'NDE-3149',
    sourceType: 'local_path',
    fileName: path.basename(filePath),
    mimeType: 'application/octet-stream',
    size: Buffer.byteLength('hello jira attachment'),
    attachment: {
      id: '10001',
      filename: path.basename(filePath),
    },
    message: 'ok',
  })

  await fastify.close()
  await fs.promises.unlink(filePath)
})

test('jira upload-attachment route should reject remote_url request without fileUrl', async () => {
  const fastify = Fastify()

  fastify.decorate('jiraService', {
    async createTicket() {
      throw new Error('not used')
    },
    async getCreateMeta() {
      throw new Error('not used')
    },
    async uploadAttachment() {
      throw new Error('not used')
    },
  })

  await fastify.register(jiraRoute, { prefix: '/jira' })
  await fastify.ready()

  const response = await fastify.inject({
    method: 'POST',
    url: '/jira/upload-attachment',
    headers: {
      'content-type': 'application/json',
    },
    payload: {
      jiraUser: 'zengdi',
      jiraPassword: '123456',
      issueIdOrKey: 'NDE-3149',
      sourceType: 'remote_url',
    },
  })

  assert.equal(response.statusCode, 400)
  assert.deepEqual(response.json(), {
    error: 'sourceType=remote_url 时 fileUrl 必填',
  })

  await fastify.close()
})

test('jira upload-attachment route should reject multipart request without issueIdOrKey', async () => {
  const fastify = Fastify()

  fastify.decorate('jiraService', {
    async createTicket() {
      throw new Error('not used')
    },
    async getCreateMeta() {
      throw new Error('not used')
    },
    async uploadAttachment() {
      throw new Error('not used')
    },
  })

  await fastify.register(jiraRoute, { prefix: '/jira' })
  await fastify.ready()

  const boundary = '----fastify-test-boundary'
  const payload =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="jiraUser"\r\n\r\n` +
    `zengdi\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="jiraPassword"\r\n\r\n` +
    `123456\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="demo.txt"\r\n` +
    `Content-Type: text/plain\r\n\r\n` +
    `hello\r\n` +
    `--${boundary}--\r\n`

  const response = await fastify.inject({
    method: 'POST',
    url: '/jira/upload-attachment',
    headers: {
      'content-type': `multipart/form-data; boundary=${boundary}`,
    },
    payload,
  })

  assert.equal(response.statusCode, 400)
  assert.deepEqual(response.json(), {
    error: 'Bad Request',
  })

  await fastify.close()
})
