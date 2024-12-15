// 导入crypto模块中的createCipheriv和createDecipheriv函数
import { createCipheriv, createDecipheriv } from 'node:crypto'
// 导入CryptoJS模块
import CryptoJS from 'crypto-js'

type modeKeyType = 'dec' | 'fatfs'

const keyModeType = {
  dec: '0123456789012345',
  fatfs: '01234567890123456789012345678901',
}

// 定义一个加密函数，将传入的字符串进行加密，并返回加密后的字符串
export const enCryptBase64 = (val: string, type: modeKeyType = 'dec'): string => {
  // 定义密钥
  const key = keyModeType[type]
  // 将密钥转换为Utf8编码
  const keyStr = CryptoJS.enc.Utf8.parse(key)
  // 将密钥转换为Utf8编码
  const iv = CryptoJS.enc.Utf8.parse(key)
  // 将传入的字符串转换为Utf8编码
  const srcs = CryptoJS.enc.Utf8.parse(val)
  // 使用AES加密算法，CBC模式和ZeroPadding填充方式对传入的字符串进行加密
  const encrypted = CryptoJS.AES.encrypt(srcs, keyStr, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })
  // 将加密后的字符串转换为Base64编码
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

export function aesDecrypt(ciphertext: string, type: modeKeyType): string {
  try {
    const key = keyModeType[type]
    const iv = '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    // Convert key and iv to WordArray format
    const keyWordArray = CryptoJS.enc.Utf8.parse(key)
    const ivWordArray = CryptoJS.enc.Latin1.parse(iv)

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    // Remove padding
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return 'null'
  }
}

// 定义一个解密函数，将传入的字符串进行解密，并返回解密后的字符串
export const deCryptoBase64 = (val: string, type: modeKeyType = 'dec'): string => {
  // 定义密钥
  const key = keyModeType[type]
  // 将密钥转换为Utf8编码
  const keyStr = CryptoJS.enc.Utf8.parse(key)
  // 将密钥转换为Utf8编码
  const iv = CryptoJS.enc.Utf8.parse(key)
  // 将传入的字符串转换为Base64编码
  const base64 = CryptoJS.enc.Base64.parse(val)
  // 将Base64编码的字符串转换为Utf8编码
  const src = CryptoJS.enc.Base64.stringify(base64)
  // 使用AES解密算法，CBC模式和ZeroPadding填充方式对传入的字符串进行解密
  const decrypt = CryptoJS.AES.decrypt(src, keyStr, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })
  // 将解密后的字符串转换为Utf8编码
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  // 返回解密后的字符串
  return decryptedStr.toString()
}
// 定义一个SQL密钥
const sqlKey = Buffer.from('WJ19938888', 'utf8')
.subarray(0, 16)
.toString('utf8')
.padEnd(16, '\0')

// 定义一个加密SQL函数，将传入的字符串进行加密，并返回加密后的字符串
export function encryptSQLOrigin(text: string): string {
  // 创建一个AES加密器
  const cipher = createCipheriv('aes-128-ecb', sqlKey, null)
  // 将传入的字符串进行加密，并转换为Base64编码
  let encrypted = cipher.update(text, 'utf8', 'base64')
  // 将加密后的字符串进行最终加密
  encrypted += cipher.final('base64')
  // 返回加密后的字符串
  return encrypted
}

// 定义一个解密SQL函数，将传入的字符串进行解密，并返回解密后的字符串
export function decryptSQLOrigin(encryptedBase64: string): string {
  // 创建一个AES解密器
  const decipher = createDecipheriv('aes-128-ecb', sqlKey, null)
  // 将传入的字符串进行解密，并转换为Utf8编码
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8')
  // 将解密后的字符串进行最终解密
  decrypted += decipher.final('utf8')
  // 返回解密后的字符串
  return decrypted
}
