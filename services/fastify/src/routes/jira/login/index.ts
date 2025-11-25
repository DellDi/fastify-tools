import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@fastify/type-provider-typebox'
import { JiraService } from '@/services/jira/jira.service.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const jiraService = new JiraService(fastify)
  
  fastify.post('', {
    schema: {
      body: Type.Object({
        jiraUser: Type.String(),
        jiraPassword: Type.String(),
      }),
      response: {
        200: Type.Object({
          cookies: Type.String(),
          atlToken: Type.String(),
        }),
      },
    },
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword } = req.body as any

      // 使用 JiraService 进行登录（验证和错误处理在服务层）
      const session = await jiraService.login({ jiraUser, jiraPassword })
      return session
    },
  })
}

export default jira
