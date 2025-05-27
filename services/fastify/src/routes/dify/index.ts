import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyInstance } from 'fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { difySchema, InputDataType } from '@/schema/dify/dify.js'
import { JiraCreateExportResponseType } from '@/schema/jira/jira.js'
import { JiraRestService } from '@/services/jira/jira-rest.service.js'
import { fastifyCache } from '@/utils/cache.js'

const dify: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set(['zd-nb-19950428']),
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

      try {
        if (point === 'app.create_jira_tool') {
          if (!params.title || !params.description) {
            reply
              .code(400)
              .send({ error: 'Missing required fields: title and description' })
            return
          }
          const { issueId, issueKey, issueUrl, updateMsg } =
            await handleAppExternalDataToolQuery(fastify, params)
          reply.send({
            result: `${Date.now()}`,
            issueId,
            issueKey,
            issueUrl,
            updateMsg,
          })
        }
      } catch (e) {
        reply.code(400).send({ error: `Not implemented: ${e}` })
      }
    },
  })
}

// 修改 handleAppExternalDataToolQuery 函数，增加错误处理
async function handleAppExternalDataToolQuery(
  fastify: FastifyInstance,
  params: Omit<InputDataType, 'point'>
) {
  const jiraService = new JiraRestService(fastify)

  const {
    title,
    description,
    assignee,
    customerName,
    jiraUser,
    jiraPassword,
    labels,
    customAutoFields,
  } = params || {}

  const res = await fastify.inject({
    url: '/jira/create-ticket',
    method: 'POST',
    body: {
      title,
      description,
      jiraUser,
      jiraPassword,
      assignee,
      customerName,
      customAutoFields,
    },
    headers: {
      'content-type': 'application/json',
    },
  })

  // 检查响应状态码
  if (res.statusCode >= 400) {
    fastify.log.error(`Jira API 错误: ${res.statusCode} - ${res.body}`)
    throw new Error(`创建 Jira 工单失败: ${res.body}`)
  }

  // 登录获取认证信息
  await fastify.inject({
    method: 'POST',
    url: '/jira/login',
    body: { jiraUser, jiraPassword },
  })

  // 尝试解析 JSON 并验证必要字段
  try {
    const jsonData = res.json() as JiraCreateExportResponseType

    // 检查是否包含错误信息
    if (jsonData.error) {
      fastify.log.error(`Jira API 返回错误: ${jsonData.error}`)

      // 如果有详细错误信息，格式化并记录
      if (jsonData.details) {
        const detailsStr = Object.entries(jsonData.details)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
        fastify.log.error(`错误详情:\n${detailsStr}`)
      }

      throw new Error(jsonData.error)
    }

    // 验证必要字段
    if (!jsonData.issueId || !jsonData.issueKey) {
      throw new Error('返回的 Jira 数据缺少必要字段')
    }

    const { values } = await jiraService.createMeta(
      'V10',
      '4',
      fastifyCache.get('jira-session')?.cookies,
      25,
      0
    )

    const customInfo = jiraService.getCustomInfo(values, customerName || '')
    const labelArr = labels?.split(',') || []
    await fastify.inject({
      url: '/jira/update',
      method: 'POST',
      body: {
        issueIdOrKey: jsonData.issueKey,
        fields: {
          labels: labelArr,
          ...customInfo,
        },
      },
      headers: {
        'content-type': 'application/json',
      },
    })

    return jsonData
  } catch (error) {
    fastify.log.error(`解析 Jira 响应失败: ${error}`)
    throw new Error(`处理 Jira 响应时出错: ${error}`)
  }
}

export default dify
