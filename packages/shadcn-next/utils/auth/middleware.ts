"use server"

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function verifyAuth(request: NextRequest) {
  // 输出所有 cookies，便于调试
  console.log('中间件收到的所有 cookies：', request.cookies.getAll())

  // 尝试获取 auth_token
  const token = request.cookies.get('auth_token')?.value
  console.log('中间件获取到的 auth_token：', token)

  if (!token) {
    console.log('未找到 auth_token cookies')
    return false
  }

  return true
}

export async function updateSession(request: NextRequest) {
  const authUserResult = await verifyAuth(request)

  if (!authUserResult) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 中间件不进行数据库操作，直接返回
  return NextResponse.next()
}

export async function hasPermission(request: NextRequest, requiredPermission: string) {
  const authUserResult = await verifyAuth(request)
  if (!authUserResult) return false

  // 简化版本不检查具体权限，只要用户已登录就返回 true
  // 实际权限检查应该放在 API 路由或页面组件中进行
  return true
}
