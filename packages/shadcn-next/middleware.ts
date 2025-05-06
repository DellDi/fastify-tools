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
  try {
    const { pathname } = req.nextUrl

    // 输出详细的请求信息便于调试
    console.log(`
🔍 中间件收到请求: ${pathname}`)
    console.log(`🍪 Cookies: ${req.cookies.getAll().map(c => c.name).join(', ') || '无'}`)
    console.log(`🔒 Auth Cookie: ${req.cookies.get('auth_token')?.value ? '存在' : '不存在'}`)
    console.log(`📣 Headers: ${JSON.stringify([...req.headers.entries()].slice(0, 5))}`)

    // 1. 检查白名单路由 - 直接放行
    if (isWhiteRoute(pathname)) {
      console.log(`✅ 白名单路由放行: ${pathname}`)
      return NextResponse.next()
    }

    // 2. 检查公共 API 路由 - 直接放行
    if (isPublicApiRoute(pathname)) {
      console.log(`✅ 公共API路由放行: ${pathname}`)
      return NextResponse.next()
    }

    // 3. 检查是否需要更新 session
    if (isUpSessionRoute(pathname)) {
      console.log(`🔄 更新Session路由: ${pathname}`)
      return updateSession(req)
    }

    // 4. 验证用户身份 - 所有需要认证的路由
    const authResult = await verifyAuth(req)
    console.log(`🔑 认证结果: ${authResult ? '成功' : '失败'}`)

    if (!authResult) {
      // 认证失败处理
      if (isUserApiRoute(pathname)) {
        // API 路由返回 JSON 错误
        console.log(`⛔ API认证失败，返回401状态码`)
        return NextResponse.json(
          { error: '未授权访问', code: 401 },
          { status: 401 }
        )
      } else {
        // 非 API 路由重定向到登录页
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('from', pathname)
        console.log(`⛔ 认证失败，重定向到: ${loginUrl.toString()}`)
        return NextResponse.redirect(loginUrl)
      }
    }

    // 5. 认证成功，检查权限（如果需要）
    console.log(`✅ 认证成功，用户ID: ${authResult.id}`)

    // 如果不是 API 路由，可以在这里检查菜单权限
    if (!pathname.startsWith('/api/')) {
      // 简化版本不检查具体权限，只要用户已登录就放行
      // 实际权限检查可以在这里实现
    }

    // 放行请求
    return NextResponse.next()

  } catch (error) {
    // 错误处理
    console.error(`❌ 中间件错误:`, error)
    // 发生错误时返回默认响应，避免完全阻止访问
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
