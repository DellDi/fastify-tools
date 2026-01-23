-- 创建数据库 (如果不存在)
SELECT 'CREATE DATABASE fastify_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fastify_db')\gexec

-- 创建 shadcn_next 数据库 (如果不存在)
SELECT 'CREATE DATABASE shadcn_next'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shadcn_next')\gexec
