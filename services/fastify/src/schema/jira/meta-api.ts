import { Type } from '@sinclair/typebox'
import { FieldMetaBean } from './meta.js'

export const JiraCreateMetaBody = Type.Object({
  jiraUser: Type.Optional(Type.String({
    default: process.env.JIRA_USERNAME,
    description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
  })),
  jiraPassword: Type.Optional(Type.String({
    default: process.env.JIRA_PASSWORD,
    description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
  })),
  projectKey: Type.String({
    default: 'V10',
    description: '目标 Jira 项目 Key。用于限定返回该项目下可创建工单的字段元数据。',
  }),
  issueTypeId: Type.String({
    default: '4',
    description: '目标问题类型 ID。用于限定返回该类型下的字段元数据。',
  }),
  maxResults: Type.Number({
    default: 25,
    description: '每页最大返回数量。',
  }),
  startAt: Type.Number({
    default: 0,
    description: '分页起始偏移量。',
  }),
})

export const JiraCreateMetaSchema = {
  description: '查询 Jira 创建工单所需的字段元数据。适合前端动态表单渲染、字段联动和问题类型配置场景。',
  tags: ['jira'],
  body: JiraCreateMetaBody,
  response: {
    200: Type.Object({
      maxResults: Type.Number({ description: '当前页最大返回数量。' }),
      startAt: Type.Number({ description: '当前页起始偏移量。' }),
      total: Type.Number({ description: '符合条件的字段总数。' }),
      isLast: Type.Boolean({ description: '是否已经是最后一页。' }),
      values: Type.Array(FieldMetaBean, {
        description: '当前页返回的 Jira 字段元数据列表。',
      }),
    }),
    400: Type.Object({
      error: Type.String({
        description: '请求参数非法或 Jira 元数据查询失败时返回的错误信息。',
      }),
    }),
  },
}
