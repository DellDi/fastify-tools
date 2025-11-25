import { FastifyPluginAsync } from 'fastify'
import {
  JiraLoginBodyType,
  JiraLoginResponseType,
  jiraLoginSchema,
} from '../../../schema/jira/jira.js'
import { JiraService } from '@/services/jira/jira.service.js'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const jiraService = new JiraService(fastify)
  
  fastify.post<{ Body: JiraLoginBodyType; Response: JiraLoginResponseType }>(
    '',
    {
      schema: jiraLoginSchema,
      handler: async (req, reply) => {
        const { jiraUser, jiraPassword } = req.body

        try {
          if (!jiraUser || !jiraPassword) {
            return reply.code(400).send({ error: 'Missing jiraUser or jiraPassword' })
          }

          // 使用 JiraService 进行登录
          const session = await jiraService.login({ jiraUser, jiraPassword })
          return session
        } catch (error) {
          fastify.log.error('Login error:', error)
          return reply.code(400).send({ error: 'Login failed' })
        }
      },
    }
  )
}

export default jira
