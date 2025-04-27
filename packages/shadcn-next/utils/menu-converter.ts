import { MenuWithChildren } from '@/types/prisma-extensions'
import { 
  SquareTerminal, Bot, BookOpen, Code2, Settings2, 
  History, Rabbit, Bird, Turtle, Map, PieChart, Frame,
  LucideIcon
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
  // 可以添加更多图标
}

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
  return menus.map(menu => {
    // 获取图标，如果没有指定或找不到则使用默认图标
    const IconComponent = menu.icon ? (iconMap[menu.icon] || Settings2) : Settings2
    
    // 处理父级菜单
    return {
      title: menu.name,
      url: menu.url || '#',
      icon: IconComponent,
      isActive: false,
      description: menu.description || '',
      items: menu.children.map(child => {
        // 获取子菜单图标
        const ChildIconComponent = child.icon ? (iconMap[child.icon] || History) : History
        
        return {
          title: child.name,
          url: child.url || '/',
          icon: ChildIconComponent,
          description: child.description || '',
        }
      })
    }
  })
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
