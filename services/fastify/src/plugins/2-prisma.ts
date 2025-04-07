import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 客户端插件
 * 
 * 这个插件将 Prisma 客户端实例注册到 Fastify 实例中，
 * 使其在整个应用程序中可用。
 */
export default fp(async (fastify) => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  // 在应用启动时连接到数据库
  await prisma.$connect();

  // 将 Prisma 客户端添加到 Fastify 实例
  fastify.decorate('prisma', prisma);

  // 在应用关闭时断开 Prisma 连接
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
}, {
  name: 'prisma',
  // dependencies: ['env'],
});

// 为 Fastify 实例添加 Prisma 类型
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
