# fastify-ts 项目

- 这是一个基于 [Fastify](https://www.fastify.io/) 和 TypeScript 的项目。
- monorepo - 项目使用 [Lerna](https://lerna.js.org/) 进行管理。
- 项目使用 [Pnpm](https://pnpm.io/) 进行包管理。
- 项目使用 [ESLint](https://eslint.org/) 和 [Prettier](https://prettier.io/) 进行代码规范检查。
- 项目使用 [Docker](https://www.docker.com/) 进行容器化部署。
- 项目使用 [Swagger](https://swagger.io/) 自动生成 API 文档。
- 项目使用 [Next](https://nextjs.org/) 和 [shadcn-ui](https://shadcn-ui.vercel.app/) 进行前端开发。

## 项目概述

fastify-tools 是一个基于pnpm的monorepo项目，项目包含以下子项目：

### fastify子项目

是一个 Fastify 和 TypeScript 的项目，旨在提供一个高性能、可扩展的Nodejs服务。项目包含以下特性：

1. 高性能路由处理
2. 插件系统
3. 安全性
4. 数据验证
5. 异步处理
6. 接口文档生成，作为shadcn-next项目的主要服务

### shadcn-next

是一个基于Next、shadcn-ui、fas的项目，旨在提供一个高性能、可扩展的Web应用程序框架。项目包含以下特性：

1. 服务端渲染
2. 静态页面生成
3. 动态路由
4. 数据获取
5. AIGC相关服务和功能
6. 个人工作工具作品展示

## 目录结构

## 开始使用

首先，运行开发服务器。在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目时间线

1. 项目初始化 (2023-11-01)

    - 使用 Fastify CLI 创建项目骨架
    - 集成 TypeScript

2. 基础功能开发 (2023-11-15)

    - 实现用户认证系统
    - 设计并实现 RESTful API

3. 数据库集成 (2023-12-01)

    - 选择并集成数据库（如 PostgreSQL）
    - 实现数据模型和 ORM

4. 测试与优化 (2023-12-15)

    - 编写单元测试和集成测试
    - 性能优化和负载测试

5. 文档和部署 (2024-01-01)
    - 完善 API 文档
    - 设置 CI/CD 流程

## 功能思考

1. 高性能路由处理

    - 利用 Fastify 的高性能特性
    - 实现智能路由缓存机制

2. 插件系统

    - 设计可扩展的插件架构
    - 开发常用功能插件（如日志、监控）

3. 安全性

    - 实现强大的身份验证和授权系统
    - 集成 CSRF 保护和 rate limiting

4. 数据验证

    - 使用 JSON Schema 进行请求和响应验证
    - 实现自定义验证逻辑

5. 异步处理

    - 优化异步操作处理
    - 实现任务队列系统

6. 文档生成
    - 自动生成 API 文档
    - 集成 Swagger UI

## 学习资源

- [Fastify 文档](https://www.fastify.io/docs/latest/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Lerna 文档](https://lerna.js.org/)
- [Pnpm 文档](https://pnpm.io/)
- [ESLint 文档](https://eslint.org/docs/user-guide/getting-started)
- [Prettier 文档](https://prettier.io/docs/en/index.html)
- [Docker 文档](https://docs.docker.com/)
- [Swagger 文档](https://swagger.io/docs/)
- [Next 文档](https://nextjs.org/docs)
- [shadcn-ui 文档](https://shadcn-ui.vercel.app/)

## 部署

推荐使用 [Docker](https://www.docker.com/) 进行容器化部署。详细部署文档请参考 [部署指南](./DEPLOYMENT.md)。

## 贡献

欢迎提交 Pull Requests 和 Issues！请查看 [贡献指南](./CONTRIBUTING.md) 了解更多信息。
