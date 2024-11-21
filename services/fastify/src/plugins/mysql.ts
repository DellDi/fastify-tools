import fp from 'fastify-plugin'
import fastifyMysql from '@fastify/mysql'

export default fp(async (fastify) => {
  const { ENV_DB_IP, ENV_DB_HOST, ENV_DB_PSW, ENV_DB_USER, ENV_DB_NAME } = process.env
  let mysqlRegistered = false
  // 尝试发起调用ENV_DB_IP是否可以测试调用响应，如果不行，就不注册mysql插件
  try {
    const response = await fetch(`http://${ENV_DB_IP}:${ENV_DB_HOST}`)
    if (response.ok) {
      fastify.log.info('MySQL plugin registered')
      fastify.register(fastifyMysql, {
        promise: true,
        connectionString: `mysql://${ENV_DB_USER}:${ENV_DB_PSW}@${ENV_DB_IP}:${ENV_DB_HOST}/${ENV_DB_NAME}`,
      })
      mysqlRegistered = true
    } else {
      fastify.log.error('Failed to connect to MySQL:', response.statusText)
    }
  } catch (error) {
    fastify.log.error('Failed to connect to MySQL:', error)
  }

  fastify.decorate('mysqlRegistered', mysqlRegistered)
})
