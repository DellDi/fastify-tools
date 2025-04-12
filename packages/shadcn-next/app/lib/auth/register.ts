'use server'

import { prisma } from '@/lib/prisma'
import { jwt } from '@/utils/auth/jwt'
import { z } from 'zod';
import { fetchFastifyApi } from '@/utils/fetch/fasifyFetch'
import { User } from '@/generated/client/index.js'

const emailSchema = z.string().email();

export async function sendEmailVerification(user: User, code: string) {
  const BASE_NEXT_API_URL = process.env.BASE_NEXT_API_URL || ''
  fetchFastifyApi('/email/send', {
    method: 'POST',
    body: JSON.stringify({ 
      email: user.email,
      templateName: 'register-confirmation',
      variables: {
        Email: user.email,
        ConfirmationURL: `${BASE_NEXT_API_URL}/api/auth/verify?code=${code}`,
        SiteURL: `${BASE_NEXT_API_URL}`,
      },
    }),
  })
}

export const errorMessagesCodeMap = {
  EMAIL_FORMAT_INVALID: {
    message: '邮箱格式不正确',
    code: 'EMAIL_FORMAT_INVALID'
  },
  EMAIL_EXISTS: {
    message: '邮箱已被注册',
    code: 'EMAIL_EXISTS'
  },
  EMAIL_NOT_VERIFIED: {
    message: '邮箱未验证，请检查邮箱通过点击链接验证',
    code: 'EMAIL_NOT_VERIFIED'
  },
  EMAIL_VERIFICATION_EXPIRED: {
    message: '邮箱验证已过期，请重新验证',
    code: 'EMAIL_VERIFICATION_EXPIRED'
  },
}

export async function registerUser(params: { username: string; email: string; password: string }) {
  try {
    const { username, email, password } = params
    const encryptedPassword = jwt.encrypt(password)

    // 验证邮箱是否已注册
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })
    if (existingUser) {
      // 待验证
      if (existingUser.emailConfirmedAt) {
        throw new Error(errorMessagesCodeMap.EMAIL_EXISTS.code)
      }
      // 检查验证码是否过期
      const verificationData = await prisma.verificationCode.findFirst({
        where: { userId: existingUser.id },
      })
      if (!verificationData) {
        throw new Error(errorMessagesCodeMap.EMAIL_NOT_VERIFIED.code)
      }
      if (new Date() > new Date(verificationData.expiresAt)) {
        throw new Error(errorMessagesCodeMap.EMAIL_VERIFICATION_EXPIRED.code)
      }

    }
    
    // 注册账号、但未验证邮箱、未设置角色
    const user = await prisma.user.create({
      data: {
        username,
        email,
        encryptedPassword,
      },
    })

    // 验证邮箱是否合规
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      throw new Error(errorMessagesCodeMap.EMAIL_FORMAT_INVALID.code)
    }
    
    // 生成6位随机验证码
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString()

    // 创建验证码
    await prisma.verificationCode.create({
      data: { 
        userId: user.id,
        code: randomCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    })
    
    // 发送邮箱验证邮件
    sendEmailVerification(user, randomCode)
    return user
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}