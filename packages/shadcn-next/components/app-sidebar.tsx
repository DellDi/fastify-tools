'use client'

import { useEffect, useRef } from 'react'
import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { StorageCard } from '@/components/storage-card'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { routesConfig } from '@/utils/slide/route'
import { updateActiveMenu } from '@/utils/menu-converter'
import { Skeleton } from '@/components/ui/skeleton'
import { useMenuStore, useMenuActions } from '@/store/client/menuStore'
import { useUserActions } from '@/store/client/userStore'

export function AppSidebar() {
  const pathname = usePathname()
  const { navItems, isLoading, setNavItems, setLoading } = useMenuStore()
  const { loadMenusFromServer } = useMenuActions()
  const { loadUserFromServer } = useUserActions()

  // 使用 useRef 跟踪是否已经初始化，防止重复调用
  const initialized = useRef(false)

  // 当路径变化时更新活动菜单
  useEffect(() => {
    if (navItems.length > 0) {
      setNavItems(updateActiveMenu(navItems, pathname))
    }
  }, [pathname, setNavItems])

  // 在组件首次渲染时加载用户和菜单数据
  useEffect(() => {
    // 防止重复初始化
    if (initialized.current) return
    initialized.current = true

    async function initializeMenu() {
      // 无论是否已有菜单数据，都强制从服务器重新加载
      setLoading(true)

      try {
        // 首先加载用户信息
        await loadUserFromServer()

        // 然后加载菜单数据
        await loadMenusFromServer()
      } catch (error) {
        console.error('初始化菜单失败:', error)
        // 出错时显示空菜单
        setNavItems([])
      } finally {
        setLoading(false)
      }
    }

    initializeMenu()
  }, [])

  // 更新当前活动菜单 - 确保有有效的菜单数据
  // 只有在确认有数据时才设置菜单，否则使用空数组
  // 这样可以避免在数据未准备好时渲染导致的错误
  const displayNavItems = navItems.length > 0 ? navItems : []

  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={routesConfig.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>工具平台</SidebarLabel>
          {isLoading || displayNavItems.length === 0 ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <NavMain
              items={displayNavItems}
              searchResults={routesConfig.searchResults}
            />
          )}
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>项目中心</SidebarLabel>
          <NavProjects projects={routesConfig.projects} />
        </SidebarItem>
        <SidebarItem>
          <StorageCard />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={routesConfig.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
