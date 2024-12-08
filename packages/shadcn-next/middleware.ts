import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(req: NextRequest) {
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
  // const userRole = await getUserRole()
  // if (userRole?.name !== 'admin') {
  //   // 如果用户不是管理员，重定向到仪表板
  //   return NextResponse.redirect(new URL('/dashboard', req.url))
  // }
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




