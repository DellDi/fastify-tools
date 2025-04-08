// PrismaClient 是一个重量级对象，不应该在每次请求时都创建新实例
// 使用 globalThis 作为全局缓存，避免在开发环境下热重载时创建多个实例
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client'

// 全局类型定义，用于存储 PrismaClient 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建或复用 PrismaClient 实例
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// 在开发环境中保存实例到全局对象，避免热重载时创建多个实例
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
