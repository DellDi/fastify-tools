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

# 复制工作区配置、根目录依赖和锁文件（确保依赖版本一致）
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# 复制服务目录
COPY services/fastify ./services/fastify

# 确保启动脚本存在并可执行
RUN ls -la /app/services/fastify/
RUN test -f /app/services/fastify/docker-start.sh && echo "Script exists" || echo "Script NOT found"

# 安装依赖
RUN pnpm install

# 添加执行权限到启动脚本
RUN chmod +x services/fastify/docker-start.sh

# 设置工作目录为服务目录
WORKDIR /app/services/fastify

# Expose the port the app runs on
EXPOSE 3100

# Command to run the application
CMD ["sh", "/app/services/fastify/docker-start.sh"]
