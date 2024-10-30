import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {
  DifyResponseType,
  difySchema,
  InputDataType,
} from '../../schema/dify/dify.js'

const dify: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
  .register(auth)
  .register(bearerAuth, {
    addHook: true,
    keys: new Set(['zd-nb-19950428']),
  })
  .decorate(
    'allowAnonymous',
    function (
      req: { headers: { authorization: any } },
      reply: any,
      done: (arg0: Error | undefined) => any,
    ) {
      if (req.headers.authorization) {
        return done(Error('not anonymous'))
      }
      return done(undefined)
    },
  )
  fastify.post<{
    Body: InputDataType
    Response: DifyResponseType
  }>('/create-jira', {
    schema: difySchema,
    preHandler: fastify.verifyBearerAuth,
    handler: async (request, reply) => {
      const { point, ...params } = request.body

      if (point === 'ping') {
        return { result: 'pong' }
      }

      try {
        if (point === 'app.create_jira_tool') {
          if (!params.title || !params.description) {
            reply.code(400).send({ error: 'Missing required fields: title and description' })
            return
          }
          const { issueId, issueKey, issueUrl, updateMsg } =
            await handleAppExternalDataToolQuery(fastify, params)
          reply.send({
            result: `${Date.now()}`,
            issueId,
            issueKey,
            issueUrl,
            updateMsg,
          })
          return
        }
      } catch (e) {
        reply.code(400).send({ error: `Not implemented: ${e}` })
      }
    },
  })
}

async function handleAppExternalDataToolQuery(
  fastify: FastifyInstance,
  params: Omit<InputDataType, 'point'>,
) {
  const { title, description, assignee, customerName, jiraUser, jiraPassword, labels } = params || {}

  const res = await fastify.inject({
    url: '/jira/create-ticket',
    method: 'POST',
    body: {
      title,
      description,
      jiraUser,
      jiraPassword,
      assignee,
      labels,
      customerName,
    },
    headers: {
      'content-type': 'application/json',
    },
  })

  return {
    ...res.json(),
  }
}

export default dify
