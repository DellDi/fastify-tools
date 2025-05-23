import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import {
  JiraSearchResponseType,
  JiraSearchSchema,
} from '../../../schema/jira/jira.js'
import cors from '@fastify/cors'
import customFieldProcessor from './filter-plugin.js'

const jira: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  fastify.register(customFieldProcessor)

  fastify.post('', {
    schema: JiraSearchSchema,
    handler: async (req, reply) => {
      try {
        const { jql, jiraCookies, startAt, maxResults } = req.body

        // 记录请求信息（不包含敏感信息）
        fastify.log.info(
          `Jira 搜索请求: startAt=${startAt}, maxResults=${maxResults}`
        )
        fastify.log.info(`JQL: ${jql}， cookies: ${jiraCookies}`)
        // ajs_user_id=b855f69db6d93f0a1a50b21008c841d7416fc802; ajs_anonymous_id=1aa0c0e5-d076-48d2-b0d7-feaf4d1210bc;

        const cookies =
          jiraCookies +
          ';ajs_user_id=b855f69db6d93f0a1a50b21008c841d7416fc802;ajs_anonymous_id=1aa0c0e5-d076-48d2-b0d7-feaf4d1210bc;'
        console.log('🚀 ~ handler: ~ cookies:', cookies)
        try {
          const jiraRes = await request(
            `http://bug.new-see.com:8088/rest/api/2/search`,
            {
              method: 'GET',
              query: {
                startAt,
                maxResults,
                jql,
              },
              headers: {
                Cookie: cookies,
                Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              },
              // 添加超时设置
              headersTimeout: 15000,
              bodyTimeout: 30000,
            }
          )

          fastify.log.info(`Jira API 响应状态码: ${jiraRes.statusCode}`)

          if (jiraRes?.statusCode !== 200) {
            // 尝试获取错误响应内容
            const errorBody = await jiraRes.body.text()
            fastify.log.error(
              `Jira API 错误: ${jiraRes.statusCode}, ${errorBody}`
            )
            return reply.code(502).send({
              error: '无法连接到 Jira 服务',
              statusCode: jiraRes.statusCode,
              details: errorBody,
            })
          }

          const jiraData = (await jiraRes.body.json()) as JiraSearchResponseType
          fastify.log.info(
            `Jira 搜索成功，返回 ${jiraData.issues?.length || 0} 条记录`
          )
          return reply.code(200).send(jiraData)
        } catch (apiError) {
          // 专门处理 API 调用错误
          fastify.log.error(`Jira API 调用错误: ${apiError}`)
          return reply.code(502).send({
            error: '调用 Jira API 时出错',
            message:
              apiError instanceof Error ? apiError.message : String(apiError),
          })
        }
      } catch (error) {
        // 处理其他未预期的错误
        fastify.log.error(`Jira 搜索未预期错误: ${error}`)
        return reply.status(500).send({
          error: '服务器内部错误',
          message: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}

export default jira
