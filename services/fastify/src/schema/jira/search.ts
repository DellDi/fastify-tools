import { Static, Type } from '@sinclair/typebox'

export const jiraAddResInfo = Type.Object({
  issueKey: Type.String(),
  createdIssueDetails: Type.Object({
    id: Type.String(),
  }),
  fields: Type.Array(
    Type.Object({
      id: Type.String(),
      label: Type.String(),
      required: Type.Boolean(),
      editHtml: Type.String(),
    })
  ),
  errorMessages: Type.Optional(Type.Array(Type.String())),
  errors: Type.Optional(Type.Any()),
})

export type JiraAddResInfoType = Static<typeof jiraAddResInfo>

const JiraSearchBody = Type.Object({
  startAt: Type.Number({
    description: '开始位置',
    default: 0,
  }),
  maxResults: Type.Number({
    description: '最大数量',
    default: 20,
  }),
  jql: Type.String({
    description: 'Jira查询语句',
  }),
  jiraCookies: Type.String({
    description: 'jira cookies',
  }),
})

const JiraSearchResponse = Type.Object({
  total: Type.Number(),
  issues: Type.Array(
    Type.Object({
      id: Type.String(),
      key: Type.String(),
      fields: Type.Object({
        assignee: Type.Object({
          displayName: Type.String(),
        }),
        creator: Type.Object({
          displayName: Type.String(),
        }),
        fixVersions: Type.Array(
          Type.Object({
            name: Type.String(),
          })
        ),
        labels: Type.Array(Type.String()),
        customfield_10000: Type.Optional(
          Type.Object({
            value: Type.String(),
            id: Type.Number(),
          })
        ),
        customFieldCode: Type.Optional(
          Type.Number({ description: '自定义的客户名称code' })
        ),
        created: Type.String(),
        summary: Type.String(),
        status: Type.Object({
          name: Type.String(),
        }),
      }),
    })
  ),
})

const JiraErrorResponse = Type.Object({
  error: Type.String(),
  message: Type.Optional(Type.String()),
  statusCode: Type.Optional(Type.Number()),
  details: Type.Optional(Type.Any()),
})

export const JiraSearchSchema = {
  description: 'Search Jira tickets',
  tags: ['jira'],
  body: JiraSearchBody,
  response: {
    200: JiraSearchResponse,
    500: JiraErrorResponse,
    502: JiraErrorResponse,
  },
}

export type JiraSearchResponseType = Static<typeof JiraSearchResponse>
