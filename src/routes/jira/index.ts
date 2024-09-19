import { FastifyPluginAsync } from 'fastify'
import { request } from 'undici'
import qs from 'node:querystring'
import {
  JiraAddResInfoType,
  jiraCreateExport,
  JiraCreateExportBodyType,
  JiraCreateExportResponseType,
  JiraLoginResponseType,
} from '../../schema/jira.js'
import { CustomerInfoResType } from '../../schema/dify.js'

const jiraBaseUrl = 'http://bug.new-see.com:8088'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: JiraCreateExportBodyType
    Response: JiraCreateExportResponseType
  }>('/create-ticket', {
    schema: jiraCreateExport,
    handler: async (req, reply) => {
      const { title, description, assignee, customerName } = req.body

      try {
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: {
            jiraUser: process.env.JIRA_USERNAME,
            jiraPassword: process.env.JIRA_PASSWORD,
          },
        })
        const { cookies, atlToken } = resLogin.json() as JiraLoginResponseType

        const jiraPostData = {
          pid: '11450',
          issuetype: '10604',
          atl_token: atlToken,
          summary: title,
          components: '13676',
          // 客户名称
          customfield_10000: '14169',
          // 客户信息
          customfield_12600: '17714',
          'customfield_12600:1': '21057',
          customfield_10041: '2024-09-11',
          customfield_10070: '10270',
          priority: '3',
          description: description || title,
          assignee: assignee,
          labels: ['SaaS专项工作', '数据中台'],
          timetracking: '',
          isCreateIssue: 'true',
          hasWorkStarted: 'false',
          fieldsToRetain: [
            'project',
            'issuetype',
            'components',
            'customfield_10000',
            'customfield_12600',
            'customfield_10041',
            'priority',
            'assignee',
          ],
        }

        // Create Jira ticket
        const createTicketResponse = await request(
          `http://newsee:newsee@bug.new-see.com:8088/secure/QuickCreateIssue.jspa?decorator=none`,
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

        // 调用查询客户信息接口
        const resFields = responseBody.fields
        const customer = resFields.find(
          (a) => a.id === 'customfield_12600' && a.label === '客户信息'
        )
        const customerHtml = customer?.editHtml

        const { customerNameId, customerInfoId } = (await fastify.inject({
          method: 'POST',
          url: '/dify/get-customer',
          body: {
            customerName: customerName,
            htmlStr: customerHtml,
          },
        })) as unknown as CustomerInfoResType

        console.log("🚀 ~ handler: ~ customerNameId, customerInfoId:", customerNameId, customerInfoId)

        const createdIssueDetails = responseBody.createdIssueDetails
        const { id: issueId } = createdIssueDetails
        const issueKey = responseBody.issueKey
        const issueUrl = `${jiraBaseUrl}/browse/${issueKey}`
        const updateData = {
          issueId,
          atl_token: atlToken,
          singleFieldEdit: 'true',
          fieldsToForcePresent: [
            'labels',
            'customfield_10000',
            'customfield_12600',
          ],
          labels: ['SaaS专项工作', '管理驾驶舱'],
          customfield_10000: customerNameId,
          customfield_12600: customerInfoId,
        }

        const updateIssueResponse = await request(
          `http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa?decorator=none`,
          {
            method: 'POST',
            headers: {
              Cookie: cookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify(updateData),
          }
        )

        const updateResponseData = await updateIssueResponse.body.json()
        fastify.log.info(updateResponseData)
        return { issueId, issueKey, issueUrl }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
