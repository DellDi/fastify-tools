import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  JiraReconcileLogAssigneesSchema,
  JiraReconcileLogsDeleteSchema,
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

  fastify.get('/assignees', {
    schema: JiraReconcileLogAssigneesSchema,
    handler: async () => ({
      values: await fastify.jiraService.getReconcileLogAssignees(),
    }),
  })

  fastify.delete('', {
    schema: JiraReconcileLogsDeleteSchema,
    handler: async (req) => {
      const { ids } = req.body as { ids: string[] }
      return { deleted: await fastify.jiraService.deleteReconcileLogs(ids) }
    },
  })
}

export default jiraReconcileLogs
