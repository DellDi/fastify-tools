import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'

import {
  jiraCreateExport,
  JiraLoginResponseType,
  JiraCreateExportBodyType,
} from '@/schema/jira/jira.js'
import { JiraRestService } from '@/services/jira/jira-rest.service.js'
import { FieldMetaBean } from '@/schema/jira/meta.js'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const jiraRestService = new JiraRestService(fastify)

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
        // 登录获取认证信息
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: { jiraUser, jiraPassword },
        })

        const { cookies } = resLogin.json() as JiraLoginResponseType

        const jiraCreateResponse = await jiraRestService.createIssue(
          {
            title,
            description,
            assignee,
            customAutoFields,
          },
          cookies
        )

        // 返回创建成功的工单信息
        const createdIssue = jiraCreateResponse
        return {
          issueId: createdIssue.id || '',
          issueKey: createdIssue.key || '',
          issueUrl: `http://bug.new-see.com:8088/browse/${
            createdIssue.key || ''
          }`,
          updateMsg: '工单创建成功',
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        fastify.log.error('Jira API 错误:', errorMessage)
        throw new Error(`创建 Jira 工单失败: ${errorMessage}`)
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
      // 登录获取认证信息
      const resLogin = await fastify.inject({
        method: 'POST',
        url: '/jira/login',
        body: {
          jiraUser: req.body.jiraUser,
          jiraPassword: req.body.jiraPassword,
        },
      })

      const { cookies } = resLogin.json() as JiraLoginResponseType

      // 创建 JiraRestService
      const jiraRestService = new JiraRestService(fastify)

      const metaInfo = await jiraRestService.createMeta(
        req.body.projectKey,
        req.body.issueTypeId,
        cookies,
        req.body.maxResults,
        req.body.startAt
      )
     
      return metaInfo
    },
  })
}

export default jira
