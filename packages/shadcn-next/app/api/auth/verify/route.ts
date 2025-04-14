import { verifyMagicLink } from '@/app/lib/auth/verified'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, code } = await request.json()
  try {
    await verifyMagicLink(code, email)
    return NextResponse.json({ message: '邮箱验证成功' })
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

