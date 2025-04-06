# Fastify-Tools 项目

## 项目概述

Fastify-Tools 是一个基于 Pnpm 的 Monorepo 项目，旨在提供一个高性能、可扩展的全栈开发框架。项目包含多个子项目，分别负责后端服务、前端应用和工具开发。通过使用 Fastify、Next.js 和 shadcn-ui 等技术栈，项目能够快速构建现代化的 Web 应用。

## 技术栈

- **后端**: Fastify, TypeScript, Prisma ORM
- **前端**: Next.js, shadcn-ui, React 19
- **数据库**: PostgreSQL
- **包管理**: Pnpm
- **代码规范**: ESLint, Prettier
- **容器化**: Docker, Docker Compose
- **API 文档**: Swagger, Scalar
- **测试**: Tap

## 项目结构

```
fastify-tools/
├── packages/                # 前端相关项目
│   └── shadcn-next/         # 基于 Next.js 和 shadcn-ui 的前端应用
├── services/                # 后端服务
│   ├── fastify/             # 基于 Fastify 的后端服务
│   │   └── prisma/          # Prisma ORM 配置和迁移
│   └── tools/               # 工具类项目
├── docker-compose.yml       # Docker 容器化配置
├── .env.example             # 环境变量示例
├── pnpm-workspace.yaml      # Pnpm 工作区配置
└── README.md                # 项目说明文档
```

## 安装与运行

### 前置条件

- Node.js 18+
- Pnpm 8+
- Docker (可选)
- PostgreSQL (可选，如果不使用 Docker)

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## Docker 部署

项目支持使用 Docker Compose 进行容器化部署，包含以下服务：

1. **PostgreSQL 数据库** - 共享数据库服务，供所有子项目使用
2. **Fastify 后端服务** - 提供 API 接口
3. **Next.js 前端应用** - 提供用户界面
4. **PgAdmin** - 数据库管理工具（可选）

### 环境配置

1. 复制环境变量示例文件：

```bash
cp .env.example .env
```

2. 根据需要修改 `.env` 文件中的配置。

### 启动 Docker 服务

```bash
# 启动所有服务
docker-compose up -d

# 仅启动数据库
docker-compose up -d postgres

# 查看服务日志
docker-compose logs -f
```

### 访问服务

- **Fastify API**: http://localhost:4000
- **Next.js 前端**: http://localhost:4001
- **PgAdmin**: http://localhost:5050

## 子项目介绍

### Fastify 服务

Fastify 服务是整个项目的核心后端服务，提供高性能的 API 接口。主要特性包括：

- 高性能路由处理
- 插件系统
- Prisma ORM 数据库操作
- 安全性
- 数据验证
- 异步处理
- 接口文档生成

### shadcn-next 前端应用

shadcn-next 是基于 Next.js 和 shadcn-ui 的前端应用，提供现代化的用户界面。主要特性包括：

- 服务端渲染
- 静态页面生成
- 动态路由
- 数据获取
- AIGC 相关服务
- 个人工作工具展示
- React 19 支持

### Tools 工具项目

Tools 项目包含一些实用的工具脚本，如 Excel 数据处理、自动化脚本等。

## 数据库管理

项目使用 PostgreSQL 作为数据库，并通过 Prisma ORM 进行管理。

### Prisma 迁移

```bash
# 生成迁移文件
cd services/fastify
npx prisma migrate dev --name <migration-name>

# 应用迁移到生产环境
npx prisma migrate deploy

# 查看数据库
npx prisma studio
```

## 依赖管理

项目使用 pnpm 工作区管理多个子包，并解决了 React 19 与其他依赖的兼容性问题：

- 通过 `resolutions` 字段覆盖依赖版本
- 显式安装缺失的依赖
- 使用 `update:deps` 脚本更新依赖

## 贡献指南

欢迎提交 Pull Requests 和 Issues！请查看 [贡献指南](./CONTRIBUTING.md) 了解更多信息。

## 学习资源

- [Fastify 文档](https://www.fastify.io/docs/latest/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Pnpm 文档](https://pnpm.io/)
- [ESLint 文档](https://eslint.org/docs/user-guide/getting-started)
- [Prettier 文档](https://prettier.io/docs/en/index.html)
- [Docker 文档](https://docs.docker.com/)
- [Swagger 文档](https://swagger.io/docs/)
- [Next 文档](https://nextjs.org/docs)
- [shadcn-ui 文档](https://shadcn-ui.vercel.app/)
- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

## 部署

推荐使用 [Docker](https://www.docker.com/) 进行容器化部署。详细部署文档请参考 [部署指南](./DEPLOYMENT.md)。
