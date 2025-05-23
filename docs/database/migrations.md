# 数据库迁移指南

本文档详细说明了如何管理项目中的数据库迁移。项目包含两个使用 Prisma 的服务：

1. **fastify-service** - 主后端服务
   - 位置: `services/fastify/`
   - 用途: 核心业务逻辑和API

2. **shadcn-next** - 前端应用（包含用户认证）
   - 位置: `packages/shadcn-next/`
   - 用途: 用户界面和认证管理

## 目录
- [快速开始](#快速开始)
- [环境准备](#环境准备)
- [数据库迁移命令](#数据库迁移命令)
- [开发工作流](#开发工作流)
- [生产环境部署](#生产环境部署)
- [数据填充 (Seeding)](#数据填充-seeding)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)
- [数据库备份与恢复](#数据库备份与恢复)
- [多服务数据库管理](#多服务数据库管理)

## 快速开始

### 为所有服务生成 Prisma 客户端
```bash
pnpm prisma:generate:all
```

### 为单个服务创建并应用迁移
```bash
# 为 fastify-service 创建迁移
pnpm -F fastify-service prisma:migrate:dev --name <迁移名称>

# 或为 shadcn-next 创建迁移
pnpm -F shadcn-next prisma:migrate:dev --name <迁移名称>
```

### 应用所有服务的迁移到生产环境
```bash
pnpm prisma:deploy:all
```

## 环境准备

1. 确保已安装 Node.js 18+ 和 pnpm
2. 安装项目依赖：
   ```bash
   pnpm install
   ```
3. 配置环境变量：
   ```bash
   # 复制示例环境变量文件
   cp services/fastify/.env.example services/fastify/.env
   
   # 修改数据库连接信息
   # services/fastify/.env
   ```

## 数据库迁移命令

### 全局命令（适用于所有服务）
```bash
# 1. 为所有服务生成 Prisma 客户端
pnpm prisma:generate:all

# 2. 应用所有服务的迁移到生产环境
pnpm prisma:deploy:all

# 3. 运行所有服务的种子数据
pnpm prisma:seed:all

# 4. 重置所有服务的数据库（开发环境）
pnpm prisma:reset:all
```

### 单个服务命令

#### fastify-service
```bash
# 生成 Prisma 客户端
pnpm -F fastify-service prisma:generate

# 创建并应用迁移
pnpm -F fastify-service prisma:migrate:dev --name <迁移名称>

# 运行种子数据
pnpm -F fastify-service prisma:seed

# 重置数据库（开发环境）
pnpm -F fastify-service prisma:migrate:reset
```

#### shadcn-next
```bash
# 生成 Prisma 客户端
pnpm -F shadcn-next prisma:generate

# 创建并应用迁移
pnpm -F shadcn-next prisma:migrate:dev --name <迁移名称>

# 运行种子数据
pnpm -F shadcn-next prisma:seed

# 重置数据库（开发环境）
pnpm -F shadcn-next prisma:migrate:reset
```

## 数据库管理工具

### Prisma Studio（数据库管理界面）

```bash
# 启动 Prisma Studio
pnpm -F fastify-service prisma:studio
```

访问 http://localhost:5555 查看和管理数据库内容。

## 开发工作流

### 1. 创建新迁移

#### fastify-service
```bash
# 1. 修改 Prisma 模型
# 文件: services/fastify/prisma/schema.prisma

# 2. 创建并应用迁移
pnpm -F fastify-service prisma:migrate:dev --name <描述性名称>
# 例如：pnpm -F fastify-service prisma:migrate:dev --name add_feature

# 3. 生成 Prisma 客户端
pnpm -F fastify-service prisma:generate
```

#### shadcn-next
```bash
# 1. 修改 Prisma 模型
# 文件: packages/shadcn-next/prisma/schema.prisma

# 2. 创建并应用迁移
pnpm -F shadcn-next prisma:migrate:dev --name <描述性名称>
# 例如：pnpm -F shadcn-next prisma:migrate:dev --name update_auth_schema

# 3. 生成 Prisma 客户端
pnpm -F shadcn-next prisma:generate
```

### 2. 检查迁移状态

#### fastify-service
```bash
# 查看迁移历史
pnpm -F fastify-service prisma:migrate:status

# 查看待应用的迁移
pnpm -F fastify-service prisma:migrate:deploy --dry-run
```

#### shadcn-next
```bash
# 查看迁移历史
pnpm -F shadcn-next prisma:migrate:status

# 查看待应用的迁移
pnpm -F shadcn-next prisma:migrate:deploy --dry-run
```

## 生产环境部署

### 安全部署流程

1. **生成迁移**（开发环境）
   ```bash
   # 为 fastify-service 生成迁移
   pnpm -F fastify-service prisma:migrate:dev --create-only --name <迁移名称>
   
   # 或为 shadcn-next 生成迁移
   pnpm -F shadcn-next prisma:migrate:dev --create-only --name <迁移名称>
   ```

2. **检查迁移文件**
   - fastify-service: `services/fastify/prisma/migrations/<timestamp>_<name>/migration.sql`
   - shadcn-next: `packages/shadcn-next/prisma/migrations/<timestamp>_<name>/migration.sql`

3. **应用迁移到生产环境**
   ```bash
   # 应用所有服务的迁移
   pnpm prisma:deploy:all
   
   # 或单独应用某个服务
   pnpm -F <service-name> prisma:migrate:deploy
   ```

4. **验证迁移状态**
   ```bash
   pnpm -F <service-name> prisma:migrate:status
   ```

## 数据填充 (Seeding)

### 全局命令
```bash
# 运行所有服务的种子脚本
pnpm prisma:seed:all

# 重置并重新填充所有数据库（开发环境）
pnpm prisma:reset:all
```

### 单个服务

#### fastify-service
```bash
# 运行种子脚本
pnpm -F fastify-service prisma:seed

# 重置并重新填充数据库
pnpm -F fastify-service prisma:migrate:reset --force
pnpm -F fastify-service prisma:seed
```

#### shadcn-next
```bash
# 运行种子脚本
pnpm -F shadcn-next prisma:seed

# 重置并重新填充数据库
pnpm -F shadcn-next prisma:migrate:reset --force
pnpm -F shadcn-next prisma:seed
```

## 最佳实践

1. **迁移命名**：使用描述性的迁移名称，如 `add_user_table` 或 `update_profile_fields`
2. **小步提交**：每个迁移应该只做一件事情，便于回滚和审查
3. **测试迁移**：在应用迁移到生产环境前，先在测试环境测试
4. **备份**：在执行重要迁移前备份生产数据库
5. **文档**：在复杂的迁移中添加 README.md 说明变更原因和影响

## 常见问题

### 迁移冲突

如果遇到迁移冲突：

#### fastify-service
```bash
# 1. 重置数据库（仅限开发环境）
pnpm -F fastify-service prisma:migrate:reset --force

# 2. 重新创建迁移
pnpm -F fastify-service prisma:migrate:dev --name <新迁移名称>
```

#### shadcn-next
```bash
# 1. 重置数据库（仅限开发环境）
pnpm -F shadcn-next prisma:migrate:reset --force

# 2. 重新创建迁移
pnpm -F shadcn-next prisma:migrate:dev --name <新迁移名称>
```

### 手动应用 SQL 脚本

#### fastify-service
```bash
# 1. 将 SQL 文件放在 services/fastify/prisma/migrations/manual/
# 2. 标记为已应用
pnpm -F fastify-service prisma migrate resolve --applied manual
```

#### shadcn-next
```bash
# 1. 将 SQL 文件放在 packages/shadcn-next/prisma/migrations/manual/
# 2. 标记为已应用
pnpm -F shadcn-next prisma migrate resolve --applied manual
```

## 数据库备份与恢复

### fastify-service
```bash
# 备份数据库
pg_dump -h localhost -U postgres -d fastify_db > fastify_backup_$(date +%Y%m%d).sql

# 恢复数据库
psql -h localhost -U postgres -d fastify_db < fastify_backup_20230523.sql
```

### shadcn-next
```bash
# 备份数据库
pg_dump -h localhost -U postgres -d next_auth > auth_backup_$(date +%Y%m%d).sql

# 恢复数据库
psql -h localhost -U postgres -d next_auth < auth_backup_20230523.sql
```

## 多服务数据库管理

### 服务概览

| 服务名称 | 目录 | 数据库 | 主要用途 |
|---------|------|--------|----------|
| fastify-service | services/fastify | fastify_db | 核心业务逻辑和API |
| shadcn-next | packages/shadcn-next | next_auth | 用户认证和会话管理 |

### 常用命令

#### 生成 Prisma 客户端
```bash
# 为单个服务生成
pnpm -F <service-name> prisma:generate

# 为所有服务生成
pnpm prisma:generate:all
```

#### 运行迁移
```bash
# 为单个服务运行迁移
pnpm -F <service-name> prisma:migrate:dev --name <migration-name>

# 为所有服务运行迁移
pnpm prisma:deploy:all
```

#### 数据库管理
```bash
# 启动 Prisma Studio 管理界面
pnpm -F <service-name> prisma:studio

# 重置数据库（开发环境）
pnpm -F <service-name> prisma:migrate:reset
```

### 环境变量配置

每个服务都有自己的 `.env` 文件，需要分别配置：

1. `services/fastify/.env` - 主后端服务配置
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/fastify_db"
   ```

2. `packages/shadcn-next/.env` - 前端认证服务配置
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/next_auth"
   ```

### 开发建议

1. **数据库隔离**：每个服务使用独立的数据库，避免数据耦合
2. **迁移管理**：为每个服务维护独立的迁移历史
3. **环境一致性**：确保开发、测试和生产环境的数据库结构一致
4. **备份策略**：定期备份重要数据，特别是生产环境
