-- 更新 users 表，添加必要的字段
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS username VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 确保 email 字段存在并且是唯一的
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

