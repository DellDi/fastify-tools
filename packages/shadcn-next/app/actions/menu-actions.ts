'use server'

import { cookies } from 'next/headers'
import { getUserRolesMenu } from '@/app/lib/auth/user-route'
import { jwt } from '@/utils/auth/jwt'
import { MenuWithChildren } from '@/types/prisma-extensions'
import { serviceCache } from '@/store/service'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Menu } from '@/generated/client'

// 定义 JWT 解码后的数据类型
type JwtPayload = {
  id: string
  email: string
  role?: string
}

/**
 * 获取用户菜单数据
 * 优先从缓存获取，如果缓存中没有则从数据库获取
 */
export async function getUserMenus(): Promise<{ 
  menus: MenuWithChildren[],
  error?: string 
}> {
  try {
    // 从 cookie 获取 token
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    
    if (!token) {
      return { menus: [], error: '未认证' }
    }
    
    // 验证 token 并获取用户 ID
    const decoded = jwt.verifyToken(token)
    
    // 验证解码结果
    if (!decoded || decoded instanceof Error) {
      return { menus: [], error: 'token无效' }
    }
    
    const userId = typeof decoded === 'string' ? decoded : decoded.id
    
    // 先尝试从缓存获取菜单
    const cachedMenu = serviceCache.get(userId + '_menu') as MenuWithChildren[]
    
    if (cachedMenu) {
      return { menus: cachedMenu }
    }
    
    // 如果缓存中没有，则从数据库获取
    const menus = await getUserRolesMenu(userId)
    
    return { menus }
  } catch (error) {
    console.error('获取菜单失败:', error)
    return { menus: [], error: '获取菜单失败' }
  }
}

/**
 * 检查用户是否有访问特定路由的权限
 * @param route 要检查的路由路径
 */
export async function checkRoutePermission(route: string): Promise<boolean> {
  const { menus, error } = await getUserMenus()
  
  if (error || !menus.length) {
    return false
  }
  
  // 扁平化所有菜单项
  const allRoutes = menus.flatMap(menu => 
    [menu.url, ...menu.children.map(child => child.url)]
  ).filter(Boolean) as string[]
  
  // 检查用户是否有权限访问该路由
  return allRoutes.some(menuRoute => route.startsWith(menuRoute || ''))
}

/**
 * 验证用户身份并获取用户信息
 * 如果验证失败则重定向到登录页
 */
export async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) {
    redirect('/login')
  }
  
  const decoded = jwt.verifyToken(token)
  
  if (!decoded || decoded instanceof Error) {
    redirect('/login')
  }
  
  const userId = typeof decoded === 'string' ? decoded : decoded.id
  return userId
}

/**
 * 获取用户的所有权限
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    
    if (!token) {
      return []
    }
    
    const decoded = jwt.verifyToken(token)
    
    if (!decoded || decoded instanceof Error) {
      return []
    }
    
    const userId = typeof decoded === 'string' ? decoded : decoded.id
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRole: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })
    
    if (!user || !user.userRole) {
      return []
    }
    
    return user.userRole.rolePermissions.map(rp => rp.permission.name)
  } catch (error) {
    console.error('获取用户权限失败:', error)
    return []
  }
}
