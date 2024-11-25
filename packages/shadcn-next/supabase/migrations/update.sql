-- 为 auth.users 表添加额外的字段
ALTER TABLE auth.users
    ADD COLUMN IF NOT EXISTS username VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON auth.users(username);

