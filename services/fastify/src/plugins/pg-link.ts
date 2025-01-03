import fp from 'fastify-plugin'
import fastifyPgSQL from '@fastify/postgres'

export default fp(async (fastify) => {
  const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env
  console.log('🚀 ~ file:pg-link.ts, line:6-----', POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
  let isConnectedPg = false
  // 尝试发起调用ENV_DB_IP是否可以测试调用响应，如果不行，就不注册mysql插件
  try {
    await fastify.register(fastifyPgSQL, {
      connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
    })
    isConnectedPg = true
  } catch (error) {
    fastify.log.error('Failed to register fastifyPgSQL plugin:', error)
  }

  fastify.decorate('isConnectedPg', isConnectedPg)
})
