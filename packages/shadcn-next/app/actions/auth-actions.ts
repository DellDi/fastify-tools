'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyPasswordCrypto } from '@/utils/auth/password'
import { jwt } from '@/utils/auth/jwt'
import { z } from 'zod'

export type LoginState = {
  success: boolean
  message: string
} | null

const UserMetaSchema = z.object({
  salt: z.string(),
})

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return '/dashboard'

  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//')) return '/dashboard'
  if (path === '/login' || path.startsWith('/login?')) return '/dashboard'

  return path
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = getSafeRedirectPath(formData.get('redirectTo'))

  // 验证凭据
  const user = await prisma.user.findFirst({
    where: { email },
  })

  if (!user) {
    return { success: false, message: '账号未注册' }
  }

  if (!user.encryptedPassword) {
    return { success: false, message: '账号未通过验证' }
  }

  const parseResult = UserMetaSchema.safeParse(user.rawUserMetaData)
  if (!parseResult.success) {
    return { success: false, message: '用户数据格式不正确' }
  }

  const { salt } = parseResult.data

  if (!salt) {
    return { success: false, message: '用户数据不完整，请联系管理员' }
  }

  const isPasswordValid = verifyPasswordCrypto(password, salt, user.encryptedPassword)

  if (!isPasswordValid) {
    return { success: false, message: '密码错误' }
  }

  // 生成 JWT token
  const token = jwt.generateToken(user)

  // 记录登录日志
  try {
    await prisma.$transaction(async (tx) => {
      await tx.loginLog.create({
        data: {
          userId: user.id,
          ipAddress: '',
          userAgent: '',
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: { lastSignInAt: new Date() },
      })
    })
  } catch (error) {
    console.error('Login log error:', error)
    // 日志写入失败不影响登录流程
  }

  // 在服务端设置 cookie
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()
  cookieStore.set('auth_token', String(token), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })

  // 服务端重定向 — 不经过客户端路由缓存，彻底避免首次登录卡住的问题
  // redirect() 放在 try/catch 外面，让 Next.js 框架正常处理
  redirect(redirectTo)
}
