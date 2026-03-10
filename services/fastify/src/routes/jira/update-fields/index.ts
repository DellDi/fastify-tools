import {
  JiraUpdateFieldsBodyType,
  JiraUpdateFieldsSchema,
} from '@/schema/jira/jira.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const jiraUpdateFields: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.post('', {
    schema: JiraUpdateFieldsSchema,
    handler: async (req) => {
      const {
        issueIdOrKey,
        jiraUser,
        jiraPassword,
        labels,
        fixVersionIds,
        devCompleteDate,
        summary,
        description,
        assignee,
        fields,
        extraFields,
      } = req.body as JiraUpdateFieldsBodyType

      const mergedFields: Record<string, any> = {
        ...(fields || {}),
      }

      if (labels) {
        mergedFields.labels = labels
      }

      if (fixVersionIds) {
        mergedFields.fixVersions = fixVersionIds.map((id) => ({ id }))
      }

      if (devCompleteDate) {
        mergedFields.customfield_10022 = devCompleteDate
      }

      if (summary) {
        mergedFields.summary = summary
      }

      if (description) {
        mergedFields.description = description
      }

      if (assignee) {
        mergedFields.assignee = { name: assignee }
      }

      Object.assign(mergedFields, extraFields || {})

      return fastify.jiraService.updateTicket(
        { jiraUser: jiraUser || '', jiraPassword: jiraPassword || '' },
        {
          issueIdOrKey,
          fields: mergedFields,
        },
      )
    },
  })
}

export default jiraUpdateFields
