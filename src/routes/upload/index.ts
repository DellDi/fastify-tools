import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pipeline } from 'node:stream'
import { fileURLToPath } from 'node:url'
import {
  multipleUpload,
  singleUpload,
  uploadBatch,
} from '../../schema/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOAD_DIR = path.join(__dirname, '..', 'public')
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/ppt',
  'application/pdf',
]
const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Register multipart plugin
  fastify.register(fastifyMultipart, {
    limits: {
      fieldSize: MAX_FILE_SIZE,
    },
  })

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  fastify.get('/', {
    schema: {
        tags: ['upload'],
      },
    },async function (request, reply) {
    let params = request.headers
    return {
      root: params,
    }
  })

  fastify.post(
    '/upload',
    {
      schema: singleUpload,
    },
    async function (request: FastifyRequest, reply) {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }

      if (!ALLOWED_TYPES.includes(data.mimetype)) {
        return reply.code(400).send({ error: 'File type not allowed' })
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

      const fileUrl = `/static/${fileName}`

      return {
        message: 'File uploaded successfully',
        fileUrl,
        fileHash,
      }
    }
  )

  fastify.post(
    '/upload/chunk',
    {
      schema: multipleUpload,
    },
    async function (request: FastifyRequest, reply) {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'No file chunk uploaded' })
      }

      const { chunkIndex, totalChunks, fileHash } = data.fields as any

      const chunkDir = path.join(UPLOAD_DIR, fileHash)
      if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir, { recursive: true })
      }

      const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`)
      await fs.promises.writeFile(chunkPath, await data.toBuffer())

      if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
        // All chunks received, merge them
        const fileName = `${fileHash}-${data.filename}`
        const filePath = path.join(UPLOAD_DIR, fileName)
        const writeStream = fs.createWriteStream(filePath)

        for (let i = 0; i < parseInt(totalChunks); i++) {
          const chunkPath = path.join(chunkDir, `chunk-${i}`)
          const chunkBuffer = await fs.promises.readFile(chunkPath)
          writeStream.write(chunkBuffer)
        }

        writeStream.end()

        // Clean up chunk directory
        await fs.promises.rm(chunkDir, { recursive: true, force: true })

        const fileUrl = `/static/${fileName}`
        return {
          message: 'File uploaded successfully',
          fileUrl,
          fileHash,
        }
      }

      return { message: 'Chunk uploaded successfully' }
    }
  )

  fastify.post('/upload/batch', {
    schema: uploadBatch,
    handler: async function (request: FastifyRequest, reply) {
      const parts = request.parts()
      const uploadedFiles = []

      for await (const part of parts) {
        if (part.type === 'file') {
          if (!ALLOWED_TYPES.includes(part.mimetype)) {
            continue // Skip files with disallowed types
          }

          const fileName = `${Date.now()}-${part.filename}`
          const filePath = path.join(UPLOAD_DIR, fileName)

          await pipeline(part.file, fs.createWriteStream(filePath))

          uploadedFiles.push({
            originalName: part.filename,
            fileUrl: `/static/${fileName}`,
          })
        }
      }

      return {
        message: 'Batch upload completed',
        uploadedFiles,
      }
    },
  })

  // Serve static files
  fastify.register(fastifyStatic, {
    root: UPLOAD_DIR,
    // prefix: '/',
    constraints: {
      host: '127.0.0.1',
    },
  })
}

export default upload