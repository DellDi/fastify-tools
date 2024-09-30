import { createCipheriv, createDecipheriv } from 'node:crypto'
import CryptoJS from 'crypto-js'

/**
 * Encrypt by Base64
 * @param val - The value to encrypt
 * @returns The encrypted string
 */
export const enCryptBase64 = (val: string): string => {
  const key = '0123456789012345'
  const keyStr = CryptoJS.enc.Utf8.parse(key)
  const iv = CryptoJS.enc.Utf8.parse(key)
  const srcs = CryptoJS.enc.Utf8.parse(val)

  const encrypted = CryptoJS.AES.encrypt(srcs, keyStr, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })
  const res = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  return res
}

/**
 * Decrypt by Base64
 * @param val - The value to decrypt
 * @returns The decrypted string
 */
export const deCryptoBase64 = (val: string): string => {
  const key = '0123456789012345'
  const keyStr = CryptoJS.enc.Utf8.parse(key)
  const iv = CryptoJS.enc.Utf8.parse(key)
  const base64 = CryptoJS.enc.Base64.parse(val)

  const src = CryptoJS.enc.Base64.stringify(base64)
  const decrypt = CryptoJS.AES.decrypt(src, keyStr, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })

  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
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
