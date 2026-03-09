import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createServer } from 'node:http'

const require = createRequire(import.meta.url)
const { UpdateTicketUseCase } = require('../../api/services/jira/use-cases/update-ticket.use-case.js') as {
  UpdateTicketUseCase: typeof import('../../src/services/jira/use-cases/update-ticket.use-case.js').UpdateTicketUseCase
}

test('updateTicket use-case should update issue fields successfully', async () => {
  const calls: string[] = []

  const logger = {
    info() {},
    warn() {},
    error(message: string) {
      calls.push(`logger.error:${message}`)
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

  const requestBodies: string[] = []
  const server = createServer((req, res) => {
    calls.push('server:request')
    assert.equal(req.method, 'PUT')
    assert.equal(req.url, '/rest/api/2/issue/NDE-1')
    assert.equal(req.headers.cookie, 'mock-cookie')
    assert.equal(req.headers.authorization, 'Basic test')

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      requestBodies.push(body)
      res.statusCode = 204
      res.end()
    })
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start test server')
  }

  const useCase = new UpdateTicketUseCase(logger, sessionService, {
    endpoints: {
      updateIssue: `http://127.0.0.1:${address.port}/rest/api/2/issue`,
    },
    auth: {
      proxyAuthToken: 'Basic test',
    },
  })

  try {
    const result = await useCase.updateTicket(
      {
        jiraUser: 'alice',
        jiraPassword: 'secret',
      },
      {
        issueIdOrKey: 'NDE-1',
        fields: {
          labels: ['foo'],
        },
      },
    )

    assert.equal(
      result.message,
      'Jira 工单：NDE-1 已经更新成功，涉及字段：labels',
    )
    assert.deepEqual(JSON.parse(requestBodies[0] || '{}'), {
      fields: {
        labels: ['foo'],
      },
    })
    assert.deepEqual(calls, ['getSession', 'server:request'])
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  }
})
