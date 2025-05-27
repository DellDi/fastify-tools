import { request } from 'undici'
import {
  JiraLoginResponseType,
  JiraUpdateTicketSchema,
} from '@/schema/jira/jira.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const jira: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post('', {
    schema: JiraUpdateTicketSchema,
    handler: async (req, reply) => {
      const { issueIdOrKey, jiraUser, jiraPassword, ...data } = req.body
      try {
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: {
            jiraUser: jiraUser,
            jiraPassword: jiraPassword,
          },
        })
        const { cookies } = resLogin.json() as JiraLoginResponseType
        // update Jira ticket
        const jiraRes = await request(
          `http://bug.new-see.com:8088/rest/api/2/issue/${issueIdOrKey}`,
          {
            method: 'PUT',
            headers: {
              Cookie: cookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
            }),
          }
        )

        if (jiraRes?.statusCode !== 204) {
          throw new Error(
            JSON.stringify({
              issueIdOrKey,
              ...data,
            })
          )
        }

        return {
          message: `Jira 工单：${issueIdOrKey} 已经更新成功，涉及字段：${Object.keys(
            data.fields
          ).join(',')}`,
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
