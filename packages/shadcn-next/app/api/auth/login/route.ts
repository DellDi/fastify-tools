import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    // 验证用户凭据
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (!user.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 检查用户是否已验证邮箱
    const { data: userData } = await supabase
    .from('users')
    .select('verified')
    .eq('id', user.user.id)
    .single()

    if (!userData?.verified) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 })
    }

    // 生成 JWT token
    const token = sign(
      { userId: user.user.id, email: user.user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    // 记录登录
    await supabase
    .from('login_logs')
    .insert({ user_id: user.user.id, login_time: new Date().toISOString() })

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

