import path from 'node:path'
import { UPLOAD_DIR } from '../../utils/index.js'
import fs from 'node:fs'
import { FastifyReply, FastifyRequest } from 'fastify'
// 注意：我们直接使用 FastifyRequest 和 data.fields，不需要显式导入 MultipartFile

export async function handleTrunk(req: FastifyRequest, reply: FastifyReply) {
  // 从查询参数中获取元数据
  const query = req.query as Record<string, string>
  console.log('Chunk upload query:', query)
  
  // 获取文件块
  const data = await req.file()

  if (!data) {
    return reply.code(400).send({ error: 'No file chunk uploaded' })
  }
  
  console.log('Chunk upload file:', data.filename)

  // 从查询参数中提取必要的字段
  const chunkIndex = query.chunkIndex
  const totalChunks = query.totalChunks
  const fileHash = query.fileHash
  
  // 验证必要的字段
  if (!chunkIndex || !totalChunks || !fileHash) {
    return reply.code(400).send({ 
      error: 'Missing required fields in query parameters', 
      received: { chunkIndex, totalChunks, fileHash },
      query
    })
  }
  const chunkDir = path.join(UPLOAD_DIR, fileHash)
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true })
  }

  const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`)
  await fs.promises.writeFile(chunkPath, await data.toBuffer())

  if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
    // 所有分块已收到，开始合并
    console.log(`开始合并文件分块，总分块数: ${totalChunks}`)
    
    try {
      const fileName = `${fileHash}-${data.filename}`
      const filePath = path.join(UPLOAD_DIR, fileName)
      
      // 使用流式处理，减少内存使用
      const writeStream = fs.createWriteStream(filePath)
      
      // 异步处理每个分块，使用 Promise 确保写入完成
      const writePromise = new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => {
          console.log(`文件合并完成: ${fileName}`)
          resolve()
        })
        writeStream.on('error', (err) => {
          console.error(`文件合并错误:`, err)
          reject(err)
        })
      })
      
      // 使用流式处理每个分块
      for (let i = 0; i < parseInt(totalChunks); i++) {
        const chunkPath = path.join(chunkDir, `chunk-${i}`)
        if (fs.existsSync(chunkPath)) {
          const chunkBuffer = await fs.promises.readFile(chunkPath)
          // 检查是否可以继续写入
          const canContinue = writeStream.write(chunkBuffer)
          if (!canContinue) {
            // 如果缓冲区满，等待 'drain' 事件
            await new Promise<void>(resolve => writeStream.once('drain', resolve))
          }
        } else {
          console.warn(`分块文件不存在: ${chunkPath}`)
        }
      }
      
      // 结束写入流
      writeStream.end()
      
      // 等待写入完成
      await writePromise
      
      // 清理分块目录
      await fs.promises.rm(chunkDir, { recursive: true, force: true })
      
      const fileUrl = `/zuul/${fileName}`
      return {
        message: 'File uploaded successfully',
        fileUrl,
        fileHash,
      }
    } catch (error) {
      console.error('合并文件分块时出错:', error)
      return reply.code(500).send({
        error: '合并文件分块时出错',
        message: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  return { message: 'Chunk uploaded successfully' }
}
