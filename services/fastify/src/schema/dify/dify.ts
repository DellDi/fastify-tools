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
      default: process.env.JIRA_USER,
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

const DifyResponse = Type.Intersect([
  Type.Object({
    result: Type.String(),
  }),
  Type.Partial(JiraCreateExportResponse),
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
