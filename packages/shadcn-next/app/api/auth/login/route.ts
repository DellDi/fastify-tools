'use server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPasswordCrypto } from '@/utils/auth/password'
import { jwt } from '@/utils/auth/jwt'
import { z } from 'zod';

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) return NextResponse.json({
      error: 'Invalid credentials: 账号未注册',
      code: 401,
    }, { status: 401 })

    if (!user.encryptedPassword) {
      return NextResponse.json({ error: 'Invalid credentials: 账号未通过验证', code: 401 }, { status: 401 })
    }

    const UserMetaSchema = z.object({
      salt: z.string()
    });

    // 使用时
    const parseResult = UserMetaSchema.safeParse(user.rawUserMetaData);
    if (!parseResult.success) {
      return NextResponse.json({ error: '用户数据格式不正确', code: 401 }, { status: 401 });
    }

    const { salt } = parseResult.data;

    // 如果没有盐值，则无法验证密码
    if (!salt) {
      return NextResponse.json({ error: '用户数据不完整，请联系管理员', code: 401 }, { status: 401 })
    }

    const rowHash = user.encryptedPassword
    const isPasswordValid = verifyPasswordCrypto(password, salt, rowHash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: '密码错误', code: 401 }, { status: 401 })
    }

    // 生成 JWT token
    const token = jwt.generateToken(user)

    // 使用事务记录登录日志
    await prisma.$transaction(async (tx) => {
      await tx.loginLog.create({
        data: {
          userId: user.id,
          ipAddress: request.headers.get('cf-connecting-ip') || '',
          userAgent: request.headers.get('user-agent') || '',
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: { lastSignInAt: new Date() },
      })
    })
    const response = NextResponse.json({ message: '登录成功', token, userInfo: user }, { status: 200 });
    // 设置 token 到 cookies - 确保 token 是字符串类型
    response.cookies.set(
      'auth_token',
      String(token),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
    )
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败，请检查您的邮箱和密码。', code: 500 }, { status: 500 })
  }
}

