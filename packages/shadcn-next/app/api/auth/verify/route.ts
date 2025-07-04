import { sendVerificationEmail, verifyMagicLink } from '@/app/lib/auth/verified'
import { NextResponse, NextRequest } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { email, code } = await request.json()
  try {
    await verifyMagicLink(code, email)
    // 返回用户信息
    const user = await prisma.user.findFirst({
      where: { email },
    })
    const response = NextResponse.json({ message: '邮箱验证成功', userInfo: user })
    try {
      await fastifyFetch('/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          templateName: 'register-success',
          variables: {
            logoUrl: `https://poc.new-see.com/M00/00/DB/rBA3xGgJrJyABcs_ABrGg9fghbg128.png`,
            username: email,
            email,
            password: '123456',
          },
        }),
      })
    } catch (error) {
      console.error('Email send error:', error)
      NextResponse.json({
        error: '邮箱发送失败，请稍后再试',
        message: '邮箱发送失败，请稍后再试'
      }, { status: 500 })
    }
    return response
  } catch (error) {
    console.error('Verification error:', error)
    // 将原始错误信息和错误码传递给前端
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          message: '验证失败，请稍后再试'
        },
        { status: 400 }
      )
    }
    // 处理未知错误
    return NextResponse.json(
      {
        error: 'UNKNOWN_ERROR',
        message: '验证失败，请稍后再试'
      },
      { status: 500 }
    )
  }
}

// 发送邮箱验证码
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({
      error: 'Email is required',
      message: '邮箱是必填项'
    }, { status: 400 })
  }
  try {
    await sendVerificationEmail(email)
    return NextResponse.json({
      message: "验证码已发送, 请及时查收",
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({
      error: 'Verification error',
      message: '验证失败，请稍后再试'
    }, { status: 500 })
  }
}