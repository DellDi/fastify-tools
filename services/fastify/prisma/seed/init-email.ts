import { randomUUID } from 'crypto';
import { PrismaClient } from '../../generated/client/index.js';
const prisma = new PrismaClient();
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function seedEmail() {
    await prisma.emailTemplate.upsert({
        where: { id: randomUUID() },
        update: {},
        create: {
            name: 'register-confirmation',
            subject: '邮件注册确认',
            body: fs.readFileSync(path.join(__dirname, '../../public/email/base-template.html'), 'utf8'),
            variables: {
                Email: 'string',
                ConfirmationURL: 'string',
                SiteURL: 'string'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    console.log('Email templates seeded successfully')
}