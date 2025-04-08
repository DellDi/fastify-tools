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

COPY package.json .

# Install dependencies for the entire monorepo
RUN pnpm install

COPY  . .

# 添加执行权限到启动脚本
RUN chmod +x docker-start.sh

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["./docker-start.sh"]
