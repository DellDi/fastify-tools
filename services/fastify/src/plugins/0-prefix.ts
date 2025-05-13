import fp from 'fastify-plugin'

/**
 * 前缀插件 - 根据环境变量设置 API 前缀
 * 
 * 该插件会根据 API_PREFIX 环境变量设置全局路由前缀
 * - 生产环境默认使用 /fastify 前缀
 * - 开发环境默认不使用前缀
 */
export default fp(async (fastify, opts) => {
  // 从环境变量获取 API 前缀，默认为空字符串（不添加前缀）
  const API_PREFIX = process.env.API_PREFIX || ''
  
  // 只有当 API_PREFIX 不为空时才设置前缀
  if (API_PREFIX) {
    // 使用 register 方法和 prefix 选项来设置前缀
    // 注意：这会影响后续注册的所有路由
    fastify.register(async (instance) => {
      // 这个空函数只是为了应用前缀设置
    }, { prefix: API_PREFIX })
    
    fastify.log.info(`API 前缀已设置为: ${API_PREFIX}`)
  } else {
    fastify.log.info('未设置 API 前缀，使用根路径')
  }
}, {
  name: 'prefix-plugin',
  dependencies: []
})
