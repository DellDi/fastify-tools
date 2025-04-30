import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/app/actions/menu-actions'
import { getUserInfo } from '@/app/actions/user-actions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const userId = await requireAuth()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = await getUserInfo(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 只返回必要的用户信息
    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

// 更新用户基本信息
export async function PATCH(req: NextRequest) {
  const userId = await requireAuth()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { username, avatarUrl } = body
    if (!username && !avatarUrl) {
      return NextResponse.json({ error: "No valid data provided" }, { status: 400 })
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        avatarUrl,
      },
    })

    return NextResponse.json({ data: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}


