'use server'

import { prisma } from '@/lib/prisma'
import { jwt } from '@/utils/auth/jwt'
import { z } from 'zod';

const emailSchema = z.string().email();

export async function sendEmailVerification(user: User) {
  await sendVerificationEmail({ user }, user.email, '123456')
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
        throw new Error('邮箱已被注册')
      } else { 
        throw new Error('邮箱未验证，请检查邮箱通过点击链接验证')
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
      throw new Error('邮箱格式不正确')
    }

    // 发送邮箱验证邮件
    sendEmailVerification(user)
    return user
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}