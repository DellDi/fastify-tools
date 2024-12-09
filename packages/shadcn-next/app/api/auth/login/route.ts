'use server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { setUserStore } from '@/utils/store/user'
import { initRolePermission } from '@/app/api/auth/register/role_permission'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createClient()

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

    // 记录登录
    await supabase
    .from('login_logs')
    .insert({ user_id: data.user.id, login_time: new Date().toISOString() })

    setUserStore(
      data.user,
    )

    if (!data.user.role_id) {
      await initRolePermission(data.user)
    }

    return NextResponse.json({ message: '登录成功' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败，请检查您的邮箱和密码。' }, { status: 500 })
  }
}

