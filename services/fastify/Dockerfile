# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# 启用 Corepack
RUN corepack enable

# 设置 corepack的环境变量
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com

# Set the npm registry to the mirror
RUN pnpm config set registry https://registry.npmmirror.com

# 复制工作区配置和根目录依赖
COPY pnpm-workspace.yaml package.json ./

# 复制 Prisma 工作区配置
COPY .prisma ./.prisma

# 复制服务目录
COPY services/fastify ./services/fastify

# 安装依赖
RUN pnpm install

# 添加执行权限到启动脚本
RUN chmod +x services/fastify/docker-start.sh

# 设置工作目录为服务目录
WORKDIR /app/services/fastify

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["./docker-start.sh"]
