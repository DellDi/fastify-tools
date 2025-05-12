import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { request } from 'undici'
import dayjs from 'dayjs'
import qs from 'node:querystring'

import {
  JiraAddResInfoType,
  jiraCreateExport,
  JiraLoginResponseType,
  JiraUpdateResponseSchema,
} from '../../schema/jira/jira.js'
import { CustomerInfoResType } from '../../schema/dify/dify.js'

const jiraBaseUrl = 'http://bug.new-see.com:8088'

const jira: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.post('/create-ticket', {
    schema: jiraCreateExport,
    handler: async (req, reply) => {
      const {
        title,
        description,
        labels,
        assignee,
        customerName,
        jiraUser,
        jiraPassword,
        customAutoFields,
      } = req.body

      try {
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: {
            jiraUser: jiraUser,
            jiraPassword: jiraPassword,
          },
        })
        const { cookies, atlToken } = resLogin.json() as JiraLoginResponseType

        const customAutoFieldsKeys = Object.keys(customAutoFields || {})

        const jiraPostData = {
          pid: '11450',
          issuetype: '10604',
          atl_token: atlToken,
          summary: title,
          components: '13676',
          customfield_10000: '14169',
          customfield_12600: '17714',
          'customfield_12600:1': '21057',
          customfield_10041: dayjs().format('YYYY-MM-DD'),
          customfield_10070: '10270',
          priority: '3',
          description: description || title,
          assignee: assignee,
          labels: labels ? labels.split(',') : ['SaaS内部已评审'],
          timetracking: '',
          isCreateIssue: 'true',
          hasWorkStarted: 'false',
          ...(customAutoFields || {}),
          fieldsToRetain: [
            'project',
            'issuetype',
            'components',
            'customfield_10000',
            'customfield_12600',
            'customfield_12600:1',
            'customfield_10041',
            'priority',
            'assignee',
            'labels',
            ...customAutoFieldsKeys,
          ],
        }

        // Create Jira ticket
        const createTicketResponse = await request(
          `http://bug.new-see.com:8088/secure/QuickCreateIssue.jspa?decorator=none`,
          {
            method: 'POST',
            headers: {
              Cookie: cookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify(jiraPostData),
          }
        )

        const responseBody =
          (await createTicketResponse.body.json()) as JiraAddResInfoType

        // 检查是否有错误信息
        if (createTicketResponse.statusCode >= 400 || responseBody.errors) {
          // 将错误对象转换为格式化的字符串
          const errorMsg = responseBody.errors
            ? Object.entries(responseBody.errors)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')
            : '未知错误'

          fastify.log.error(`创建 Jira 工单失败: ${errorMsg}`)
          return reply.status(400).send({
            error: `创建 Jira 工单失败: ${errorMsg}`,
            details: responseBody.errors,
          })
        }
        // 调用查询客户信息接口
        const resFields = responseBody.fields
        const customerBase = resFields.find((a) => a.id === 'customfield_10000')
        const customerAll = resFields.find((a) => a.id === 'customfield_12600')

        const resBody = await fastify.inject({
          method: 'POST',
          url: '/dify/customer',
          body: {
            customerName: customerName,
            htmlStr: customerBase?.editHtml,
            htmlStrAll: customerAll?.editHtml,
          },
        })

        const { customerNameId, customerInfoId, isSaaS } =
          resBody.json() as CustomerInfoResType
        const createdIssueDetails = responseBody.createdIssueDetails
        const { id: issueId } = createdIssueDetails
        const issueKey = responseBody.issueKey
        const issueUrl = `${jiraBaseUrl}/browse/${issueKey}`
        const tagCustom = isSaaS ? 'SaaS专项工作' : '快捷工单'
        let oldLabels = labels ? labels.split(',') : []
        const updateData = {
          issueId,
          singleFieldEdit: false,
          labels: [tagCustom].concat(oldLabels),
          customfield_10000: customerNameId,
          customfield_12600: customerInfoId,
          'customfield_12600:1': `${+customerInfoId + 1}`,
          fieldsToForcePresent: [
            'labels',
            'customfield_10000',
            'customfield_12600',
          ],
        }

        // 调用更新单子接口
        const updateIssueResponse = await fastify.inject({
          method: 'POST',
          url: '/jira/update',
          body: { ...updateData, jiraUser, jiraPassword },
        })
        const updateIssueResponseBody =
          updateIssueResponse.json() as JiraUpdateResponseSchema
        fastify.log.info(updateIssueResponseBody)

        return reply.send({
          issueId,
          issueKey,
          issueUrl,
          updateMsg: updateIssueResponseBody.message,
        })
      } catch (error) {
        fastify.log.error(error)
        return reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
