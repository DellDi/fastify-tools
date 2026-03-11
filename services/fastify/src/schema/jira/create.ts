import { Static, Type } from '@sinclair/typebox'

export const JiraCreateExportBody = Type.Object({
  title: Type.String({
    default: '【超级工单】新增测试工单',
    description: '待创建 Jira 工单的标题。',
  }),
  description: Type.String({
    default: '【超级工单】新增测试工单-我是工单的描述信息',
    description: '待创建 Jira 工单的详细描述内容。',
  }),
  assignee: Type.Optional(
    Type.String({
      default: process.env.JIRA_ASSIGNEE_USER,
      description: 'Jira 经办人用户名。未传时可使用服务端默认值。',
    })
  ),
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: 'Jira 登录用户名。用于指定执行创建动作的账号。',
    })
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'Jira 登录密码。用于指定执行创建动作的账号。',
    })
  ),
  customAutoFields: Type.Object(
    {
      customfield_10601: Type.String({
        description: '功能现状是必需的。',
        default: '功能现状是必需的。',
      }),
      customfield_10602: Type.String({
        description: '提交角色是必需的。',
        default: '提交角色是必需的。',
      }),
      customfield_13401: Type.String({
        description: '修改建议是必需的。',
        default: '修改建议是必需的。',
      }),
      customfield_13400: Type.String({
        description: '业务场景是必需的。',
        default: '业务场景是必需的。',
      }),
    },
    {
      default: {
        customfield_10601: '功能现状是必需的。',
        customfield_10602: '提交角色是必需的。',
        customfield_13401: '修改建议是必需的。',
        customfield_13400: '业务场景是必需的。',
      },
      additionalProperties: Type.Any(),
    }
  ),
})

export const JiraCreateExportResponse = Type.Object({
  error: Type.Optional(Type.String({
    description: '创建失败时的错误摘要信息。',
  })),
  details: Type.Optional(Type.Any({
    description: '创建失败时的附加错误详情，可能包含字段校验或 Jira 返回信息。',
  })),
  issueKey: Type.String({
    description: '创建成功后的 Jira 工单 Key。',
  }),
  issueId: Type.String({
    description: '创建成功后的 Jira 工单 ID。',
  }),
  issueUrl: Type.String({
    description: '创建成功后的 Jira 工单访问地址。',
  }),
  updateMsg: Type.Optional(Type.String({ description: '工单创建后附加更新动作的结果说明。' })),
})

export const jiraCreateExport = {
  description: 'Create a Jira ticket',
  tags: ['jira'],
  body: JiraCreateExportBody,
  response: {
    200: JiraCreateExportResponse,
    400: Type.Object({
      error: Type.String(),
      details: Type.Optional(Type.Record(Type.String(), Type.String())),
    }),
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export type JiraCreateExportBodyType = Static<typeof JiraCreateExportBody>
export type JiraCreateExportResponseType = Static<typeof JiraCreateExportResponse>
