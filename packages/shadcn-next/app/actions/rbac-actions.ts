'use server'

import { prisma } from '@/lib/prisma'
import { serviceCache } from '@/store/service'
import { requireAuth } from './menu-actions'

// RBAC 管理操作：全部要求超管或 admin 角色；变更后清菜单/权限缓存
async function requireAdmin() {
  const userId = await requireAuth()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true, userRole: { select: { name: true } } },
  })
  if (!user || !(user.isSuperAdmin || user.userRole?.name === 'admin')) {
    throw new Error('需要管理员权限')
  }
  return userId
}

const invalidate = () => serviceCache.clear()

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const userId = await requireAuth()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isSuperAdmin: true, userRole: { select: { name: true } } },
    })
    return !!(user?.isSuperAdmin || user?.userRole?.name === 'admin')
  } catch {
    return false
  }
}

// ---------- 角色 ----------

export async function listRoles() {
  await requireAdmin()
  return prisma.role.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { users: true } },
      rolePermissions: { include: { permission: true } },
      roleMenus: { include: { menu: true } },
    },
  })
}

export async function createRole(name: string, description?: string) {
  await requireAdmin()
  if (!name.trim()) throw new Error('角色名不能为空')
  const exists = await prisma.role.findUnique({ where: { name: name.trim() } })
  if (exists && !exists.deletedAt) throw new Error('角色名已存在')
  const role = exists
    ? await prisma.role.update({
        where: { id: exists.id },
        data: { deletedAt: null, description: description ?? exists.description },
      })
    : await prisma.role.create({ data: { name: name.trim(), description } })
  invalidate()
  return role
}

export async function updateRole(
  id: string,
  data: { name?: string; description?: string }
) {
  await requireAdmin()
  if (data.name) {
    const dup = await prisma.role.findFirst({
      where: { name: data.name.trim(), id: { not: id }, deletedAt: null },
    })
    if (dup) throw new Error('角色名已存在')
  }
  const role = await prisma.role.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    },
  })
  invalidate()
  return role
}

export async function deleteRole(id: string) {
  await requireAdmin()
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  })
  if (!role) throw new Error('角色不存在')
  if (role.name === 'admin') throw new Error('内置 admin 角色不可删除')
  if (role._count.users > 0) throw new Error(`仍有 ${role._count.users} 个用户使用该角色`)
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId: id } }),
    prisma.roleMenu.deleteMany({ where: { roleId: id } }),
    prisma.role.delete({ where: { id } }),
  ])
  invalidate()
  return { ok: true }
}

// ---------- 权限 ----------

export async function listPermissions() {
  await requireAdmin()
  return prisma.permission.findMany({
    where: { deletedAt: null },
    orderBy: [{ groupName: 'asc' }, { name: 'asc' }],
  })
}

export async function createPermission(input: {
  name: string
  description?: string
  groupName?: string
}) {
  await requireAdmin()
  if (!input.name.trim()) throw new Error('权限名不能为空')
  const name = input.name.trim()
  const exists = await prisma.permission.findUnique({ where: { name } })
  if (exists && !exists.deletedAt) throw new Error('权限名已存在')
  const permission = exists
    ? await prisma.permission.update({
        where: { id: exists.id },
        data: {
          deletedAt: null,
          description: input.description ?? exists.description,
          groupName: input.groupName ?? exists.groupName,
        },
      })
    : await prisma.permission.create({
        data: { name, description: input.description, groupName: input.groupName },
      })
  invalidate()
  return permission
}

export async function deletePermission(id: string) {
  await requireAdmin()
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { permissionId: id } }),
    prisma.permission.delete({ where: { id } }),
  ])
  invalidate()
  return { ok: true }
}

// ---------- 菜单 ----------

export async function listMenus() {
  await requireAdmin()
  return prisma.menu.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function createMenu(input: {
  name: string
  url?: string
  parentId?: string | null
  icon?: string
  description?: string
  sortOrder?: number
}) {
  await requireAdmin()
  if (!input.name.trim()) throw new Error('菜单名不能为空')
  const menu = await prisma.menu.create({
    data: {
      name: input.name.trim(),
      url: input.url || '#',
      parentId: input.parentId || null,
      icon: input.icon,
      description: input.description,
      sortOrder: input.sortOrder ?? 0,
    },
  })
  invalidate()
  return menu
}

export async function updateMenu(
  id: string,
  input: {
    name?: string
    url?: string
    parentId?: string | null
    icon?: string
    description?: string
    sortOrder?: number
  }
) {
  await requireAdmin()
  if (input.parentId === id) throw new Error('父菜单不能是自身')
  const menu = await prisma.menu.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.url !== undefined ? { url: input.url } : {}),
      ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
  })
  invalidate()
  return menu
}

// 删除菜单连同其整个子树（含 role_menus 关联）
export async function deleteMenu(id: string) {
  await requireAdmin()
  const all = await prisma.menu.findMany({
    where: { deletedAt: null },
    select: { id: true, parentId: true },
  })
  const ids = [id]
  for (let i = 0; i < ids.length; i++) {
    all.filter((m) => m.parentId === ids[i]).forEach((m) => ids.push(m.id))
  }
  await prisma.$transaction([
    prisma.roleMenu.deleteMany({ where: { menuId: { in: ids } } }),
    prisma.menu.deleteMany({ where: { id: { in: ids } } }),
  ])
  invalidate()
  return { ok: true, count: ids.length }
}

// ---------- 角色关联（权限/菜单批量重绑） ----------

export async function setRolePermissions(roleId: string, permissionIds: string[]) {
  await requireAdmin()
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
    }),
  ])
  invalidate()
  return { ok: true }
}

export async function setRoleMenus(roleId: string, menuIds: string[]) {
  await requireAdmin()
  await prisma.$transaction([
    prisma.roleMenu.deleteMany({ where: { roleId } }),
    prisma.roleMenu.createMany({
      data: menuIds.map((menuId) => ({ roleId, menuId })),
    }),
  ])
  invalidate()
  return { ok: true }
}

// ---------- 用户 ----------

export async function listUsers() {
  await requireAdmin()
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      username: true,
      email: true,
      isSuperAdmin: true,
      roleId: true,
      userRole: { select: { name: true } },
    },
  })
}

export async function setUserRole(userId: string, roleId: string | null) {
  const selfId = await requireAdmin()
  if (roleId === null) throw new Error('角色不能为空')
  if (userId === selfId) throw new Error('不能修改自己的角色')
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true },
  })
  if (target?.isSuperAdmin) throw new Error('不能修改超级管理员的角色')
  await prisma.user.update({ where: { id: userId }, data: { roleId } })
  invalidate()
  return { ok: true }
}
