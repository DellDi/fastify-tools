import { verifyMagicLink } from '@/app/lib/auth/verified'
import { NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function POST(request: Request) {
  const { email, code } = await request.json()
  try {
    await verifyMagicLink(code, email)

    const SITE_DOMAIN_URL = process.env.SITE_DOMAIN_URL || 'http://localhost:3001'
    const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

    const response = NextResponse.json({ message: '邮箱验证成功' })
    try {
      await fastifyFetch('/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          templateName: 'success-template',
          variables: {
            logoUrl: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}/logo.png`,
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

