#!/bin/bash
set -e

echo "🔄 正在启动应用..."

# 等待数据库准备就绪
echo "⏳ 等待数据库连接..."
npx wait-on -t 60000 tcp:${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}

# 执行数据库迁移
echo "🔄 执行数据库迁移..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
# 使用明确的 schema 路径指定生成
cd /app
npx prisma generate --schema=./services/fastify/prisma/schema.prisma
cd /app/services/fastify

# 执行种子数据
echo "🌱 执行种子数据..."
npx prisma db seed --schema=./prisma/schema.prisma

# 启动应用
echo "🚀 启动应用..."
if [ "$NODE_ENV" = "production" ]; then
  # 生产环境启动命令
  npm start
else
  # 开发环境启动命令
  npm run dev
fi
