import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import scalarReference from '@scalar/fastify-api-reference'

export default fp(async (fastify) => {
  // 获取 API 前缀
  const API_PREFIX = process.env.API_PREFIX || ''

  // 定义公共路径
  const openApiJsonPath = '/openapi.json'
  const docsPath = '/docs'

  fastify.log.info('开始注册 API 文档')

  // 注册 OpenAPI 文档路由
  fastify.get(openApiJsonPath, (request, reply) => {
    // 生成带有服务器信息的 OpenAPI 文档

    // 使用 referer 获取当前 URL
    let serverUrl = ''

    // 如果有 referer，从 referer 中提取协议和主机
    const refererUrl = new URL(request.headers.referer as string)
    serverUrl = `${refererUrl.protocol}//${refererUrl.host}${API_PREFIX}`

    // 获取基本的 swagger 对象
    const swaggerObject = fastify.swagger()

    // 添加服务器信息 - 使用类型断言确保类型安全
    const typedSwaggerObject = swaggerObject as any
    typedSwaggerObject.servers = [
      {
        url: serverUrl,
        description: '当前 API 服务器',
      },
    ]

    reply.send(swaggerObject)
  })

  // 注册 Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Dell DI 的API文档',
        description: 'Dell DI the Fastify swagger API',
        version: '0.1.0',
      },
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  })

  // 注册 Swagger UI - 使用简化配置
  await fastify.register(swaggerUi, {
    routePrefix: docsPath,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      // 指向我们自定义的 OpenAPI 文档路径
      url: `${API_PREFIX}${openApiJsonPath}`,
    },
    staticCSP: true,
  })

  fastify.log.info('成功注册 Swagger UI')

  // 注册 Scalar API Reference
  await fastify.register(scalarReference, {
    routePrefix: '/reference', // 使用不同的路由前缀
    configuration: {
      theme: 'purple',
      title: 'Dell DI 的API文档',
      // 指定正确的 OpenAPI 文档 URL
      // 使用绝对路径，确保包含 API 前缀
      url: `${API_PREFIX}${openApiJsonPath}`,
    },
  })
  fastify.log.info('成功注册 Scalar API Reference')
  fastify.log.info(`Scalar API Reference URL: ${API_PREFIX}/reference`)
  fastify.log.info(`OpenAPI JSON URL: ${API_PREFIX}${openApiJsonPath}`)
})
