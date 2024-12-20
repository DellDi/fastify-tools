import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { forbidden } from 'next/navigation'
import { getCurrentUserRole } from '@/app/lib/user'
import { isWhiteRoute } from '@/utils/auth/config'

export async function middleware(req: NextRequest) {
  if (isWhiteRoute(req.nextUrl.pathname)) return NextResponse.next()
  // 需要认证的路由
  const authRoutes = ['/dashboard', '/profile', '/settings']
  // 也需要需要管理员权限的路由
  const adminRoutes = ['/admin/roles', '/admin/permissions', '/admin/user']
  // 检查当前路由是否需要认证或管理员权限
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // 检查当前路由是否需要认证
  if (isAuthRoute || isAdminRoute) {
    return await updateSession(req)
  }
  const userRoles = await getCurrentUserRole()
  // 判断是否具有路由菜单权限
  if (userRoles && isAdminRoute && userRoles.roles.some(role => role.name === 'admin')) {
    forbidden()
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




