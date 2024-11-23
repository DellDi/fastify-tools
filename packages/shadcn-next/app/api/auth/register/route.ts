import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { username, email, password, phoneNumber } = await request.json()

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Generate verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Insert user and verification code into database
    const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ username, email, password, phone_number: phoneNumber, verified: false })
    .select()
    .single()

    if (insertError) throw insertError

    await supabase
    .from('verification_codes')
    .insert({ user_id: newUser.id, code: verificationCode, expires_at: expiresAt })

    // Send verification email (implement this function)
    await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({ message: "注册成功，请查收验证邮件" })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: "注册失败，请稍后再试" }, { status: 500 })
  }
}

async function sendVerificationEmail(email: string, code: string) {
  // Implement email sending logic here
  console.log(`Sending verification email to ${email} with code ${code}`)
  // In a real application, you would use an email service like SendGrid, AWS SES, etc.
}

