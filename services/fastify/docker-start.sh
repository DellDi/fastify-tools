#!/bin/bash
set -e

echo "🔄 正在启动 Fastify 服务..."

# 等待数据库准备就绪
echo "⏳ 等待数据库连接..."
npx wait-on -t 60000 tcp:${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}

# 执行数据库迁移
echo "🔄 执行数据库迁移..."
npx prisma migrate deploy

# 启动应用
echo "🚀 启动应用..."
if [ "$NODE_ENV" = "production" ]; then
  # 生产环境启动命令
  npm start
else
  # 开发环境启动命令
  npm run dev
fi
