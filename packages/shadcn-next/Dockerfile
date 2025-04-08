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

# 复制 Next.js 项目目录
COPY packages/shadcn-next ./packages/shadcn-next

# 安装依赖
RUN pnpm install

# Remove .env.local file if exists
RUN rm -f packages/shadcn-next/.env.local

# 添加执行权限到启动脚本
RUN chmod +x packages/shadcn-next/docker-start.sh

# 设置工作目录为 Next.js 项目目录
WORKDIR /app/packages/shadcn-next

# Set the environment variable for the base path
ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}
ARG BASE_API_URL
ENV BASE_API_URL=${BASE_API_URL}

# Build the application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["./docker-start.sh"]
