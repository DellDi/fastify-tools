import fp from 'fastify-plugin'
import fastifySwagger, { FastifySwaggerOptions } from '@fastify/swagger'

export default fp<FastifySwaggerOptions>(async (fastify, opts) => {
  // Register other plugins with options
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'fatify-service-template',
        description: 'API documentation',
        version: '1.0.0',
      },

      host: `${process.env.ENV_HOST}:${process.env.ENV_PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })
})