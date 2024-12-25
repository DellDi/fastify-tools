import { NextResponse } from 'next/server'
import { createServerBaseClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const { username, email, password } = await request.json()
  try {
    // 使用 Supabase 注册用户
    const supabase = await createServerBaseClient()

    const { data: userInfo, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    console.log('🚀 ~ file:route.ts, line:20-----', userInfo, authError)

    if (authError) {
      if (authError.message.includes('User already registered')) {
        return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
      }
      throw authError
    }

    return NextResponse.json({ data: { userInfo }, message: '注册成功，请查收验证邮件' })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : '注册失败，请稍后再试',
    }, { status: 500 })
  }
}
