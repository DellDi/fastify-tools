import { FastifyPluginAsync } from 'fastify'
import { fastifyCache } from '@/utils/cache.js'
import {
  ClearAllCacheSchema,
  ClearCacheByKeySchema,
  LLMVerifyBodyType,
  LLMVerifySchema,
  RootDebugSchema,
} from '@/schema/system/index.js'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: RootDebugSchema,
    async handler(request, reply) {
      const headers = request.headers
      return {
        headers,
      }
    },
  })

  // 清除缓存
  fastify.get(
    '/clear-all-cache',
    {
      schema: ClearAllCacheSchema,
    },
    async function (request, reply) {
      fastifyCache.clear()
      return { success: true }
    }
  )

  // 清除指定的缓存
  fastify.get(
    '/clear-cache/:key',
    {
      schema: ClearCacheByKeySchema,
    },
    async function (request, reply) {
      const { key } = request.params as { key: string }
      fastifyCache.delete(key)
      return { success: true }
    }
  )

  fastify.post(
    '/system/llm/verify',
    {
      schema: LLMVerifySchema,
    },
    async function (request, reply) {
      const { mode = 'config', prompt, timeoutMs } =
        request.body as LLMVerifyBodyType

      try {
        const result = await fastify.llmService.verify({
          mode,
          prompt,
          timeoutMs,
        })

        if (!result.ok && mode === 'config') {
          return reply.code(400).send({
            error: result.message,
          })
        }

        return result
      } catch (error) {
        return reply.code(500).send({
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  )
}

export default example
