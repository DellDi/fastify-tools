import { type NextRequest, NextResponse } from 'next/server'
import { forbidden } from 'next/navigation'
import { updateSession, verifyAuth } from '@/utils/auth/middleware'
import { 
  isWhiteRoute, 
  isUpSessionRoute, 
  isPublicApiRoute,
  isUserApiRoute 
} from '@/utils/auth/config'
import { checkRoutePermission } from './app/actions/menu-actions'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // 1. 检查白名单路由 - 直接放行
  if (isWhiteRoute(pathname)) {
    return NextResponse.next()
  }
  
  // 2. 检查公共 API 路由 - 直接放行
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next()
  }
  
  // 3. 检查是否需要更新 session
  if (isUpSessionRoute(pathname)) {
    return updateSession(req)
  }
  
  // 4. 验证用户身份 - 所有需要认证的接口路由
  const authUserResult = await verifyAuth(req)
  if (!authUserResult) {
    // API 路由返回 JSON 错误，非 API 路由重定向到登录页
    if (isUserApiRoute(pathname)) {
      return NextResponse.json(
        { error: '未授权访问', code: 401 },
        { status: 401 }
      )
    } else {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  // 5. 检查菜单权限
  if (authUserResult && authUserResult.userRole?.roleMenus && authUserResult.userRole.roleMenus.length > 0) {
    // 如果不是 API 路由，检查当前路径是否在用户菜单权限内
    if (!pathname.startsWith('/api/')) {
      const hasPermission = await checkRoutePermission(pathname)
      if (!hasPermission) {
        return forbidden()
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
