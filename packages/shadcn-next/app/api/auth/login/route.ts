'use server'
import { NextResponse } from 'next/server'
import { createServerBaseClient } from '@/utils/supabase/server'
import { initUserStore } from '@/app/lib/user'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createServerBaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 401 })

    if (!data.user) {
      return NextResponse.json({ error: 'Invalid credentials: 账号未注册、或未通过验证' }, { status: 401 })
    }

    // // 生成 JWT token
    // const token = sign(
    //   { userId: data.user.id, email: data.user.email },
    //   process.env.SUPABASE_JWT_SECRET!,
    //   { expiresIn: '1d' }
    // )

    // 记录登录，先别记录，影响业务整体注册流程的判断
    // await supabase
    // .from('login_logs')
    // .insert({ user_id: data.user.id, login_time: new Date().toISOString() })

    await initUserStore(data.user)

    return NextResponse.json({ message: '登录成功' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败，请检查您的邮箱和密码。' }, { status: 500 })
  }
}

