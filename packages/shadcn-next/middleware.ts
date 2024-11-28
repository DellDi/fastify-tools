import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(req: NextRequest) {
  // 需要认证的路由
  const authRoutes = ['/dashboard', '/profile', '/settings']

  // 检查当前路由是否需要认证
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isAuthRoute) {
    return await updateSession(req)
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

// export function middlewareOld(request: NextRequest) {
//   // 需要认证的路由
//   const authRoutes = ['/dashboard', '/profile', '/settings', '/main/dashboard']
//
//   // 检查当前路由是否需要认证
//   const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
//
//   if (isAuthRoute) {
//     const token = request.headers.get('Authorization')?.split(' ')[1]
//
//     if (!token) {
//       // 如果没有 token，重定向到登录页面
//       return NextResponse.redirect(new URL('/auth', request.url))
//     }
//
//     try {
//       // 验证 token
//       verify(token, process.env.JWT_SECRET!)
//       return NextResponse.next()
//     } catch (error) {
//       // 如果 token 无效，重定向到登录页面
//       return NextResponse.redirect(new URL('/auth', request.url))
//     }
//   }
//
//   // 对于非认证路由，直接放行
//   return NextResponse.next()
// }
