import { PrismaClient } from '@/types/prisma.js';
import { runVersionedSeed } from './seed/version-manager.js';
import { seedEmail } from './seed/init-email.js';
const prisma = new PrismaClient();
async function main() {
    try {
        console.log('Starting database seed...');
        await runVersionedSeed('init-email', '1.0.0', seedEmail);
        console.log('All seed operations completed successfully');
    }
    catch (error) {
        console.error('Error during seed:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
