import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import fastifyMultipart from '@fastify/multipart'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { pagesDeploy, pagesList, pagesDelete } from '@/schema/pages/index.js'
import {
  deploySiteZip,
  listSites,
  deleteSite,
  appendDeployLog,
  readDeployLog,
} from '@/utils/pages.js'
import { AppError } from '@/utils/errors.js'

const MAX_ZIP_SIZE = 50 * 1024 * 1024 // zip 上传上限 50MB

const pages: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const sitesDir = fastify.config.PAGES_SITES_DIR || '/srv/pages-sites'
  const baseDomain = fastify.config.PAGES_BASE_DOMAIN || 'pages.delldiagi.top'

  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([fastify.config.BEARER_TOKEN]),
    })

  fastify.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: MAX_ZIP_SIZE,
    },
  })

  // 站点列表 + 审计日志
  fastify.get('', {
    schema: pagesList,
    preHandler: fastify.verifyBearerAuth,
    handler: async () => {
      const [sites, logs] = await Promise.all([
        listSites(sitesDir),
        readDeployLog(sitesDir),
      ])
      return {
        sites: sites.map((s) => ({
          ...s,
          url: `https://${s.slug}.${baseDomain}`,
        })),
        logs,
      }
    },
  })

  fastify.post('/deploy', {
    schema: pagesDeploy,
    preHandler: fastify.verifyBearerAuth,
    handler: async (req, reply) => {
      const data = await req.file()
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }

      const buf = await data.toBuffer()
      if (data.file.truncated) {
        return reply.code(413).send({ error: 'zip 超出 50MB 上限' })
      }

      // slug：表单字段指定则覆盖同名站点，否则随机生成
      const slugField = data.fields.slug
      const slugPart = Array.isArray(slugField) ? slugField[0] : slugField
      const slugValue = (slugPart as { value?: unknown } | undefined)?.value
      const slug = typeof slugValue === 'string' ? slugValue : undefined

      try {
        const result = await deploySiteZip(buf, sitesDir, slug)
        await appendDeployLog(sitesDir, {
          action: 'deploy',
          slug: result.slug,
          files: result.files,
          sizeBytes: buf.length,
          ip: req.ip,
          via: 'http',
        })
        return {
          ...result,
          url: `https://${result.slug}.${baseDomain}`,
        }
      } catch (err) {
        if (err instanceof AppError) {
          return reply.code(err.statusCode).send({ error: err.message })
        }
        throw err
      }
    },
  })

  // 删除站点
  fastify.delete('/:slug', {
    schema: pagesDelete,
    preHandler: fastify.verifyBearerAuth,
    handler: async (req, reply) => {
      const { slug } = req.params as { slug: string }
      try {
        const deleted = await deleteSite(sitesDir, slug)
        if (!deleted) {
          return reply.code(404).send({ error: `站点不存在: ${slug}` })
        }
        await appendDeployLog(sitesDir, {
          action: 'delete',
          slug,
          ip: req.ip,
          via: 'http',
        })
        return { deleted: true, slug }
      } catch (err) {
        if (err instanceof AppError) {
          return reply.code(err.statusCode).send({ error: err.message })
        }
        throw err
      }
    },
  })
}

export default pages
