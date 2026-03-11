import { Static, Type } from '@sinclair/typebox'

const JiraAttachmentSourceType = Type.Union([
  Type.Literal('multipart'),
  Type.Literal('local_path'),
  Type.Literal('remote_url'),
], {
  description: '附件来源类型。`multipart` 表示直接上传文件，`local_path` 表示读取服务端本地文件，`remote_url` 表示从远程 URL 拉取文件后再上传到 Jira。',
})

export const JiraUploadAttachmentBody = Type.Object({
  jiraUser: Type.Optional(
    Type.String({
      default: process.env.JIRA_USERNAME,
      description: 'Jira 登录用户名。未传时默认使用服务端配置账号。',
    }),
  ),
  jiraPassword: Type.Optional(
    Type.String({
      default: process.env.JIRA_PASSWORD,
      description: 'Jira 登录密码。未传时默认使用服务端配置账号。',
    }),
  ),
  issueIdOrKey: Type.String({
    default: 'NDE-3149',
    description: '目标 Jira 工单的 issue key 或 issue id，例如 `NDE-3149`。',
  }),
  sourceType: JiraAttachmentSourceType,
  filePath: Type.Optional(
    Type.String({
      description: '当 `sourceType=local_path` 时必填。表示服务端可访问的本地文件绝对路径。',
    }),
  ),
  fileUrl: Type.Optional(
    Type.String({
      format: 'uri',
      description: '当 `sourceType=remote_url` 时必填。表示需要下载并上传到 Jira 的远程文件地址。',
    }),
  ),
}, {
  description: 'Jira 附件上传接口的公共请求字段。根据 `sourceType` 不同，还需要额外提供 multipart 文件、本地文件路径或远程 URL。',
})

export const JiraAttachmentItem = Type.Object({
  id: Type.String({ description: 'Jira 附件 ID。' }),
  filename: Type.String({ description: 'Jira 中记录的附件文件名。' }),
  size: Type.Optional(Type.Number({ description: '附件大小，单位字节。' })),
  mimeType: Type.Optional(Type.String({ description: '附件 MIME 类型。' })),
  content: Type.Optional(Type.String({ description: '附件内容下载地址。' })),
  thumbnail: Type.Optional(Type.String({ description: '图片附件缩略图地址。' })),
}, {
  description: 'Jira 返回的附件对象精简信息。',
})

export const JiraUploadAttachmentResponse = Type.Object({
  issueIdOrKey: Type.String({ description: '目标 Jira 工单标识。' }),
  sourceType: JiraAttachmentSourceType,
  fileName: Type.String({ description: '本次上传到 Jira 的文件名。' }),
  mimeType: Type.String({ description: '本次上传文件的 MIME 类型。' }),
  size: Type.Number({ description: '本次上传文件大小，单位字节。' }),
  attachment: JiraAttachmentItem,
  message: Type.String({ description: '上传结果说明。' }),
})

export const JiraUploadAttachmentJsonSchema = {
  description: 'Jira 附件上传接口。支持 `multipart` 直接传文件、`local_path` 读取服务端本地文件、`remote_url` 下载远程文件后上传到 Jira，适合前端表单、内部脚本和自动化流程统一接入。',
  tags: ['jira'],
  body: JiraUploadAttachmentBody,
  response: {
    200: JiraUploadAttachmentResponse,
    400: Type.Object({
      error: Type.String({ description: '请求参数非法、本地文件不可用或远程文件下载失败时的错误信息。' }),
    }),
    500: Type.Object({
      error: Type.Any({ description: 'Jira 上传附件失败或服务端内部异常。' }),
    }),
  },
}

export const JiraUploadAttachmentMultipartSchema = {
  description: 'Jira 附件上传接口的 multipart 模式。通过 `multipart/form-data` 直接上传文件，同时提交工单标识与 Jira 账号信息。',
  tags: ['jira'],
  consumes: ['multipart/form-data'],
  response: {
    200: JiraUploadAttachmentResponse,
    400: Type.Object({
      error: Type.String({ description: '请求参数非法、未上传文件或文件内容无效时的错误信息。' }),
    }),
    500: Type.Object({
      error: Type.Any({ description: 'Jira 上传附件失败或服务端内部异常。' }),
    }),
  },
}

export type JiraUploadAttachmentBodyType = Static<typeof JiraUploadAttachmentBody>
