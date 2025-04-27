'use server'

import { prisma } from '@/lib/prisma'

// 初始化用户角色
export async function initUserRole(userId: string) {
  const userRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: '超级管理员',
      status: 'active',
      createdBy: userId,
      updatedBy: userId,
    },
  })
  
  // 更新用户角色
  await prisma.user.update({
    where: { id: userId },
    data: { roleId: userRole.id },
  })
  return userRole
}


