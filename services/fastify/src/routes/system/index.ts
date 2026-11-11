import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { SystemHistorySchema, SystemStatusSchema } from '@/schema/system/index.js'
import {
  getLatestStatus,
  getStatusHistory,
  getSystemStatus,
  startSystemSampler,
  stopSystemSampler,
  StatusOptions,
} from '@/utils/system.js'

const system: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([fastify.config.BEARER_TOKEN]),
    })

  const opts: StatusOptions = {
    diskPath: fastify.config.PAGES_SITES_DIR || '/srv/pages-sites',
    prisma: fastify.prisma,
    baseDomain: fastify.config.PAGES_BASE_DOMAIN || 'pages.delldiagi.top',
  }

  // 30s 内存环形采样，/status 读快照、/history 读序列；模块单例防重复
  startSystemSampler(opts)
  fastify.addHook('onClose', async () => stopSystemSampler())

  // 宿主机实时状态：CPU / 内存 / 磁盘 / 运行时长 + 业务库体积
  fastify.get('/status', {
    schema: SystemStatusSchema,
    preHandler: fastify.verifyBearerAuth,
    handler: async () => getLatestStatus() ?? getSystemStatus(opts),
  })

  // 采样历史（环形缓冲，重启清空）
  fastify.get('/history', {
    schema: SystemHistorySchema,
    preHandler: fastify.verifyBearerAuth,
    handler: async (req) => {
      const { hours = 24 } = req.query as { hours?: number }
      return { samples: getStatusHistory(hours) }
    },
  })
}

export default system
