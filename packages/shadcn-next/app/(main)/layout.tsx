import { AppSidebar } from '@/components/app-sidebar'
import { SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar'
import { DynamicBreadcrumb } from '@/components/custom/DynamicBreadcrumb'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ToggleTheme } from '@/components/custom/ToggleTheme'

const Layout = async ({ children }: {
  children: React.ReactNode
}) => {
  const { cookies } = await import('next/headers')
  const sidebarState = await cookies()
  const sidebar = sidebarState.get('sidebar:state')
  return (
    <SidebarLayout
      defaultOpen={sidebar?.value === 'true'} // Now you can safely use sidebarState
    >
      <AppSidebar/>
      <main className="h-screen w-full flex flex-col box-border">
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-center">
            <SidebarTrigger className={`mr-2`}/>
            <DynamicBreadcrumb/>
          </div>
          <div className="flex-1 w-full flex justify-end">
            <form className="md:w-1/3 lg:w-1/4 sm:w-1/2 xs:w-1/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none pl-8 rounded-full bg-muted/60"
                />
              </div>
            </form>
            <ToggleTheme className="ml-2"/>
          </div>
        </header>
        <div className="grow bg-background p-4 box-border overflow-auto">
          {children}
        </div>
      </main>
    </SidebarLayout>
  )
}

export default Layout
