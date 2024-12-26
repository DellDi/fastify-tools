const whiteRoutes = ['/login', '/auth', '/api/auth', '/register', '/error', '/404', '/500', '/forbidden']

export const isWhiteRoute = (path: string) => {
  if (path === '/') return true
  return whiteRoutes.some(w => path.startsWith(w))
}

export const isUpSessionRoute = (path: string) => {
  return path.startsWith('/api/auth')
}
