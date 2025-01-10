// src/plugins/email/index.ts
import fp from 'fastify-plugin'
import nodemailer from 'nodemailer'
import { type Pool } from 'pg'
import { randomBytes } from 'crypto'
import { Type } from '@sinclair/typebox'
import { EmailService } from '../../types/fastify.js'

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
  db: Pool
  magicLinkBaseUrl: string
  magicLinkExpiry: number // 魔法链接过期时间(分钟)
}

export default fp(async (fastify, options: EmailPluginOptions) => {
  const { smtp, db, magicLinkBaseUrl, magicLinkExpiry } = options
  const transporter = nodemailer.createTransport(smtp)

  // 邮件服务实现
  const emailService: EmailService = {
    async sendTemplateEmail(templateName, to, variables) {
      const template = await db.query(
        'SELECT * FROM email_templates WHERE name = $1',
        [templateName],
      )

      if (!template.rows[0]) {
        throw new Error(`Template ${templateName} not found`)
      }

      const { subject, body } = template.rows[0]

      // 替换模板变量
      const renderedBody = body.replace(/\${(\w+)}/g, (_, key) => variables[key] || '')
      const renderedSubject = subject.replace(/\${(\w+)}/g, (_, key) => variables[key] || '')

      await transporter.sendMail({
        to,
        subject: renderedSubject,
        html: renderedBody,
      })

      // 记录发送日志
      await db.query(
        `INSERT INTO email_logs (template_id, to_email, variables, status)
         VALUES ($1, $2, $3, $4)`,
        [template.rows[0].id, to, variables, 'sent'],
      )
    },

    async createMagicLink(email, purpose) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + magicLinkExpiry * 60000)

      await db.query(
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

    async verifyMagicLink(token) {
      const result = await db.query(
        `SELECT *
         FROM magic_links
         WHERE token = $1
           AND expires_at > NOW()
           AND used_at IS NULL`,
        [token],
      )

      if (!result.rows[0]) {
        return false
      }

      // 标记链接为已使用
      await db.query(
        'UPDATE magic_links SET used_at = NOW() WHERE token = $1',
        [token],
      )

      return true
    },

    async subscribe(email, preferences = {}) {
      await db.query(
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
      await db.query(
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

  // 注册路由
  fastify.register(async function (fastify) {
    // 魔法链接注册
    fastify.post('/auth/magic-link', {
      schema: {
        body: Type.Object({
          email: Type.String({ format: 'email' }),
          purpose: Type.String(),
        }),
      },
      handler: async (request, reply) => {
        const { email, purpose } = request.body as any
        const link = await fastify.emailService.createMagicLink(email, purpose)
        reply.send({ message: 'Magic link sent successfully' })
      },
    })

    // 验证魔法链接
    fastify.post('/auth/verify-magic-link', {
      schema: {
        body: Type.Object({
          token: Type.String(),
        }),
      },
      handler: async (request, reply) => {
        const { token } = request.body as any
        const isValid = await fastify.emailService.verifyMagicLink(token)
        if (!isValid) {
          reply.code(400).send({ error: 'Invalid or expired token' })
          return
        }
        reply.send({ message: 'Token verified successfully' })
      },
    })

    // 订阅管理
    fastify.post('/subscriptions', {
      schema: {
        body: Type.Object({
          email: Type.String({ format: 'email' }),
          preferences: Type.Optional(Type.Object({})),
        }),
      },
      handler: async (request, reply) => {
        const { email, preferences } = request.body as any
        await fastify.emailService.subscribe(email, preferences)
        reply.send({ message: 'Subscribed successfully' })
      },
    })

    // 取消订阅
    fastify.post('/subscriptions/unsubscribe', {
      schema: {
        body: Type.Object({
          email: Type.String({ format: 'email' }),
        }),
      },
      handler: async (request, reply) => {
        const { email } = request.body as any
        await fastify.emailService.unsubscribe(email)
        reply.send({ message: 'Unsubscribed successfully' })
      },
    })
  })
})
