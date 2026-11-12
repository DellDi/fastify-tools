import { PrismaClient } from '../generated/client';
import { seedHomeSections } from './seed/home_sections';
import { seedInitRoleMenu } from './seed/init_role_menu';
import { seedInitAccount } from './seed/init_account';
import { seedPagesMenu } from './seed/pages_menu';
import { seedChangelog } from './seed/changelog';
import { runVersionedSeed } from './seed/version-manager';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');

    // 1. 初始化认证相关数据（角色、权限、菜单等）
    await runVersionedSeed('init_role_menu', '1.0.0', seedInitRoleMenu);
    
    // 2. 初始化账户-超级管理员
    await runVersionedSeed('init_account', '1.0.0', seedInitAccount);

    // 3. 初始化首页sections数据
    await runVersionedSeed('home_sections', '1.0.0', seedHomeSections);

    // 4. AIGC 组下补充 Pages站点 菜单
    await runVersionedSeed('pages_menu', '1.0.0', seedPagesMenu);

    // 5. 初始化更新日志数据
    await runVersionedSeed('changelog', '1.0.0', seedChangelog);

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