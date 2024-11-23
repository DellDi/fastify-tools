import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // 需要认证的路由
  const authRoutes = ['/dashboard', '/profile', '/settings']

  // 检查当前路由是否需要认证
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isAuthRoute) {
    if (!token) {
      // 如果没有 token，重定向到登录页面
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    try {
      // 验证 token
      verify(token, process.env.JWT_SECRET!)
      return NextResponse.next()
    } catch (error) {
      // 如果 token 无效，重定向到登录页面
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // 对于非认证路由，直接放行
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

