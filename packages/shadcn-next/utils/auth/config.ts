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

  // 静态资源
  '/_next',
  '/fonts',
  '/favicon.ico',
  '/images',
  '/assets',
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

// 检查是否为白名单路由
export function isWhiteRoute(pathname: string): boolean {
  return whiteRoutes.some(route => pathname.endsWith(route))
}

// 检查是否为公共 API 路由
export function isPublicApiRoute(pathname: string): boolean {
  return publicApiRoutes.some(route => pathname.endsWith(route))
}

// 检查是否为需要用户认证的 API 路由
export function isUserApiRoute(pathname: string): boolean {
  return userApiRoutes.some(route => pathname.endsWith(route))
}

// 检查是否为需要管理员权限的 API 路由
export function isAdminApiRoute(pathname: string): boolean {
  return adminApiRoutes.some(route => pathname.endsWith(route))
}

// 检查是否为需要更新 session 的路由
export function isUpSessionRoute(pathname: string): boolean {
  return sessionUpdateRoutes.some(route => pathname.endsWith(route))
}

// JWT配置
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
  expiresIn: '7d', // Token过期时间
}
