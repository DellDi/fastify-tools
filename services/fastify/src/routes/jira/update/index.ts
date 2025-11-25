import {
  JiraUpdateTicketSchema,
} from '@/schema/jira/jira.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { JiraService } from '@/services/jira/jira.service.js'

const jira: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  const jiraService = new JiraService(fastify)
  
  fastify.post('', {
    schema: JiraUpdateTicketSchema,
    handler: async (req, reply) => {
      const { issueIdOrKey, jiraUser, jiraPassword, fields } = req.body
      try {
        if (!jiraUser || !jiraPassword) {
          return reply.code(400).send({ error: 'Missing jiraUser or jiraPassword' })
        }

        // 使用 JiraService 更新工单
        const result = await jiraService.updateTicket(
          { jiraUser, jiraPassword },
          {
            issueIdOrKey,
            fields,
          }
        )

        return result
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
