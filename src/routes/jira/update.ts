import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import qs from 'node:querystring'
import { jiraCreateExport } from '../../schema/jira.js'
interface JiraTicketRequest {
  title: string
  description?: string
  assignee: string
}

const jiraBaseUrl = 'http://bug.new-see.com:8088'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: JiraTicketRequest }>('/create-ticket', {
    schema: jiraCreateExport,
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

        // Create Jira ticket

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
        return { message: 'Jira ticket update successfully' }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
