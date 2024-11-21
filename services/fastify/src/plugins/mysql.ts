import fp from 'fastify-plugin'
import fastifyMysql from '@fastify/mysql'

export default fp(async (fastify) => {
  const { ENV_DB_IP, ENV_DB_HOST, ENV_DB_PSW, ENV_DB_USER, ENV_DB_NAME } = process.env
  // mysql://nssoft:nssoft123@192.168.1.52:3306/your_database_name
  fastify.register(fastifyMysql, {
    promise: true,
    connectionString: `mysql://${ENV_DB_USER}:${ENV_DB_PSW}@${ENV_DB_IP}:${ENV_DB_HOST}/${ENV_DB_NAME}`,
  })
})
