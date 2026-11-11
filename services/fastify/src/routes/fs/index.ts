import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import fastifyMultipart from '@fastify/multipart'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { spawn } from 'node:child_process'
import { mkdir, rename, rm, stat } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import {
  FsDeleteSchema,
  FsDuSchema,
  FsListSchema,
  FsMkdirSchema,
  FsMoveSchema,
  FsReadSchema,
  FsRenameSchema,
  FsSearchSchema,
  FsUploadSchema,
} from '@/schema/fs/index.js'
import { FsError, fsErrorToHttp, HOST_ROOT, resolveHost } from '@/utils/fs-safe.js'
import {
  duTree,
  fileStream,
  imageMimeOf,
  listDir,
  readFileChunk,
  searchFiles,
} from '@/utils/fs-ops.js'

const fsRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([fastify.config.BEARER_TOKEN]),
    })
    .register(fastifyMultipart, {
      limits: { files: 5, fileSize: 512 * 1024 ** 2 },
    })

  const guard = { preHandler: fastify.verifyBearerAuth }

  // 错误统一出口：FsError 自带 statusCode，errno 兜底
  fastify.setErrorHandler((err, _req, reply) => {
    const { statusCode, message } = fsErrorToHttp(err)
    void reply.code(statusCode).send({ message })
  })

  const toHostPath = (p: string) => p.slice(HOST_ROOT.length) || '/'
  const toAbs = (hostPath: string) => HOST_ROOT + (hostPath === '/' ? '' : hostPath)

  // ---------- 读侧（全盘只读） ----------

  fastify.get('/list', {
    schema: FsListSchema,
    ...guard,
    handler: async (req) => {
      const { path: p } = req.query as { path: string }
      const r = await resolveHost(toAbs(p))
      return { path: r.hostPath, writable: r.writable, entries: await listDir(r.abs) }
    },
  })

  fastify.get('/read', {
    schema: FsReadSchema,
    ...guard,
    handler: async (req) => {
      const { path: p, offset = 0, limit } = req.query as {
        path: string
        offset?: number
        limit?: number
      }
      const r = await resolveHost(toAbs(p))
      return readFileChunk(r.abs, offset, limit)
    },
  })

  // 图片/原始流（预览 img src 与文件下载共用底层，下载走 /download 带 disposition）
  fastify.get('/raw', {
    ...guard,
    handler: async (req, reply) => {
      const { path: p } = req.query as { path: string }
      const r = await resolveHost(toAbs(p))
      const st = await stat(r.abs)
      if (st.isDirectory()) return reply.code(400).send({ message: '目录请用 /download' })
      return reply
        .header('Content-Type', imageMimeOf(r.abs) ?? 'application/octet-stream')
        .header('Content-Length', st.size)
        .send(fileStream(r.abs))
    },
  })

  fastify.get('/download', {
    ...guard,
    handler: async (req, reply) => {
      const { path: p } = req.query as { path: string }
      const r = await resolveHost(toAbs(p))
      const st = await stat(r.abs)
      const name = path.posix.basename(r.abs) || 'root'
      if (st.isDirectory()) {
        // 目录打包 tar.gz 流式返回
        const tar = spawn('tar', ['-czf', '-', '-C', path.posix.dirname(r.abs), name])
        tar.stderr.resume()
        return reply
          .header('Content-Type', 'application/gzip')
          .header('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}.tar.gz"`)
          .send(tar.stdout)
      }
      return reply
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}"`)
        .header('Content-Length', st.size)
        .send(fileStream(r.abs))
    },
  })

  fastify.get('/search', {
    schema: FsSearchSchema,
    ...guard,
    handler: async (req) => {
      const { path: p, name, content, depth, limit } = req.query as {
        path: string
        name?: string
        content?: string
        depth?: number
        limit?: number
      }
      if (!name && !content) return { hits: [], truncated: false, timedOut: false }
      const r = await resolveHost(toAbs(p))
      const res = await searchFiles({ root: r.abs, name, content, depth, limit })
      return { ...res, hits: res.hits.map((h) => ({ ...h, path: toHostPath(h.path) })) }
    },
  })

  fastify.get('/du', {
    schema: FsDuSchema,
    ...guard,
    handler: async (req) => {
      const { path: p, depth = 2 } = req.query as { path: string; depth?: number }
      const r = await resolveHost(toAbs(p))
      const { root, truncated } = await duTree(r.abs, depth)
      const strip = (n: typeof root): typeof root => ({
        ...n,
        path: toHostPath(n.path),
        children: n.children?.map(strip),
      })
      return { root: strip(root), truncated }
    },
  })

  // ---------- 写侧（仅 /opt、/srv 白名单） ----------

  fastify.post('/mkdir', {
    schema: FsMkdirSchema,
    ...guard,
    handler: async (req) => {
      const { path: p } = req.body as { path: string }
      const r = await resolveHost(toAbs(p), true)
      await mkdir(r.abs, { recursive: true })
      return { ok: true }
    },
  })

  fastify.post('/rename', {
    schema: FsRenameSchema,
    ...guard,
    handler: async (req) => {
      const { path: p, newName } = req.body as { path: string; newName: string }
      if (!newName || newName.includes('/') || newName === '.' || newName === '..') {
        throw new FsError('非法文件名', 400)
      }
      const src = await resolveHost(toAbs(p), true)
      const dst = await resolveHost(toAbs(path.posix.join(path.posix.dirname(src.hostPath), newName)), true)
      await rename(src.abs, dst.abs)
      return { ok: true }
    },
  })

  fastify.post('/move', {
    schema: FsMoveSchema,
    ...guard,
    handler: async (req) => {
      const { src, dest } = req.body as { src: string; dest: string }
      const s = await resolveHost(toAbs(src), true)
      const dDir = await resolveHost(toAbs(dest), true)
      const d = await resolveHost(
        toAbs(path.posix.join(dDir.hostPath, path.posix.basename(s.abs))),
        true
      )
      await rename(s.abs, d.abs)
      return { ok: true }
    },
  })

  fastify.delete('/', {
    schema: FsDeleteSchema,
    ...guard,
    handler: async (req) => {
      const { path: p, confirm, recursive = false } = req.query as {
        path: string
        confirm: boolean
        recursive?: boolean
      }
      if (!confirm) throw new FsError('需 confirm=true 二次确认', 400)
      const r = await resolveHost(toAbs(p), true)
      const st = await stat(r.abs)
      if (st.isDirectory() && !recursive) throw new FsError('目录删除需 recursive=true', 400)
      await rm(r.abs, { recursive, force: true })
      return { ok: true }
    },
  })

  fastify.post('/upload', {
    schema: FsUploadSchema,
    ...guard,
    handler: async (req) => {
      const { path: p } = req.query as { path: string }
      const dir = await resolveHost(toAbs(p), true)
      const saved: string[] = []
      for await (const file of req.files()) {
        const target = await resolveHost(toAbs(path.posix.join(dir.hostPath, file.filename)), true)
        await pipeline(file.file, createWriteStream(target.abs))
        saved.push(target.hostPath)
      }
      if (!saved.length) throw new FsError('未收到文件（字段名 file）', 400)
      return { ok: true, files: saved }
    },
  })
}

export default fsRoutes
