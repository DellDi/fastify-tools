import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  const { email, code } = await request.json()

  try {
    // Get user and verification code
    const { data: user } = await supabase
    .from('users')
    .select('id, verified')
    .eq('email', email)
    .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.verified) {
      return NextResponse.json({ error: 'User already verified' }, { status: 400 })
    }

    const { data: verificationData } = await supabase
    .from('verification_codes')
    .select('code, expires_at')
    .eq('user_id', user.id)
    .single()

    if (!verificationData) {
      return NextResponse.json({ error: 'Verification code not found' }, { status: 404 })
    }

    // Check if code is correct and not expired
    if (verificationData.code !== code || new Date() > new Date(verificationData.expires_at)) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Mark user as verified
    await supabase
    .from('users')
    .update({ verified: true })
    .eq('id', user.id)

    // Delete verification code
    await supabase
    .from('verification_codes')
    .delete()
    .eq('user_id', user.id)

    return NextResponse.json({ message: '邮箱验证成功' })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: '验证失败，请稍后再试' }, { status: 500 })
  }
}

