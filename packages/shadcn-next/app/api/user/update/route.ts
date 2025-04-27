import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/app/actions/menu-actions'

// 更新用户信息
export async function PUT(request: Request) {
  const userId = await requireAuth()
  if (!userId) {
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  }

  const { username, email, phoneNumber, avatarUrl } = await request.json()

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { email, username, phoneNumber, avatarUrl }
    })

    if (!user) {
      return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 })
    }

    return NextResponse.json({ message: "用户信息更新成功", data: user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 })
  }
}

