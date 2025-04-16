import { registerUser } from '@/app/lib/auth/register'
import { NextResponse } from 'next/server'
import { errorMessagesCodeMap } from '@/types/email'
import { sendEmailVerification } from '@/app/lib/auth/register'
import { prisma } from '@/lib/prisma'

// 使用邮箱注册
export async function POST(request: Request) {
  // 默认颁发初始化密码
  const { username, email, phoneNumber } = await request.json()
  try {
    const user = await registerUser({ username, email, phoneNumber })
    return NextResponse.json({ data: { user }, message: '注册成功，请查收验证邮件，进行邮箱验证' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: errorMessagesCodeMap[error.message as keyof typeof errorMessagesCodeMap].message,
        code: errorMessagesCodeMap[error.message as keyof typeof errorMessagesCodeMap].code,
      }, { status: 500 })
    }
    return NextResponse.json({
      message: '注册失败，请稍后再试',
      code: 'UNKNOWN_ERROR'
    }, { status: 500 })
  }
}

// 邮箱重发
export async function GET(request: Request) {
  const { email } = await request.json()

  const user = await prisma.user.findFirst({
    where: { email },
  })
  if (!user) return NextResponse.json({
    error: 'Invalid credentials: 账号未注册、或未通过验证',
    code: 401,
  }, { status: 401 })

  // 发送邮箱验证邮件
  const verificationCode = await sendEmailVerification(email)

  // 更新验证码对应的用户过期时间
  await prisma.verificationCode.update({
    where: { id: user.id },
    data: {
      code: verificationCode.code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  })
  
  return NextResponse.json({ message: "密码重置邮件已发送, 请及时查收" })
}

