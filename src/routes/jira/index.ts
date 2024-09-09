import { FastifyPluginAsync } from 'fastify'
import { request } from 'undici'
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
    handler: async (req, reply) => {
      const { title, description, assignee } = req.body

      try {
        const resLogin = await fastify.inject({
          method: 'POST',
          url: '/jira/login',
          body: {
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
          }
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
          labels: 'SaaS专项工作,管理驾驶舱',
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
          ].join(','),
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
            body: new URLSearchParams(jiraPostData).toString(),
          }
        )

        const responseBody = (await createTicketResponse.body.json()) as {
          issueKey: string
          createdIssueDetails: {
            id: string
          }
        }
        const createdIssueDetails = responseBody.createdIssueDetails
        const { id: issueId } = createdIssueDetails
        const issueKey = responseBody.issueKey
        const issueUrl = `${jiraBaseUrl}/browse/${issueKey}`

        const updateIssueResponse = await request(
          `http://newsee:newsee@bug.new-see.com:8088/secure/AjaxIssueAction.jspa?decorator=none`,
          {
            method: 'POST',
            headers: {
              Cookie: cookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              issueId,
              atl_token: atlToken,
              singleFieldEdit: 'true',
              fieldsToForcePresent: 'labels',
              labels: 'SaaS专项工作,管理驾驶舱',
            }).toString(),
          }
        )

        const updateResponseData = (await updateIssueResponse.body.json()) as {
          issue: {
            project: {
              avatarUrls: {
                '48x48': string
              }
            }
          }
        }
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
