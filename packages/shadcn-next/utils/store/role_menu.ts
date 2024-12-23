// 基于supabase的role_menu菜单管理
// import { create } from 'zustand'

import { create } from 'zustand/index'
import { Menu } from '@supabase/supabase-js'

interface UserRoleMenus {
  menus: Menu[] | null
  setMenus: (Menu: Menu[]) => void
  resetMenus: () => void
}

const useMenusStore = create<UserRoleMenus>((set) => ({
  menus: null,
  setMenus: (menus) => set({ menus }),
  resetMenus: () => set({ menus: null }),
}))

const setMenusStore = (menus: Menu[]) => useMenusStore.getState().setMenus(menus)
const getMenusStore = () => useMenusStore.getState().menus
const resetMenusStore = () => useMenusStore.getState().resetMenus()

export {
  useMenusStore,
  setMenusStore,
  getMenusStore,
  resetMenusStore,
}
