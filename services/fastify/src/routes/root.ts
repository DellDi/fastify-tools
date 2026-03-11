import { FastifyPluginAsync } from 'fastify'
import { fastifyCache } from '@/utils/cache.js'
import {
  ClearAllCacheSchema,
  ClearCacheByKeySchema,
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
}

export default example
