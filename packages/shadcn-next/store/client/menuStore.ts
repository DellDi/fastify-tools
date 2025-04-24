// 基于supabase的role_menu菜单管理
import { create } from 'zustand'
import { Menu } from '@supabase/supabase-js'

interface UserRoleMenus {
  menus: Menu[] | null
  routeMenus: Menu[] | null
  setMenus: (Menu: Menu[]) => void
  setRouteMenus: (menus: Menu[]) => void
  resetMenus: () => void
  resetRoutesMenus: () => void
}

const useMenusStore = create<UserRoleMenus>((set) => ({
  menus: null,
  routeMenus: null,
  setMenus: (menus) => set({ menus }),
  setRouteMenus: (menus: Menu[]) => set({ menus }),
  resetMenus: () => set({ menus: null }),
  resetRoutesMenus: () => set({ routeMenus: null }),
}))

const setMenusStore = (menus: Menu[]) => useMenusStore.getState().setMenus(menus)
const getMenusStore = () => useMenusStore.getState().menus
const setRouteMenusStore = (menus: Menu[]) => useMenusStore.getState().setRouteMenus(menus)
const getRouteMenusStore = () => useMenusStore.getState().routeMenus

const resetMenusStore = () => {
  useMenusStore.getState().resetMenus()
  useMenusStore.getState().resetRoutesMenus()
}

export {
  useMenusStore,
  setMenusStore,
  setRouteMenusStore,
  getMenusStore,
  getRouteMenusStore,
  resetMenusStore,
}
