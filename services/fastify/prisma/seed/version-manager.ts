import { PrismaClient } from '@/types/prisma.js';

const prisma = new PrismaClient();

/**
 * 种子版本管理工具
 * 用于管理种子脚本的版本和执行状态
 */
export async function runVersionedSeed(
  seedName: string, 
  version: string, 
  seedFn: () => Promise<void>
): Promise<void> {
  try {
    // 检查种子是否已经执行过
    const existing = await prisma.seedVersion.findUnique({
      where: { id: seedName }
    });
    
    // 如果种子不存在或版本不匹配，则执行种子函数
    if (!existing || existing.version !== version) {
      console.log(`执行种子 ${seedName} (版本: ${version})`);
      await seedFn();
      
      // 更新种子版本记录
      await prisma.seedVersion.upsert({
        where: { id: seedName },
        update: { version },
        create: { id: seedName, version }
      });
      
      console.log(`种子 ${seedName} 执行完成并更新版本为 ${version}`);
    } else {
      console.log(`跳过种子 ${seedName} (版本: ${version})，已经执行过`);
    }
  } catch (error) {
    console.error(`执行种子 ${seedName} 时出错:`, error);
    throw error;
  }
}
