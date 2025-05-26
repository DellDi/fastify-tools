import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'

import {
  JiraAddResInfoType,
  jiraCreateExport,
  JiraLoginResponseType,
  JiraCreateExportBodyType,
} from '../../schema/jira/jira.js'
import { JiraRestService } from '../../services/jira/jira-rest.service.js'
import { JiraMeta, FieldMetaBean } from '../../schema/jira/meta.js'

// 定义响应类型
interface JiraCreateResponse {
  id?: string
  key?: string
  self?: string
  errors?: Record<string, string>
  [key: string]: any
}

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
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

        // 构建符合 Jira REST API v2 的请求体
        const issueData: {
          fields: {
            project: { key: string }
            summary: string
            issuetype: { id: string }
            components: Array<{ id: string }>
            customfield_10000: { id: string }
            customfield_12600: {
              id: string
              child: {
                id: string
              }
            }
            customfield_10041: string
            priority: { id: string }
            description: string
            assignee: { name: string } | null
            [key: string]: any
          }
        } = {
          fields: {
            project: { key: 'V10' }, // 项目 ID
            summary: title,
            issuetype: { id: '4' }, // 问题类型 ID
            components: [{ id: '13676' }], // 组件 ID
            customfield_10000: { id: '13163' }, // 使用对象格式提供 ID
            customfield_12600: {
              id: '15862', // This is the ID for the parent option
              child: {
                id: '15863', // This is the ID for the child option
              },
            },
            customfield_10041: dayjs().format('YYYY-MM-DD'),
            priority: { id: '3' },
            description: description || title,
            assignee: assignee ? { name: assignee } : null,
          },
        }

        // 添加自定义字段
        if (customAutoFields) {
          Object.entries(customAutoFields).forEach(([key, value]) => {
            issueData.fields[key] = value
          })
        }

        // 创建 Jira 工单
        const createTicketResponse = await request(
          'http://bug.new-see.com:8088/rest/api/2/issue',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
              Cookie: cookies,
            },
            body: JSON.stringify(issueData),
          }
        )

        const responseBody =
          (await createTicketResponse.body.json()) as JiraAddResInfoType

        // 检查是否有错误信息
        if (
          createTicketResponse.statusCode >= 400 ||
          (responseBody as JiraCreateResponse).errors
        ) {
          const errorMsg = (responseBody as JiraCreateResponse).errors
            ? Object.entries((responseBody as JiraCreateResponse).errors!)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')
            : `HTTP ${createTicketResponse.statusCode}`
          throw new Error(`创建 Jira 工单失败: ${errorMsg}`)
        }

        // 返回创建成功的工单信息
        const createdIssue = responseBody as JiraCreateResponse
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
            maxResults: 20,
            startAt: 0,
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
