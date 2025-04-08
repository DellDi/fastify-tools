import { PrismaClient } from '@prisma/client';
import { seedHomeSections } from './seed/home_sections.js';
import { seedAuthInit } from './seed/auth_init.js';
import { runVersionedSeed } from './seed/version-manager.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');

    // 1. 初始化认证相关数据（角色、权限、菜单等）
    await runVersionedSeed('auth_init', '1.0.0', seedAuthInit);
    
    // 2. 初始化首页sections数据
    await runVersionedSeed('home_sections', '1.0.0', seedHomeSections);

    console.log('All seed operations completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })