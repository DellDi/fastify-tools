import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { JiraCreateExportResponseType } from '../../schema/jira.js'
import {
  DifyResponseType,
  difySchema,
  InputDataType,
} from '../../schema/dify.js'

const dify: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  await fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set(['zd-nb-19950428']),
      verifyErrorLogLevel: 'debug',
    })
    .decorate(
      'allowAnonymous',
      function (
        req: { headers: { authorization: any } },
        reply: any,
        done: (arg0: Error | undefined) => any
      ) {
        fastify.log.debug('Authorization header:', req.headers.authorization)
        if (req.headers.authorization) {
          return done(Error('not anonymous'))
        }
        return done(undefined)
      }
    )
  fastify.post<{
    Body: InputDataType
    Response: DifyResponseType
  }>('/create-jira', {
    schema: difySchema,
    preHandler: fastify.verifyBearerAuth,
    handler: async (request, reply) => {
      const { point, ...params } = request.body
      console.log("🚀 ~ handler: ~ params:", params)
      // for debug
      fastify.log.info(`point: ${point}`)

      if (point === 'ping') {
        return { result: 'pong' }
      }

      if (point === 'app.external_data_tool.query') {
        const { issueId, issueKey, issueUrl } =
          await handleAppExternalDataToolQuery(fastify, params || {})
        return {
          result: {
            issueId,
            issueKey,
            issueUrl,
          }
        }
      }

      reply.code(400).send({ error: 'Not implemented' })
    },
  })
}

async function handleAppExternalDataToolQuery(
  fastify: FastifyInstance,
  params: Record<string, any>
) {
  const { title, description, assignee } = params || {}

  const { issueId, issueKey, issueUrl } = (await fastify.inject({
    url: '/jira/create-ticket',
    method: 'POST',
    body: {
      title,
      description,
      assignee,
    },
    headers: {
      'content-type': 'application/json',
    },
  })) as unknown as JiraCreateExportResponseType

  return {
    issueId,
    issueKey,
    issueUrl,
  }
}

export default dify
