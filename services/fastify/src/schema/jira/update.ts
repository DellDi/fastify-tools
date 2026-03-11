import { Static, Type } from '@sinclair/typebox'

export const JiraUpdateBody = Type.Object({
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: 'jira用户名-创建人',
    })
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'jira密码-创建人',
    })
  ),
  fields: Type.Object(
    {
      labels: Type.Optional(
        Type.Array(
          Type.String({
            default: '数据中台',
            description: 'labels: 单子标签',
          })
        )
      ),
    },
    {
      default: {
        labels: ['AI单'],
      },
    }
  ),
  issueIdOrKey: Type.String({
    default: 'V10-28154',
    description: 'Jira单子keyOrId',
  }),
})

export const responseUpdateSchema = Type.Object({
  message: Type.String({
    description: '更新响应的信息-成功或者失败',
  }),
})

export const JiraUpdateFieldsBody = Type.Object({
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
    })
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
    })
  ),
  issueIdOrKey: Type.String({
    default: 'NDE-3149',
    description: '目标 Jira 工单的 issue key 或 issue id，例如 `NDE-3149`。',
  }),
  labels: Type.Optional(
    Type.Array(
      Type.String({
        description: '工单标签名称。提交后会整体覆盖 Jira 中的 labels 字段。',
      }),
      {
        description: '工单标签列表，例如 `AI单`、`数据中台`。',
      }
    )
  ),
  fixVersionIds: Type.Optional(
    Type.Array(
      Type.String({
        description: '修复版本 ID。会自动转换为 Jira 需要的 `fixVersions: [{ id }]` 结构。',
      }),
      {
        description: '修复版本 ID 列表，例如 `23987`。适合只知道版本 ID 的场景。',
      }
    )
  ),
  devCompleteDate: Type.Optional(
    Type.String({
      default: '2026-03-18',
      description:
        '预计开发完成时间，会写入 Jira 自定义字段 `customfield_10022`。格式必须为 `YYYY-MM-DD`。',
    })
  ),
  summary: Type.Optional(
    Type.String({
      description: '工单标题，对应 Jira `summary` 字段。传入后会直接覆盖原标题。',
    })
  ),
  description: Type.Optional(
    Type.String({
      description: '工单描述，对应 Jira `description` 字段。传入后会直接覆盖原描述。',
    })
  ),
  assignee: Type.Optional(
    Type.String({
      description:
        '经办人用户名。会自动转换为 Jira `assignee: { name }` 结构。传空字符串不会自动清空，请显式通过 `fields` 或 `extraFields` 控制。',
    })
  ),
  fields: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description:
        '原始 Jira fields 对象。适合直接传任意 Jira 字段，例如 `{ priority: { id: "3" } }`。当与顶层常用字段重复时，以顶层常用字段和 `extraFields` 合并后的结果为准。',
      default: {
        priority: { id: '3' },
      },
    })
  ),
  extraFields: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description:
        '额外自定义字段。适合补充任意 Jira 字段，例如 `customfield_10601`。会在最终合并阶段覆盖同名字段。',
      default: {
        customfield_10601: '功能现状补充说明',
      },
    })
  ),
})

export const JiraUpdateTicketSchema = {
  description:
    '底层通用 Jira 字段更新接口。直接透传标准 `fields` 到 Jira，适合已经清楚 Jira 原始字段结构的高级调用方或内部调试场景。若只是更新常用业务字段，优先使用 `/jira/update-fields`。',
  body: JiraUpdateBody,
  header: {
    ContentType: 'application/json',
  },
  tags: ['jira'],
  response: {
    200: responseUpdateSchema,
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export const JiraUpdateFieldsSchema = {
  description:
    '推荐的业务字段更新接口。支持常用字段快捷写法、原始 `fields` 透传和 `extraFields` 扩展字段，适合前端或业务服务直接调用。内部最终会统一转换为 Jira 标准 `fields` 后执行更新。',
  body: JiraUpdateFieldsBody,
  header: {
    ContentType: 'application/json',
  },
  tags: ['jira'],
  response: {
    200: responseUpdateSchema,
    500: Type.Object({
      error: Type.Any(),
    }),
  },
}

export type JiraUpdateTicket = Static<typeof JiraUpdateBody>
export type JiraUpdateFieldsBodyType = Static<typeof JiraUpdateFieldsBody>
export type JiraUpdateResponseSchema = Static<typeof responseUpdateSchema>
