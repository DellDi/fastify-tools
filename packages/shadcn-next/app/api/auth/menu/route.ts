'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getUserRolesMenu } from '@/app/lib/auth/user-route'
import { serviceCache } from '@/store/service'
import { MenuWithChildren } from '@/types/prisma-extensions'
import { requireAuth } from '@/app/actions/menu-actions'

/**
 * 获取用户菜单接口
 * 用于前端获取用户菜单数据
 */
export async function GET() {
  try {
    const userId = await requireAuth()
    
    if (!userId) {
      return NextResponse.json({ error: '未认证', code: 401 }, { status: 401 })
    }
    
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
