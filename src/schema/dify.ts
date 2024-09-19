import { Static, Type } from '@sinclair/typebox'
import { JiraCreateExportResponse, JiraCreateExportBody } from './jira.js'

const InputData = Type.Intersect([
  Type.Object({
    point: Type.String({
      default: 'ping',
      description: "触发标识:'ping' | 触发接口: 'app.external_data_tool.query'",
    }),
  }),
  JiraCreateExportBody,
])

const InputCustomer = Type.Object({
  htmlStr: Type.String({
    description: 'htmlStr',
  }),
  customerName: Type.Optional(Type.String({description: '客户不精确名称'})),
})

const CustomerInfo = Type.Object({
  customerNameId: Type.String({
    description: '客户名称ID',
  }),
  customerInfoId: Type.String({
    description: '客户合同信息ID',
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
  tags: ['dify'],
  body: InputData,
  response: {
    200: DifyResponse,
    400: ErrorResponse,
  },
}

export const difyCustomerSchema = {
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
