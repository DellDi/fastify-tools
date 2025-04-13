import { registerUser } from '@/app/lib/auth/register'
import { NextResponse } from 'next/server'
import { errorMessagesCodeMap } from '@/types/email'

export async function POST(request: Request) {
  // 默认颁发初始化密码
  const { username, email, phoneNumber } = await request.json()
  try {
    const user = await registerUser({ username, email, phoneNumber })
    return NextResponse.json({ data: { user }, message: '注册成功，请查收验证邮件，进行邮箱验证' })
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
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
