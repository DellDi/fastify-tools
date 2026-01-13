#!/usr/bin/env node
/**
 * 迁移脚本：从原生 PostgreSQL 迁移到 Prisma ORM
 *
 * 此脚本用于将现有的数据库结构迁移到 Prisma ORM 管理的结构
 * 执行步骤：
 * 1. 确保已安装 Prisma 依赖
 * 2. 确保已配置 .env 文件中的 DATABASE_URL
 * 3. 运行此脚本
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const prismaDir = path.join(rootDir, 'prisma');
const migrationsDir = path.join(prismaDir, 'migrations');

console.log('🚀 开始迁移到 Prisma ORM...');

// 确保 Prisma 目录存在
if (!existsSync(prismaDir)) {
  console.log('创建 Prisma 目录...');
  mkdirSync(prismaDir, { recursive: true });
}

// 确保 migrations 目录存在
if (!existsSync(migrationsDir)) {
  console.log('创建 migrations 目录...');
  mkdirSync(migrationsDir, { recursive: true });
}

try {
  // 生成 Prisma 客户端
  console.log('生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });

  // 创建初始迁移
  console.log('创建初始迁移...');
  execSync('npx prisma migrate dev --name init', {
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, PRISMA_MIGRATION_SKIP_GENERATE: '1' }
  });

  console.log('✅ 迁移完成！');
  console.log('');
  console.log('下一步操作:');
  console.log('1. 使用 `npx prisma studio` 查看和管理数据库');
  console.log('2. 使用 `npx prisma migrate deploy` 在生产环境应用迁移');
  console.log('3. 使用 `npx prisma generate` 更新 Prisma 客户端');
} catch (error) {
  console.error('❌ 迁移过程中出错:', error);
  process.exit(1);
}
