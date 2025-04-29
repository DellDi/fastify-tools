import path from 'node:path'
import { UPLOAD_DIR } from '../../utils/index.js'
import { pipeline } from 'node:stream/promises' // 使用 promises 版本的 pipeline
import fs from 'node:fs'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ALLOWED_TYPES } from '../../utils/upload.js'

export async function handleBatch(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parts = req.parts()
    const uploadedFiles = []
    let fileCount = 0
    const processingTimeout = setTimeout(() => {
      if (fileCount === 0) {
        // 如果超时且没有处理任何文件，返回错误
        reply.code(400).send({
          error: '上传超时或未接收到文件',
        })
      }
    }, 10000) // 10秒超时

    for await (const part of parts) {
      if (part.type === 'file') {
        fileCount++
        if (!ALLOWED_TYPES.includes(part.mimetype)) {
          continue // Skip files with disallowed types
        }

        const fileName = `${Date.now()}-${part.filename}`
        const filePath = path.join(UPLOAD_DIR, fileName)

        try {
          // 使用 await 等待 pipeline 完成，并添加超时处理
          await Promise.race([
            pipeline(part.file, fs.createWriteStream(filePath)),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('文件写入超时')), 30000)
            )
          ])

          uploadedFiles.push({
            originalName: part.filename,
            fileUrl: `/zuul/${fileName}`,
          })
        } catch (err) {
          // 处理单个文件上传失败
          console.error(`文件 ${part.filename} 上传失败:`, err)
          // 尝试清理部分写入的文件
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }
      }
    }

    clearTimeout(processingTimeout)

    // 即使没有文件上传成功，也返回200状态码，但uploadedFiles为空数组
    reply.code(200).send({
      message: fileCount > 0 ? 'Batch upload completed' : 'No valid files uploaded',
      uploadedFiles,
    })
  } catch (error) {
    console.error('批量上传处理错误:', error)
    reply.code(500).send({
      error: '服务器处理上传请求时发生错误',
    })
  }
}
