import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import qs from 'node:querystring'

interface JiraTicketRequest {
  title: string
  description?: string
  assignee: string
}

const jiraBaseUrl = 'http://bug.new-see.com:8088'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: JiraTicketRequest }>('/create-ticket', {
    schema: {
      description: 'Create a Jira ticket',
      tags: ['jira'],
      body: {
        type: 'object',
        required: ['title', 'assignee'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          assignee: { type: 'string', default: 'JIRA_ASSIGNEE_USER' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            issueKey: { type: 'string' },
            issueId: { type: 'string' },
            issueUrl: { type: 'string' },
            avatarUrls: {
              type: 'object',
              properties: {
                '48x48': { type: 'string' },
                '24x24': { type: 'string' },
                '16x16': { type: 'string' },
                '32x32': { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { title, description, assignee } = request.body

      const jiraUrl =
        'http://newsee:newsee@bug.new-see.com:8088/rest/gadget/1.0/login'
      const jiraUser = process.env.JIRA_USER
      const jiraPassword = process.env.JIRA_PASSWORD
      try {
        const loginResponse = await axios.post(
          jiraUrl,
          qs.stringify({
            os_username: jiraUser,
            os_password: jiraPassword,
            os_cookie: true,
          }),
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          }
        )

        // 获取授权token
        const setCookieHeader = loginResponse.headers['set-cookie'] ?? []
        const cookies = setCookieHeader
          .map((cookie) => cookie.split(';')[0])
          .join(';')

        let atlToken = ''
        if (Array.isArray(setCookieHeader)) {
          const xsrfCookie = setCookieHeader.find((cookie) =>
            cookie.startsWith('atlassian.xsrf.token=')
          )
          if (xsrfCookie) {
            atlToken = xsrfCookie.split(';')[0].split('=')[1]
          }
        }

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
