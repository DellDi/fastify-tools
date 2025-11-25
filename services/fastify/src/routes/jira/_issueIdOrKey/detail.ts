import { JiraDetail, jiraDetailSchema } from '@/schema/jira/detail.js'
import { JiraLoginResponseType } from '@/schema/jira/jira.js'
import { request } from 'undici'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { getJiraConfig } from '@/utils/config-helpers.js'

const detail: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  const jiraConfig = getJiraConfig(fastify)
  
  fastify.get('/detail', {
    schema: jiraDetailSchema,
    handler: async (_request, reply) => {
      const { issueIdOrKey } = _request.params
      const resLogin = await fastify.inject({
        method: 'POST',
        url: '/jira/login',
        body: {
          jiraUser: jiraConfig.auth.username,
          jiraPassword: jiraConfig.auth.password,
        },
      })
      const { cookies } = resLogin.json() as JiraLoginResponseType
      // Create Jira ticket
      const detailJiraResponse = await request(
        `${jiraConfig.baseUrl}/rest/api/2/issue/${issueIdOrKey}`,
        {
          method: 'GET',
          headers: {
            Cookie: cookies,
            Authorization: jiraConfig.auth.basicToken,
            'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
          },
        }
      )
      if (detailJiraResponse.statusCode === 200) {
        const detailRes = (await detailJiraResponse.body.json()) as JiraDetail
        return reply.code(200).send(detailRes)
      }

      reply.code(400).send({ error: `${issueIdOrKey},Not implemented` })
    },
  })
}
export default detail
