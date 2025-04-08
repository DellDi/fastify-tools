# 数据库种子 (Seeds) 使用指南

## 概述

种子数据是初始化数据库的预设数据，用于确保应用程序在首次启动时具有必要的基础数据。在 Docker 环境中，无论是首次部署还是后续迭代，种子数据都会自动执行。

## 种子文件结构

项目中的种子文件位于 `prisma/seed/` 目录下，主要包括：

```
prisma/
├── seed.ts                # 主种子文件，协调所有种子的执行
└── seed/
    ├── auth_init.ts       # 认证相关初始数据（角色、权限、菜单等）
    └── home_sections.ts   # 首页sections数据
```

## 种子数据执行机制

我们使用 Prisma 的 `upsert` 操作来处理种子数据，这确保了种子脚本可以**安全地重复执行**，不会产生重复数据：

```typescript
// 示例：upsert 操作
await prisma.role.upsert({
  where: { name: 'admin' },
  update: {},  // 如果记录存在，不做任何更新
  create: {    // 如果记录不存在，创建新记录
    name: 'admin',
    description: '系统管理员'
  }
})
```

## Docker 环境中的种子执行

在 Docker 环境中，种子数据通过统一的启动脚本 `docker-start.sh` 自动执行：

```bash
# 执行数据库迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate

# 执行种子数据
npx prisma db seed
```

## 添加新的种子数据

当需要添加新的种子数据时，按照以下步骤操作：

1. 在 `prisma/seed/` 目录下创建新的种子文件，例如 `new_seed.ts`：

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedNewData() {
  // 使用 upsert 操作确保安全重复执行
  await prisma.yourModel.upsert({
    where: { /* 唯一标识 */ },
    update: {},
    create: { /* 新数据 */ }
  });
  
  console.log('New seed data executed successfully');
}
```

2. 在主种子文件 `prisma/seed.ts` 中引入并调用新的种子函数：

```typescript
import { seedNewData } from './seed/new_seed.js';

async function main() {
  try {
    // 其他种子...
    
    // 执行新的种子数据
    await seedNewData();
    
  } catch (error) {
    // 错误处理...
  }
}
```

## 更新现有种子数据

当需要更新现有种子数据时：

1. 修改相应的种子文件
2. 如果需要强制更新已存在的数据，在 `upsert` 的 `update` 部分添加需要更新的字段

```typescript
// 更新已存在的数据
await prisma.role.upsert({
  where: { name: 'admin' },
  update: { 
    description: '更新后的描述'  // 会更新已存在记录的描述
  },
  create: { /* ... */ }
})
```

## 首次部署与后续迭代的区别

得益于 `upsert` 操作和统一的启动脚本，无论是首次部署还是后续迭代，数据库初始化流程都是一致的：

1. **首次部署**：所有种子数据都会被执行，创建初始记录
2. **后续迭代**：
   - 已存在的数据会被跳过（除非 `update` 部分有更新）
   - 新增的种子数据会被执行，添加新记录

这种机制确保了 Docker 环境中数据库的一致性，无需针对首次部署和后续迭代编写不同的配置。

## 最佳实践

1. **始终使用 `upsert`**：确保种子脚本可以安全重复执行
2. **使用唯一标识**：在 `where` 条件中使用唯一字段（如 `name`、`id` 等）
3. **谨慎更新**：只在必要时在 `update` 部分添加字段，避免不必要的数据更新
4. **模块化**：每类数据使用单独的种子文件，便于维护
5. **日志记录**：添加适当的日志，便于调试和监控种子执行情况
