import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { chunkUpload, singleUpload, uploadBase, uploadBatch } from '@/schema/upload/index.js'
import { UPLOAD_DIR } from '../../utils/index.js'
import cors from '@fastify/cors'
import { handleBatch } from './handleBatch.js'
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '../../utils/upload.js'
import { handleTrunk } from './handleTrunk.js'

const upload: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  fastify.register(cors, {
      origin: ['http://localhost:3001', 'http://localhost:3000'], // Allow requests from this origin
      methods: ['POST'], // Allow these methods
    },
  )

  // Serve static files  this /upload/static/
  fastify.register(fastifyStatic, {
    root: UPLOAD_DIR,
    prefix: '/static/',
  })

  fastify.get('', {
    schema: uploadBase,
    async handler(req, reply) {
      const { hashId } = req.query
      if (hashId) {
        // 遍历读取UPLOAD_DIR文件夹中的所有文件名
        const files = fs.readdirSync(UPLOAD_DIR)
        const fileName = files.find((s) => s.includes(hashId))
        // return reply.sendFile(`${fileName}`)
        return reply.download(`${fileName}`, `${(fileName || '').split('-')[1]}`)

      } else {
        return reply.code(400).send({
          msg: `未找到支持的${hashId}`,
        })
      }
    },
  })

  // Register multipart plugin
  fastify.register(fastifyMultipart, {
    limits: {
      files: 3,
      fileSize: MAX_FILE_SIZE,
    },
  })

  fastify.post(
    '/single',
    {
      schema: singleUpload,
    },
    async function (req, reply) {
      const data = await req.file()

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }
      if (!ALLOWED_TYPES.includes(data.mimetype)) {
        return reply.code(400).send({ error: 'File type not allowed' })
      }
      // 新增秒传的逻辑
      const hashes = data.filename.split('-')
      const orgHash = hashes[0] as string
      const fileNameList = fs.readdirSync(UPLOAD_DIR)
      const fileFullName = fileNameList.find(a => a.includes(orgHash))
      console.log("🚀 ~ fileFullName:", fileFullName)
      if (fileFullName) {
        return reply.code(200).send({
          message: 'one second File uploaded successfully',
          fileUrl: `/zuul/${fileFullName}`,
          fileHash: orgHash,
        })
      }

      const hash = crypto.createHash('sha256')
      const chunks: Buffer[] = []
      let size = 0

      for await (const chunk of data.file) {
        chunks.push(chunk)
        hash.update(chunk)
        size += chunk.length

        if (size > MAX_FILE_SIZE) {
          return reply.code(413).send({ error: 'File too large' })
        }
      }

      const fileHash = hash.digest('hex')
      const fileName = `${fileHash}-${data.filename}`
      const filePath = path.join(UPLOAD_DIR, fileName)
      await fs.promises.writeFile(filePath, Buffer.concat(chunks))

      const fileUrl = `/zuul/${fileName}`

      return {
        message: 'File uploaded successfully',
        fileUrl,
        fileHash,
      }
    },
  )

  // Register batch upload handler
  fastify.post('/batch', {
    schema: uploadBatch,
    handler: handleBatch,
  })

  fastify.post(
    '/chunk',
    {
      schema: chunkUpload,
    },
    handleTrunk,
  )

}

export default upload
