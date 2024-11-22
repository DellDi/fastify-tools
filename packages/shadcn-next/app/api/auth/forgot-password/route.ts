import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  
  // 这里应该有实际的密码重置逻辑,比如发送重置邮件
  // 为了演示,我们只是返回一个成功消息
  
  console.log(`Sending password reset email to ${email}`)

  return NextResponse.json({ message: "密码重置邮件已发送" })
}

