import { PrismaClient } from '@/types/prisma.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function seedInitRoleMenu() {
  // 1. 创建默认权限
  const permissions = [
    { name: 'password:view', description: '查看密码', groupName: 'password' },
    { name: 'password:create', description: '创建密码', groupName: 'password' },
    { name: 'file:manage', description: '管理文件', groupName: 'file' },
    { name: 'file:upload', description: '上传文件', groupName: 'file' },
    { name: 'file:big_upload', description: '上传大文件', groupName: 'file' },
    { name: 'jira:view', description: '查看Jira', groupName: 'jira' },
    { name: 'jira:create', description: '创建Jira', groupName: 'jira' },
    { name: 'chat:view', description: '使用Chat工具', groupName: 'chat' },
    { name: 'model:view', description: '调优模型', groupName: 'model' },
    { name: 'task:view', description: '任务管理', groupName: 'task' },
    { name: 'task:download', description: '任务下载', groupName: 'task' },
    { name: 'task:delete', description: '任务删除', groupName: 'task' },
    { name: 'settings:view', description: '查看个人设置', groupName: 'settings' },
    { name: 'settings:edit', description: '编辑个人设置', groupName: 'settings' },
    { name: 'role:view', description: '查看角色', groupName: 'role' },
    { name: 'role:create', description: '创建角色', groupName: 'role' },
    { name: 'role:update', description: '更新角色', groupName: 'role' },
    { name: 'role:delete', description: '删除角色', groupName: 'role' },
    { name: 'role:assign', description: '分配角色', groupName: 'role' },
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
    { name: '设置', url: '#', icon: 'Settings2' },
  ]

  const subMenus = [
    { parentName: '密码解析', name: 'v10加密中心', url: '/password/newsee', icon: 'History', description: 'neesee密码加解密' },
    { parentName: '文件系统', name: '文件管理', url: '/file/manage', icon: 'Rabbit', description: '我们最快的通用模型。' },
    { parentName: '文件系统', name: '文件上传', url: '/file/upload', icon: 'Bird', description: '高效的性能和速度。' },
    { parentName: '文件系统', name: '大文件上传', url: '/file/big_upload', icon: 'Turtle', description: '最强大的复杂计算模型。' },
    { parentName: 'jira中心', name: '个人看板', url: '/jira/personal', icon: 'BookOpen', description: '个人看板' },
    { parentName: 'jira中心', name: '创建工单', url: '/jira/create', icon: 'BookOpen', description: '创建工单' },
    { parentName: 'AIGC', name: 'Chat工具', url: '/aigc/chat', icon: 'SquareTerminal', description: 'Chat工具' },
    { parentName: 'AIGC', name: '模型调优', url: '/aigc/model', icon: 'Code2', description: '模型调优' },
    { parentName: 'AIGC', name: '爬虫管理', url: '/aigc/task', icon: 'Code2', description: '爬虫管理' },
    { parentName: '设置', name: '账户', url: '/settings', icon: 'SquareTerminal', description: '账户' },
    { parentName: '设置', name: '角色', url: '/role', icon: 'SquareTerminal', description: '角色' }
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

  const testRole = await prisma.role.upsert({
    where: { name: 'test' },
    update: {},
    create: {
      name: 'test',
      description: '测试用户'
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
    'file:big_upload',
    'jira:view', 'jira:create',
    'settings:view',
    'task:view',
    'task:download',
  ]

  const userMenus = [
    'v10加密中心', '文件管理', '文件上传', '大文件上传',
    '个人看板', 'Chat工具', '任务管理', '账户'
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

  // 6. 为测试用户分配分配测试权限和菜单
  const textPermissions = [
    'password:view', 'password:create',
    'file:manage', 'file:upload',
    'file:big_upload',
    'jira:view', 'jira:create',
    'chat:view',
    'model:view',
    'task:view',
    'task:download',
    'task:delete',
  ]

  const textMenus = [
    'v10加密中心', '个人看板', '创建工单', '任务管理', "爬虫管理", "模型调优", '账户'
  ]
  // 分配权限
  const textPermissionsData = await prisma.permission.findMany({
    where: { name: { in: textPermissions } }
  })

  for (const permission of textPermissionsData) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: testRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: testRole.id,
        permissionId: permission.id
      }
    })
  }

  // 分配菜单
  const textMenusData = await prisma.menu.findMany({
    where: { name: { in: textMenus } }
  })
  for (const menu of textMenusData) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: testRole.id,
          menuId: menu.id
        }
      },
      update: {},
      create: {
        roleId: testRole.id,
        menuId: menu.id
      }
    })
  }

  console.log('菜单与权限初始化种子完成')
}