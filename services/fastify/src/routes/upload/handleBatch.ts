import path from 'node:path'
import { UPLOAD_DIR } from '../../utils/index.js'
import { pipeline } from 'node:stream'
import fs from 'node:fs'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ALLOWED_TYPES } from '../../utils/upload.js'

export async function handleBatch(req: FastifyRequest, reply: FastifyReply) {
  const parts = req.parts()

  const uploadedFiles = []
  for await (const part of parts) {
    if (part.type === 'file') {
      if (!ALLOWED_TYPES.includes(part.mimetype)) {
        continue // Skip files with disallowed types
      }

      const fileName = `${Date.now()}-${part.filename}`
      const filePath = path.join(UPLOAD_DIR, fileName)

      pipeline(part.file, fs.createWriteStream(filePath))

      uploadedFiles.push({
        originalName: part.filename,
        fileUrl: `/zuul/${fileName}`,
      })
    }
  }

  reply.code(200).send({
    message: 'Batch upload completed',
    uploadedFiles,
  })

}
