'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod';
import { errorMessagesCodeMap } from '@/types/email'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch';
import crypto from 'crypto';
import { hashPasswordWithSaltCrypto } from '@/utils/auth/password';

const emailSchema = z.string().email();

export async function sendEmailVerification(email: string) {
  // 生成6位随机验证码
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString()

  const SITE_DOMAIN_URL = process.env.SITE_DOMAIN_URL || 'http://localhost:3001'
  const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
  await fastifyFetch('/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      templateName: 'register-confirmation',
      variables: {
        Email: email,
        ConfirmationURL: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}/auth?code=${randomCode}&email=${email}`,
        SiteURL: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}`,
      },
    }),
  })

  return { code: randomCode }
}

const INITIAL_PASSWORD = process.env.INITIAL_USER_PASSWORD || '123456'

export async function registerUser(params: { username: string; email: string; phoneNumber: string; }) {
  try {
    const { username, email, phoneNumber } = params

    // 验证邮箱是否合规
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      throw new Error(errorMessagesCodeMap.EMAIL_FORMAT_INVALID.code)
    }

    const { salt, hash } = hashPasswordWithSaltCrypto(INITIAL_PASSWORD)

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

    // 发送邮箱验证邮件
    const verificationCode = await sendEmailVerification(email)

    // 注册账号、但未验证邮箱、未设置角色
    const user = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        encryptedPassword: hash,
        rawUserMetaData: {
          salt,
        },
      },
    })

    // 创建验证码
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode.code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    })

    return { user, verificationCode }
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}