import { Static, Type } from '@sinclair/typebox'

const ReconcileLogQuerystring = Type.Object({
  batchId: Type.Optional(
    Type.String({ description: '按巡检批次 ID 过滤' }),
  ),
  issueKey: Type.Optional(
    Type.String({ description: '按工单 Key 过滤' }),
  ),
  status: Type.Optional(
    Type.Union(
      [
        Type.Literal('success'),
        Type.Literal('partial_success'),
        Type.Literal('failure'),
        Type.Literal('unchanged'),
      ],
      { description: '按执行结果分类过滤' },
    ),
  ),
  assignee: Type.Optional(
    Type.String({ description: '按经办人过滤' }),
  ),
  from: Type.Optional(
    Type.String({ description: '起始时间，ISO 日期/时间' }),
  ),
  to: Type.Optional(
    Type.String({ description: '结束时间，ISO 日期/时间' }),
  ),
  take: Type.Optional(Type.Integer({ default: 50, maximum: 200 })),
  skip: Type.Optional(Type.Integer({ default: 0, minimum: 0 })),
})

const ReconcileLogItemSchema = Type.Object({
  id: Type.String(),
  batchId: Type.String({ description: '巡检批次 ID，同一次调用共享' }),
  issueKey: Type.String(),
  projectKey: Type.Union([Type.String(), Type.Null()]),
  assignee: Type.Union([Type.String(), Type.Null()]),
  status: Type.String({
    description: 'success/partial_success/failure/unchanged',
  }),
  message: Type.Union([Type.String(), Type.Null()]),
  details: Type.Any({
    description: '改动明细：fixVersionName/devCompleteDate/transitionName/steps 等',
  }),
  durationMs: Type.Union([Type.Integer(), Type.Null()]),
  createdAt: Type.String(),
})

const JiraReconcileLogsResponse = Type.Object({
  total: Type.Number(),
  values: Type.Array(ReconcileLogItemSchema),
})

export const JiraReconcileLogsSchema = {
  description:
    '查询 Jira 巡检审计日志：dev-reply 每次执行逐单记录状态、改动明细与耗时',
  tags: ['jira'],
  querystring: ReconcileLogQuerystring,
  response: {
    200: JiraReconcileLogsResponse,
    500: Type.Object({ error: Type.Any() }),
  },
}

export type JiraReconcileLogQueryType = Static<typeof ReconcileLogQuerystring>
export type JiraReconcileLogsResponseType = Static<
  typeof JiraReconcileLogsResponse
>
