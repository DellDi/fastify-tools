'use server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwt } from '@/utils/auth/jwt'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) return NextResponse.json({
      error: 'Invalid credentials: 账号未注册、或未通过验证',
      code: 401,
    }, { status: 401 })

    if (!user.encryptedPassword) {
      return NextResponse.json({ error: 'Invalid credentials: 账号未注册、或未通过验证', code: 401 }, { status: 401 })
    }

    const isPasswordValid = await jwt.compare(password, user.encryptedPassword)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials: 账号未注册、或未通过验证', code: 401 }, { status: 401 })
    }

    // 生成 JWT token
    const token = jwt.generateToken(user)
    const response = NextResponse.json({ message: '登录成功' }, { status: 200 });
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

