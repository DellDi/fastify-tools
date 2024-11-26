import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.SUPABASE_JWT_SECRET!) as { userId: string, email: string }

    const { data: { user }, error } = await supabase.auth.admin.getUserById(decoded.userId)

    if (error) throw error

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 只返回必要的用户信息
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.user_metadata.username,
      phone_number: user.user_metadata.phone_number,
      avatar_url: user.user_metadata.avatar_url
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

