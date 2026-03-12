import { Static, Type } from '@sinclair/typebox'

export const LLMVerifyModeSchema = Type.Union([
  Type.Literal('config'),
  Type.Literal('live'),
], {
  description: 'LLM 验证模式。`config` 只检查环境配置是否完整，`live` 会真实调用当前模型做在线探活。',
})

export const LLMVerifyBody = Type.Object({
  mode: Type.Optional(LLMVerifyModeSchema),
  prompt: Type.Optional(Type.String({
    description: '仅在 `live` 模式下生效。可自定义本次探活提示词，未传时使用默认短提示。',
    maxLength: 1000,
  })),
  timeoutMs: Type.Optional(Type.Number({
    description: '仅在 `live` 模式下生效。单位毫秒，用于限制探活请求的最大等待时间。',
    minimum: 1000,
    maximum: 60000,
    default: 10000,
  })),
}, {
  description: 'LLM 可用性验证接口请求体。支持只校验环境配置，或真实请求当前模型做在线验证。',
})

export const LLMVerifyResponse = Type.Object({
  ok: Type.Boolean({ description: '本次验证是否通过。' }),
  mode: LLMVerifyModeSchema,
  provider: Type.String({ description: '当前 LLM 提供方类型标识。' }),
  baseUrl: Type.String({ description: '当前使用的 LLM 请求地址。' }),
  model: Type.String({ description: '当前使用的模型名称。' }),
  hasApiKey: Type.Boolean({ description: '当前环境是否已配置 API Key。不会回显真实密钥。' }),
  message: Type.String({ description: '本次验证的人类可读说明。' }),
  latencyMs: Type.Optional(Type.Number({ description: '在线探活耗时，单位毫秒。' })),
  preview: Type.Optional(Type.String({ description: '在线探活返回内容的摘要预览。' })),
})

export const LLMVerifySchema = {
  description: '验证当前环境配置的 LLM 是否可用。支持 `config` 只检查配置完整性，或 `live` 发起真实模型请求验证连通性。',
  tags: ['system'],
  body: LLMVerifyBody,
  response: {
    200: LLMVerifyResponse,
    400: Type.Object({
      error: Type.String({ description: '请求参数不合法或缺少必要配置时返回的错误信息。' }),
    }),
    500: Type.Object({
      error: Type.String({ description: '在线探活失败、超时或上游模型请求异常时返回的错误信息。' }),
    }),
  },
}

export type LLMVerifyBodyType = Static<typeof LLMVerifyBody>
