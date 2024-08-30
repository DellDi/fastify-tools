import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

export function enCryptBase64(val: string): string {
  const key = '0123456789012345'
  const iv = '0123456789012345'

  const decipher = createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(val, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

export function deCryptoBase64(encryptedBase64: string): string {
  // 将密钥和 IV 转换为 Buffer
  const keyBuffer = Buffer.from('0123456789012345', 'utf-8')
  const ivBuffer = randomBytes(16) // 随机生成 IV，实际使用时应与加密时相同

  // 将 Base64 编码的字符串解码为 Buffer
  const encryptedBuffer = Buffer.from(encryptedBase64, 'base64')

  // 创建解密器
  const decipher = createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer)

  // 执行解密操作
  let decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ])

  // 去除 ZeroPadding
  // 从末尾开始查找第一个非 0 字节的位置
  let paddingStartIndex = decryptedBuffer.length
  for (let i = decryptedBuffer.length - 1; i >= 0; i--) {
    if (decryptedBuffer[i] !== 0) {
      paddingStartIndex = i + 1
      break
    }
  }
  // 截取去除填充后的 Buffer
  const unpaddedBuffer = decryptedBuffer.subarray(0, paddingStartIndex)
  // 将 Buffer 转换为字符串
  return unpaddedBuffer.toString('utf8')
}

const sqlKey = Buffer.from('WJ19938888', 'utf8')
  .subarray(0, 16)
  .toString('utf8')
  .padEnd(16, '\0')
// const sqlIv = Buffer.alloc(16, 0) // MySQL uses a zero IV for AES_ENCRYPT

export function encryptSQLOrigin(text: string): string {
  const cipher = createCipheriv('aes-128-ecb', sqlKey, null)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export function decryptSQLOrigin(encryptedBase64: string): string {
  const decipher = createDecipheriv('aes-128-ecb', sqlKey, null)
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
