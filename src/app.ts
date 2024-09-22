import * as path from 'path'
import process from 'node:process'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {} & Partial<AutoloadPluginOptions>

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
  })

  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true,
    routeParams: true,
  })

  await fastify.ready((err) => {
    if (err) throw err
    // 现在可以调用 .swagger() 方法
  })

  fastify.log.info('Something important happened!')
  fastify.log.info('process', JSON.stringify(process.env))

  fastify.addHook('preHandler', function (req, reply, done) {
    if (req.body) {
      req.log.info({ body: req.body }, 'parsed body')
    }
    done()
  })

  fastify.addHook('onRequest', (req, reply, done) => {
    // reply.header('Access-Control-Allow-Origin', '*')
    // reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    reply.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    done()
  })
}

export default app
export { app, options }
