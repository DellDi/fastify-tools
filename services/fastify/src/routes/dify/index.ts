import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyInstance } from 'fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { difySchema, InputDataType } from '@/schema/dify/dify.js'
import { JiraService } from '@/services/jira/jira.service.js'
import { getAuthConfig } from '@/utils/config-helpers.js'
import { ValidationError } from '@/utils/errors.js'

const dify: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const authConfig = getAuthConfig(fastify)
  
  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([authConfig.bearerToken]),
    })
    .decorate(
      'allowAnonymous',
      function (
        req: { headers: { authorization: any } },
        reply: any,
        done: (arg0: Error | undefined) => any
      ) {
        if (req.headers.authorization) {
          return done(Error('not anonymous'))
        }
        return done(undefined)
      }
    )
  fastify.post('/create-jira', {
    schema: difySchema,
    preHandler: fastify.verifyBearerAuth,
    handler: async (request, reply) => {
      const { point, ...params } = request.body

      if (point === 'ping') {
        return { result: 'pong' }
      }

      if (point === 'app.create_jira_tool') {
        // 验证必需字段 - 让服务层处理验证
        const { issueId, issueKey, issueUrl, updateMsg } =
          await handleAppExternalDataToolQuery(fastify, params)
        
        return {
          result: `${Date.now()}`,
          issueId,
          issueKey,
          issueUrl,
          updateMsg,
        }
      }

      // 处理未知的 point 值
      throw new ValidationError(`未知的操作类型: ${point}`)
    },
  })
}

// 重构后的 handleAppExternalDataToolQuery 函数，使用 JiraService
async function handleAppExternalDataToolQuery(
  fastify: FastifyInstance,
  params: Omit<InputDataType, 'point'>
) {
  const jiraService = new JiraService(fastify)
  const {
    title,
    description,
    assignee,
    customerName,
    jiraUser,
    jiraPassword,
    labels,
  } = params || {}

  if (!jiraUser || !jiraPassword) {
    throw new Error('缺少 Jira 登录凭据: jiraUser 和 jiraPassword')
  }

  // 使用 JiraService 创建工单并处理标签
  const result = await jiraService.createTicketWithLabels(
    { jiraUser, jiraPassword },
    {
      title,
      description,
      assignee,
      customerName,
      labels,
    }
  )

  return result
}

export default dify
