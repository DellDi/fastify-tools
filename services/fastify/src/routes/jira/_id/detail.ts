import { FastifyPluginAsync } from 'fastify'
import { JiraDetail, jiraDetailSchema } from '../../../schema/jira/detail.js'
import { JiraLoginResponseType } from '../../../schema/jira/jira.js'
import { request } from 'undici'

const detail: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{
    Params: {
      id: string
    }
    Response: JiraDetail
  }>('/detail', {
    schema: jiraDetailSchema,
    handler: async (_request, reply) => {
      const { id } = _request.params
      const resLogin = await fastify.inject({
        method: 'POST',
        url: '/jira/login',
        body: {
          jiraUser: process.env.JIRA_USER,
          jiraPassword: process.env.JIRA_PASSWORD,
        },
      })
      const { cookies } = resLogin.json() as JiraLoginResponseType
      // Create Jira ticket
      const detailJiraResponse = await request(
        `http://bug.new-see.com:8088/secure/AjaxIssueAction!default.jspa`,
        {
          method: 'GET',
          headers: {
            Cookie: cookies,
            Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
            'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
          },
          query: {
            issueKey: id,
          },
        }
      )
      if (detailJiraResponse?.statusCode === 200) {
        const detailRes = (await detailJiraResponse.body.json()) as JiraDetail
        return reply.code(200).send(detailRes)
      }

      reply.code(400).send({ error: `${id},Not implemented` })
    },
  })
}
export default detail
