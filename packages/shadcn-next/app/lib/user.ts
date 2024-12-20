'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserStore } from '@/utils/store/user'
import { UserRole } from '@/utils/store/role'
import { Menu, Role, type User } from '@supabase/supabase-js'

export async function getUser(): Promise<User | null> {
  const userInfo = getUserStore()
  if (userInfo) return userInfo
  const supabase = await createClient()
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

  const supabase = await createClient()
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

export async function getUserMenus(roles: Role[]): Promise<Menu[]> {
  if (!roles || roles.length === 0) {
    return []
  }
  const roleIds = roles.map(role => role.id)
  const supabase = await createClient()
  const { data: menuData, error: menuError } = await supabase
  .from('role_menus')
  .select('*')
  .in('role_id', roleIds)

  if (menuError) {
    console.error('Error fetching user menus:', menuError)
    return []
  }
  if (!menuData) return []
  // 去重
  return buildMenuTree(menuData)
}

// 构建菜单树
function buildMenuTree(menus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>()
  const rootMenus: Menu[] = []

  menus.forEach(menu => {
    menu['children'] = [] // 初始化 children 属性
    menuMap.set(menu.id, menu)
    if (menu.parent_id) {
      const parentMenu = menuMap.get(menu.parent_id)
      if (parentMenu) {
        parentMenu['children']!.push(menu)
      }
    } else {
      rootMenus.push(menu)
    }
  })

  return rootMenus
}

// 如果用户是第一次注册，且注册验证成功了，但是用户还没有分配默认角色、需要分配一个默认的角色给到当前注册成功的用户
export async function assignDefaultRole(user: User): Promise<void> {
  const supabase = await createClient()
  const { data, error } = await supabase
  .from('roles')
  .select('id')
  .eq('name', 'user') // 假设默认角色名为 'default'
  if (error) {
    console.error('Error fetching default role:', error)
    return
  }
  if (data && data.length > 0) {
    const defaultRoleId = data[0].id
    await supabase
    .from('users')
    .update({ role_id: defaultRoleId })
    .eq('id', user.id)
  }
}
