import { type NextRequest, NextResponse } from 'next/server'
import { forbidden } from 'next/navigation'
import { updateSession, hasAdminRole, verifyAuth } from '@/utils/auth/middleware'
import { isWhiteRoute, isUpSessionRoute } from '@/utils/auth/config'
import { serviceCache } from '@/store/service'

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
  
  // 如果是管理员，直接放行
  if (await hasAdminRole(req)) {
    return NextResponse.next()
  }
  
  // 检查用户是否有权限访问当前路径
  if (menus && menus.length > 0) {
    // 缓存菜单数据到 localStorage 供前端使用
    const userId = typeof authResult.user.id === 'string' ? authResult.user.id : ''
    if (userId) {
      serviceCache.set(userId + '_menu', menus)
    }
    
    // 检查当前路径是否在用户菜单权限内
    const hasPermission = menus.some(menu => {
      // 检查主菜单URL
      if (menu.url && req.nextUrl.pathname.startsWith(menu.url)) {
        return true
      }
      // 检查子菜单URL
      return false
    })
    
    if (!hasPermission) {
      return forbidden()
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
