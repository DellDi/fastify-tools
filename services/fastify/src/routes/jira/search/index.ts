import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import {
  JiraSearchResponseType,
  JiraSearchSchema,
} from '../../../schema/jira/jira.js'
import cors from '@fastify/cors'
import customFieldProcessor from './filter-plugin.js'
import { getJiraConfig } from '@/utils/config-helpers.js'

const jira: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  const jiraConfig = getJiraConfig(fastify)
  
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  fastify.register(customFieldProcessor)

  fastify.post('', {
    schema: JiraSearchSchema,
    handler: async (req, reply) => {
      try {
        const { jql, jiraCookies, jiraUser, jiraPassword, startAt, maxResults } =
          req.body as {
            jql: string
            jiraCookies?: string
            jiraUser?: string
            jiraPassword?: string
            startAt: number
            maxResults: number
          }

        // 记录请求信息（不包含敏感信息）
        fastify.log.info(
          `Jira 搜索请求: startAt=${startAt}, maxResults=${maxResults}, cookies=${jiraCookies ? 'caller' : 'server-session'}`
        )
        fastify.log.info(`JQL: ${jql}`)

        const doSearch = async (cookies: string) => {
          const jiraRes = await request(
            `${jiraConfig.baseUrl}/rest/api/2/search`,
            {
              method: 'GET',
              query: {
                startAt,
                maxResults,
                jql,
              },
              headers: {
                Cookie: cookies,
                Authorization: jiraConfig.auth.proxyAuthToken,
              },
              // 添加超时设置
              headersTimeout: 60000,
              bodyTimeout: 120000,
            }
          )

          fastify.log.info(`Jira API 响应状态码: ${jiraRes.statusCode}`)

          if (jiraRes?.statusCode !== 200) {
            // 401/403 原样冒泡为带状态码的错误，服务端会话路径据此触发自愈，
            // 调用方 cookie 路径也让上层能识别"会话失效"而非笼统的 502
            if (jiraRes.statusCode === 401 || jiraRes.statusCode === 403) {
              await jiraRes.body.dump()
              throw Object.assign(new Error(`HTTP ${jiraRes.statusCode}`), {
                statusCode: jiraRes.statusCode,
              })
            }
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
          return jiraData
        }

        try {
          const jiraData = jiraCookies
            ? await doSearch(jiraCookies)
            : await fastify.jiraService.withSession(
                { jiraUser, jiraPassword },
                (session) => doSearch(session.cookies),
              )

          if (reply.sent) return
          return reply.code(200).send(jiraData)
        } catch (apiError) {
          // 会话失效（401/403）原样透传，调用方可据此重登重试；其余仍为 502
          const status =
            (apiError as { statusCode?: number })?.statusCode === 401 ||
            (apiError as { statusCode?: number })?.statusCode === 403
              ? (apiError as { statusCode: number }).statusCode
              : 502
          fastify.log.error(`Jira API 调用错误: ${apiError}`)
          return reply.code(status).send({
            error: status === 502 ? '调用 Jira API 时出错' : 'Jira 会话已失效或无权访问',
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
