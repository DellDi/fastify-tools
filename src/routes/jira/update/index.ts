import { FastifyPluginAsync } from 'fastify'
import { request } from 'undici'
import qs from 'node:querystring'
import {
  JiraLoginResponseType,
  JiraUpdateResponseSchema,
  JiraUpdateTicket,
  JiraUpdateTicketSchema,
} from '../../../schema/jira.js'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: JiraUpdateTicket
    Response: JiraUpdateResponseSchema
  }>('', {
    schema: JiraUpdateTicketSchema,
    handler: async (req, reply) => {
      const { issueId, ...data } = req.body
      console.log("🚀 ~ handler: ~ data:", data)
      try {
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: {
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
          },
        })
        const { cookies, atlToken } = resLogin.json() as JiraLoginResponseType
        // Create Jira ticket
        const jiraRes = await request(
          `http://bug.new-see.com:8088/secure/AjaxIssueAction.jspa`,
          {
            method: 'POST',
            body: qs.stringify({
              issueId: issueId.toString(),
              ...data,
              atl_token: atlToken,
            }),
            query: {
              decorator: 'none',
            },
            headers: {
              Cookie: cookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        if (jiraRes?.statusCode !== 200) {
          throw new Error(
            qs.stringify({
              issueId: issueId.toString(),
              ...data,
              atl_token: atlToken,
            })
          )
        }

        return {
          message: 'Jira ticket updated successfully',
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
