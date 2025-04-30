'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight, type LucideIcon, Search, FileIcon, icons, type LucideProps } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { Icons } from './ui/icons'

export function NavMain({
  className,
  items,
  searchResults,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | string
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  searchResults: React.ComponentProps<typeof SidebarSearch>['results']
} & React.ComponentProps<'ul'>) {
  // 获取当前路径
  const pathname = usePathname()
  
  // 检查菜单项是否激活
  const isActive = (url: string) => {
    return pathname.includes(url)
  }
  
  // 检查父菜单是否应该展开（当前路径匹配父菜单或其任何子菜单）
  const shouldExpand = (item: any) => {
    // 如果当前路径匹配父菜单URL，则展开
    if (isActive(item.url)) return true
    
    // 如果有子菜单，检查是否有任何子菜单匹配当前路径
    if (item.items && item.items.length > 0) {
      return item.items.some((subItem: any) => isActive(subItem.url))
    }
    
    return item.isActive || false
  }
  
  // 渲染图标函数 - 支持组件函数和字符串名称
  const renderIcon = (icon: LucideIcon | string | undefined) => {
    // 默认图标，当没有图标时使用
    if (!icon) {
      return <FileIcon className="h-4 w-4 shrink-0" />
    }
    
    try {
      // 如果是对象并且是React组件（包括Forward Ref）
      if (typeof icon === 'object' && icon !== null && 'render' in icon) {
        return React.createElement(icon as any, { className: "h-4 w-4 shrink-0" })
      }
      
      // 如果是函数组件（Lucide图标）
      if (typeof icon === 'function') {
        return React.createElement(icon as any, { className: "h-4 w-4 shrink-0" })
      }
      
      // 如果是字符串
      if (typeof icon === 'string') {
        // 从自定义Icons对象中查找
        if (icon in Icons) {
          return React.createElement(Icons[icon as keyof typeof Icons] as any, { className: "h-4 w-4 shrink-0" })
        }
        
        // 从lucide-react图标库中查找
        if (icon in icons) {
          return React.createElement(icons[icon as keyof typeof icons] as any, { className: "h-4 w-4 shrink-0" })
        }
        
        // 如果是图片URL
        if (icon.startsWith('http') || icon.startsWith('/')) {
          return <img src={icon} alt="menu icon" className="h-4 w-4 shrink-0 object-contain" />
        }
      }
    } catch (error) {
      console.error('Error rendering icon:', error)
    }
    
    // 默认图标
    return <FileIcon className="h-4 w-4 shrink-0" />
  }

  return (
    <ul className={cn('grid gap-0.5', className)}>
      <li>
        <SidebarSearch results={searchResults} />
      </li>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={shouldExpand(item)}>
          <li>
            <div className="relative flex items-center">
              <Link
                href={item.url}
                className={`min-w-8 flex h-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-hidden ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 ${
                  isActive(item.url) ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                {/* 安全渲染图标，支持组件函数和字符串名称 */}
                {renderIcon(item.icon)}
                <div className="flex flex-1 overflow-hidden">
                  <div className="line-clamp-1 pr-6">{item.title}</div>
                </div>
              </Link>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 data-[state=open]:rotate-90"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-4 py-0.5">
              <ul className="grid border-l px-2">
                {item.items?.map((subItem) => (
                  <li key={subItem.title}>
                    <Link
                      href={subItem.url || '#'}
                      className={`min-w-8 flex h-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 ${isActive(subItem.url)
                        ? 'bg-accent text-accent-foreground'
                        : ''}`}
                    >
                      <div className="line-clamp-1">{subItem.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </li>
        </Collapsible>
      ))}
    </ul>
  )
}

function SidebarSearch({
  results,
}: {
  results: {
    title: string
    teaser: string
    url: string
  }[]
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="min-w-8 flex h-8 w-full flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-hidden ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <div className="flex flex-1 overflow-hidden">
            <div className="line-clamp-1 pr-6">搜索</div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <form>
            <div className="border-b p-2.5">
              <Input
                type="search"
                placeholder="搜索..."
                className="h-8 rounded-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </form>
          <div className="grid gap-1 p-1.5 text-sm">
            {results.map((result) => (
              <Link
                href={result.url}
                key={result.title}
                className="rounded-md p-2.5 outline-hidden ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
              >
                <div className="font-medium">{result.title}</div>
                <div className="line-clamp-2 text-muted-foreground">
                  {result.teaser}
                </div>
              </Link>
            ))}
            <Separator className="my-1.5" />
            <Link
              href="#"
              className="rounded-md px-2.5 py-1 text-muted-foreground outline-hidden ring-ring hover:text-foreground focus-visible:ring-2"
            >
              See all results
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger className="min-w-8 flex h-8 w-full flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-hidden ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        <Search className="h-4 w-4 shrink-0" />
        <div className="flex flex-1 overflow-hidden">
          <div className="line-clamp-1 pr-6">搜索</div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={4}
        className="w-96 p-0"
      >
        <form>
          <div className="border-b p-2.5">
            <Input
              type="search"
              placeholder="搜索..."
              className="h-8 rounded-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </form>
        <div className="grid gap-1 p-1.5 text-sm">
          {results.map((result) => (
            <Link
              href={result.url}
              key={result.title}
              className="rounded-md p-2.5 outline-hidden ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
            >
              <div className="font-medium">{result.title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {result.teaser}
              </div>
            </Link>
          ))}
          <Separator className="my-1.5" />
          <Link
            href="#"
            className="rounded-md px-2.5 py-1 text-muted-foreground outline-hidden ring-ring hover:text-foreground focus-visible:ring-2"
          >
            See all results
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
