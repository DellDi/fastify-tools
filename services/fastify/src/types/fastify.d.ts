import { MySQLPromiseConnection } from 'fastify-mysql'
import { FastifyInstance, FastifyPluginAsync as OriginalFastifyPluginAsync } from 'fastify';
declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromiseConnection;
    mysqlRegistered: boolean;
    isConnectedPg: boolean
  }
}
