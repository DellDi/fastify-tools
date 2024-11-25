import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (!data.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 生成 JWT token
    const token = sign(
      { userId: data.user.id, email: data.user.email },
      process.env.SUPABASE_JWT_SECRET!,
      { expiresIn: '1d' }
    )

    // 记录登录
    await supabase
    .from('login_logs')
    .insert({ user_id: data.user.id, login_time: new Date().toISOString() })

    // 设置 cookie
    const response = NextResponse.json({ message: "登录成功" })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: "登录失败，请检查您的邮箱和密码。" }, { status: 500 })
  }
}

