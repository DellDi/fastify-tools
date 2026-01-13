import { JiraDetail, jiraDetailSchema } from '@/schema/jira/detail.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const detail: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {

  fastify.get('/', {
    schema: jiraDetailSchema,
    handler: async (_request, reply) => {
      const { issueIdOrKey } = _request.params

      try {
        const detailRes = await fastify.jiraService.getIssueDetail<JiraDetail>(
          {
            jiraUser: fastify.config.JIRA_USERNAME,
            jiraPassword: fastify.config.JIRA_PASSWORD,
          },
          issueIdOrKey
        )
        return reply.code(200).send(detailRes)
      } catch (error) {
        reply.code(400).send({ error: `${issueIdOrKey}: ${error}` })
      }
    },
  })
}

export default detail
