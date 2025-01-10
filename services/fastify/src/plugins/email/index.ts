// src/plugins/email/index.ts
import fp from 'fastify-plugin'
import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'
import { Type } from '@sinclair/typebox'
import { EmailService } from '../../types/fastify.js'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
// 配置类型
interface EmailPluginOptions {
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  magicLinkBaseUrl: string
  magicLinkExpiry: number // 魔法链接过期时间(分钟)
}

export default fp(async (fastify, options: EmailPluginOptions) => {
  const { smtp, magicLinkBaseUrl, magicLinkExpiry } = options
  fastify.log.info('Email plugin initialized', options)
  const transporter = nodemailer.createTransport(smtp)
  const pgPoolClient = await fastify.pg.connect()
  // 邮件服务实现
  const emailService: EmailService = {
    async sendTemplateEmail(templateName, to, variables) {
      const template = await pgPoolClient.query(
        'SELECT * FROM email_templates WHERE name = $1',
        [templateName],
      )

      if (!template.rows[0]) {
        throw new Error(`Template ${templateName} not found`)
      }

      const { subject, body } = template.rows[0]

      // 替换模板变量
      const renderedBody = body.replace(/\${(\w+)}/g, (_: any, key: string | number) => variables[key] || '')
      const renderedSubject = subject.replace(/\${(\w+)}/g, (_: any, key: string | number) => variables[key] || '')

      await transporter.sendMail({
        to,
        subject: renderedSubject,
        html: renderedBody,
      })

      // 记录发送日志
      await pgPoolClient.query(
        `INSERT INTO email_logs (template_id, to_email, variables, status)
         VALUES ($1, $2, $3, $4)`,
        [template.rows[0].id, to, variables, 'sent'],
      )
    },

    async setEmailTemplate(name, subject, body) {
      await pgPoolClient.query(
        `INSERT INTO email_templates (name, subject, body)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE
             SET subject = $2,
                 body = $3,
                 updated_at = NOW()`,
        [name, subject, body],
      )
    },

    async createMagicLink(email, purpose) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + magicLinkExpiry * 60000)

      await pgPoolClient.query(
        `INSERT INTO magic_links (email, token, purpose, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [email, token, purpose, expiresAt],
      )

      const magicLink = `${magicLinkBaseUrl}/${token}`

      // 发送魔法链接邮件
      await this.sendTemplateEmail('magic-link', email, {
        link: magicLink,
        expiresIn: `${magicLinkExpiry} minutes`,
      })

      return magicLink
    },


    async verifyMagicLink(token: string) {
      try {
        const result = await fastify.pg.transact(async (client) => {
          const dbResult = await client.query(
            `SELECT purpose, used_at, expires_at
            FROM magic_links
            WHERE token = $1
        `,
            [token],
          );

          if (dbResult.rowCount === 0) {
            return { status: 'invalid', purpose: null };
          }

          const { used_at, expires_at, purpose } = dbResult.rows[0];

          if (used_at) {
            return { status: 'used', purpose };
          }

          if (new Date(expires_at) < new Date()) {
            return { status: 'expired', purpose }
          }

          return { status: 'valid', purpose }
        });

        return result as { status: 'error' | 'invalid' | 'used' | 'expired' | 'valid'; purpose: string | null };
      } catch (error) {
        fastify.log.error('verifyMagicLink error:', error); // 记录错误日志
        return { status: 'error', purpose: null };
      }
    },

    async subscribe(email, preferences = {}) {
      await pgPoolClient.query(
        `INSERT INTO subscriptions (email, status, preferences)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE
             SET status = 'active',
                 preferences = $3,
                 updated_at = NOW()`,
        [email, 'active', preferences],
      )
    },

    async unsubscribe(email) {
      await pgPoolClient.query(
        `UPDATE subscriptions
         SET status = 'unsubscribed',
             updated_at = NOW()
         WHERE email = $1`,
        [email],
      )
    },
  }

  // 注册服务
  fastify.decorate('emailService', emailService)

  // 注册接口路由
  fastify.register(async function (fastify) {
    // 验证魔法链接
    fastify.withTypeProvider<TypeBoxTypeProvider>().get('/auth/verify-magic-link', {
      schema: {
        tags: ['email'],
        // 添加参数的中文描述
        querystring: Type.Object({
          token: Type.String({ minLength: 32, maxLength: 32, description: 'The magic link token' }),
          redirect: Type.String({ description: 'The URL to redirect to after verification' }),
          base_url: Type.String({ description: 'The base URL of the application' }),
        }),
      },
      handler: async (request, reply) => {
        const { token, redirect, base_url } = request.query
        const isValid = await fastify.emailService.verifyMagicLink(token)
        if (!isValid) {
          reply.code(400).send({ error: 'Invalid or expired token' })
          // 验证失败 重定向到指定页面
          reply.redirect(`${base_url}?error=invalid`)
          return
        }
        reply.redirect(`${redirect}?token=${token}`)

      },
    })

    // 设置邮箱模版
    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/email/set-template', {
      schema: {
        tags: ['email'],
        body: Type.Object({
          name: Type.String({ description: 'The name of the email template' }),
          subject: Type.String({ description: 'The subject of the email' }),
          body: Type.String({ description: 'The body of the email' }),
        }),
      },
      handler: async (request, reply) => {
        const { name, subject, body } = request.body
        await fastify.emailService.setEmailTemplate(name, subject, body)
        reply.send({ message: 'Email template saved successfully' })
      },
    })


    // 魔法链接注册
    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/auth/magic-link', {
      schema: {
        tags: ['email'],
        body: Type.Object({
          email: Type.String({ format: 'email' }),
          purpose: Type.String({ description: 'The purpose of the magic link' }),
        }),
      },
      handler: async (request, reply) => {
        const { email, purpose } = request.body
        const link = await fastify.emailService.createMagicLink(email, purpose)
        fastify.log.info(`Magic link sent to ${email}: ${link}`)
        reply.send({ message: 'Magic link sent successfully' })
      },
    })


    // 订阅管理
    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/email/subscriptions', {
      schema: {
        tags: ['email'],
        body: Type.Object({
          email: Type.String({ format: 'email' }),
          preferences: Type.Optional(Type.Object({})),
        }),
      },
      handler: async (request, reply) => {
        const { email, preferences } = request.body
        await fastify.emailService.subscribe(email, preferences)
        reply.send({ message: 'Subscribed successfully' })
      },
    })

    // 取消订阅
    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/email/unsubscribe', {
      schema: {
        tags: ['email'],
        body: Type.Object({
          email: Type.String({ format: 'email' }),
        }),
      },
      handler: async (request, reply) => {
        const { email } = request.body
        await fastify.emailService.unsubscribe(email)
        reply.send({ message: 'Unsubscribed successfully' })
      },
    })
  })
})


