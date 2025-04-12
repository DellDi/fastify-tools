'use server'

import crypto from 'crypto'



export async function sendVerificationEmail(authUser: {
  user: { id: string; email: string }
}, to: string, code: string) {

  const { user: { id: user_id, email } } = authUser
  // 生成验证码
  const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now


  // 插入验证码
  const { error: insertError } = await supabase
  .from('verification_codes')
  .insert({ user_id: user_id, code: verificationCode, expires_at: expiresAt })

  if (insertError) throw insertError

  // 发送验证邮件（这里需要实现实际的邮件发送逻辑）
  // await sendVerificationEmail(email, verificationCode)

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: `验证您的邮箱${email}`,
    text: `您的验证码是: ${code}`,
    html: `
      <h1>验证您的邮箱</h1>
      <p>您的验证码是: <strong>${code}</strong></p>
      <p>此验证码将在15分钟后过期。</p>
    `,
  }

  try {
    // await transporter.sendMail(mailOptions)
    console.log(`Verification email sent to ${to} ,${mailOptions}`)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

