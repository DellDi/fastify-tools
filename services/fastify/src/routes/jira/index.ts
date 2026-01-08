import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'

import {
  jiraCreateExport,
  JiraCreateExportBodyType,
} from '@/schema/jira/jira.js'
import { JiraService } from '@/services/jira/jira.service.js'
import { FieldMetaBean } from '@/schema/jira/meta.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const jiraService = new JiraService(fastify)

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
      const result = await jiraService.createTicket(
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
      body: Type.Object({
        jiraUser: Type.Optional(Type.String({ default: process.env.JIRA_USERNAME })),
        jiraPassword: Type.Optional(Type.String({ default: process.env.JIRA_PASSWORD })),
        projectKey: Type.String({
          default: 'V10',
          description:
            '逗号分隔的项目 Key 列表，用于筛选结果（例如：projectKeys=PROJ1,PROJ2）',
        }),
        issueTypeId: Type.String({
          default: '4',
          description:
            '逗号分隔的问题类型 ID 列表，用于筛选结果（例如：issueTypeIds=1,2,3）',
        }),
        maxResults: Type.Number({
          default: 25,
          description: '每页最大结果数',
        }),
        startAt: Type.Number({
          default: 0,
          description: '起始位置',
        }),
      }),
      response: {
        200: Type.Object({
          maxResults: Type.Number(),
          startAt: Type.Number(),
          total: Type.Number(),
          isLast: Type.Boolean(),
          values: Type.Array(FieldMetaBean),
        }),
        400: Type.Object({
          error: Type.String(),
        }),
      },
    },
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword, projectKey, issueTypeId, maxResults, startAt } = req.body

      // 使用 JiraService 获取元数据（验证和错误处理在服务层）
      const metaInfo = await jiraService.getCreateMeta(
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
