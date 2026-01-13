import { Static, Type } from '@sinclair/typebox'
import { JiraCreateExportResponse } from '../jira/jira.js'

const DifyJiraCreateExportBody = Type.Object({
  title: Type.String({
    default: '【超级工单】新增测试工单',
    description: '单子标题',
  }),
  description: Type.String({
    default: '【超级工单】新增测试工单-我是工单的描述信息',
    description: '单子描述',
  }),
  labels: Type.Optional(
    Type.String({
      default: 'SaaS内部已评审',
      description: '单子标签',
    })
  ),
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
  customerName: Type.Optional(
    Type.String({
      description: '客户名称信息',
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
      default: false,
      description: '是否启用 LLM 智能匹配项目和问题类型',
    })
  ),
  matchPrompt: Type.Optional(
    Type.String({
      description: '用于 LLM 智能匹配的额外提示信息，如"这是一个 Bug"、"提给产品组"等',
    })
  ),
  autoDevReply: Type.Optional(
    Type.Boolean({
      default: false,
      description: '创建工单后是否自动执行"开发回复"工作流转换，包括自动选择修复版本和分配预计开发完成时间',
    })
  ),
})

const InputData = Type.Intersect([
  Type.Object({
    point: Type.String({
      default: 'ping',
      description:
        "测试使用的标识:'ping' | 报单触发接口: 'app.create_jira_tool'",
    }),
  }),
  DifyJiraCreateExportBody,
])

const InputCustomer = Type.Object({
  htmlStr: Type.String({
    description: 'htmlStr',
  }),
  htmlStrAll: Type.String({
    description: 'htmlStr',
  }),
  customerName: Type.Optional(Type.String({ description: '客户不精确名称' })),
})

const CustomerInfo = Type.Object({
  customerNameId: Type.String({
    description: '客户名称ID',
  }),
  customerInfoId: Type.String({
    description: '客户合同信息ID',
  }),
  customerInfoIdAlias: Type.String({
    description: '客户合同二级信息ID',
  }),
  isSaaS: Type.Boolean({
    description: '是否为saas',
  }),
})

const DifyHeaders = Type.Object({
  'Content-Type': Type.String({
    description: 'application/json',
    default: 'application/json',
  }),
  Authorization: Type.String({
    description: 'Bearer token',
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
    result: Type.String(),
  }),
  Type.Partial(JiraCreateExportResponse),
  Type.Object({
    matchInfo: Type.Optional(MatchInfo),
    devReply: Type.Optional(DevReplyInfo),
  }),
])

const ErrorResponse = Type.Object({
  error: Type.String(),
})

export const difySchema = {
  description: 'Dify create jira',
  tags: ['dify'],
  body: InputData,
  headers: DifyHeaders,
  response: {
    200: DifyResponse,
    400: ErrorResponse,
  },
}

export const difyCustomerSchema = {
  description: 'Dify customer',
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
