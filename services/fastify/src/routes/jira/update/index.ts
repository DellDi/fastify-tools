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
      const { issueIdOrKey, jiraUser, jiraPassword, fields } = req.body as any

      // 使用 JiraService 更新工单（验证和错误处理在服务层）
      const result = await jiraService.updateTicket(
        { jiraUser: jiraUser || '', jiraPassword: jiraPassword || '' },
        {
          issueIdOrKey,
          fields,
        }
      )

      return result
    },
  })
}

export default jira
