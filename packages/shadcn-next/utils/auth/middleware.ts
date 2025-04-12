import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '../../lib/prisma'
import { jwt } from '../../utils/auth/jwt'
import { type Menu, type Permission, type Role, type User } from '../../generated/client/index.js'

type FullUser = User & {
  userRole?: Role & {
    rolePermissions: {
      permission: Permission
    }[]
    roleMenus: {
      menu: Menu
    }[]
  }
}

interface AuthResult {
  user: FullUser
  permissions: string[]
  menus: Menu[]
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        userRole: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            },
            roleMenus: {
              include: {
                menu: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return null
    }

    return {
      user,
      permissions: user.userRole?.rolePermissions.map((rp) => rp.permission.name) || [],
      menus: user.userRole?.roleMenus.map((rm) => rm.menu) || []
    } as AuthResult
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const authResult = await verifyAuth(request)

  if (!authResult) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 更新用户最后登录时间
  await prisma.user.update({
    where: { id: authResult.user.id },
    data: { lastSignInAt: new Date() }
  })

  // 记录登录日志
  await prisma.loginLog.create({
    data: {
      userId: authResult.user.id,
      ipAddress: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || ''
    }
  })

  return NextResponse.next()
}

export async function hasPermission(request: NextRequest, requiredPermission: string) {
  const authResult = await verifyAuth(request)
  if (!authResult) return false
  return authResult.permissions.includes(requiredPermission)
}

export async function hasAdminRole(request: NextRequest) {
  const authResult = await verifyAuth(request)
  if (!authResult) return false
  return authResult.user.userRole?.name === 'admin'
}

export async function canAccessMenu(request: NextRequest, menuUrl: string) {
  const authResult = await verifyAuth(request)
  if (!authResult) return false
  return authResult.menus.some((menu) => menuUrl.startsWith(menu.url || ''))
}