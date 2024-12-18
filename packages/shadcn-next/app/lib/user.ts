'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserStore } from '@/utils/store/user'
import { UserRole } from '@/utils/store/role'
import { type User } from '@supabase/supabase-js'

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

async function getUserMenus(roles: Role[]): Promise<Menu[]> {
  if (!roles || roles.length === 0) {
    return []
  }
  const roleIds = roles.map(role => role.id)

  const { data: menuData, error: menuError } = await supabase
  .from('role_menus')
  .select('menus(*)')
  .in('role_id', roleIds)
  if (menuError) {
    console.error('Error fetching user menus:', menuError)
    return []
  }
  if (!menuData) return []
  const menus = menuData.map(rm => rm.menus)
  // 去重
  const uniqueMenus = Array.from(new Set(menus.map(JSON.stringify))).map(JSON.parse)
  return buildMenuTree(uniqueMenus)
}

// 构建菜单树
function buildMenuTree(menus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>()
  const rootMenus: Menu[] = []

  menus.forEach(menu => {
    menu.children = [] // 初始化 children 属性
    menuMap.set(menu.id, menu)
    if (menu.parentId) {
      const parentMenu = menuMap.get(menu.parentId)
      if (parentMenu) {
        parentMenu.children!.push(menu)
      }
    } else {
      rootMenus.push(menu)
    }
  })

  return rootMenus
}

