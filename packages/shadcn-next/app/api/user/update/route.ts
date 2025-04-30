import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/app/actions/menu-actions'
import { hashPasswordWithSaltCrypto } from '@/utils/auth/password'

// 更新用户安全信息
export async function PATCH(request: NextRequest) {
  const userId = await requireAuth()
  if (!userId) {
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  }
  const { email, emailCode, password, confirmPassword } = await request.json()

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "两次输入的密码不一致" }, { status: 400 })
  }

  // 验证邮箱和code
  const verificationCode = await prisma.verificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  // 验证邮箱验证码
  if (!verificationCode) {
    return NextResponse.json({ error: "邮箱验证码不存在" }, { status: 404 })
  }

  // 判断是否过期
  if (new Date() > verificationCode.expiresAt) {
    return NextResponse.json({ error: "验证码已过期" }, { status: 400 })
  }

  // 验证验证码
  if (verificationCode.code !== emailCode) {
    return NextResponse.json({ error: "验证码错误" }, { status: 400 })
  }

  try {
    const { salt, hash } = hashPasswordWithSaltCrypto(password)

    const user = await prisma.user.update({
      where: { id: userId, email },
      data: { encryptedPassword: hash, rawUserMetaData: { salt } }
    })

    if (!user) {
      return NextResponse.json({ error: "更新用户密码失败" }, { status: 500 })
    }

    return NextResponse.json({ message: "用户密码更新成功", data: user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: "更新用户密码失败" }, { status: 500 })
  }
}

