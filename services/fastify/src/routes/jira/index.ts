import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'

import {
  jiraCreateExport,
  JiraLoginResponseType,
  JiraCreateExportBodyType,
} from '@/schema/jira/jira.js'
import { JiraRestService } from '@/services/jira/jira-rest.service.js'
import { JiraMeta, FieldMetaBean } from '@/schema/jira/meta.js'

// 定义响应类型
interface JiraCreateResponse {
  id?: string
  key?: string
  self?: string
  errors?: Record<string, string>
  [key: string]: any
}

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
            ...customAutoFields,
          },
          cookies
        )

        // const metaInfo = await jiraRestService.createMeta(
        //   req.body.projectKey,
        //   req.body.issueTypeId
        // )

        // 添加自定义字段
        if (customAutoFields) {
        }

        // 返回创建成功的工单信息
        const createdIssue = jiraCreateResponse as JiraCreateResponse
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
        jiraUser: Type.String({ default: process.env.JIRA_USER }),
        jiraPassword: Type.String({ default: process.env.JIRA_PASSWORD }),
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
        req.body.issueTypeId
      )

      // 获取创建工单的元数据
      const requestCreateMeta = await request(
        `http://bug.new-see.com:8088/rest/api/2/issue/createmeta/${metaInfo.projectKeys}/issuetypes/${metaInfo.issuetypeIds}`,
        {
          method: 'GET',
          headers: {
            Cookie: cookies,
            Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
            'Content-Type': 'application/json',
          },
          query: {
            maxResults: req.body.maxResults,
            startAt: req.body.startAt,
          },
        }
      )

      const responseBody = await requestCreateMeta.body.json()

      if (requestCreateMeta.statusCode !== 200) {
        throw new Error(`HTTP ${requestCreateMeta.statusCode}`)
      }
      const metaRes = responseBody as {
        maxResults: number
        startAt: number
        total: number
        isLast: boolean
        values: JiraMeta[]
      }
      return metaRes
    },
  })
}

export default jira
