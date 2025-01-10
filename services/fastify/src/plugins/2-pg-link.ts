import fp from 'fastify-plugin'
import fastifyPgSQL from '@fastify/postgres'

export default fp(async (fastify) => {
  const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env
  let isConnectedPg = false

  try {
    await fastify.register(fastifyPgSQL, {
      connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
    })

    // // 装饰一个方便的获取客户端的方法
    // fastify.decorate('getPgClient', async () => {
    //   try {
    //     return await fastify.pg.connect();
    //   } catch (err) {
    //     fastify.log.error('Failed to get pg client:', err);
    //     throw err; // 重新抛出错误，以便调用方处理
    //   }
    // })

    isConnectedPg = true
  } catch (error) {
    fastify.log.error('Failed to register fastifyPgSQL plugin:', error)
  }

  fastify.decorate('isConnectedPg', isConnectedPg)
}, {
  name: 'pg-link',
})
