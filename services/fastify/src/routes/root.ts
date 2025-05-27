import { FastifyPluginAsync } from 'fastify'
import { fastifyCache } from '@/utils/cache.js'
import { Type } from '@fastify/type-provider-typebox'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    let headers = request.headers
    return {
      headers: headers,
      // 'process.env': process.env,
    }
  })

  // 清除缓存
  fastify.get(
    '/clear-all-cache',
    {
      schema: {
        response: {
          200: Type.Object({
            success: Type.Boolean(),
          }),
        },
      },
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
      schema: {
        params: Type.Object({
          key: Type.String({
            description: '缓存键 | jira-session | jira-meta',
            default: 'jira-session',
          }),
        }),
        response: {
          200: Type.Object({
            success: Type.Boolean(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { key } = request.params as { key: string }
      fastifyCache.delete(key)
      return { success: true }
    }
  )
}

export default example
