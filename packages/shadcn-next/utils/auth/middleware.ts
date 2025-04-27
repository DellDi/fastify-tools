import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwt } from '@/utils/auth/jwt'
import { type Permission, type Role, type User } from '@/generated/client'
import { serviceCache } from '@/store/service'
import { type MenuWithChildren } from '@/types/prisma-extensions'

type FullUserInfo = User & {
  userRole?: Role & {
    rolePermissions: Permission[]
    roleMenus: MenuWithChildren[]
  }
}

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verifyToken(token) as {
      id: string
      email: string
      role: string
    }

    const cachedUser = serviceCache.get(decoded.id + '_user') as FullUserInfo
    if (cachedUser) {
      return {
        user: cachedUser,
        permissions: cachedUser.userRole?.rolePermissions?.map((rp) => rp) || [],
        menus: cachedUser.userRole?.roleMenus?.map((rm) => rm) || []
      } as unknown as FullUserInfo
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })
    

    if (!user) {
      return null
    }

    const fullUser = {
      ...user,
      userRole: {
        roleMenus: [] as MenuWithChildren[],
        rolePermissions: [] as Permission[]
      }
    }

    if (user && !fullUser.userRole?.roleMenus) {
      const menus = serviceCache.get(user.id + '_menu') as MenuWithChildren[]
      fullUser.userRole.roleMenus = menus ?? []
    }

    if (user && !fullUser.userRole?.rolePermissions) {
      const permissions = serviceCache.get(user.id + '_permission') as Permission[]
      fullUser.userRole.rolePermissions = permissions ?? []
    }

    serviceCache.set(decoded.id + '_user', fullUser)

    return fullUser
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const authUserResult = await verifyAuth(request)

  if (!authUserResult) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 更新用户最后登录时间
  await prisma.user.update({
    where: { id: authUserResult.id },
    data: { lastSignInAt: new Date() }
  })

  // 记录登录日志
  await prisma.loginLog.create({
    data: {
      userId: authUserResult.id,
      ipAddress: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || ''
    }
  })

  return NextResponse.next()
}

export async function hasPermission(request: NextRequest, requiredPermission: string) {
  const authUserResult = await verifyAuth(request)
  if (!authUserResult) return false
  
  // 使用 for 循环替代 some 方法
  const permissions = authUserResult.userRole?.rolePermissions || []
  for (const permission of permissions) {
    if (permission.name === requiredPermission) {
      return true
    }
  }
  return false
}
