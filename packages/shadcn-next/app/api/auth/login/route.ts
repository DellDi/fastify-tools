'use server'
import { NextResponse } from 'next/server'

import { initUserStore } from '@/app/lib/user'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createServerBaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return NextResponse.json({
      error: `${error.message},检查您的账号或者密码是否存在正确或者重新注册`,
      code: 401,
    }, { status: 401 })

    if (!data.user) {
      return NextResponse.json({ error: 'Invalid credentials: 账号未注册、或未通过验证', code: 401 }, { status: 401 })
    }

    // // 生成 JWT token
    // const token = sign(s
    //   { userId: data.user.id, email: data.user.email },
    //   process.env.SUPABASE_JWT_SECRET!,
    //   { expiresIn: '1d' }
    // )

    // 记录登录，先别记录，影响业务整体注册流程的判断
    // await supabase
    // .from('login_logs')
    // .insert({ user_id: data.user.id, login_time: new Date().toISOString() })

    await initUserStore()

    return NextResponse.json({ message: '登录成功', code: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败，请检查您的邮箱和密码。', code: 500 }, { status: 500 })
  }
}

