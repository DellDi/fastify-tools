import fp from 'fastify-plugin'
import { FastifyEnvOptions } from '@fastify/env'
import emailPlugin from './email/index.js'
import { Pool } from 'pg'

// 初始化数据库连接池
const pool = new Pool({
  // 数据库配置
})

export default fp<FastifyEnvOptions>(async (fastify, opts) => {
  // Register other plugins with options
  await fastify.register(emailPlugin, {
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com',
        pass: 'your-password',
      },
    },
    db: pool,
    magicLinkBaseUrl: 'https://your-app.com/verify',
    magicLinkExpiry: 30, // 30 minutes
  })
})
