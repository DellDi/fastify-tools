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
  opts,
): Promise<void> => {

  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
    ignoreFilter: (path) => {
      return path.includes('test')
    }
  })

  // 加载所有路由
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true,
    routeParams: true,
  })

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
      'GET, POST, PUT, DELETE, OPTIONS',
    )
    done()
  })

}

export default app
export { app, options }
