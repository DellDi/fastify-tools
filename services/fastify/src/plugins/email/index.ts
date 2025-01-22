import cors from '@fastify/cors'
import fp from 'fastify-plugin'
import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'
import { Type } from '@sinclair/typebox'
import { EmailService } from '../../types/fastify.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
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

  // 配置SMTP传输器，添加额外的TLS选项
  const transportConfig = {
    ...smtp,
    secure: false, // 强制使用非安全模式，让Nodemailer自动处理TLS
    tls: {
      rejectUnauthorized: false // 允许自签名证书
    },
    debug: true // 启用调试模式以获取详细日志
  }

  const transporter = nodemailer.createTransport(transportConfig)

  // 验证SMTP连接
  try {
    await transporter.verify()
    fastify.log.info('SMTP connection verified successfully')
  } catch (error) {
    fastify.log.error('SMTP connection verification failed:', error)
    throw new Error('Failed to establish SMTP connection')
  }
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

      // 替换模板变量 {{key}} 替换为变量值(双花括号)
      const renderedSubject = subject.replace(/{{(\w+)}}/g, (_: any, key: string | number) => {
        return variables[key] || ''
      })
      const renderedBody = body.replace(/{{(\w+)}}/g, (_: any, key: string | number) => {
        return variables[key] || ''
      })

      try {
        await transporter.sendMail({
          from: smtp.auth.user, // 添加发件人地址
          to,
          subject: renderedSubject,
          html: renderedBody,
          headers: {
            'Message-ID': `<${Date.now()}@${smtp.host}>` // 添加消息ID
          }
        })
        fastify.log.info(`Email sent successfully to ${to}`)
      } catch (error) {
        fastify.log.error('Failed to send email:', error)
        throw new Error(`Failed to send email: ${error.message}`)
      }

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

    async createMagicLink(email, purpose, username) {
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
        username: username || '佚名',
        verification_link: magicLink,
        expiration_time: `${magicLinkExpiry} minutes`,
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

  // 设置包装的插件服务
  const plugins: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.register(cors, {
      origin: (origin, cb) => {
        const hostname = new URL(origin || '').hostname
        const allowedHostnames = ['localhost', '127.0.0.1']
        if (allowedHostnames.includes(hostname)) {
          //  Request from localhost will pass
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(new Error('origin Not allowed'), false)
      },
    })

    // 魔法链接注册
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
        const { email, username, purpose } = request.body
        const link = await fastify.emailService.createMagicLink(email, purpose, username)
        fastify.log.info(`Magic link sent to ${email}: ${link}`)
        reply.send({ message: 'Magic link sent successfully' })
      },
    })

    // 验证魔法链接
    fastify.get('/auth/verify-magic-link', {
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
        const { name, subject, body } = request.body
        await fastify.emailService.setEmailTemplate(name, subject, body)
        reply.send({ message: 'Email template saved successfully' })
      },
    })

    // 订阅管理
    fastify.post('/email/subscriptions', {
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
    fastify.post('/email/unsubscribe', {
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

    // 获取邮件模版列表
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
        const result = await pgPoolClient.query(
          'SELECT name, subject, body, created_at, updated_at FROM email_templates ORDER BY created_at DESC'
        )
        reply.send({ templates: result.rows })
      },
    })

  }

  // 注册接口路由
  fastify.register(plugins)
})


