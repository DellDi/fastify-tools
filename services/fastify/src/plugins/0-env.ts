import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'
import { Type } from '@sinclair/typebox'
import { config } from 'dotenv'

const schema = Type.Object({
  // 端口与环境
  PORT: Type.String(),
  NODE_ENV: Type.String({ default: 'development' }),
  // 数据库配置
  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.Number(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),

  // 数据库连接字符串
  DATABASE_URL: Type.String(),

  // 邮件服务配置
  SMTP_HOST: Type.String(),
  SMTP_PORT: Type.Number(),
  SMTP_USER: Type.String(),
  SMTP_PASS: Type.String(),
  SMTP_SECURE: Type.Boolean({ default: false }),
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
