import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'

import {
  JiraAddResInfoType,
  jiraCreateExport,
  JiraLoginResponseType,
  JiraCreateExportBodyType,
} from '../../schema/jira/jira.js'

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
    handler: async (req: FastifyRequest<{ Body: JiraCreateExportBodyType }>, reply: FastifyReply) => {
      const {
        title,
        description,
        assignee,
        jiraUser,
        jiraPassword,
        customAutoFields,
      } = req.body
      
      // Labels will be handled in a separate update if needed
      // They are not included in the initial request due to Jira API restrictions

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
            customfield_10000: { value: string }
            customfield_12600: { value: string }
            customfield_10041: string
            priority: { id: string }
            description: string
            assignee: { name: string } | null
            labels?: Array<{ name: string }>
            [key: string]: any
          }
        } = {
          fields: {
            project: { key: 'V10' }, // 项目 ID
            summary: title,
            issuetype: { id: '10604' }, // 问题类型 ID
            components: [{ id: '13676' }], // 组件 ID
            customfield_10000: { value: '14169' }, // 使用对象格式提供 ID
            customfield_12600: { value: '17714' }, // 必填字段，使用对象格式
            customfield_10041: dayjs().format('YYYY-MM-DD'),
            priority: { id: '3' },
            description: description || title,
            assignee: assignee ? { name: assignee } : null,
            labels: [{ name: '数据中台' }],
            // Labels will be added in a separate update after issue creation if needed
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
              'Authorization': 'Basic bmV3c2VlOm5ld3NlZQ==',
              'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
              'Cookie': cookies
            },
            body: JSON.stringify(issueData),
          }
        )

        const responseBody = await createTicketResponse.body.json() as JiraAddResInfoType

        // 检查是否有错误信息
        if (createTicketResponse.statusCode >= 400 || (responseBody as JiraCreateResponse).errors) {
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
          issueUrl: `http://bug.new-see.com:8088/browse/${createdIssue.key || ''}`,
          updateMsg: '工单创建成功'
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        fastify.log.error('Jira API 错误:', errorMessage)
        throw new Error(`创建 Jira 工单失败: ${errorMessage}`)
      }
    }
  })
}

export default jira
