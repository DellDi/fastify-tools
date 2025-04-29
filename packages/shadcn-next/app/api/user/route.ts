import { NextResponse } from 'next/server'
import { requireAuth } from '@/app/actions/menu-actions'
import { getUserInfo } from '@/app/actions/user-actions'

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

