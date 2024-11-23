import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { username, email, phone_number } = await request.json()

    const { data, error } = await supabase
    .from('users')
    .update({ username, email, phone_number })
    .eq('id', decoded.userId)

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 })
    }

    return NextResponse.json({ message: "用户信息更新成功", data })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  }
}

