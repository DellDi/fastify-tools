import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { jiraLoginSchema } from '@/schema/jira/jira.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {

  fastify.post('', {
    schema: jiraLoginSchema,
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword } = req.body as any

      // 显式登录必须返回真实可用会话：绕过缓存读，防止把 Jira 侧已失效
      // 的死会话发给调用方（调用方拿到死 cookie 重登还是会拿到同一个）
      const session = await fastify.jiraService.login({ jiraUser, jiraPassword }, true)
      return session
    },
  })
}

export default jira
