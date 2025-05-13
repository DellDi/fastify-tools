#!/bin/bash
set -e

echo "🔄 正在启动应用..."

# 等待数据库准备就绪
echo "⏳ 等待数据库连接..."
npx wait-on -t 60000 tcp:${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}

# 执行数据库迁移
echo "🔄 执行数据库迁移..."
npx prisma migrate deploy

# 生成 Prisma Client
# 只检查客户端目录是否存在
if [ ! -d "./generated/client" ]; then
  echo "🔧 生成 Prisma Client..."
  npx prisma generate
else
  echo "🔧 Prisma Client 已存在，跳过生成步骤..."
fi

# 执行种子数据
echo "🌱 执行种子数据..."
npx prisma db seed

# 启动应用
echo "🚀 启动应用..."
if [ "$NODE_ENV" = "production" ]; then
  # 生产环境启动命令
  npm start
else
  # 开发环境启动命令
  npm run dev
fi
