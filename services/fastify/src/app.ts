import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {} & Partial<AutoloadPluginOptions>

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // 从环境变量获取 API 前缀
  const API_PREFIX = process.env.API_PREFIX || ''

  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
    ignoreFilter: (path) => path.includes('test'),
  })

  // 加载所有路由（带前缀）
  const loadRoutes = async (instance: typeof fastify) => {
    void instance.register(AutoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: opts,
      forceESM: true,
      routeParams: true,
    })
  }

  if (API_PREFIX) {
    fastify.log.info(`路由前缀已设置为: ${API_PREFIX}`)
    void fastify.register(loadRoutes, { prefix: API_PREFIX })
  } else {
    void fastify.register(loadRoutes)
  }

  fastify.ready((err) => {
    if (err) throw err

    // 检查 Prisma 是否已注册
    if (!fastify.prisma) {
      fastify.log.warn('Prisma 插件未注册，跳过数据库操作')
    } else {
      fastify.log.info('Prisma 已连接到数据库')
    }
    fastify.log.info(fastify.printRoutes())
  })

  fastify.addHook('preHandler', function (req, reply, done) {
    if (req.body) {
      req.log.info({ body: req.body }, 'parsed body')
    }
    done()
  })

  fastify.addHook('onRequest', (req, reply, done) => {
    reply.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    done()
  })
}

export default app
export { app, options }
