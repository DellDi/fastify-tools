# Prisma 迁移指南

本文档提供了将现有 Fastify 应用程序从原生 PostgreSQL 迁移到 Prisma ORM 的步骤。

## 迁移步骤

### 1. 安装依赖

已在 `package.json` 中添加了必要的依赖：

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### 2. 初始化 Prisma

```bash
npx prisma init
```

这将创建基本的 Prisma 配置文件。

### 3. 配置数据库连接

在 `.env` 文件中添加 Prisma 数据库连接 URL：

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fastify_db"
```

### 4. 创建 Prisma 模型

已在 `prisma/schema.prisma` 文件中定义了数据模型，对应原有的数据库表结构。

### 5. 应用迁移

有两种方式可以应用迁移：

#### 方式一：使用现有 SQL 脚本（推荐用于生产环境）

1. 将现有的 SQL 迁移脚本复制到 `prisma/migrations/manual/migration.sql`
2. 使用以下命令应用迁移：

- 主要是解决团队成员之间的迁移问题，比如说团队成员A和B，A先创建了迁移，B需要等待A完成迁移后才能开始工作。
- 或者是手动执行了 SQL 脚本，需要告诉 Prisma 这个迁移已经应用。

```bash
npx prisma migrate resolve --applied manual
```

这将告诉 Prisma 该迁移已经应用，但不会实际执行这里的相关 SQL。

- 如果是新环境，可以跳过这一步。可以直接运行：

```bash
npx prisma migrate deploy
```

#### 方式二：生成新的迁移（推荐用于开发环境）

```bash
npx prisma migrate dev --name init
```

这将根据 schema.prisma 生成新的迁移文件并应用它。

### 6. 生成 Prisma 客户端

```bash
npx prisma generate
```

这将生成 TypeScript 类型和 Prisma 客户端代码。

## 使用 Prisma

已在项目中添加了以下文件：

1. `src/plugins/prisma.ts` - Prisma 客户端插件
2. `src/services/email-template.service.ts` - 使用 Prisma 的服务示例
3. `src/routes/email-templates/index.ts` - 使用 Prisma 服务的路由示例

## 数据库管理

### 查看数据库

```bash
npx prisma studio
```

这将启动一个 Web 界面，用于查看和编辑数据库内容。

### 重置数据库

```bash
npx prisma migrate reset
```

这将删除所有数据并重新应用迁移。

## 最佳实践

1. 使用服务层封装 Prisma 操作
2. 利用 Prisma 的类型安全特性
3. 使用事务处理复杂操作
4. 定期更新 Prisma 客户端以获取最新功能
