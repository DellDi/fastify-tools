'use server'

import { prisma } from '@/lib/prisma'
import { errorMessagesCodeMap } from '@/types/email'
import { sendEmailVerification } from './register'

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