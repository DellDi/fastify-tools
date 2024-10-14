import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pipeline } from 'node:stream'
import { chunkUpload, singleUpload, uploadBase, uploadBatch, } from '../../schema/upload.js'
import { UPLOAD_DIR } from "../../utils/index.js";
import cors from "@fastify/cors";

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  // 视频
  'video/mpeg',
  'video/mp4',
  // 音频
  'audio/mpeg',
  'audio/mp3',
  // dmg
  'application/x-apple-diskimage',
  'application/ppt',
  'application/pdf',
  'application/x-msdos-program',
]
const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  fastify.register(cors, {
        origin: ['http://localhost:3001', 'http://localhost:3000'], // Allow requests from this origin
        // methods: ['GET', 'POST'], // Allow these methods
        credentials: true, // Enable cookies
      }
  )

  // Serve static files  this /upload/static/
  fastify.register(fastifyStatic, {
    root: UPLOAD_DIR,
    prefix: '/static/'
  })

  fastify.withTypeProvider<TypeBoxTypeProvider>().get('', {
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
    // attachFieldsToBody: true,
    // sharedSchemaId: '#mySharedSchema',
    limits: {
      files: 3,
      fileSize: MAX_FILE_SIZE,
    },
  })

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
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
        // const orgHash = hashes[0] as string;
        // const fileNameList = fs.readdirSync(UPLOAD_DIR)
        // console.log("🚀 ~ file:index.ts, line:93-----", fileNameList)
        // const fileFullName = fileNameList.find(a => a.includes(orgHash))
        // if (fileFullName) {
        //     return reply.code(200).send({
        //         message: 'one second File uploaded successfully',
        //         fileUrl: `/zuul/${fileFullName}`,
        //         fileHash: orgHash
        //     })
        // }

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
      }
  )

  fastify.post(
      '/chunk',
      {
        schema: chunkUpload,
      },
      async function (req, reply) {
        const data = await req.file()

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

          const fileUrl = `/zuul/${fileName}`
          return {
            message: 'File uploaded successfully',
            fileUrl,
            fileHash,
          }
        }

        return { message: 'Chunk uploaded successfully' }
      }
  )

  fastify.post('/batch', {
    schema: uploadBatch,
    handler: async function (req: FastifyRequest, reply) {
      const parts = req.parts()
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
            fileUrl: `/zuul/${fileName}`,
          })
        }
      }

      return {
        message: 'Batch upload completed',
        uploadedFiles,
      }
    },
  })


}

export default upload
