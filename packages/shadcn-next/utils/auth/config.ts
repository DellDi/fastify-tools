const whiteRoutes = ['/login', '/register', '/auth', '/error', '/404', '/500', '/forbidden']

export const isWhiteRoute = (path: string) => {
  return whiteRoutes.includes(path)
}
