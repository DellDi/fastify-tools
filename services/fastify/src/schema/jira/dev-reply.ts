import { Static, Type } from '@sinclair/typebox'

const DevReplyStepResultSchema = Type.Object({
  step: Type.String({
    description: '执行步骤名称，例如 queryUsedDates、selectFixVersion、allocateDevCompleteDate、getTransitions、doTransition',
  }),
  success: Type.Boolean({
    description: '当前步骤是否执行成功',
  }),
  message: Type.String({
    description: '当前步骤的执行结果说明',
  }),
  data: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description: '当前步骤产生的附加数据，可选',
    })
  ),
})

const DevReplyResultSchema = Type.Object({
  success: Type.Boolean({
    description: '当前工单整体是否执行成功',
  }),
  issueKey: Type.String({
    description: '工单 Key',
  }),
  fixVersionName: Type.Optional(
    Type.String({
      description: '最终使用的修复版本名称，可选',
    })
  ),
  devCompleteDate: Type.Optional(
    Type.String({
      description: '最终分配或传入的预计开发完成时间，可选',
    })
  ),
  transitionName: Type.Optional(
    Type.String({
      description: '实际执行的工作流转换名称，可选',
    })
  ),
  message: Type.String({
    description: '当前工单整体执行结果说明',
  }),
  steps: Type.Optional(
    Type.Array(DevReplyStepResultSchema, {
      description: '当前工单各步骤的执行明细，可选',
    })
  ),
  successfulSteps: Type.Optional(
    Type.Array(Type.String(), {
      description: '执行成功的步骤名称列表，可选',
    })
  ),
  failedSteps: Type.Optional(
    Type.Array(Type.String(), {
      description: '执行失败的步骤名称列表，可选',
    })
  ),
})

const JiraDevReplyBody = Type.Object({
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: '可选，外部传入 Jira 用户名；不传则使用服务默认凭证',
    })
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: '可选，外部传入 Jira 密码；不传则使用服务默认凭证',
    })
  ),
  issueKeys: Type.Union([
    Type.Array(Type.String({ minLength: 1 })),
    Type.String({ description: '支持逗号分隔的工单 Key 字符串' }),
  ]),
  projectKey: Type.String({
    default: process.env.JIRA_DEFAULT_PROJECT || 'V10',
    description: '项目Key，用于查询版本信息',
  }),
  assignee: Type.String({
    description: '经办人，用于查询已占用的预计开发完成时间',
  }),
  transitionId: Type.Optional(
    Type.String({
      description: '转换ID，执行工作流的 id',
    })
  ),
  fixVersionId: Type.Optional(
    Type.String({ description: '修复版本ID，可选' })
  ),
  devCompleteDate: Type.Optional(
    Type.String({ description: '预计开发完成时间，可选' })
  ),
  comment: Type.Optional(Type.String({ description: '评论，可选' })),
  additionalFields: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description:
        '额外字段，可选，格式为 { "fieldId": "value" }，例如 { "customfield_10001": "test" }',
    })
  ),
})

const JiraDevReplyResponse = Type.Object({
  total: Type.Number(),
  successCount: Type.Number(),
  failureCount: Type.Number(),
  successfulIssueKeys: Type.Array(Type.String()),
  failedIssueKeys: Type.Array(Type.String()),
  results: Type.Array(DevReplyResultSchema),
})

export const JiraDevReplySchema = {
  description: 'Batch execute Jira development reply workflow',
  tags: ['jira'],
  body: JiraDevReplyBody,
  response: {
    200: JiraDevReplyResponse,
    400: Type.Object({
      error: Type.String(),
    }),
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export type JiraDevReplyBodyType = Static<typeof JiraDevReplyBody>
export type JiraDevReplyResponseType = Static<typeof JiraDevReplyResponse>
