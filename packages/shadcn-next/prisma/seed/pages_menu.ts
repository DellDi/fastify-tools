import { PrismaClient } from '@/types/prisma.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 为 AIGC 组补充「Pages站点」菜单，并授权给 admin / test 角色
export async function seedPagesMenu() {
  const aigcParent = await prisma.menu.findFirst({
    where: { name: 'AIGC', url: '#' },
  });
  if (!aigcParent) {
    console.log('未找到 AIGC 父菜单，跳过 Pages站点 菜单初始化');
    return;
  }

  // 固定 UUID，保证重复执行幂等
  const PAGES_MENU_ID = '7f2c8a1e-5b3d-4e6f-9a0b-1c2d3e4f5a6b';
  const menu = await prisma.menu.upsert({
    where: { id: PAGES_MENU_ID },
    update: {},
    create: {
      id: PAGES_MENU_ID,
      name: 'Pages站点',
      url: '/pages',
      icon: 'Globe',
      description: 'Pages 静态站点部署审计与管理',
      parentId: aigcParent.id,
    },
  });

  for (const roleName of ['admin', 'test']) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: { roleId: role.id, menuId: menu.id },
      },
      update: {},
      create: { roleId: role.id, menuId: menu.id },
    });
  }

  console.log('Pages站点 菜单初始化完成');
}
