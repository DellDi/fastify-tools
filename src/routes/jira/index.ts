import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import qs from 'node:querystring'
import {
  jiraCreateExport,
  JiraCreateExportBodyType,
  JiraCreateExportResponseType,
  JiraLoginResponseType,
} from '../../schema/jira.js'

const jiraBaseUrl = 'http://bug.new-see.com:8088'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: JiraCreateExportBodyType
    Response: JiraCreateExportResponseType
  }>('/create-ticket', {
    schema: jiraCreateExport,
    handler: async (request, reply) => {
      const { title, description, assignee } = request.body

      try {
        const resLogin = await fastify.inject('/login')
        const { cookies, atlToken } = resLogin.body as unknown as JiraLoginResponseType

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
          labels: ['SaaS专项工作', '管理驾驶舱'],
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
        const createTicketResponse = await axios.post(
          `http://newsee:newsee@bug.new-see.com:8088/secure/QuickCreateIssue.jspa`,
          qs.stringify(jiraPostData),
          {
            params: {
              decorator: 'none',
            },
            headers: {
              Cookie: cookies,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        const responseBody = createTicketResponse.data
        const createdIssueDetails = responseBody.createdIssueDetails
        const { id: issueId } = createdIssueDetails
        const issueKey = responseBody.issueKey
        const issueUrl = `${jiraBaseUrl}/browse/${issueKey}`

        const updateIssueResponse = await axios.post(
          `http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa`,
          qs.stringify({
            issueId,
            atl_token: atlToken,
            singleFieldEdit: true,
            fieldsToForcePresent: 'labels',
            labels: ['SaaS专项工作', '管理驾驶舱'],
          }),
          {
            params: {
              decorator: 'none',
            },
            headers: {
              Cookie: cookies,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        const updateResponseData = updateIssueResponse.data
        const avatarUrls = updateResponseData.issue?.project?.avatarUrls
        return { issueId, issueKey, issueUrl, avatarUrls }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
