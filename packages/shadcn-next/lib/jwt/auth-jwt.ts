import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from '@/types/prisma'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret' // 强烈建议使用环境变量
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret' // 强烈建议使用环境变量

export const generateAccessToken = (user: User) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }) // Access Token 有效期 15 分钟
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }) // Refresh Token 有效期 7 天
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as User
  } catch (error) {
    return null
  }
}

export const getRefreshTokenFromCookies = () => {
  const cookieStore = cookies()
  return cookieStore.get('refreshToken')?.value
}

export const setRefreshTokenToCookies = (token: string) => {
  const cookieStore = cookies()
  cookieStore.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 仅在生产环境设置 Secure
    sameSite: 'strict', // 防止 CSRF 攻击
    path: '/', // Cookie 作用路径
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })
}

export const deleteRefreshTokenFromCookies = () => {
  const cookieStore = cookies()
  cookieStore.delete('refreshToken')
}
