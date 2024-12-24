import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { resetAllInfo } from '@/app/lib/user'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  } else {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    await resetAllInfo()
    NextResponse.redirect(url)
    return NextResponse.json({ message: '登出成功' })
  }
  // response.cookies.set('auth_token', '', {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  //   expires: new Date(0),
  //   path: '/',
  // })
}

