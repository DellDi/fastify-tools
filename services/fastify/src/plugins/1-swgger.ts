import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import scalarReference from '@scalar/fastify-api-reference'

export default fp(async (fastify) => {
  fastify.log.info('开始注册 Swagger')

  // 自定义路径常量
  const customApiDocsPath = '/docs'
  const customJsonPath = 'openapi.json'

  // 注册 swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.1.0',
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

  // 注册 Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: customApiDocsPath,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      // 指定自定义的 JSON URL 路径
      url: `/${customJsonPath}`
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })

  // 自定义 Swagger JSON 路径
  // 这会覆盖默认的 /documentation/json 路径
  fastify.get(`/${customJsonPath}`, {}, (req, reply) => {
    reply.send(fastify.swagger())
  })

  fastify.log.info('成功注册 Swagger UI')

  // 注册 Scalar API Reference
  await fastify.register(scalarReference, {
    routePrefix: '/reference',  // 使用不同的路由前缀
    configuration: {
      theme: 'purple',
      title: 'Dell DI 的API文档',
      // 指向自定义的 JSON 路径
      url: `/${customJsonPath}`
    },
  })
  fastify.log.info('成功注册 Scalar API Reference')
})
