import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import qs from 'node:querystring'
import {
  JiraLoginResponseType,
  JiraUpdateResponseSchema,
  JiraUpdateTicket,
  JiraUpdateTicketSchema,
} from '../../schema/jira.js'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: JiraUpdateTicket
    Response: JiraUpdateResponseSchema
  }>('/create-ticket', {
    schema: JiraUpdateTicketSchema,
    handler: async (request, reply) => {
      const { issueId, ...data } = request.body
      try {
        const resLogin = await fastify.inject('/login')
        const { cookies, atlToken } =
          resLogin.body as unknown as JiraLoginResponseType
        // Create Jira ticket
        await axios.post(
          `http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa`,
          qs.stringify({
            issueId,
            ...data,
            atlToken,
          }),
          {
            params: {
              decorator: 'none',
            },
            headers: {
              Cookie: cookies,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        return {
          message: 'Jira ticket update successfully',
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
