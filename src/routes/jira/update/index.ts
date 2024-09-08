import { FastifyPluginAsync } from 'fastify'
import { request } from 'undici'
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
      try {
        const resLogin = await fastify.inject('/jira/login')
        const { cookies, atlToken } = resLogin.json() as JiraLoginResponseType
        // Create Jira ticket
        await request(
          `http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa`,
          {
            method: 'POST',
            body: new URLSearchParams({
              issueId: issueId.toString(),
              ...data,
              atlToken,
              atl_token: atlToken,
              singleFieldEdit: 'true',
            }).toString(),
            query: {
              decorator: 'none',
            },
            headers: {
              Cookie: cookies,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        return {
          message: 'Jira ticket updated successfully',
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },  })
}

export default jira
