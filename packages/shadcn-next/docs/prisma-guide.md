# Prisma 使用指南

## 目录
1. [数据库配置](#数据库配置)
2. [数据模型](#数据模型)
3. [数据迁移](#数据迁移)
4. [种子数据初始化](#种子数据初始化)

## 数据库配置

项目使用PostgreSQL数据库，通过环境变量`DATABASE_URL`配置数据库连接。在`.env`文件中配置：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
```

## 数据模型

项目主要包含以下数据模型：

- `User`: 用户表
- `Role`: 角色表
- `Permission`: 权限表
- `Menu`: 菜单表
- `HomeSection`: 首页配置表
- `AuditLogEntry`: 审计日志表
- `LoginLog`: 登录日志表
- `VerificationCode`: 验证码表

详细的数据模型定义请查看 `prisma/schema.prisma` 文件。

## 数据迁移

### 迁移文件说明

项目的迁移文件都集中在 `prisma/migrations` 目录下，包括：

1. 表结构迁移
2. 字段注释配置
3. 行级安全策略(RLS)设置

所有迁移都遵循Prisma的命名规范：`[timestamp]_[name].sql`

### 创建新的迁移

当您修改了 schema.prisma 文件后，创建新的迁移：

```bash
# 开发环境创建迁移
npx prisma migrate dev --name your_migration_name
```

这将：
- 创建新的迁移文件
- 执行所有待处理的迁移
- 重新生成 Prisma Client

### 生产环境部署

在生产环境中应用迁移：

```bash
# 执行所有待处理的迁移
npx prisma migrate deploy
```

这个命令会：
- 检查并执行所有未应用的迁移文件
- 自动应用表结构变更
- 执行字段注释
- 设置RLS策略

## 种子数据初始化

项目使用结构化的种子文件组织初始化数据：

```
prisma/
├── seed/
│   ├── auth_init.ts   # 认证相关数据（角色、权限、菜单）
│   └── home_sections.ts # 首页展示数据
└── seed.ts            # 主种子文件
```

### 运行种子脚本

```bash
# 执行所有初始化数据
npx prisma db seed
```

这将按顺序执行：
1. 认证相关数据初始化
2. 首页数据初始化

### 自定义初始化数据

如果需要添加新的初始化数据：

1. 在 `prisma/seed` 目录下创建新的种子文件
2. 在 `prisma/seed.ts` 中导入并执行新的种子函数

例如：

```typescript
// prisma/seed/custom_data.ts
export async function seedCustomData() {
  // 初始化自定义数据
}

// prisma/seed.ts
import { seedCustomData } from './seed/custom_data'

async function main() {
  await seedAuthInit()
  await seedHomeSections()
  await seedCustomData()  // 添加新的种子函数
}
```

## 部署流程

完整的部署流程只需要两个步骤：

```bash
# 1. 执行数据库迁移（包括表结构、注释和RLS）
npx prisma migrate deploy

# 2. 初始化基础数据
npx prisma db seed
```

这样简化的流程更适合容器化部署，无需依赖额外的数据库命令行工具。