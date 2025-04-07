// 白名单路由，无需身份验证
export const whiteRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/callback',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/send-verification',
  '/api/auth/reset-password',
  '/_next',
  '/fonts',
  '/favicon.ico',
]

// 需要更新session的路由
export const sessionUpdateRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
]

export function isWhiteRoute(pathname: string): boolean {
  return whiteRoutes.some(route => pathname.startsWith(route))
}

export function isUpSessionRoute(pathname: string): boolean {
  return sessionUpdateRoutes.some(route => pathname.startsWith(route))
}

// JWT配置
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
  expiresIn: '7d', // Token过期时间
}
