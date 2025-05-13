import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'
import { Type } from '@sinclair/typebox'
import { config } from 'dotenv'

const schema = Type.Object({
  // 端口与环境
  PORT: Type.String(),
  NODE_ENV: Type.String({ default: 'development' }),

  // 数据库连接字符串
  DATABASE_URL: Type.String(),

  // SMTP 配置（设为可选）
  SMTP_HOST: Type.Optional(Type.String()),
  SMTP_PORT: Type.Optional(Type.Number()),
  SMTP_USER: Type.Optional(Type.String()),
  SMTP_PASS: Type.Optional(Type.String()),
  SMTP_SECURE: Type.Optional(Type.Boolean({ default: false })),
})

export default fp<FastifyEnvOptions>(async (fastify, opts) => {
  // 根据环境变量加载不同的 .env 文件
  const nodeEnv = process.env.NODE_ENV || 'development'
  const envFilePath = `.env.${nodeEnv}`
  config({ path: envFilePath })
  // Register other plugins with options
  fastify
    .register(fastifyEnv, {
      schema: schema,
      dotenv: true, // 如果你使用 .env 文件
    })
    .ready((err) => {
      if (err) console.error(err)
    })
})
