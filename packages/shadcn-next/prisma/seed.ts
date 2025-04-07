import { PrismaClient } from '@prisma/client';
import { seedHomeSections } from './seed/home_sections.js';
import { seedAuthInit } from './seed/auth_init.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');

    // 1. 初始化认证相关数据（角色、权限、菜单等）
    await seedAuthInit();
    console.log('Auth data seeded successfully');

    // 2. 初始化首页sections数据
    await seedHomeSections();
    console.log('Home sections seeded successfully');

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