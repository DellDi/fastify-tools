import { NextResponse, type NextRequest } from 'next/server'

import { resetAllInfo } from '@/app/lib/user'

export async function POST(request: NextRequest) {
  const supabase = await createServerBaseClient()
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
}

