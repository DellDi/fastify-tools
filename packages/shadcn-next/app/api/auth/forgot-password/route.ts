import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

// 使用邮箱重设密码
export async function GET(request: Request) {
  const { email } = await request.json()

  const user = await prisma.user.findFirst({
    where: { email },
  })
  if (!user) return NextResponse.json({
    error: 'Invalid credentials: 账号未注册、或未通过验证',
    code: 401,
  }, { status: 401 })

  const SITE_DOMAIN_URL = process.env.SITE_DOMAIN_URL || 'http://localhost:3001'
  const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
  // 发送邮箱验证邮件
  await fastifyFetch('/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      templateName: 'reset-password',
      variables: {
        Email: email,
        ConfirmationURL: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}/auth?email=${email}`,
        SiteURL: `${SITE_DOMAIN_URL}${NEXT_PUBLIC_BASE_PATH}`,
      },
    }),
  })

  return NextResponse.json({ message: "密码重置邮件已发送, 请及时查收" })
}

