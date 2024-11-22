import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // 这里应该有实际的用户验证逻辑
  // 为了演示,我们只是返回一个成功消息
  
  return NextResponse.json({ message: "登录成功", token: "fake_jwt_token" })
}

