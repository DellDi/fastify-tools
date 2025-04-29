// 基于zustand的菜单状态管理
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MenuWithChildren } from '@/types/prisma-extensions'
import { NavItem, convertMenuToRouteConfig } from '@/utils/menu-converter'
import { fetchBase } from '@/utils/fetch/fetch'

/**
 * 菜单状态接口
 */
interface MenuState {
  // 状态
  menus: MenuWithChildren[]           // 原始菜单数据
  navItems: NavItem[]                 // 转换后的导航项
  isLoading: boolean                  // 加载状态
  activeMenuId: string | null         // 当前激活的菜单ID

  // 操作
  setMenus: (menus: MenuWithChildren[]) => void
  setNavItems: (navItems: NavItem[]) => void
  setLoading: (isLoading: boolean) => void
  setActiveMenu: (menuId: string | null) => void
  clearMenus: () => void

  // 计算属性
  hasPermission: (url: string) => boolean
}

/**
 * 菜单状态管理
 * 使用zustand实现，支持持久化存储
 */
export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      // 初始状态
      menus: [],
      navItems: [],
      isLoading: true,
      activeMenuId: null,

      // 设置菜单数据
      setMenus: (menus) => set({ menus }),

      // 设置导航项
      setNavItems: (navItems) => set({ navItems }),

      // 设置加载状态
      setLoading: (isLoading) => set({ isLoading }),

      // 设置当前激活的菜单
      setActiveMenu: (menuId) => set({ activeMenuId: menuId }),

      // 清除菜单数据
      clearMenus: () => set({ menus: [], navItems: [], activeMenuId: null }),

      // 检查是否有权限访问指定URL
      hasPermission: (url) => {
        const { menus } = get()

        // 如果没有菜单数据，默认没有权限
        if (!menus || menus.length === 0) return false

        // 检查是否有权限访问
        return menus.some(menu => {
          // 检查主菜单
          if (menu.url && url.startsWith(menu.url)) return true

          // 检查子菜单
          return menu.children.some(child =>
            child.url && url.startsWith(child.url)
          )
        })
      }
    }),
    {
      name: 'menu-storage',          // 存储的键名
      storage: createJSONStorage(() => localStorage),  // 使用localStorage存储
      partialize: (state) => ({
        menus: state.menus,           // 只持久化菜单数据
        navItems: state.navItems      // 和导航项
      }),
    }
  )
)

/**
 * 菜单操作钩子
 * 提供常用的菜单操作方法
 */
export const useMenuActions = () => {
  const { menus, setMenus, setNavItems, setLoading, clearMenus } = useMenuStore()

  /**
   * 从服务器加载菜单
   * @returns 加载的菜单数据
   */
  const loadMenusFromServer = async () => {
    setLoading(true)
    try {
      // 使用封装好的 fetch
      const response = await fetchBase('/api/auth/menu')

      // 打印响应数据，便于调试
      console.log('🚀 菜单接口原始响应:', response)
      
      if (response && response.menus && Array.isArray(response.menus)) {
        // 设置菜单数据
        setMenus(response.menus)
        
        // 同时转换并设置导航项
        const convertedNavItems = convertMenuToRouteConfig(response.menus)
        console.log('🚀 转换后的导航项:', convertedNavItems)
        
        // 更新导航项状态
        setNavItems(convertedNavItems)
        
        // 返回处理后的菜单数据
        return { menus: response.menus, navItems: convertedNavItems }
      } else {
        console.warn('菜单数据格式不正确:', response)
        return { menus: [], navItems: [] }
      }
    } catch (error) {
      console.error('加载菜单失败:', error)
      return { error, menus: [], navItems: [] }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 登出时清除菜单
   */
  const clearMenusOnLogout = () => {
    clearMenus()
  }

  return {
    menus,
    loadMenusFromServer,
    clearMenusOnLogout
  }
}
