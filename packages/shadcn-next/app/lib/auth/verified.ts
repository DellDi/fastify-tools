'use server'

import { prisma } from '@/lib/prisma'
import { errorMessagesCodeMap } from '@/types/email'
import { sendEmailVerification } from './register'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function verifyMagicLink(code: string, email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  })
  if (!user) {
    throw new Error(errorMessagesCodeMap.EMAIL_NOT_VERIFIED.code)
  }
  if (user.emailConfirmedAt) {
    throw new Error(errorMessagesCodeMap.EMAIL_ALREADY_VERIFIED.code)
  }
  const verificationData = await prisma.verificationCode.findFirst({
    where: { userId: user.id },
  })
  if (!verificationData) {
    throw new Error(errorMessagesCodeMap.EMAIL_NOT_VERIFIED.code)
  }
  if (verificationData.code !== code || new Date() > new Date(verificationData.expiresAt)) {
    throw new Error(errorMessagesCodeMap.EMAIL_VERIFICATION_EXPIRED.code)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailConfirmedAt: new Date() },
  })

  return user
}


export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  })
  if (!user) {
    throw new Error(errorMessagesCodeMap.USER_NOT_FOUND.code)
  }
  if (user.emailConfirmedAt) {
    throw new Error(errorMessagesCodeMap.EMAIL_ALREADY_VERIFIED.code)
  }
  const verificationData = await prisma.verificationCode.findFirst({
    where: { userId: user.id },
  })
  if (!verificationData) {
    throw new Error(errorMessagesCodeMap.EMAIL_NOT_VERIFIED.code)
  }
  await sendEmailVerification(email)

  return user
}


const sendEmailCode = async (userId: string, email: string) => {
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
  const SITE_DOMAIN_URL = process.env.SITE_DOMAIN_URL || 'http://localhost:3001'
  const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const verificationData = await prisma.verificationCode.findFirst({
    where: { userId },
  })

  // 如果验证码存在且未过期，则不发送
  if (verificationData && Date.now() - new Date(verificationData.expiresAt).getTime() < 5 * 60 * 1000) {
    throw new Error(errorMessagesCodeMap.EMAIL_VERIFICATION_EXPIRED.code)
  }

  // 事务
  await prisma.$transaction(async (tx) => {
    await tx.verificationCode.create({
      data: {
        userId,
        code: randomCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    })

    await fastifyFetch('/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        templateName: 'edit-password',
        variables: {
          Email: email,
          Code: randomCode,
          SiteURL: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}`,
          SiteName: 'DellDi的邮箱服务',
          SupportEmail: 'delldi808611@outlook.com',
        },
      }),
    })
  })

  return randomCode
}

export async function sendVerificationEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  })
  if (!user) {
    throw new Error(errorMessagesCodeMap.USER_NOT_FOUND.code)
  }
  const randomCode = await sendEmailCode(user.id, email)

  return { user, randomCode }
}
