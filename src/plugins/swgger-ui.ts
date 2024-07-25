import fp from 'fastify-plugin'
import fastifySwaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export default fp<FastifySwaggerUiOptions>(async (fastify, opts) => {
  // Register other plugins with options
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    // exposeRoute: true,
  })
})