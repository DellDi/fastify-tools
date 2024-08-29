import { createCipheriv, scryptSync, createDecipheriv } from 'node:crypto'

// 使用示例
const password = '0123456789012345' // 密码
const iv = '0123456789012345' // 偏移量

export function enCryptBase64(text: string): string {
  // 将密码转换为Buffer
  const key = scryptSync(password, Buffer.alloc(0), 32) // 使用空的盐值
  const ivBuffer = Buffer.from(iv, 'utf8') // 直接将IV视为普通字符串

  // 创建cipher对象
  const cipher = createCipheriv('aes-256-cbc', key, ivBuffer)

  // 执行加密操作
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  return encrypted
}

export function deCryptoBase64(encryptedText: string): string {
  // 将密码和偏移量转换为Buffer
  const key = scryptSync(password, Buffer.alloc(0), 32) // 使用空的盐值
  const ivBuffer = Buffer.from(iv, 'utf8')

  // 创建decipher对象
  const decipher = createDecipheriv('aes-256-cbc', key, ivBuffer)

  // 执行解密操作
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
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
