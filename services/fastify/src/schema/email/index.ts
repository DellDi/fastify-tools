import { Static, Type } from '@sinclair/typebox'

const EmailTemplateSchema = Type.Object({
  id: Type.String({
    description: '邮件模板唯一 ID。',
  }),
  name: Type.String({
    description: '邮件模板名称，通常作为模板管理中的识别标识。',
  }),
  subject: Type.String({
    description: '邮件主题模板内容。',
  }),
  body: Type.String({
    description: '邮件正文模板内容。',
  }),
  variables: Type.Optional(Type.Any({
    description: '模板变量定义或发送时的变量数据结构。',
  })),
  createdAt: Type.String({
    format: 'date-time',
    description: '模板创建时间。',
  }),
  updatedAt: Type.String({
    format: 'date-time',
    description: '模板最后更新时间。',
  }),
})

const EmailTemplateIdParams = Type.Object({
  id: Type.String({
    description: '邮件模板 ID。',
  }),
})

const EmailTemplateMutationBody = Type.Object({
  name: Type.String({
    description: '邮件模板名称。',
  }),
  subject: Type.String({
    description: '邮件主题模板内容。',
  }),
  body: Type.String({
    description: '邮件正文模板内容。',
  }),
  variables: Type.Optional(Type.Any({
    description: '模板变量定义，例如占位字段及默认值。',
  })),
})

const EmailTemplateUpdateBody = Type.Object({
  name: Type.Optional(Type.String({
    description: '更新后的邮件模板名称。',
  })),
  subject: Type.Optional(Type.String({
    description: '更新后的邮件主题模板内容。',
  })),
  body: Type.Optional(Type.String({
    description: '更新后的邮件正文模板内容。',
  })),
  variables: Type.Optional(Type.Any({
    description: '更新后的模板变量定义。',
  })),
})

const EmailNotFoundResponse = Type.Object({
  message: Type.String({
    description: '模板不存在时返回的错误信息。',
  }),
})

const EmailSendLogSchema = Type.Object({
  id: Type.String({
    description: '邮件发送日志 ID。',
  }),
  templateId: Type.String({
    description: '本次发送使用的模板 ID。',
  }),
  toEmail: Type.String({
    description: '收件人邮箱地址。',
  }),
  variables: Type.Optional(Type.Any({
    description: '本次发送时使用的模板变量。',
  })),
  status: Type.String({
    description: '邮件发送状态。',
  }),
  createdAt: Type.String({
    format: 'date-time',
    description: '日志创建时间。',
  }),
})

const EmailSendBody = Type.Object({
  email: Type.String({
    format: 'email',
    description: '收件人邮箱地址。',
  }),
  templateName: Type.Optional(Type.String({
    default: 'register-confirmation',
    description: '要使用的邮件模板名称。未传时使用默认模板。',
  })),
  variables: Type.Optional(Type.Any({
    description: '模板渲染所需的变量数据。',
  })),
})

export const EmailTemplateListSchema = {
  description: '查询所有邮件模板。适合后台模板管理页初始化列表，返回模板基础信息、变量定义与创建更新时间。',
  tags: ['email'],
  response: {
    200: Type.Array(EmailTemplateSchema),
  },
}

export const EmailTemplateDetailSchema = {
  description: '根据模板 ID 查询单个邮件模板详情。适合模板编辑页回填，若模板不存在则返回 404。',
  tags: ['email'],
  params: EmailTemplateIdParams,
  response: {
    200: EmailTemplateSchema,
    404: EmailNotFoundResponse,
  },
}

export const EmailTemplateCreateSchema = {
  description: '创建新的邮件模板。用于新增可复用的邮件主题、正文与变量占位定义。',
  tags: ['email'],
  body: EmailTemplateMutationBody,
  response: {
    201: EmailTemplateSchema,
  },
}

export const EmailTemplateUpdateSchema = {
  description: '按模板 ID 更新邮件模板内容。支持局部字段更新，若模板不存在则返回 404。',
  tags: ['email'],
  params: EmailTemplateIdParams,
  body: EmailTemplateUpdateBody,
  response: {
    200: EmailTemplateSchema,
    404: EmailNotFoundResponse,
  },
}

export const EmailTemplateDeleteSchema = {
  description: '按模板 ID 删除邮件模板。适合后台管理场景，删除成功后返回被删除的模板信息。',
  tags: ['email'],
  params: EmailTemplateIdParams,
  response: {
    200: EmailTemplateSchema,
    404: EmailNotFoundResponse,
  },
}

export const EmailSendSchema = {
  description: '基于模板名称发送邮件。服务端会先查找模板，再结合传入变量渲染并发送，适合注册通知、业务提醒等场景。',
  tags: ['email'],
  body: EmailSendBody,
  response: {
    200: Type.Object({
      log: EmailSendLogSchema,
      message: Type.String({
        description: '邮件发送成功提示信息。',
      }),
    }),
    404: EmailNotFoundResponse,
  },
}

export type EmailTemplateIdParamsType = Static<typeof EmailTemplateIdParams>
export type EmailTemplateCreateBodyType = Static<typeof EmailTemplateMutationBody>
export type EmailTemplateUpdateBodyType = Static<typeof EmailTemplateUpdateBody>
export type EmailSendBodyType = Static<typeof EmailSendBody>
