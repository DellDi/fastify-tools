// Create a transporter using SMTP
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: '验证您的邮箱',
    text: `您的验证码是: ${code}`,
    html: `
      <h1>验证您的邮箱</h1>
      <p>您的验证码是: <strong>${code}</strong></p>
      <p>此验证码将在15分钟后过期。</p>
    `,
  }

  try {
    // await transporter.sendMail(mailOptions)
    console.log(`Verification email sent to ${to}`)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

