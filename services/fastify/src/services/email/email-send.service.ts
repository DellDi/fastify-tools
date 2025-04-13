import { FastifyInstance } from 'fastify';
import { EmailLog } from 'generated/client/index.js';
import nodemailer from 'nodemailer';

/**
 * 邮件发送服务
 * 提供邮件发送功能
 */
export class EmailSendService {
    private transporter: nodemailer.Transporter;

    constructor(private fastify: FastifyInstance) {
        const { SMTP_HOST = 'localhost', SMTP_PORT = 587, SMTP_USER = '', SMTP_PASS = '', SMTP_SECURE = 'false' } = process.env;
        // 创建 SMTP 传输器
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: +SMTP_PORT,
            secure: SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true
        });
    }

    /**
     * 发送邮件
     * @param to 收件人邮箱
     * @param subject 邮件主题
     * @param html 邮件内容 (HTML格式)
     */
    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html
        });
    }

    /**
     * 使用模板发送邮件
     * @param email 收件人邮箱
     * @param templateName 模板名称
     * @param variables 模板变量
     */
    async sendWithTemplate(email: string, templateName: string, variables: Record<string, any>): Promise<EmailLog> {
        // 查找模板
        const template = await this.fastify.prisma.emailTemplate.findFirst({
            where: { name: templateName },
        });

        if (!template) {
            throw new Error(`邮件模板 "${templateName}" 未找到`);
        }

        // 替换模板变量
        let subject = template.subject;
        let html = template.body;

        // 替换所有变量
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            subject = subject.replace(regex, String(value));
            html = html.replace(regex, String(value));
        });

        // 发送邮件
        await this.sendEmail(email, subject, html);

        // 记录发送日志
        const log = await this.fastify.prisma.emailLog.create({
            data: {
                templateId: template.id,
                toEmail: email,
                variables: JSON.stringify(variables),
                status: 'sent'
            }
        });

        return log;
    }
}
