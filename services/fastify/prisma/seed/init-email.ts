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

    await prisma.emailTemplate.upsert({
        where: { id: randomUUID() },
        update: {},
        create: {
            name: 'register-success',
            subject: '注册成功',
            body: fs.readFileSync(path.join(__dirname, '../../public/email/success-template.html'), 'utf8'),
            variables: {
                logoUrl: 'string',
                username: 'string',
                email: 'string',
                password: 'string',
                loginUrl: 'string'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    await prisma.emailTemplate.upsert({
        where: { id: randomUUID() },
        update: {},
        create: {
            name: 'edit-password',
            subject: '修改密码',
            body: fs.readFileSync(path.join(__dirname, '../../public/email/edit-password.html'), 'utf8'),
            variables: {
                Email: 'string',
                Code: 'string',
                SiteName: 'string',
                SiteURL: 'string',
                SupportEmail: 'string'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    await prisma.emailTemplate.upsert({
        where: { id: randomUUID() },
        update: {},
        create: {
            name: 'reset-password',
            subject: '重置密码',
            body: fs.readFileSync(path.join(__dirname, '../../public/email/reset-password.html'), 'utf8'),
            variables: {
                logoUrl: 'string',
                ConfirmationURL: 'string',
                SiteURL: 'string'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    console.log('Email templates seeded successfully')
}