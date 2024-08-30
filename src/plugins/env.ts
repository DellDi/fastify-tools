import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'
import { config } from 'dotenv'

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {

  },
}
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
