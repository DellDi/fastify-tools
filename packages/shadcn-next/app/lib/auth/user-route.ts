import { Menu } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { MenuWithChildren } from '@/types/prisma-extensions'
import { serviceCache } from '@/store/service'

// 获取用户的角色菜单 - 优化版本
export async function getUserRolesMenu(userId: string): Promise<MenuWithChildren[]> {
    // 一次性查询用户及其角色和菜单
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            roleId: true,           // 选择用户的角色ID
            userRole: {             // 关联查询用户的角色
                select: {
                    id: true,       // 选择角色ID
                    roleMenus: {    // 关联查询角色的菜单关联
                        select: {
                            menu: true  // 关联查询菜单详情
                        }
                    }
                }
            }
        }
    });

    // 用户不存在或没有角色
    if (!user || !user.roleId || !user.userRole) {
        return [];
    }

    // 提取所有菜单
    const menus = user.userRole.roleMenus.map(rm => rm.menu);
    
    // 构建菜单树
    const menuTree = buildMenuTree(menus);
    
    // 缓存菜单树
    serviceCache.set(userId + '_menu', menuTree);
    
    return menuTree;
}

/**
 * 将 Prisma Menu 模型转换为 RouteMenu 接口
 */
function convertToRouteMenu(menu: Menu): MenuWithChildren {
    return {
        ...menu,
        children: []
    };
}

/**
 * 构建菜单树结构
 */
function buildMenuTree(menus: Menu[]): MenuWithChildren[] {
    // 转换所有菜单为 RouteMenu 格式
    const routeMenuMap = new Map<string, MenuWithChildren>();
    menus.forEach(menu => {
        routeMenuMap.set(menu.id, convertToRouteMenu(menu));
    });

    // 构建树结构
    const rootMenus: MenuWithChildren[] = [];

    // 遍历所有菜单，将子菜单添加到父菜单的 children 数组中
    routeMenuMap.forEach(menu => {
        if (menu.parentId && routeMenuMap.has(menu.parentId)) {
            // 如果有父菜单，则添加到父菜单的 children 数组
            const parentMenu = routeMenuMap.get(menu.parentId);
            if (parentMenu) {
                parentMenu.children.push(menu);
            }
        } else {
            // 如果没有父菜单或父菜单不在当前菜单集合中，则为根菜单
            rootMenus.push(menu);
        }
    });

    // 对菜单进行排序
    rootMenus.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    routeMenuMap.forEach(menu => {
        menu.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    });

    return rootMenus;
}