import { NextResponse, type NextRequest } from 'next/server'
import { serviceCache } from '@/store/service'
import { jwt } from '@/utils/auth/jwt'

// 退出登录
export async function POST(request: NextRequest) {
  const userId = jwt.verifyToken(request.cookies.get('auth_token')?.value || '')
  if (!userId) {
    return NextResponse.json({ message: '未认证' }, { status: 401 })
  }
  // 清除用户缓存
  serviceCache.delete(userId)
  serviceCache.delete(userId + '_menu')
  // 清除cookie
  request.cookies.delete('auth_token')
  const response = NextResponse.json({ message: '登出成功' }, { status: 200 })
  return response
}

