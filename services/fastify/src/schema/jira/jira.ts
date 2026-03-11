import { Type, Static } from '@sinclair/typebox'

const JiraLoginBody = Type.Object({
  jiraUser: Type.String({ default: process.env.JIRA_USERNAME }),
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
  assignee: Type.Optional(
    Type.String({
      default: process.env.JIRA_ASSIGNEE_USER,
      description: 'jira-经办人',
    })
  ),
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
      // 允许用户添加额外的自定义属性，类型为任意
      additionalProperties: Type.Any(),
    }
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
  error: Type.Optional(Type.String()),
  details: Type.Optional(Type.Any()),
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
export type JiraCreateExportResponseType = Static<
  typeof JiraCreateExportResponse
>

const JiraUpdateBody = Type.Object({
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

const responseUpdateSchema = Type.Object({
  message: Type.String({
    description: '更新响应的信息-成功或者失败',
  }),
})

const JiraUpdateFieldsBody = Type.Object({
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
    })
  ),
  errorMessages: Type.Optional(Type.Array(Type.String())),
  errors: Type.Optional(Type.Any()),
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
          })
        ),
        labels: Type.Array(Type.String()),
        // 自定义字段
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

// 定义更详细的错误响应类型
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
