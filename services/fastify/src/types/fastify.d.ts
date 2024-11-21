import { MySQLPromiseConnection } from 'fastify-mysql'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromiseConnection;
  }
}
