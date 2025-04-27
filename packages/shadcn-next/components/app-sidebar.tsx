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
import { convertMenuToRouteConfig, updateActiveMenu } from '@/utils/menu-converter'
import { Skeleton } from '@/components/ui/skeleton'
import { useMenuStore, useMenuActions } from '@/store/client/menuStore'

export function AppSidebar() {
  const pathname = usePathname()
  const { navItems, menus, isLoading, setNavItems, setLoading } = useMenuStore()
  const { loadMenusFromServer } = useMenuActions()
  
  // 使用 useRef 跟踪是否已经初始化，防止重复调用
  const initialized = useRef(false)
  
  // 当路径变化时更新活动菜单
  useEffect(() => {
    if (navItems.length > 0) {
      setNavItems(updateActiveMenu(navItems, pathname))
    }
  }, [pathname, setNavItems])
  
  // 只在组件首次渲染时加载菜单
  useEffect(() => {
    // 防止重复初始化
    if (initialized.current) return
    initialized.current = true
    
    async function initializeMenu() {
      // 如果已经有菜单数据，只需要更新活动状态
      if (menus.length > 0) {
        const convertedNavItems = convertMenuToRouteConfig(menus)
        setNavItems(updateActiveMenu(convertedNavItems, pathname))
        setLoading(false)
        return
      }
      
      // 否则从服务器加载菜单
      try {
        await loadMenusFromServer()
        
        // 如果没有获取到菜单，使用默认菜单
        if (navItems.length === 0) {
          setNavItems(updateActiveMenu(routesConfig.navMain, pathname))
        }
      } catch (error) {
        console.error('初始化菜单失败:', error)
        // 使用默认菜单
        setNavItems(updateActiveMenu(routesConfig.navMain, pathname))
      } finally {
        setLoading(false)
      }
    }
    
    initializeMenu()
  }, [])
  
  // 更新当前活动菜单
  const displayNavItems = navItems.length > 0 
    ? navItems 
    : updateActiveMenu(routesConfig.navMain, pathname)
  
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={routesConfig.teams}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <NavMain items={displayNavItems} searchResults={routesConfig.searchResults}/>
          )}
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={routesConfig.projects}/>
        </SidebarItem>
        <SidebarItem>
          <StorageCard/>
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={routesConfig.user}/>
      </SidebarFooter>
    </Sidebar>
  )
}
