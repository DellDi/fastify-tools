import { Static, Type } from '@sinclair/typebox'

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

const JiraCreateExportBody = Type.Object({
  title: Type.String({
    default: '【超级工单】新增测试工单',
    description: '单子标题',
  }),
  description: Type.Optional(
    Type.String({
      default: '【超级工单】新增测试工单-我是工单的描述信息',
      description: '单子描述',
    })
  ),
  assignee: Type.String({
    default: 'zengdi',
    description: '经办人',
  }),
})

const AvatarUrls = Type.Object({
  '48x48': Type.String({
    description: '48x48 头像',
  }),
  '24x24': Type.String({
    description: '24x24 头像',
  }),
  '16x16': Type.String({
    description: '16x16 头像',
  }),
  '32x32': Type.String({
    description: '32x32 头像',
  }),
})

const JiraCreateExportResponse = Type.Object({
  issueKey: Type.String({
    description: '单子key',
  }),
  issueId: Type.String({
    description: '单子id',
  }),
  issueUrl: Type.String({
    description: '单子url',
  }),
  avatarUrls: AvatarUrls,
})

export const jiraCreateExport = {
  description: 'Create a Jira ticket',
  tags: ['jira'],
  body: JiraCreateExportBody,
  response: {
    200: JiraCreateExportResponse,
  },
}

export type JiraCreateExportBodyType = Static<typeof JiraCreateExportBody>
export type JiraCreateExportResponseType = Static<
  typeof JiraCreateExportResponse
>

const JiraUpdateBody = Type.Object({
  customfield_12600: Type.Optional(
    Type.String({
      default: 'JIRA_CUSTOM_FIELD_12600',
      description: '自定义字段12600',
    })
  ),
  'customfield_12600:1': Type.Optional(
    Type.String({
      default: 'JIRA_CUSTOM_FIELD_12600',
      description: '自定义字段12600:1',
    })
  ),
  issueId: Type.Number({
    default: 123456,
    description: 'Jira单子ID',
  }),
  atl_token: Type.String({
    default: 'JIRA_ATL_TOKEN',
    description: 'Jira Atl Token',
  }),
  singleFieldEdit: Type.Boolean({
    default: true,
    description: '是否单字段编辑',
  }),
  fieldsToForcePresent: Type.String({
    default: 'labels',
    description: '强制存在的字段单子的标签',
  }),
})

const responseUpdateSchema = Type.Object({
  message: Type.String({
    description: '更新响应的信息-成功或者失败',
  }),
})

export const JiraUpdateTicketSchema = {
  body: JiraUpdateBody,
  tags: ['jira'],
  response: {
    200: responseUpdateSchema,
  },
}

export type JiraUpdateTicket = Static<typeof JiraUpdateBody>
export type JiraUpdateResponseSchema = Static<typeof responseUpdateSchema>
