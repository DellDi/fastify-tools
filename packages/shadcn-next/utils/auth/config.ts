const whiteRoutes = ['/login', '/auth', '/register', '/error', '/404', '/500', '/forbidden']

export const isWhiteRoute = (path: string) => {
  if (path === '/') return true
  return whiteRoutes.some(w=> path.startsWith(w))
}
