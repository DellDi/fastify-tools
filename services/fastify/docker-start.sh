#!/bin/bash
set -e

echo "🔄 正在启动应用..."

# 等待数据库准备就绪
echo "⏳ 等待数据库连接..."
npx wait-on -t 60000 tcp:${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}

# 执行数据库迁移
echo "🔄 执行数据库迁移..."
prisma migrate deploy

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
prisma generate

# 执行种子数据
echo "🌱 执行种子数据..."
prisma db seed

# 启动应用
echo "🚀 启动应用..."
if [ "$NODE_ENV" = "production" ]; then
  # 生产环境启动命令
  npm start
else
  # 开发环境启动命令
  npm run dev
fi
