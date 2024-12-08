-- 1. 创建角色表 (roles)
CREATE TABLE IF NOT EXISTS public.roles
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status      VARCHAR(20) DEFAULT 'active',  -- active, inactive, deleted
    created_by  UUID,                      -- 创建者
    updated_by  UUID,                      -- 更新者
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at  TIMESTAMP WITH TIME ZONE  -- 软删除字段
);

-- 2. 创建权限表 (permissions)
CREATE TABLE IF NOT EXISTS public.permissions
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    group_name  VARCHAR(255),  -- 权限分组
    status      VARCHAR(20) DEFAULT 'active',  -- active, inactive
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at  TIMESTAMP WITH TIME ZONE  -- 软删除字段
);

-- 3. 创建角色权限关联表 (role_permissions)
CREATE TABLE IF NOT EXISTS public.role_permissions
(
    role_id       UUID REFERENCES public.roles (id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions (id) ON DELETE CASCADE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at    TIMESTAMP WITH TIME ZONE,  -- 软删除字段
    PRIMARY KEY (role_id, permission_id)
);

-- 4. 为 auth.users 表添加 role_id 字段
ALTER TABLE auth.users
    ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles (id),
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';  -- 用户状态字段（active、inactive、suspended）

-- 5. 为 auth.users 表创建索引
CREATE INDEX IF NOT EXISTS idx_users_role_id ON auth.users (role_id);

-- 6. 创建角色权限关联表的索引
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- 7. 为权限表创建索引
CREATE INDEX IF NOT EXISTS idx_permissions_group_name ON public.permissions(group_name);
CREATE INDEX IF NOT EXISTS idx_permissions_status ON public.permissions(status);

-- 8. 创建菜单表 (menus)
CREATE TABLE IF NOT EXISTS public.menus
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    url         VARCHAR(255) NOT NULL,  -- 对应的路由路径
    parent_id   UUID REFERENCES public.menus(id),  -- 父菜单
    sort_order  INT DEFAULT 0,           -- 排序，避免与保留字冲突
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at  TIMESTAMP WITH TIME ZONE  -- 软删除字段
);

-- 9. 创建角色与菜单关联表 (role_menus)
CREATE TABLE IF NOT EXISTS public.role_menus
(
    role_id     UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    menu_id     UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, menu_id)
);

-- 10. 为角色与菜单关联表创建索引
CREATE INDEX IF NOT EXISTS idx_role_menus_role_id ON public.role_menus(role_id);
CREATE INDEX IF NOT EXISTS idx_role_menus_menu_id ON public.role_menus(menu_id);
