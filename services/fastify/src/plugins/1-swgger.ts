import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import scalarReference from '@scalar/fastify-api-reference'

export default fp(async (fastify) => {
  // 获取 API 前缀
  const API_PREFIX = process.env.API_PREFIX || ''

  // 定义公共路径（带前缀）
  const openApiJsonPath = `${API_PREFIX}/openapi.json`
  const docsPath = `${API_PREFIX}/docs` as `/${string}`
  const referencePath = `${API_PREFIX}/reference` as `/${string}`

  fastify.log.info('开始注册 API 文档')

  // 注册 OpenAPI 文档路由
  fastify.get(openApiJsonPath, (request, reply) => {
    // 生成带有服务器信息的 OpenAPI 文档
    let serverUrl = API_PREFIX || '/'

    // 尝试从 referer 或 host 获取完整 URL
    try {
      const referer = request.headers.referer
      const host = request.headers.host
      const protocol = request.headers['x-forwarded-proto'] || 'http'

      if (referer) {
        const refererUrl = new URL(referer)
        serverUrl = `${refererUrl.protocol}//${refererUrl.host}${API_PREFIX}`
      } else if (host) {
        serverUrl = `${protocol}://${host}${API_PREFIX}`
      }
    } catch {
      // 解析失败时使用默认值
    }

    // 获取基本的 swagger 对象
    const swaggerObject = fastify.swagger()

    // 添加服务器信息
    const typedSwaggerObject = swaggerObject as Record<string, unknown>
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
      url: openApiJsonPath,
    },
    staticCSP: true,
  })

  fastify.log.info('成功注册 Swagger UI')

  // 注册 Scalar API Reference
  await fastify.register(scalarReference, {
    routePrefix: referencePath,
    configuration: {
      theme: 'purple',
      title: 'Dell DI 的API文档',
      url: openApiJsonPath,
    },
  })
  fastify.log.info('成功注册 Scalar API Reference')
  fastify.log.info(`Scalar API Reference URL: ${referencePath}`)
  fastify.log.info(`OpenAPI JSON URL: ${openApiJsonPath}`)
})
