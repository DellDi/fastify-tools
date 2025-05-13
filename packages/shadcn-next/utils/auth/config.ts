// 白名单路由，无需身份验证
export const whiteRoutes = [
  // 页面路由 - 公开访问
  '/',
  '/login',
  '/error',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth',
  '/auth/callback',

  // 静态资源 - 使用通配符表示前缀匹配
  '/_next/*',
  '/fonts/*',
  '/favicon.ico',
  '/images/*',
  '/assets/*',
  '/.well-known/*',

  // 测试路由
  '/test/*'
]

// 公共 API 端点，无需身份验证
export const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/send-verification',
  '/api/auth/reset-password',
  '/api/auth/logout',
  '/api/public',
]

// 需要用户认证的 API 端点
export const userApiRoutes = [
  '/api/auth/menu',
  '/api/user',
  '/api/profile',
  '/api/user/update',
]

// 需要管理员权限的 API 端点
export const adminApiRoutes = [
  '/api/admin',
  '/api/roles',
  '/api/permissions',
]

// 需要更新session的路由
export const sessionUpdateRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
]

// 通用路由匹配函数
function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // 通配符路径匹配
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    // 根路径匹配
    if (route === '/' && pathname === '/') {
      return true
    }
    // 精确匹配
    return pathname === route
  })
}

// 检查是否为白名单路由
export function isWhiteRoute(pathname: string): boolean {
  return matchRoute(pathname, whiteRoutes)
}

// 检查是否为公共 API 路由
export function isPublicApiRoute(pathname: string): boolean {
  return matchRoute(pathname, publicApiRoutes)
}

// 检查是否为需要用户认证的 API 路由
export function isUserApiRoute(pathname: string): boolean {
  return matchRoute(pathname, userApiRoutes)
}

// 检查是否为需要管理员权限的 API 路由
export function isAdminApiRoute(pathname: string): boolean {
  return matchRoute(pathname, adminApiRoutes)
}

// 检查是否为需要更新 session 的路由
export function isUpSessionRoute(pathname: string): boolean {
  return matchRoute(pathname, sessionUpdateRoutes)
}

// JWT配置
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
  expiresIn: '7d', // Token过期时间
}
