import { Menu } from '@/generated/client';

/**
 * 用户元数据类型定义
 */
export interface UserMetaData {
  salt: string;
  // 可以添加其他用户元数据字段
}

/**
 * 应用元数据类型定义
 */
export interface AppMetaData {
  // 应用相关元数据字段
}

// 扩展 Prisma 的 Menu 类型
export interface MenuWithChildren extends Menu {
  children: MenuWithChildren[];
}

/**
 * 扩展 Prisma 用户类型
 */
declare global {

  namespace PrismaJson {
    // 扩展 Prisma 的 JSON 类型
    interface UserMetaData {
      salt: string;
      // 可以添加其他用户元数据字段
    }
    
    interface AppMetaData {
      // 应用相关元数据字段
    }
  }
}
