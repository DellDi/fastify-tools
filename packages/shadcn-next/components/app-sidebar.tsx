'use client'

import { useEffect, useState } from 'react'
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
import { getUserMenus } from '@/app/actions/menu-actions'
import { NavItem, convertMenuToRouteConfig, updateActiveMenu } from '@/utils/menu-converter'
import { Skeleton } from '@/components/ui/skeleton'

export function AppSidebar() {
  const pathname = usePathname()
  const [navItems, setNavItems] = useState<NavItem[]>(routesConfig.navMain)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadMenus() {
      try {
        // 首先尝试从 localStorage 获取菜单
        const storedMenus = localStorage.getItem('user_menus')
        
        if (storedMenus) {
          try {
            const parsedMenus = JSON.parse(storedMenus)
            const convertedNavItems = convertMenuToRouteConfig(parsedMenus)
            setNavItems(convertedNavItems)
            setIsLoading(false)
          } catch (e) {
            console.error('解析存储的菜单数据失败:', e)
            await fetchMenusFromServer()
          }
        } else {
          await fetchMenusFromServer()
        }
      } catch (error) {
        console.error('加载菜单失败:', error)
        setIsLoading(false)
      }
    }
    
    loadMenus()
  }, [])
  
  async function fetchMenusFromServer() {
    try {
      const { menus, error } = await getUserMenus()
      
      if (error) {
        console.error('获取菜单错误:', error)
        return
      }
      
      if (menus && menus.length > 0) {
        const convertedNavItems = convertMenuToRouteConfig(menus)
        setNavItems(convertedNavItems)
        // 同时更新 localStorage
        localStorage.setItem('user_menus', JSON.stringify(menus))
      }
    } catch (error) {
      console.error('获取菜单失败:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 更新当前活动菜单
  const updatedNavItems = updateActiveMenu(navItems, pathname)
  
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
            <NavMain items={updatedNavItems} searchResults={routesConfig.searchResults}/>
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
