import { Static, Type } from '@sinclair/typebox'
import { JiraCreateExportResponse } from '../jira/jira.js'

const DifyJiraCreateExportBody = Type.Object({
  title: Type.String({
    default: '【超级工单】新增测试工单',
    description: '待创建 Jira 工单的标题。',
  }),
  description: Type.String({
    default: '【超级工单】新增测试工单-我是工单的描述信息',
    description: '待创建 Jira 工单的详细描述内容。',
  }),
  labels: Type.Optional(
    Type.String({
      default: 'SaaS内部已评审',
      description: '工单标签字符串。多个标签的拼接格式取决于调用方约定。',
    })
  ),
  assignee: Type.Optional(
    Type.String({
      default: process.env.JIRA_ASSIGNEE_USER,
      description: 'Jira 经办人用户名。未传时由服务端默认配置兜底。',
    })
  ),
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: 'Jira 登录用户名。用于外部调用时指定执行账号。',
    })
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'Jira 登录密码。用于外部调用时指定执行账号。',
    })
  ),
  customerName: Type.Optional(
    Type.String({
      description: '客户名称关键字。用于匹配客户相关的 Jira 自定义字段。',
      default: '新安明珠',
    })
  ),
  projectKey: Type.Optional(
    Type.String({
      description: 'Jira 项目 Key，如不指定则使用默认项目或 LLM 智能匹配',
    })
  ),
  issueType: Type.Optional(
    Type.String({
      description: 'Jira 问题类型 ID，如不指定则使用默认类型或 LLM 智能匹配',
    })
  ),
  smartMatch: Type.Optional(
    Type.Boolean({
      default: true,
      description: '是否启用 LLM 智能匹配 Jira 项目和问题类型。',
    })
  ),
  matchPrompt: Type.Optional(
    Type.String({
      description: '用于 LLM 智能匹配的补充提示信息，例如“这是一个 Bug”“提给产品组”等。',
    })
  ),
  autoDevReply: Type.Optional(
    Type.Boolean({
      default: true,
      description: '创建工单后是否自动执行“开发回复”工作流，包括自动选择修复版本和预计完成时间。',
    })
  ),
})

const InputData = Type.Intersect([
  Type.Object({
    point: Type.String({
      default: 'ping',
      description:
        "调用动作标识。`ping` 用于健康检查，`app.create_jira_tool` 用于触发 Jira 创建流程。",
    }),
  }),
  DifyJiraCreateExportBody,
])

const InputCustomer = Type.Object({
  htmlStr: Type.String({
    description: '客户名称下拉框对应的 HTML 片段。',
  }),
  htmlStrAll: Type.String({
    description: '包含客户名称和合同信息级联下拉框的完整 HTML 片段。',
  }),
  customerName: Type.Optional(Type.String({ description: '用于模糊匹配的客户名称关键字。' })),
})

const CustomerInfo = Type.Object({
  customerNameId: Type.String({
    description: '匹配到的客户名称字段 ID。',
  }),
  customerInfoId: Type.String({
    description: '匹配到的客户合同一级信息 ID。',
  }),
  customerInfoIdAlias: Type.String({
    description: '匹配到的客户合同二级信息 ID。',
  }),
  isSaaS: Type.Boolean({
    description: '是否判定为 SaaS 客户。',
  }),
})

const DifyHeaders = Type.Object({
  'Content-Type': Type.String({
    description: '请求内容类型，固定为 `application/json`。',
    default: 'application/json',
  }),
  Authorization: Type.String({
    description: 'Bearer Token 鉴权头，用于保护 Dify 外部工具接口。',
  }),
})

const MatchInfo = Type.Object({
  projectKey: Type.String({ description: '匹配的项目 Key' }),
  projectName: Type.String({ description: '匹配的项目名称' }),
  issueTypeId: Type.String({ description: '匹配的问题类型 ID' }),
  issueTypeName: Type.String({ description: '匹配的问题类型名称' }),
  confidence: Type.Union([
    Type.Literal('high'),
    Type.Literal('medium'),
    Type.Literal('low'),
  ], { description: '匹配置信度' }),
})

const DevReplyInfo = Type.Object({
  success: Type.Boolean({ description: '开发回复是否成功' }),
  issueKey: Type.String({ description: '工单 Key' }),
  fixVersionName: Type.Optional(Type.String({ description: '选择的修复版本名称' })),
  devCompleteDate: Type.Optional(Type.String({ description: '分配的预计开发完成时间' })),
  transitionName: Type.Optional(Type.String({ description: '执行的工作流转换名称' })),
  message: Type.String({ description: '执行结果消息' }),
})

const DifyResponse = Type.Intersect([
  Type.Object({
    result: Type.String({
      description: '本次调用的结果标识或请求追踪值。',
    }),
  }),
  Type.Partial(JiraCreateExportResponse),
  Type.Object({
    matchInfo: Type.Optional(MatchInfo),
    devReply: Type.Optional(DevReplyInfo),
  }),
])

const ErrorResponse = Type.Object({
  error: Type.String({
    description: '请求失败时返回的错误信息。',
  }),
})

export const difySchema = {
  description:
    'Dify 外部工具统一入口。支持健康检查 `ping`，以及通过 `app.create_jira_tool` 触发 Jira 创建、智能匹配和自动开发回复等流程。',
  tags: ['dify'],
  body: InputData,
  headers: DifyHeaders,
  response: {
    200: DifyResponse,
    400: ErrorResponse,
  },
}

export const difyCustomerSchema = {
  description:
    'Dify 客户信息提取接口。根据页面 HTML 片段解析客户名称、合同信息及 SaaS 标识，适合自动填单前的数据预处理场景。',
  tags: ['dify'],
  body: InputCustomer,
  response: {
    200: CustomerInfo,
    400: ErrorResponse,
  },
}

export type InputDataType = Static<typeof InputData>

export type DifyResponseType = Static<typeof DifyResponse>

export type InputCustomerType = Static<typeof InputCustomer>

export type CustomerInfoResType = Static<typeof CustomerInfo>
