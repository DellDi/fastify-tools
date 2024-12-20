const whiteRoutes = ['/login', '/register', '/auth']

export const isWhiteRoute = (path: string) => {
  return whiteRoutes.includes(path)
}
