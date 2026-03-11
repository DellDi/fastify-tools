import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { jiraLoginSchema } from '@/schema/jira/jira.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {

  fastify.post('', {
    schema: jiraLoginSchema,
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword } = req.body as any

      // 使用 JiraService 进行登录（验证和错误处理在服务层）
      const session = await fastify.jiraService.login({ jiraUser, jiraPassword })
      return session
    },
  })
}

export default jira
