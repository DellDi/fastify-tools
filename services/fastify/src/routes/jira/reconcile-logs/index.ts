import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  JiraReconcileLogsSchema,
  JiraReconcileLogQueryType,
} from '@/schema/jira/jira.js'

const jiraReconcileLogs: FastifyPluginAsyncTypebox = async (
  fastify,
): Promise<void> => {
  fastify.get('', {
    schema: JiraReconcileLogsSchema,
    handler: async (req) => {
      const q = req.query as JiraReconcileLogQueryType
      return fastify.jiraService.getReconcileLogs({
        batchId: q.batchId,
        issueKey: q.issueKey,
        status: q.status,
        assignee: q.assignee,
        from: q.from,
        to: q.to,
        take: q.take,
        skip: q.skip,
      })
    },
  })
}

export default jiraReconcileLogs
