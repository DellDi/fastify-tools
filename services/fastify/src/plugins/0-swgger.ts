import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: '工具类接口合集',
        description: '常用集合的一些工具类接口和文档输出',
        version: '1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
})
