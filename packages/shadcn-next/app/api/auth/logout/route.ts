import { NextResponse, type NextRequest } from 'next/server'
import { serviceCache } from '@/store/service'
import { requireAuth } from '@/app/actions/menu-actions'
// 退出登录
export async function POST(request: NextRequest) {
  const userId = await requireAuth()
  if (!userId) {
    return NextResponse.json({ message: '未认证' }, { status: 401 })
  }
  // 清除用户缓存
  serviceCache.delete(userId)
  serviceCache.delete(userId + '_user')
  serviceCache.delete(userId + '_menu')
  serviceCache.delete(userId + '_permission')
  // 清除cookie
  request.cookies.delete('auth_token')
  const response = NextResponse.json({ message: '登出成功' }, { status: 200 })
  return response
}

