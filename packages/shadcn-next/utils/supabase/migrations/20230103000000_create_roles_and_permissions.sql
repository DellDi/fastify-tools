-- 创建角色表
CREATE TABLE IF NOT EXISTS public.roles
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建权限表
CREATE TABLE IF NOT EXISTS public.permissions
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS public.role_permissions
(
    role_id       UUID REFERENCES public.roles (id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 为 auth.users 表添加角色字段
ALTER TABLE auth.users
    ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles (id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_role_id ON auth.users (role_id);

