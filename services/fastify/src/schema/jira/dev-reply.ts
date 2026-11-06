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
  status: Type.Optional(
    Type.Union(
      [
        Type.Literal('success'),
        Type.Literal('partial_success'),
        Type.Literal('failure'),
        Type.Literal('unchanged'),
      ],
      {
        description:
          '执行结果分类：success 全部完成 / partial_success 字段已改但转换失败 / failure 失败 / unchanged reconcile 后无需改动',
      },
    )
  ),
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
  reasoning: Type.Optional(
    Type.Array(Type.String(), {
      description:
        '决策推理链：版本/日期/语义巡检每个决策"为什么做"的逐条记录，末行为结论',
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
  projectKey: Type.Optional(
    Type.String({
      description:
        '项目Key，用于查询版本信息。不传时每个工单按单号前缀自动推导项目（如 ARM-75059 → ARM），支持跨项目混投。',
    }),
  ),
  assignee: Type.Optional(
    Type.String({
      default: 'zhouxia',
      description: '经办人，用于查询已占用的预计开发完成时间。不传默认 zhouxia。',
    }),
  ),
  reconcile: Type.Optional(
    Type.Boolean({
      default: true,
      description:
        '对账模式，默认开启。逐项检查工单现状（修复版本/预计完成时间/回复状态），只改写漂移项：版本已是目标单选版本则不动、日期仍合法则保留、已是回复态则跳过转换；改动说明评论由 withComment 控制（默认不发）。传 false 回退到全量盲写。',
    }),
  ),
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
  withComment: Type.Optional(
    Type.Boolean({
      default: false,
      description:
        '是否自动补评论，默认 false 不评论。传 true 时沿用原逻辑：有实际改动时生成一条客观说明评论（随转换提交或独立补评）。显式传入 comment 文本不受此开关影响，始终发表。',
    }),
  ),
  additionalFields: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description:
        '额外字段，可选，格式为 { "fieldId": "value" }，例如 { "customfield_10001": "test" }',
    })
  ),
  extraHolidays: Type.Optional(
    Type.Array(Type.String(), {
      description:
        '额外注入的节假日/封网日期，支持单日 "YYYY-MM-DD" 或区间 "YYYY-MM-DD~YYYY-MM-DD"。日期分配与动态时间字段语义巡检都会避开这些日期，且会注入 LLM 评审上下文。',
    })
  ),
})

const JiraDevReplyResponse = Type.Object({
  total: Type.Number(),
  successCount: Type.Number(),
  failureCount: Type.Number(),
  successfulIssueKeys: Type.Array(Type.String()),
  failedIssueKeys: Type.Array(Type.String()),
  unchangedIssueKeys: Type.Array(
    Type.String({ description: 'reconcile 模式下未发生任何改动的工单' }),
  ),
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
