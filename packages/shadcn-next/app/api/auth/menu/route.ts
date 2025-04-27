'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getUserRolesMenu } from '@/app/lib/auth/user-route'
import { jwt } from '@/utils/auth/jwt'
import { serviceCache } from '@/store/service'
import { MenuWithChildren } from '@/types/prisma-extensions'

/**
 * 获取用户菜单接口
 * 用于前端获取用户菜单数据
 */
export async function GET(request: NextRequest) {
  try {
    // 从 cookie 获取 token
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ error: '未认证', code: 401 }, { status: 401 })
    }
    
    // 验证 token 并获取用户 ID
    const decoded = jwt.verifyToken(token)
    
    // 验证解码结果
    if (!decoded || decoded instanceof Error) {
      return NextResponse.json({ error: 'token无效', code: 401 }, { status: 401 })
    }
    
    const userId = typeof decoded === 'string' ? decoded : decoded.id
    
    // 先尝试从缓存获取菜单
    const cachedMenu = serviceCache.get(userId + '_menu') as MenuWithChildren[]
    
    if (cachedMenu) {
      return NextResponse.json({ menus: cachedMenu })
    }
    
    // 如果缓存中没有，则从数据库获取
    const menus = await getUserRolesMenu(userId)
    
    // 缓存菜单数据
    if (menus.length > 0) {
      serviceCache.set(userId + '_menu', menus)
    }
    
    return NextResponse.json({ menus })
  } catch (error) {
    console.error('获取菜单失败:', error)
    return NextResponse.json({ error: '获取菜单失败', code: 500 }, { status: 500 })
  }
}
