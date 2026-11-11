import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import fastifyMultipart from '@fastify/multipart'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { unzipSync } from 'fflate'
import { pagesDeploy } from '@/schema/pages/index.js'

const MAX_ZIP_SIZE = 50 * 1024 * 1024 // zip 上传上限 50MB
const MAX_FILES = 2000 // 单站文件数上限
const MAX_UNCOMPRESSED = 300 * 1024 * 1024 // 解压后总量上限 300MB
// DNS label 规则：小写字母数字开头结尾，中间可含连字符
const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/

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

      let entries: Record<string, Uint8Array>
      try {
        entries = unzipSync(new Uint8Array(buf))
      } catch {
        return reply.code(400).send({ error: '无法解析 zip 文件' })
      }

      // 过滤并校验 zip 内路径，防路径穿越
      const safe: Array<[string, Uint8Array]> = []
      let totalSize = 0
      for (const [rawName, content] of Object.entries(entries)) {
        const rel = rawName.replace(/\\/g, '/')
        if (rel.endsWith('/')) continue // 目录条目
        const norm = path.posix.normalize(rel)
        if (
          norm.startsWith('/') ||
          norm === '..' ||
          norm.startsWith('../') ||
          norm.includes('/../')
        ) {
          return reply
            .code(400)
            .send({ error: `zip 包含非法路径: ${rawName}` })
        }
        totalSize += content.byteLength
        if (totalSize > MAX_UNCOMPRESSED) {
          return reply.code(413).send({ error: '解压后总体积超出 300MB 上限' })
        }
        if (safe.length >= MAX_FILES) {
          return reply.code(400).send({ error: `zip 内文件数超出 ${MAX_FILES} 上限` })
        }
        safe.push([norm, content])
      }
      if (safe.length === 0) {
        return reply.code(400).send({ error: 'zip 内没有可部署的文件' })
      }

      // slug：表单字段指定则覆盖同名站点，否则随机生成
      const slugField = data.fields.slug
      const slugPart = Array.isArray(slugField) ? slugField[0] : slugField
      const slugValue = (slugPart as { value?: unknown } | undefined)?.value
      let slug = typeof slugValue === 'string' ? slugValue.trim() : ''
      if (slug && !SLUG_PATTERN.test(slug)) {
        return reply.code(400).send({ error: `slug 非法: ${slug}` })
      }
      if (!slug) {
        do {
          slug = crypto.randomBytes(4).toString('hex')
        } while (fs.existsSync(path.join(sitesDir, slug)))
      }

      const siteDir = path.join(sitesDir, slug)
      await fs.promises.rm(siteDir, { recursive: true, force: true })
      await fs.promises.mkdir(sitesDir, { recursive: true })
      for (const [rel, content] of safe) {
        const target = path.join(siteDir, rel)
        await fs.promises.mkdir(path.dirname(target), { recursive: true })
        await fs.promises.writeFile(target, content)
      }

      return {
        slug,
        url: `https://${slug}.${baseDomain}`,
        files: safe.length,
        hasIndexHtml: fs.existsSync(path.join(siteDir, 'index.html')),
      }
    },
  })
}

export default pages
