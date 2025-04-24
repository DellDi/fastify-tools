import { PrismaClient } from '@/types/prisma';
import { hashPasswordWithSaltCrypto } from '@/utils/auth/password';

const prisma = new PrismaClient();

export async function seedInitAccount() {
  const INITIAL_SUPER_PASSWORD = process.env.INITIAL_SUPER_PASSWORD || 'zd808611'
  const { salt, hash } = hashPasswordWithSaltCrypto(INITIAL_SUPER_PASSWORD)

  // 查询角色名称为超级管理员的角色
  const adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  })

  if (!adminRole) {
    console.error('Admin role not found')
    return
  }
  
  const adminUser = await prisma.user.create({
    data: {
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
    },
  }); 

  console.log('Admin user seeded successfully', adminUser);
}

