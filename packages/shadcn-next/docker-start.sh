#!/bin/bash
set -e

echo "🔄 正在启动应用..."

# 等待数据库准备就绪
echo "⏳ 等待数据库连接..."
npx wait-on -t 60000 tcp:${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}

cd /app/packages/shadcn-next

# 执行数据库迁移
echo "🔄 执行数据库迁移..."
npx prisma migrate deploy

# 执行种子数据
echo "🌱 执行种子数据..."
npx prisma db seed

# 构建应用
echo "🔄 构建应用..."
npx pnpm run build

# 启动应用
echo "🚀 启动应用..."
if [ "$NODE_ENV" = "production" ]; then
  # 生产环境启动命令
  npm start
else
  # 开发环境启动命令
  npm run dev
fi
