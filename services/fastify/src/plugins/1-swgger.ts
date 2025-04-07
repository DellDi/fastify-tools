import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import scalarReference from '@scalar/fastify-api-reference'

export default fp(async (fastify) => {
  fastify.log.info('开始注册 Swagger')
  // 注册 swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Dell DI 的API文档',
        description: 'Dell DI the Fastify swagger API',
        version: '0.1.0'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' }
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header'
          }
        }
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      }
    }
  })
  fastify.log.info('成功注册 Swagger')

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
  fastify.log.info('成功注册 Swagger UI')

  await fastify.register(scalarReference, {
    routePrefix: '/reference',  // 使用不同的路由前缀
    
    configuration: {
      theme: 'purple',
      title: 'Dell DI 的API文档',
      url: '/docs/json',
    },
  })
  fastify.log.info('成功注册 Scalar API Reference')
})
