import { PrismaClient } from '../generated/client';
import { runVersionedSeed } from './seed/version-manager.js';
import { seedEmail } from './seed/init-email.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');
    
    // 1. 初始化邮件模版
    await runVersionedSeed('init-email', '1.0.0', seedEmail);

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