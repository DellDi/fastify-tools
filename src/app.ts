require('module-alias/register')
import * as path from 'path'
import { envConfig } from '../process.env.js'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'
import { fileURLToPath } from 'url'

// 先获得环境变量。

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
  })

  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true,
  })

  // define your routes in one of these
  void fastify.register(envConfig)
}

export default app
export { app, options }
