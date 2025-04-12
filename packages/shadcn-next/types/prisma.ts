/**
 * Prisma 客户端类型定义 (Edge 兼容版本)
 * 
 * 这个文件导出 Prisma 客户端和相关类型，
 * 使用 Edge 兼容版本，避免在 Next.js Edge Runtime 中出现兼容性问题。
 */

// 从生成的 Edge 客户端导出所有内容
export * from '../generated/client';

// 重新导出 PrismaClient 类 (Edge 版本)
import { PrismaClient as OriginalPrismaClient } from '../generated/client';
export { OriginalPrismaClient as PrismaClient };

// 导出 Prisma 命名空间，包括错误类型
import { Prisma as OriginalPrisma } from '../generated/client';

// 确保 Prisma 命名空间包含所有错误类型
export const Prisma = {
  ...OriginalPrisma,
  PrismaClientKnownRequestError: OriginalPrisma.PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError: OriginalPrisma.PrismaClientUnknownRequestError,
  PrismaClientRustPanicError: OriginalPrisma.PrismaClientRustPanicError,
  PrismaClientInitializationError: OriginalPrisma.PrismaClientInitializationError,
  PrismaClientValidationError: OriginalPrisma.PrismaClientValidationError
};