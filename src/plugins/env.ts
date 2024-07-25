import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'

export default fp<FastifyEnvOptions>(async (fastify, opts) => {
  // Register other plugins with options
  fastify.register(fastifyEnv, {})
})
