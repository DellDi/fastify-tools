/**
 * Prisma 客户端类型定义
 * 
 * 这个文件导出 Prisma 客户端和相关类型，
 * 使得在项目中可以使用一致的导入路径。
 */

// 从生成的客户端导出所有内容
export * from '../../generated/client/index.js';

// 重新导出 PrismaClient 类
import { PrismaClient as OriginalPrismaClient } from '../../generated/client/index.js';
export { OriginalPrismaClient as PrismaClient };

// 导出 Prisma 命名空间，包括错误类型
import { Prisma as OriginalPrisma } from '../../generated/client/index.js';

// 确保 Prisma 命名空间包含所有错误类型
export const Prisma = {
  ...OriginalPrisma,
  PrismaClientKnownRequestError: OriginalPrisma.PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError: OriginalPrisma.PrismaClientUnknownRequestError,
  PrismaClientRustPanicError: OriginalPrisma.PrismaClientRustPanicError,
  PrismaClientInitializationError: OriginalPrisma.PrismaClientInitializationError,
  PrismaClientValidationError: OriginalPrisma.PrismaClientValidationError
};
