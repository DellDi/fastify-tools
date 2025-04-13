import { verifyMagicLink } from '@/app/lib/auth/verified'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, code } = await request.json()
  try {
    await verifyMagicLink(code, email)
    return NextResponse.json({ message: '邮箱验证成功' })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: '验证失败，请稍后再试' }, { status: 500 })
  }
}

