import { type NextRequest, NextResponse } from 'next/server'
import { forbidden } from 'next/navigation'
import { updateSession, hasAdminRole, verifyAuth } from '@/utils/auth/middleware'
import { isWhiteRoute, isUpSessionRoute } from '@/utils/auth/config'
import { getMenusStore } from '@/utils/store/role_menu'

export async function middleware(req: NextRequest) {
  if (isWhiteRoute(req.nextUrl.pathname)) return NextResponse.next()

  // 不需要认证的路由、但需要登录的路由
  const authRoutes = ['/dashboard', '/profile', '/settings']
  // 需要管理员权限的路由
  const adminRoutes = ['/admin/roles', '/admin/permissions', '/admin/user']

  // 检查当前路由是否需要认证或管理员权限
  const isLoginAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isUpSessionRoute(req.nextUrl.pathname)) {
    return updateSession(req)
  }

  // 验证用户身份
  const authResult = await verifyAuth(req)
  if (!authResult) return NextResponse.redirect(new URL('/login', req.url))

  // 检查是否需要管理员权限
  if (isAdminRoute) {
    const isAdmin = await hasAdminRole(req)
    if (!isAdmin) {
      return forbidden()
    }
  }

  // 检查菜单权限
  const menus = authResult.menus
  if (menus && !menus.some(menu => menu.url && req.nextUrl.pathname.startsWith(menu.url))) {
    return forbidden()
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
