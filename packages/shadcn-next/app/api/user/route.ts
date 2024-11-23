import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string, email: string }
    return NextResponse.json({ userId: decoded.userId, email: decoded.email })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

