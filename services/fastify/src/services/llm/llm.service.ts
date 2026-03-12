import { FastifyInstance } from 'fastify'
import { getLLMConfig } from '@/utils/config-helpers.js'

export type LLMVerifyMode = 'config' | 'live'

export interface LLMVerifyInput {
  mode: LLMVerifyMode
  prompt?: string
  timeoutMs?: number
}

export interface LLMVerifyResult {
  ok: boolean
  mode: LLMVerifyMode
  provider: 'dashscope-compatible'
  baseUrl: string
  model: string
  hasApiKey: boolean
  message: string
  latencyMs?: number
  preview?: string
}

export class LLMService {
  constructor(private fastify: FastifyInstance) {}

  async verify(input: LLMVerifyInput): Promise<LLMVerifyResult> {
    const llmConfig = getLLMConfig(this.fastify)
    const hasApiKey = Boolean(llmConfig.apiKey)

    if (input.mode === 'config') {
      const missingFields: string[] = []

      if (!llmConfig.apiKey) {
        missingFields.push('DASHSCOPE_API_KEY')
      }
      if (!llmConfig.baseUrl) {
        missingFields.push('LLM_BASE_URL')
      }
      if (!llmConfig.model) {
        missingFields.push('LLM_MODEL')
      }

      return {
        ok: missingFields.length === 0,
        mode: 'config',
        provider: 'dashscope-compatible',
        baseUrl: llmConfig.baseUrl,
        model: llmConfig.model,
        hasApiKey,
        message:
          missingFields.length === 0
            ? '当前 LLM 环境配置完整，可执行在线验证'
            : `当前 LLM 环境配置缺失：${missingFields.join(', ')}`,
      }
    }

    if (!llmConfig.apiKey) {
      throw new Error('当前环境未配置 DASHSCOPE_API_KEY，无法执行 live 验证')
    }

    const startedAt = Date.now()
    const timeoutMs = input.timeoutMs && input.timeoutMs > 0 ? input.timeoutMs : 10000
    const prompt = input.prompt?.trim() || '请仅回复 OK'

    const response = await fetch(llmConfig.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${llmConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llmConfig.model,
        messages: [
          {
            role: 'system',
            content: '你是一个用于接口连通性检测的模型，请简短稳定地响应。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0,
        top_p: 0.1,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })

    const latencyMs = Date.now() - startedAt
    const rawBody = await response.text()
    let parsedBody: any = rawBody

    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null
    } catch {
      parsedBody = rawBody
    }

    if (!response.ok) {
      this.fastify.log.error(
        {
          mode: input.mode,
          baseUrl: llmConfig.baseUrl,
          model: llmConfig.model,
          latencyMs,
          llmResponse: parsedBody,
        },
        'LLM verify failed',
      )
      throw new Error(`LLM 验证失败: HTTP ${response.status}${rawBody ? ` - ${rawBody}` : ''}`)
    }

    const preview =
      typeof parsedBody?.choices?.[0]?.message?.content === 'string'
        ? parsedBody.choices[0].message.content.trim().slice(0, 200)
        : JSON.stringify(parsedBody).slice(0, 200)

    return {
      ok: true,
      mode: 'live',
      provider: 'dashscope-compatible',
      baseUrl: llmConfig.baseUrl,
      model: llmConfig.model,
      hasApiKey,
      latencyMs,
      preview,
      message: 'LLM 在线验证成功',
    }
  }
}
