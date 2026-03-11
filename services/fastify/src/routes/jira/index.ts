import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'

import {
  jiraCreateExport,
  JiraCreateExportBodyType,
} from '@/schema/jira/jira.js'
import { FieldMetaBean } from '@/schema/jira/meta.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {

  fastify.route({
    method: 'POST',
    url: '/create-ticket',
    schema: jiraCreateExport,
    handler: async (
      req: FastifyRequest<{ Body: JiraCreateExportBodyType }>,
      reply: FastifyReply
    ) => {
      const { title, description, assignee, customAutoFields } = req.body
      const { jiraUser, jiraPassword } = req.body

      // 使用 JiraService 创建工单（验证和错误处理在服务层）
      const result = await fastify.jiraService.createTicket(
        { jiraUser: jiraUser || '', jiraPassword: jiraPassword || '' },
        {
          title,
          description,
          assignee: assignee || undefined,
          customAutoFields,
        }
      )

      return result
    },
  })

  fastify.post('/create-meta', {
    schema: {
      description: '查询 Jira 创建工单所需的字段元数据。适合前端动态表单渲染、字段联动和问题类型配置场景。',
      body: Type.Object({
        jiraUser: Type.Optional(Type.String({
          default: process.env.JIRA_USERNAME,
          description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
        })),
        jiraPassword: Type.Optional(Type.String({
          default: process.env.JIRA_PASSWORD,
          description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
        })),
        projectKey: Type.String({
          default: 'V10',
          description:
            '目标 Jira 项目 Key。用于限定返回该项目下可创建工单的字段元数据。',
        }),
        issueTypeId: Type.String({
          default: '4',
          description:
            '目标问题类型 ID。用于限定返回该类型下的字段元数据。',
        }),
        maxResults: Type.Number({
          default: 25,
          description: '每页最大返回数量。',
        }),
        startAt: Type.Number({
          default: 0,
          description: '分页起始偏移量。',
        }),
      }),
      response: {
        200: Type.Object({
          maxResults: Type.Number({ description: '当前页最大返回数量。' }),
          startAt: Type.Number({ description: '当前页起始偏移量。' }),
          total: Type.Number({ description: '符合条件的字段总数。' }),
          isLast: Type.Boolean({ description: '是否已经是最后一页。' }),
          values: Type.Array(FieldMetaBean, {
            description: '当前页返回的 Jira 字段元数据列表。',
          }),
        }),
        400: Type.Object({
          error: Type.String({
            description: '请求参数非法或 Jira 元数据查询失败时返回的错误信息。',
          }),
        }),
      },
    },
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword, projectKey, issueTypeId, maxResults, startAt } = req.body

      // 使用 JiraService 获取元数据（验证和错误处理在服务层）
      const metaInfo = await fastify.jiraService.getCreateMeta(
        { jiraUser: jiraUser || '', jiraPassword: jiraPassword || '' },
        projectKey,
        issueTypeId,
        maxResults,
        startAt
      )

      return metaInfo
    },
  })
}

export default jira
