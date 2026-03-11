import { Type } from '@sinclair/typebox'

const JiraLinkTypeQuery = Type.Object({
  jiraUser: Type.Optional(Type.String({
    description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
  })),
  jiraPassword: Type.Optional(Type.String({
    description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
  })),
})

const JiraLinkTypeItem = Type.Object({
  id: Type.String({ description: '关联类型 ID。' }),
  name: Type.String({ description: '关联类型名称。' }),
  inward: Type.String({ description: '指向当前工单时的关系文案。' }),
  outward: Type.String({ description: '由当前工单指向其他工单时的关系文案。' }),
})

const JiraLinkBody = Type.Object({
  jiraUser: Type.Optional(Type.String({
    default: process.env.JIRA_USERNAME,
    description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
  })),
  jiraPassword: Type.Optional(Type.String({
    default: process.env.JIRA_PASSWORD,
    description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
  })),
  sourceIssueKeys: Type.String({
    description: '来源工单 Key，逗号分隔，例如：NDE-4143,NDE-4144',
    examples: ['NDE-4143,NDE-4144'],
  }),
  targetIssueKey: Type.String({
    description: '目标工单 Key，例如：NDE-4145',
    examples: ['NDE-4145'],
  }),
  linkTypeName: Type.Optional(Type.String({
    description: '关联类型名称，可通过 GET /jira/link/types 查询可用值',
  })),
})

export const JiraLinkTypesSchema = {
  description: '查询当前 Jira 实例支持的工单关联类型。适合在创建关联关系前先拉取可选的 linkTypeName 列表。',
  tags: ['jira'],
  querystring: JiraLinkTypeQuery,
  response: {
    200: Type.Array(JiraLinkTypeItem),
  },
}

export const JiraLinkSchema = {
  description: '批量将多个来源工单关联到一个目标工单。若未指定 linkTypeName，服务端会自动选择第一个可用关联类型。',
  tags: ['jira'],
  body: JiraLinkBody,
  response: {
    200: Type.Object({
      results: Type.Array(
        Type.Object({
          issueKey: Type.String({ description: '当前处理的来源工单 Key。' }),
          success: Type.Boolean({ description: '该工单关联是否成功。' }),
          message: Type.String({ description: '该工单关联结果说明。' }),
        }),
      ),
    }),
    400: Type.Object({
      error: Type.String({
        description: '请求参数非法或未能解析可用关联类型时返回的错误信息。',
      }),
    }),
  },
}
