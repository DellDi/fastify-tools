import fp from 'fastify-plugin'
import scalarReference from '@scalar/fastify-api-reference'

export default fp<scalarReference>(async (fastify, opts) => {
  // Register other plugins with options
  fastify.register(scalarReference, {
    routePrefix: '/docs-reference',
    configuration: {
      theme: 'purple',
      // 设置文档标题
      title: 'Dell DI 的API文档',
      spec: {
        url: '/docs/json',
      },
      // 设置文档描述
      description: '丰富的API工具集合',
      // // 设置文档版本
      version: '1.0.0',
      // // 设置联系信息
      contact: {
        name: 'DellDi',
        email: '875372314@qq.com',
      },
    },
    // // 设置 UI 选项
    // uiConfig: {
    //   // 文档默认展开级别
    //   docExpansion: 'list',
    //   // 启用深度链接
    //   deepLinking: true,
    //   // 显示请求持续时间
    //   displayRequestDuration: true,
    // },
    // // 转换静态内容安全策略头
    // transformStaticCSP: (header: any) => header,
    // // 是否暴露文档路由
    // exposeRoute: true,
  })
})
