/**
 * 分块上传工具函数
 * 支持大文件分块上传、进度监控
 */

import { fastifyFetch } from '../fetch/fastifyFetch'

/**
 * 计算文件的 SHA-256 哈希值
 * @param file 要计算哈希的文件
 * @returns 文件的哈希值
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (!e.target?.result) {
        resolve(Date.now().toString(16))
        return
      }
      
      const buffer = e.target.result as ArrayBuffer
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      resolve(hashHex)
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 将文件分割成多个块
 * @param file 要分割的文件
 * @param chunkSize 每个块的大小（字节）
 * @returns 文件块数组
 */
export function splitFileIntoChunks(file: File, chunkSize: number = 2 * 1024 * 1024): Blob[] {
  const chunks: Blob[] = []
  let start = 0
  
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
    start = end
  }
  
  return chunks
}

/**
 * 上传单个文件块
 * @param chunk 文件块
 * @param index 块索引
 * @param totalChunks 总块数
 * @param fileHash 文件哈希值
 * @param fileName 文件名
 * @returns 上传结果
 */
export async function uploadChunk(
  chunk: Blob, 
  index: number, 
  totalChunks: number, 
  fileHash: string, 
  fileName: string
): Promise<any> {
  const formData = new FormData()
  
  // 添加文件块 - 必须命名为 'file'
  formData.append('file', chunk, fileName)
  
  // 打印调试信息
  console.log(`上传分块 ${index + 1}/${totalChunks}, 文件哈希: ${fileHash}`)
  
  // 使用查询参数传递元数据，而不是表单字段
  // 这样可以避免 fastify-multipart 处理表单字段的复杂性
  return fastifyFetch(`/upload/chunk?chunkIndex=${index}&totalChunks=${totalChunks}&fileHash=${fileHash}`, {
    method: 'POST',
    body: formData
  })
}

/**
 * 上传大文件（分块上传）
 * @param file 要上传的文件
 * @param onProgress 进度回调函数
 * @param chunkSize 块大小（字节）
 * @returns 上传结果
 */
export async function uploadLargeFile(
  file: File, 
  onProgress?: (progress: number) => void, 
  chunkSize: number = 2 * 1024 * 1024
): Promise<any> {
  // 计算文件哈希
  const fileHash = await calculateFileHash(file)
  
  // 分割文件
  const chunks = splitFileIntoChunks(file, chunkSize)
  const totalChunks = chunks.length
  
  // 上传进度
  let uploadedChunks = 0
  
  // 串行上传所有块
  for (let i = 0; i < totalChunks; i++) {
    // 添加重试机制
    let retries = 0;
    const maxRetries = 3;
    let success = false;
    let result;
    
    while (!success && retries < maxRetries) {
      try {
        // 尝试上传分块
        result = await uploadChunk(chunks[i], i, totalChunks, fileHash, file.name);
        success = true;
        
        // 更新进度
        uploadedChunks++;
        if (onProgress) {
          onProgress((uploadedChunks / totalChunks) * 100);
        }
        
        // 输出调试信息
        console.log(`分块 ${i + 1}/${totalChunks} 上传成功:`, result);
      } catch (error) {
        retries++;
        console.error(`分块 ${i + 1}/${totalChunks} 上传失败 (尝试 ${retries}/${maxRetries}):`, error);
        
        if (retries >= maxRetries) {
          throw new Error(`分块 ${i + 1}/${totalChunks} 上传失败，已达到最大重试次数`);
        }
        
        // 等待一段时间再重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    // 如果是最后一个块，服务器会返回完整文件的信息
    if (result && result.fileUrl) {
      return result;
    }
  }
  
  throw new Error('文件上传失败')
}
