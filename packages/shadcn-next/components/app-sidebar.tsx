'use client'

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

export  function AppSidebar() {
  const pathname = usePathname()
  // const pathSegments = pathname.split('/').filter((segment: string) => segment);
  // Update isActive status based on current route

  routesConfig.navMain.forEach(navItem => {
    navItem.isActive = navItem.items.some(item => (pathname || '').includes(item.url))
  })
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={routesConfig.teams}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          <NavMain items={routesConfig.navMain} searchResults={routesConfig.searchResults}/>
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={routesConfig.projects}/>
        </SidebarItem>
        {/*<SidebarItem className="mt-auto">*/}
        {/*<SidebarLabel>Help</SidebarLabel>*/}
        {/*<NavSecondary items={routesConfig.navSecondary} />*/}
        {/*</SidebarItem>*/}
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
