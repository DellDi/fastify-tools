import { type NextRequest, NextResponse } from 'next/server'
import { updateSession, verifyAuth } from '@/utils/auth/middleware'
import {
  isWhiteRoute,
  isUpSessionRoute,
  isPublicApiRoute,
  isUserApiRoute,
  isAdminApiRoute
} from '@/utils/auth/config'

// 用户认证信息类型
interface AuthResult {
  id: string
  email: string
  role?: string
  [key: string]: any
}

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

    // 判断是否是数据请求
    const isDataRequest = () => {
      const accept = req.headers.get('accept') || ''
      return (
        accept.includes('application/json') ||
        req.headers.get('x-requested-with') === 'XMLHttpRequest' ||
        pathname.startsWith('/api/') ||
        pathname.includes('.json') ||
        pathname.includes('/_next/data/')
      )
    }

    // 日志过滤
    const shouldLog = !['/.well-known', '/_next', '/favicon.ico', '/images', '/assets', '/fonts']
      .some(p => pathname.startsWith(p))

    if (shouldLog) {
      console.log(`🔍 请求: ${pathname} ${isDataRequest() ? '[数据]' : '[页面]'}`)
    }

    // 1. 白名单路由直接放行
    if (isWhiteRoute(pathname)) {
      shouldLog && console.log(`✅ 白名单路由: ${pathname}`)
      return NextResponse.next()
    }

    // 2. 公共API路由直接放行
    if (isPublicApiRoute(pathname)) {
      shouldLog && console.log(`✅ 公共API: ${pathname}`)
      return NextResponse.next()
    }

    // 3. 更新会话路由
    if (isUpSessionRoute(pathname)) {
      shouldLog && console.log(`🔄 更新会话: ${pathname}`)
      return updateSession(req)
    }

    // 4. 用户认证
    const authResult = await verifyAuth(req) as AuthResult | false
    shouldLog && console.log(`🔑 认证: ${authResult ? '成功' : '失败'}`)

    if (!authResult) {
      // 认证失败处理
      if (isDataRequest() || isUserApiRoute(pathname)) {
        // 数据请求返回JSON错误
        return NextResponse.json({ error: '未授权', code: 401 }, { status: 401 })
      } else {
        // 页面请求重定向到登录页
        const loginUrl = new URL(`${basePath}/login`, req.url)
        loginUrl.searchParams.set('from', pathname)

        const response = NextResponse.redirect(loginUrl)
        response.headers.set('Cache-Control', 'no-store')
        return response
      }
    }

    // 5. 权限检查
    if (isAdminApiRoute(pathname)) {
      const isAdmin = authResult.role === '管理员' || authResult.role === 'admin'

      if (!isAdmin) {
        shouldLog && console.log(`⛔ 禁止访问: 需要管理员权限`)
        return NextResponse.json({ error: '无权限', code: 403 }, { status: 403 })
      }
    }

    // 放行请求
    return NextResponse.next()
  } catch (error) {
    console.error(`❗ 中间件错误:`, error)
    return NextResponse.next()
  }
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
