import fp from 'fastify-plugin'
import { FastifyEnvOptions } from '@fastify/env'
import emailPlugin from './email/index.js'

export default fp<FastifyEnvOptions>(async (fastify, opts) => {
  const { SMTP_HOST = 'localhost', SMTP_PORT = 587, SMTP_USER = '', SMTP_PASS = '', SMTP_SECURE = 'false', MAGIC_LINK_BASE_URL = '', MAGIC_LINK_EXPIRY = 30 } = process.env

  // 检查 pg 连接是否可用，如果不可用，则不注册邮件插件
  if (!fastify.isConnectedPg) {
    fastify.log.warn('PostgreSQL connection is not available. Skipping email plugin registration.');
    return;
  }
  // Register other plugins with options
  await fastify.register(emailPlugin, {
    smtp: {
      host: SMTP_HOST,
      port: +SMTP_PORT,
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    },
    magicLinkBaseUrl: MAGIC_LINK_BASE_URL,
    magicLinkExpiry: +MAGIC_LINK_EXPIRY, // 30 minutes
  })
}, {
  dependencies: ['pg-link'],
})
