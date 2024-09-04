export const jiraCreateExport = {
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
}