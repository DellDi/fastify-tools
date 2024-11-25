import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { username, email, password, phoneNumber } = await request.json()

  try {
    // 使用 Supabase Auth 创建用户
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        phone_number: phoneNumber
      }
    })

    if (authError) {
      if (authError.message.includes('User already registered')) {
        return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 })
      }
      throw authError
    }

    // 生成验证码
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // 插入验证码
    const { error: insertError } = await supabase
    .from('verification_codes')
    .insert({ user_id: authUser.user.id, code: verificationCode, expires_at: expiresAt })

    if (insertError) throw insertError

    // 发送验证邮件（这里需要实现实际的邮件发送逻辑）
    await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({ message: "注册成功，请查收验证邮件" })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "注册失败，请稍后再试"
    }, { status: 500 })
  }
}

async function sendVerificationEmail(email: string, code: string) {
  // 实现邮件发送逻辑
  console.log(`Sending verification email to ${email} with code ${code}`)
}

