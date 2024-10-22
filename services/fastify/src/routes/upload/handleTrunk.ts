import path from 'node:path'
import { UPLOAD_DIR } from '../../utils/index.js'
import fs from 'node:fs'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function handleTrunk(req: FastifyRequest, reply: FastifyReply) {
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
