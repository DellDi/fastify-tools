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
      const {
        title,
        description,
        assignee,
        jiraUser,
        jiraPassword,
        customAutoFields,
      } = req.body

      try {
        if (!jiraUser || !jiraPassword) {
          reply.code(400).send({ error: 'Missing jiraUser or jiraPassword' })
          return
        }

        // 使用 JiraService 创建工单
        const result = await jiraService.createTicket(
          { jiraUser, jiraPassword },
          {
            title,
            description,
            assignee,
            customAutoFields,
          }
        )

        return result
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        fastify.log.error('Jira API 错误:', errorMessage)
        reply.code(400).send({ error: `创建 Jira 工单失败: ${errorMessage}` })
      }
    },
  })

  fastify.post('/create-meta', {
    schema: {
      body: Type.Object({
        jiraUser: Type.Optional(Type.String({ default: process.env.JIRA_USER })),
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

      try {
        if (!jiraUser || !jiraPassword) {
          reply.code(400).send({ error: 'Missing jiraUser or jiraPassword' })
          return
        }

        // 使用 JiraService 获取元数据
        const metaInfo = await jiraService.getCreateMeta(
          { jiraUser, jiraPassword },
          projectKey,
          issueTypeId,
          maxResults,
          startAt
        )
     
        return metaInfo
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        fastify.log.error('Jira API 错误:', errorMessage)
        reply.code(400).send({ error: `获取 Jira 元数据失败: ${errorMessage}` })
      }
    },
  })
}

export default jira
