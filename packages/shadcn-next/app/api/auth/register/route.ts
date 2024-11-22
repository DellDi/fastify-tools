import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, email, password, phoneNumber } = await request.json()
  
  // 这里应该有实际的用户注册逻辑,比如保存到数据库
  // 为了演示,我们只是返回一个成功消息
  
  // 模拟邮箱验证邮件发送
  console.log(`Sending verification email to ${email}`)

  return NextResponse.json({ message: "注册成功,请查收验证邮件" })
}

