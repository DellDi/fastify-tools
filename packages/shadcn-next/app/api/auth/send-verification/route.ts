import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    // Check if user exists and is not verified
    const { data: user } = await supabase
    .from('users')
    .select('id, verified')
    .eq('email', email)
    .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.verified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 })
    }

    // Generate new verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Update or insert new verification code
    await supabase
    .from('verification_codes')
    .upsert({ user_id: user.id, code: verificationCode, expires_at: expiresAt })

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({ message: "验证码已发送，请查收邮件" })
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json({ error: "发送验证码失败，请稍后再试" }, { status: 500 })
  }
}

async function sendVerificationEmail(email: string, code: string) {
  // Implement email sending logic here
  console.log(`Sending verification email to ${email} with code ${code}`)
  // In a real application, you would use an email service like SendGrid, AWS SES, etc.
}

