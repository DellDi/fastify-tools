import { MenuWithChildren } from '@/types/prisma-extensions'
import {
  SquareTerminal, Bot, BookOpen, Code2, Settings2,
  History, Rabbit, Bird, Turtle, Map, PieChart, Frame,
  LucideIcon, FileIcon // 添加一个默认图标
} from 'lucide-react'

// 图标映射表
const iconMap: Record<string, LucideIcon> = {
  'SquareTerminal': SquareTerminal,
  'Bot': Bot,
  'BookOpen': BookOpen,
  'Code2': Code2,
  'Settings2': Settings2,
  'History': History,
  'Rabbit': Rabbit,
  'Bird': Bird,
  'Turtle': Turtle,
  'Map': Map,
  'PieChart': PieChart,
  'Frame': Frame,
  'Model': FileIcon,
  // 可以添加更多图标
}

// 默认图标，当找不到匹配的图标时使用
const DEFAULT_ICON: LucideIcon = FileIcon

// 菜单项类型
export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  description?: string
  items?: {
    title: string
    url: string
    icon?: LucideIcon
    description?: string
  }[]
}

/**
 * 将后端菜单转换为前端路由配置
 * @param menus 后端菜单数据
 * @returns 前端路由配置
 */
export function convertMenuToRouteConfig(menus: MenuWithChildren[]): NavItem[] {
  // 确保 menus 是数组且不为空
  if (!Array.isArray(menus) || menus.length === 0) {
    console.warn('菜单数据为空或格式不正确，使用默认配置')
    return []
  }

  return menus.map(menu => {
    if (!menu) {
      console.warn('发现无效的菜单项')
      return null
    }

    try {
      // 获取图标，确保是有效的 Lucide 图标组件
      let IconComponent: LucideIcon = Settings2 // 默认图标

      if (menu.icon && typeof menu.icon === 'string') {
        IconComponent = iconMap[menu.icon] || Settings2
      }

      // 处理父级菜单
      return {
        title: menu.name || '未命名菜单',
        url: menu.url || '#',
        icon: IconComponent,
        isActive: false,
        description: menu.description || '',
        items: Array.isArray(menu.children)
          ? menu.children
            .filter(child => child) // 过滤掉 null 或 undefined
            .map(child => {
              try {
                // 获取子菜单图标
                let ChildIconComponent: LucideIcon = History // 默认子菜单图标

                if (child.icon && typeof child.icon === 'string') {
                  ChildIconComponent = iconMap[child.icon] || History
                }

                return {
                  title: child.name || '未命名项',
                  url: child.url || '/',
                  icon: ChildIconComponent,
                  description: child.description || '',
                }
              } catch (error) {
                console.error('处理子菜单项时出错:', error)
                return {
                  title: child.name || '错误项',
                  url: '#',
                  icon: History,
                  description: '',
                }
              }
            })
          : []
      }
    } catch (error) {
      console.error('处理菜单项时出错:', error)
      return {
        title: '错误菜单',
        url: '#',
        icon: Settings2,
        isActive: false,
        items: []
      }
    }
  }).filter(Boolean) as NavItem[] // 过滤掉可能的 null 值
}

/**
 * 从路由配置中查找当前活动菜单
 * @param navItems 路由配置
 * @param pathname 当前路径
 * @returns 更新后的路由配置
 */
export function updateActiveMenu(navItems: NavItem[], pathname: string): NavItem[] {
  return navItems.map(navItem => ({
    ...navItem,
    isActive: navItem.items?.some(item => pathname.startsWith(item.url)) || false
  }))
}
