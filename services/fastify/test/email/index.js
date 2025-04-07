import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { Type } from '@sinclair/typebox';
export default fp(async (fastify, options) => {
    const { smtp, magicLinkBaseUrl, magicLinkExpiry } = options;
    fastify.log.info('Email plugin initialized', options);
    const transportConfig = {
        ...smtp,
        secure: false,
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    };
    const transporter = nodemailer.createTransport(transportConfig);
    try {
        await transporter.verify();
        fastify.log.info('SMTP connection verified successfully');
    }
    catch (error) {
        fastify.log.error('SMTP connection verification failed:', error);
        throw new Error('Failed to establish SMTP connection');
    }
    const pgPoolClient = await fastify.pg.connect();
    const emailService = {
        async sendTemplateEmail(templateName, to, variables) {
            const template = await pgPoolClient.query('SELECT * FROM email_templates WHERE name = $1', [templateName]);
            if (!template.rows[0]) {
                throw new Error(`Template ${templateName} not found`);
            }
            const { subject, body } = template.rows[0];
            const renderedSubject = subject.replace(/{{(\w+)}}/g, (_, key) => {
                return variables[key] || '';
            });
            const renderedBody = body.replace(/{{(\w+)}}/g, (_, key) => {
                return variables[key] || '';
            });
            try {
                await transporter.sendMail({
                    from: smtp.auth.user,
                    to,
                    subject: renderedSubject,
                    html: renderedBody,
                    headers: {
                        'Message-ID': `<${Date.now()}@${smtp.host}>`
                    }
                });
                fastify.log.info(`Email sent successfully to ${to}`);
            }
            catch (error) {
                fastify.log.error('Failed to send email:', error);
                throw new Error(`Failed to send email: ${error}`);
            }
            await pgPoolClient.query(`INSERT INTO email_logs (template_id, to_email, variables, status)
         VALUES ($1, $2, $3, $4)`, [template.rows[0].id, to, variables, 'sent']);
        },
        async setEmailTemplate(name, subject, body) {
            await pgPoolClient.query(`INSERT INTO email_templates (name, subject, body)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE
             SET subject = $2,
                 body = $3,
                 updated_at = NOW()`, [name, subject, body]);
        },
        async createMagicLink(email, purpose, username) {
            const token = randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + magicLinkExpiry * 60000);
            await pgPoolClient.query(`INSERT INTO magic_links (email, token, purpose, expires_at)
         VALUES ($1, $2, $3, $4)`, [email, token, purpose, expiresAt]);
            const magicLink = `${magicLinkBaseUrl}/${token}`;
            await this.sendTemplateEmail('magic-link', email, {
                username: username || '佚名',
                verification_link: magicLink,
                expiration_time: `${magicLinkExpiry} minutes`,
            });
            return magicLink;
        },
        async verifyMagicLink(token) {
            try {
                const result = await fastify.pg.transact(async (client) => {
                    const dbResult = await client.query(`SELECT purpose, used_at, expires_at
            FROM magic_links
            WHERE token = $1
        `, [token]);
                    if (dbResult.rowCount === 0) {
                        return { status: 'invalid', purpose: null };
                    }
                    const { used_at, expires_at, purpose } = dbResult.rows[0];
                    if (used_at) {
                        return { status: 'used', purpose };
                    }
                    if (new Date(expires_at) < new Date()) {
                        return { status: 'expired', purpose };
                    }
                    return { status: 'valid', purpose };
                });
                return result;
            }
            catch (error) {
                fastify.log.error('verifyMagicLink error:', error);
                return { status: 'error', purpose: null };
            }
        },
        async subscribe(email, preferences = {}) {
            await pgPoolClient.query(`INSERT INTO subscriptions (email, status, preferences)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE
             SET status = 'active',
                 preferences = $3,
                 updated_at = NOW()`, [email, 'active', preferences]);
        },
        async unsubscribe(email) {
            await pgPoolClient.query(`UPDATE subscriptions
         SET status = 'unsubscribed',
             updated_at = NOW()
         WHERE email = $1`, [email]);
        },
    };
    fastify.decorate('emailService', emailService);
    const plugins = async (fastify, opts) => {
        fastify.register(cors, {
            origin: (origin, cb) => {
                const hostname = new URL(origin || '').hostname;
                const allowedHostnames = ['localhost', '127.0.0.1'];
                if (allowedHostnames.includes(hostname)) {
                    cb(null, true);
                    return;
                }
                cb(new Error('origin Not allowed'), false);
            },
        });
        fastify.post('/auth/magic-link', {
            schema: {
                tags: ['email'],
                body: Type.Object({
                    email: Type.String({ format: 'email' }),
                    username: Type.String({ description: 'The username of the user' }),
                    purpose: Type.String({ description: 'The purpose of the magic link' }),
                }),
            },
            handler: async (request, reply) => {
                const { email, username, purpose } = request.body;
                const link = await fastify.emailService.createMagicLink(email, purpose, username);
                fastify.log.info(`Magic link sent to ${email}: ${link}`);
                reply.send({ message: 'Magic link sent successfully' });
            },
        });
        fastify.get('/auth/verify-magic-link', {
            schema: {
                tags: ['email'],
                querystring: Type.Object({
                    token: Type.String({ minLength: 32, maxLength: 32, description: 'The magic link token' }),
                    redirect: Type.String({ description: 'The URL to redirect to after verification' }),
                    base_url: Type.String({ description: 'The base URL of the application' }),
                }),
            },
            handler: async (request, reply) => {
                const { token, redirect, base_url } = request.query;
                const isValid = await fastify.emailService.verifyMagicLink(token);
                if (!isValid) {
                    reply.code(400).send({ error: 'Invalid or expired token' });
                    reply.redirect(`${base_url}?error=invalid`);
                    return;
                }
                reply.redirect(`${redirect}?token=${token}`);
            },
        });
        fastify.post('/email/set-template', {
            schema: {
                tags: ['email'],
                body: Type.Object({
                    name: Type.String({ description: 'The name of the email template' }),
                    subject: Type.String({ description: 'The subject of the email' }),
                    body: Type.String({ description: 'The body of the email' }),
                }),
            },
            handler: async (request, reply) => {
                const { name, subject, body } = request.body;
                await fastify.emailService.setEmailTemplate(name, subject, body);
                reply.send({ message: 'Email template saved successfully' });
            },
        });
        fastify.post('/email/subscriptions', {
            schema: {
                tags: ['email'],
                body: Type.Object({
                    email: Type.String({ format: 'email' }),
                    preferences: Type.Optional(Type.Object({})),
                }),
            },
            handler: async (request, reply) => {
                const { email, preferences } = request.body;
                await fastify.emailService.subscribe(email, preferences);
                reply.send({ message: 'Subscribed successfully' });
            },
        });
        fastify.post('/email/unsubscribe', {
            schema: {
                tags: ['email'],
                body: Type.Object({
                    email: Type.String({ format: 'email' }),
                }),
            },
            handler: async (request, reply) => {
                const { email } = request.body;
                await fastify.emailService.unsubscribe(email);
                reply.send({ message: 'Unsubscribed successfully' });
            },
        });
        fastify.get('/email/templates', {
            schema: {
                tags: ['email'],
                response: {
                    200: Type.Object({
                        templates: Type.Array(Type.Object({
                            name: Type.String({ description: '模板名称' }),
                            subject: Type.String({ description: '邮件主题' }),
                            body: Type.String({ description: '邮件内容' }),
                            created_at: Type.String({ description: '创建时间' }),
                            updated_at: Type.String({ description: '更新时间' })
                        }))
                    })
                }
            },
            handler: async (request, reply) => {
                const result = await pgPoolClient.query('SELECT name, subject, body, created_at, updated_at FROM email_templates ORDER BY created_at DESC');
                reply.send({ templates: result.rows });
            },
        });
    };
    fastify.register(plugins);
});
