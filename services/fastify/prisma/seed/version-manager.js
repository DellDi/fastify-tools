import { PrismaClient } from '@/types/prisma.js';
const prisma = new PrismaClient();
export async function runVersionedSeed(seedName, version, seedFn) {
    try {
        const existing = await prisma.seedVersion.findUnique({
            where: { id: seedName }
        });
        if (!existing || existing.version !== version) {
            console.log(`执行种子 ${seedName} (版本: ${version})`);
            await seedFn();
            await prisma.seedVersion.upsert({
                where: { id: seedName },
                update: { version },
                create: { id: seedName, version }
            });
            console.log(`种子 ${seedName} 执行完成并更新版本为 ${version}`);
        }
        else {
            console.log(`跳过种子 ${seedName} (版本: ${version})，已经执行过`);
        }
    }
    catch (error) {
        console.error(`执行种子 ${seedName} 时出错:`, error);
        throw error;
    }
}
