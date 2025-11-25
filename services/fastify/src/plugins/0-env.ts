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

  // API 前缀
  API_PREFIX: Type.Optional(Type.String({ default: '' })),

  // SMTP 配置（设为可选）
  SMTP_HOST: Type.Optional(Type.String()),
  SMTP_PORT: Type.Optional(Type.Number()),
  SMTP_USER: Type.Optional(Type.String()),
  SMTP_PASS: Type.Optional(Type.String()),
  SMTP_SECURE: Type.Optional(Type.Boolean({ default: false })),

  // Jira 配置
  JIRA_USERNAME: Type.String(),
  JIRA_PASSWORD: Type.String(),
  JIRA_BASE_URL: Type.Optional(Type.String({ default: 'http://bug.new-see.com:8088' })),
  JIRA_DEFAULT_PROJECT: Type.Optional(Type.String({ default: 'V10' })),
  JIRA_DEFAULT_ISSUE_TYPE: Type.Optional(Type.String({ default: '4' })),
  JIRA_DEFAULT_COMPONENT: Type.Optional(Type.String({ default: '13676' })),
  JIRA_DEFAULT_PRIORITY: Type.Optional(Type.String({ default: '3' })),

  // 认证配置
  BEARER_TOKEN: Type.String(),

  // LLM 配置（阿里云 DashScope）
  DASHSCOPE_API_KEY: Type.Optional(Type.String()),
  LLM_BASE_URL: Type.Optional(Type.String({ default: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' })),
  LLM_MODEL: Type.Optional(Type.String({ default: 'qwen3-flash' })),
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
