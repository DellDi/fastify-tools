import { PrismaClient } from '@/types/prisma';
import { hashPasswordWithSaltCrypto } from '@/utils/auth/password';

const prisma = new PrismaClient();

export async function seedInitAccount() {
  const INITIAL_SUPER_PASSWORD = process.env.INITIAL_SUPER_PASSWORD || 'zd808611'
  const INITIAL_USER_PASSWORD = process.env.INITIAL_USER_PASSWORD || '123456'
  const { salt, hash } = hashPasswordWithSaltCrypto(INITIAL_SUPER_PASSWORD)
  const { salt: salt2, hash: hash2 } = hashPasswordWithSaltCrypto(INITIAL_USER_PASSWORD)
  // 查询角色名称为超级管理员的角色
  const adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  })

  const testRole = await prisma.role.findFirst({
    where: { name: 'test' },
  })

  if (!adminRole || !testRole) {
    console.error('Admin role not found, 请先执行role初始化的种子')
    return
  }

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'delldi808611@outlook.com', 
      phone: '18668184122',
      roleId: adminRole.id,
    },
    update: {},
    create: {
      email: 'delldi808611@outlook.com',
      role: '超级管理员',
      roleId: adminRole.id,
      status: 'active',
      phone: '18668184122',
      phoneConfirmedAt: new Date(),
      username: 'delldi',
      isSuperAdmin: true,
      encryptedPassword: hash,
      emailConfirmedAt: new Date(),
      rawUserMetaData: {
        salt,
      },
    }
  });

  // 添加一个测试用户
  const testUser = await prisma.user.upsert({
    where: { email: 'test@test.com', roleId: testRole.id ,phone: '18888888888'  },
    update: {},
    create: {
      email: 'test@test.com',
      role: '测试用户',
      roleId: testRole.id,
      status: 'active',
      phone: '18888888888',
      phoneConfirmedAt: new Date(),
      username: 'test',
      isSuperAdmin: false,
      encryptedPassword: hash2,
      emailConfirmedAt: new Date(),
      rawUserMetaData: {
        salt: salt2,
      },
    }
  })

  console.log('Admin user seeded successfully', adminUser);
  console.log('Test user seeded successfully', testUser);
}

