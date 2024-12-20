import { Type, Static } from '@sinclair/typebox'

const JiraLoginBody = Type.Object({
  jiraUser: Type.String({ default: process.env.JIRA_USER }),
  jiraPassword: Type.String({ default: process.env.JIRA_PASSWORD }),
})

const JiraLoginResponse = Type.Object({
  cookies: Type.String(),
  atlToken: Type.String(),
})

export const jiraLoginSchema = {
  description: 'Login to Jira',
  tags: ['jira'],
  body: JiraLoginBody,
  response: {
    200: JiraLoginResponse,
  },
}

export type JiraLoginBodyType = Static<typeof JiraLoginBody>
export type JiraLoginResponseType = Static<typeof JiraLoginResponse>

export const JiraCreateExportBody = Type.Object({
  title: Type.String({
    default: '【超级工单】新增测试工单',
    description: '单子标题',
  }),
  description: Type.String({
    default: '【超级工单】新增测试工单-我是工单的描述信息',
    description: '单子描述',
  }),

  labels: Type.Optional(
    Type.String({
      default: 'SaaS内部已评审',
      description: '单子标签',
    }),
  ),
  assignee: Type.Optional(
    Type.String({
      default: process.env.JIRA_ASSIGNEE_USER,
      description: 'jira-经办人',
    }),
  ),
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USER,
      description: 'jira用户名-创建人',
    }),
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'jira密码-创建人',
    }),
  ),
  customerName: Type.Optional(
    Type.String({
      description: '客户名称信息',
      default: '新安明珠',
    }),
  ),
})

// const AvatarUrls = Type.Object({
//   '48x48': Type.String({
//     description: '48x48 头像',
//   }),
//   '24x24': Type.String({
//     description: '24x24 头像',
//   }),
//   '16x16': Type.String({
//     description: '16x16 头像',
//   }),
//   '32x32': Type.String({
//     description: '32x32 头像',
//   }),
// })

export const JiraCreateExportResponse = Type.Object({
  issueKey: Type.String({
    description: '单子key',
  }),
  issueId: Type.String({
    description: '单子id',
  }),
  issueUrl: Type.String({
    description: '单子url',
  }),
  updateMsg: Type.Optional(Type.String({ description: '单子更新信息' })),
})

export const jiraCreateExport = {
  description: 'Create a Jira ticket',
  tags: ['jira'],
  body: JiraCreateExportBody,
  response: {
    200: JiraCreateExportResponse,
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export type JiraCreateExportBodyType = Static<typeof JiraCreateExportBody>
export type JiraCreateExportResponseType = Static<
  typeof JiraCreateExportResponse
>

const JiraUpdateBody = Type.Object({
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USER,
      description: 'jira用户名-创建人',
    }),
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'jira密码-创建人',
    }),
  ),
  customfield_12600: Type.Optional(
    Type.String({
      default: '19960',
      description: '自定义字段12600: 客户信息',
    }),
  ),
  'customfield_12600:1': Type.Optional(
    Type.String({
      default: '19961',
      description: '自定义字段12600:1 客户信息-1',
    }),
  ),
  customfield_10000: Type.Optional(
    Type.String({
      default: '19962',
      description: '自定义字段10000:1 : 客户名称',
    }),
  ),
  labels: Type.Optional(
    Type.Array(
      Type.String({
        default: '数据中台',
        description: 'labels: 单子标签',
      }),
    ),
  ),
  issueId: Type.Number({
    default: 123456,
    description: 'Jira单子ID',
  }),
  singleFieldEdit: Type.Boolean({
    default: false,
    description: '是否单字段编辑',
  }),
  fieldsToForcePresent: Type.Array(
    Type.String({
      default: 'labels',
      description: '单子字段的标签',
    }),
  ),
})

const responseUpdateSchema = Type.Object({
  message: Type.String({
    description: '更新响应的信息-成功或者失败',
  }),
})

export const JiraUpdateTicketSchema = {
  body: JiraUpdateBody,
  header: {
    ContentType: 'application/json',
  },
  tags: ['jira'],
  response: {
    200: responseUpdateSchema,
  },
}

export type JiraUpdateTicket = Static<typeof JiraUpdateBody>
export type JiraUpdateResponseSchema = Static<typeof responseUpdateSchema>

const jiraAddResInfo = Type.Object({
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
    }),
  ),
})

export type JiraAddResInfoType = Static<typeof jiraAddResInfo>

// 新增jira的查询接口和schema
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
          }),
        ),
        labels: Type.Array(Type.String()),
        // 自定义字段
        'customfield_10000': Type.Optional(
          Type.Object({
            value: Type.String(),
            id: Type.Number(),
          }),
        ),
        customFieldCode: Type.Optional(Type.Number({ description: '自定义的客户名称code' })),
        created: Type.String(),
        summary: Type.String(),
        status: Type.Object({
          name: Type.String(),
        }),
      }),
    }),
  ),
})

export const JiraSearchSchema = {
  description: 'Search Jira tickets',
  tags: ['jira'],
  body: JiraSearchBody,
  response: {
    200: JiraSearchResponse,
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export type JiraSearchResponseType = Static<typeof JiraSearchResponse>

