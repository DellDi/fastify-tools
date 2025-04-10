import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function seedAuthInit() {
  // 1. 创建默认权限
  const permissions = [
    { name: 'password:view', description: '查看密码', groupName: 'password' },
    { name: 'password:create', description: '创建密码', groupName: 'password' },
    { name: 'file:manage', description: '管理文件', groupName: 'file' },
    { name: 'file:upload', description: '上传文件', groupName: 'file' },
    { name: 'file:bigLoad', description: '上传大文件', groupName: 'file' },
    { name: 'jira:view', description: '查看Jira', groupName: 'jira' },
    { name: 'jira:create', description: '创建Jira', groupName: 'jira' },
    { name: 'aigc:chat', description: '使用Chat工具', groupName: 'aigc' },
    { name: 'aigc:model', description: '调优模型', groupName: 'aigc' },
    { name: 'aigc:task', description: '任务管理', groupName: 'aigc' },
    { name: 'aigc:task:download', description: '任务下载', groupName: 'aigc' },
    { name: 'aigc:task:delete', description: '任务删除', groupName: 'aigc' },
    { name: 'settings:view', description: '查看设置', groupName: 'settings' },
    { name: 'role:view', description: '查看角色', groupName: 'role' },
    { name: 'role:create', description: '创建角色', groupName: 'role' },
    { name: 'role:update', description: '更新角色', groupName: 'role' },
    { name: 'role:delete', description: '删除角色', groupName: 'role' }
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    })
  }

  // 2. 创建基础菜单
  const rootMenus = [
    { name: '密码解析', url: '#', icon: 'SquareTerminal' },
    { name: '文件系统', url: '#', icon: 'Bot' },
    { name: 'jira中心', url: '#', icon: 'BookOpen' },
    { name: 'AIGC', url: '#', icon: 'Code2' },
    { name: '设置', url: '#', icon: 'Settings2' }
  ]

  const subMenus = [
    { parentName: '密码解析', name: 'v10加密中心', url: '/password/newsee', icon: 'History', description: 'neesee密码加解密' },
    { parentName: '文件系统', name: '文件管理', url: '/file/manage', icon: 'Rabbit', description: '我们最快的通用模型。' },
    { parentName: '文件系统', name: '文件上传', url: '/file/upload', icon: 'Bird', description: '高效的性能和速度。' },
    { parentName: '文件系统', name: '大文件上传', url: '/file/bigLoad', icon: 'Turtle', description: '最强大的复杂计算模型。' },
    { parentName: 'jira中心', name: '个人看板', url: '/jira/personal' },
    { parentName: 'jira中心', name: '创建工单', url: '/jira/create' },
    { parentName: 'AIGC', name: 'Chat工具', url: '/aigc/chat' },
    { parentName: 'AIGC', name: '模型调优', url: '/aigc/model' },
    { parentName: 'AIGC', name: '爬虫管理', url: '/aigc/crawler' },
    { parentName: 'AIGC', name: 'DIFY上传', url: '/aigc/dify' },
    { parentName: '设置', name: '账户', url: '/settings' },
    { parentName: '设置', name: '角色', url: '/role' }
  ]

  // 创建根菜单
  const rootMenuMap = new Map()
  for (const menu of rootMenus) {
    const menuId = crypto.randomUUID()
    const created = await prisma.menu.upsert({
      where: { id: menuId },
      update: {},
      create: {
        id: menuId,
        ...menu
      }
    })
    rootMenuMap.set(menu.name, created)
  }

  // 创建子菜单
  for (const menu of subMenus) {
    const parentMenu = rootMenuMap.get(menu.parentName)
    if (parentMenu) {
      const subMenuId = crypto.randomUUID()
      const { parentName, ...menuData } = menu
      await prisma.menu.upsert({
        where: { id: subMenuId },
        update: {},
        create: {
          id: subMenuId,
          ...menuData,
          parentId: parentMenu.id
        }
      })
    }
  }

  // 3. 创建基础角色
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: '系统管理员'
    }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: '普通用户'
    }
  })

  // 4. 为管理员角色分配所有权限和菜单
  const allPermissions = await prisma.permission.findMany()
  const allMenus = await prisma.menu.findMany()

  // 为admin角色分配所有权限
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    })
  }

  // 为admin角色分配所有菜单
  for (const menu of allMenus) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: adminRole.id,
          menuId: menu.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        menuId: menu.id
      }
    })
  }

  // 5. 为普通用户角色分配基础权限和菜单
  const userPermissions = [
    'password:view', 'password:create',
    'file:manage', 'file:upload',
    'jira:view', 'jira:create',
    'aigc:chat'
  ]

  const userMenus = [
    'v10加密中心', '文件管理', '文件上传',
    '个人看板', 'Chat工具'
  ]

  // 分配权限
  const basicPermissions = await prisma.permission.findMany({
    where: { name: { in: userPermissions } }
  })

  for (const permission of basicPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id
      }
    })
  }

  // 分配菜单
  const basicMenus = await prisma.menu.findMany({
    where: { name: { in: userMenus } }
  })

  for (const menu of basicMenus) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: userRole.id,
          menuId: menu.id
        }
      },
      update: {},
      create: {
        roleId: userRole.id,
        menuId: menu.id
      }
    })
  }

  console.log('Auth initialization completed successfully')
}