import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { forbidden } from 'next/navigation'
import { getCurrentUserRole, getUser } from '@/app/lib/user'
import { isWhiteRoute, isUpSessionRoute } from '@/utils/auth/config'
import { getMenusStore } from '@/utils/store/role_menu'

export async function middleware(req: NextRequest) {
  const nextUrl = req.nextUrl
  console.log('🚀 ~ file:middleware.ts, line:10-----', nextUrl.pathname)
  if (isWhiteRoute(req.nextUrl.pathname)) return NextResponse.next()
  // 不需要认证的路由、但需要登录的路由
  const authRoutes = ['/dashboard', '/profile', '/settings']
  // 也需要需要管理员权限的路由
  const adminRoutes = ['/admin/roles', '/admin/permissions', '/admin/user']
  // 检查当前路由是否需要认证或管理员权限
  const isLoginAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isUpSessionRoute(req.nextUrl.pathname)) {
    await updateSession(req)
  }

  const user = await getUser()
  // 检查当前路由是否需要认证
  if (!user) return NextResponse.redirect(new URL('/login', req.url))
  // 检查当前路由是否需要管理员权限
  if (isLoginAuthRoute) {
    return NextResponse.next()
  }
  const userRoles = await getCurrentUserRole()
  const menus = getMenusStore()
  const hasAdminRole = userRoles?.roles.some(role => role.name === 'admin')

  // 判断是否具有admin菜单权限
  if (isAdminRoute && !hasAdminRole) {
    return forbidden()
  }

  // 判断是否具有路由菜单权限
  if (menus && !menus.some(menu => req.nextUrl.pathname.startsWith(menu.url))) {
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




