'use server'

import { createServerBaseClient } from '@/utils/supabase/server'
import { getUserStore, setUserStore, resetUserStore } from '@/utils/store/user'
import { getRoleStore, setRoleStore, type UserRole, resetRoleStore } from '@/utils/store/role'
import { getRouteMenusStore, setMenusStore, resetMenusStore, setRouteMenusStore } from '@/utils/store/role_menu'
import { type Menu, type User } from '@supabase/supabase-js'

export async function getUser(): Promise<User | null> {
  const userInfo = getUserStore()
  if (userInfo) return userInfo
  const supabase = await createServerBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return user
}

type userRole = {
  user: User,
  roles: Pick<UserRole, 'name' | 'description' | 'id' | 'status'>[]
}

export async function getCurrentUserRole(): Promise<userRole | null> {
  const user = await getUser()
  if (!user) return null
  const role = getRoleStore()
  if (role) return {
    user,
    roles: role,
  }
  const supabase = await createServerBaseClient()
  const { data: userRole, error } = await supabase
  .from('roles')
  .select('roles(name, id, description, status)')
  .eq('id', user.role_id)
  .single()

  if (error) {
    console.error('Error fetching role:', error)
    return null
  }
  return {
    user,
    roles: userRole.roles || [],
  }
}

export async function getUserRouteMenus(roles: Pick<UserRole, 'name' | 'description' | 'id' | 'status'>[]): Promise<Menu[]> {
  if (!roles || roles.length === 0) {
    return []
  }
  const routeMenusTree = getRouteMenusStore()
  if (routeMenusTree) return routeMenusTree
  const roleIds = roles.map(role => role.id)
  return await buildMenuTree(roleIds)
}

// 假设 role_ids 是一个字符串数组，包含角色 ID
async function buildMenuTree(roleIds: string[]) {
  const supabase = await createServerBaseClient()
  // 查询角色关联的菜单
  const { data: roleMenus, error: roleMenusError } = await supabase
  .from('role_menus')
  .select('menu_id')
  .in('role_id', roleIds)

  if (roleMenusError) {
    console.error('Error fetching role menus:', roleMenusError)
    return []
  }

  // 获取所有相关菜单的 ID
  const menuIds = roleMenus.map(rm => rm.menu_id)

  // 查询菜单详情
  const { data: menus, error: menusError } = await supabase
  .from('menus')
  .select('*')
  .in('id', menuIds)

  if (menusError) {
    console.error('Error fetching menus:', menusError)
    return []
  }
  // 缓存接口获取的菜单列表
  setMenusStore(menus)
  // 构建菜单树
  const menuMap = new Map<string, Menu>()
  menus.forEach(menu => menuMap.set(menu.id, { ...menu, children: [] }))

  const rootMenus = []

  // 构建父子关系
  for (const menu of menuMap.values()) {
    if (menu.parent_id) {
      const parent = menuMap.get(menu.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menu)
      }
    } else {
      rootMenus.push(menu)
    }
  }

  // 排序菜单
  const sortMenu = (menuList: Menu[]): Menu[] => {
    return menuList.sort((a, b) => a.sort_order - b.sort_order).map(menu => ({
      ...menu,
      children: menu.children ? sortMenu(menu.children) : [],
    }))
  }

  return sortMenu(rootMenus)
}

export async function initUserStore(user: User | null) {
  if (user) {
    setUserStore(user)
  }
  const userRole = await getCurrentUserRole()
  if (userRole) {
    setRoleStore(userRole.roles)
    const userMenus = await getUserRouteMenus(userRole.roles)
    setRouteMenusStore(userMenus)
  }
}

export async function resetAllInfo() {
  resetUserStore()
  resetRoleStore()
  resetMenusStore()
}

