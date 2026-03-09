import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  JiraDevReplySchema,
  JiraDevReplyBodyType,
} from '@/schema/jira/jira.js'

const jiraDevReply: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.post('', {
    schema: JiraDevReplySchema,
    handler: async (req, reply) => {
      const {
        jiraUser,
        jiraPassword,
        issueKeys,
        projectKey,
        assignee,
        transitionId,
        fixVersionId,
        devCompleteDate,
        comment,
        additionalFields,
      } = req.body as JiraDevReplyBodyType

      const normalizedIssueKeys = Array.isArray(issueKeys)
        ? issueKeys.map((item) => item.trim()).filter(Boolean)
        : issueKeys
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

      if (normalizedIssueKeys.length === 0) {
        return reply.code(400).send({ error: 'issueKeys 不能为空' })
      }

      return fastify.jiraService.devReplyBatch(
        { jiraUser, jiraPassword },
        {
          issueKeys: normalizedIssueKeys,
          projectKey,
          assignee,
          transitionId,
          fixVersionId,
          devCompleteDate,
          comment,
          additionalFields,
        },
      )
    },
  })
}

export default jiraDevReply
