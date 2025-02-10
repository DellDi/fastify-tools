# Fastify-Tools 项目

## 项目概述

Fastify-Tools 是一个基于 Pnpm 的 Monorepo 项目，旨在提供一个高性能、可扩展的全栈开发框架。项目包含多个子项目，分别负责后端服务、前端应用和工具开发。通过使用 Fastify、Next.js 和 shadcn-ui 等技术栈，项目能够快速构建现代化的 Web 应用。

## 技术栈

- **后端**: Fastify, TypeScript
- **前端**: Next.js, shadcn-ui
- **包管理**: Pnpm
- **代码规范**: ESLint, Prettier
- **容器化**: Docker
- **API 文档**: Swagger
- **测试**: Tap

## 项目结构

```
fastify-tools/
├── packages/                # 前端相关项目
│   └── shadcn-next/         # 基于 Next.js 和 shadcn-ui 的前端应用
├── services/                # 后端服务
│   ├── fastify/             # 基于 Fastify 的后端服务
│   └── tools/               # 工具类项目
├── docker-compose.yml       # Docker 容器化配置
├── pnpm-workspace.yaml      # Pnpm 工作区配置
└── README.md                # 项目说明文档
```

## 安装与运行

### 前置条件

- Node.js 18+
- Pnpm 8+
- Docker (可选)

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

## 子项目介绍

### Fastify 服务

Fastify 服务是整个项目的核心后端服务，提供高性能的 API 接口。主要特性包括：

- 高性能路由处理
- 插件系统
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

### Tools 工具项目

Tools 项目包含一些实用的工具脚本，如 Excel 数据处理、自动化脚本等。

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

## 部署

推荐使用 [Docker](https://www.docker.com/) 进行容器化部署。详细部署文档请参考 [部署指南](./DEPLOYMENT.md)。
