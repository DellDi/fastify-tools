-- 创建 login_logs 表
CREATE TABLE IF NOT EXISTS public.login_logs
(
    id         UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES auth.users (id),
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- 创建 verification_codes 表
CREATE TABLE IF NOT EXISTS public.verification_codes
(
    id         UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id    UUID                     NOT NULL REFERENCES auth.users (id),
    code       VARCHAR(6)               NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON public.verification_codes (user_id);


-- 1. 创建角色表 (roles)
CREATE TABLE IF NOT EXISTS public.roles
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status      VARCHAR(20)              DEFAULT 'active', -- active, inactive, deleted
    created_by  UUID,                                      -- 创建者
    updated_by  UUID,                                      -- 更新者
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at  TIMESTAMP WITH TIME ZONE                   -- 软删除字段
);

-- 2. 创建权限表 (permissions)
CREATE TABLE IF NOT EXISTS public.permissions
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE, -- "模块:权限" 格式，例如 "user:view", "user:create"
    description TEXT,
    group_name  VARCHAR(255),  -- 权限分组，保留此字段
    status      VARCHAR(20) DEFAULT 'active',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- 3. 创建角色权限关联表 (role_permissions)
CREATE TABLE IF NOT EXISTS public.role_permissions
(
    role_id       UUID REFERENCES public.roles (id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions (id) ON DELETE CASCADE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at    TIMESTAMP WITH TIME ZONE, -- 软删除字段
    PRIMARY KEY (role_id, permission_id)
);

-- 4. 为 auth.users 表添加 role_id 字段
ALTER TABLE auth.users
    ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles (id),
    ADD COLUMN IF NOT EXISTS status  VARCHAR(20) DEFAULT 'active';
-- 用户状态字段（active、inactive、suspended）

-- 5. 为 auth.users 表创建索引
CREATE INDEX IF NOT EXISTS idx_users_role_id ON auth.users (role_id);

-- 6. 创建角色权限关联表的索引
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions (permission_id);

-- 7. 为权限表创建索引
CREATE INDEX IF NOT EXISTS idx_permissions_group_name ON public.permissions (group_name);
CREATE INDEX IF NOT EXISTS idx_permissions_status ON public.permissions (status);

-- 8.菜单表
CREATE TABLE IF NOT EXISTS public.menus
(
    id                UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name              VARCHAR(255) NOT NULL,
    url               VARCHAR(255),
    parent_id         UUID REFERENCES public.menus(id),
    sort_order        INT DEFAULT 0,
    icon              VARCHAR(255),
    description       TEXT,
    component         VARCHAR(255),
    permission VARCHAR(255) REFERENCES public.permissions(name), -- 保留此字段，允许为空
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at        TIMESTAMP WITH TIME ZONE
);

-- 9.角色与菜单关联表
CREATE TABLE IF NOT EXISTS public.role_menus
(
    role_id    UUID REFERENCES public.roles (id) ON DELETE CASCADE,
    menu_id    UUID REFERENCES public.menus (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, menu_id)
);
-- 10. 为角色与菜单关联表创建索引
CREATE INDEX IF NOT EXISTS idx_role_menus_role_id ON public.role_menus (role_id);
CREATE INDEX IF NOT EXISTS idx_role_menus_menu_id ON public.role_menus (menu_id);

-- 初始化权限数据
INSERT INTO public.permissions (name, description, group_name)
VALUES -- 添加group_name
       ('password:view', '查看密码', 'password'),
       ('password:create', '创建密码', 'password'),
       ('file:manage', '管理文件', 'file'),
       ('file:upload', '上传文件', 'file'),
       ('file:bigLoad', '上传大文件', 'file'),
       ('jira:view', '查看Jira', 'jira'),
       ('jira:create', '创建Jira', 'jira'),
       ('aigc:chat', '使用Chat工具', 'aigc'),
       ('aigc:model', '调优模型', 'aigc'),
       ('settings:view', '查看设置', 'settings'),
       ('role:view', '查看角色', 'role'),
       ('role:create', '创建角色', 'role'),
       ('role:update', '更新角色', 'role'),
       ('role:delete', '删除角色', 'role');

-- 初始化菜单数据
INSERT INTO public.menus (name, url, icon, description, parent_id, permission)
VALUES ('密码解析', '#', 'SquareTerminal', NULL, NULL, NULL), -- 一级菜单，不需要权限控制
       ('neeseeERP', '/password/newsee', 'History', 'neesee密码加解密',
        (SELECT id FROM public.menus WHERE name = '密码解析'), 'password:view'),

       ('文件系统', '#', 'Bot', NULL, NULL, NULL),            -- 一级菜单
       ('文件管理', '/file/manage', 'Rabbit', '我们最快的通用模型。',
        (SELECT id FROM public.menus WHERE name = '文件系统'), 'file:manage'),
       ('文件上传', '/file/upload', 'Bird', '高效的性能和速度。', (SELECT id FROM public.menus WHERE name = '文件系统'),
        'file:upload'),
       ('大文件上传', '/file/bigLoad', 'Turtle', '最强大的复杂计算模型。',
        (SELECT id FROM public.menus WHERE name = '文件系统'), 'file:bigLoad'),

       ('jira中心', '#', 'BookOpen', NULL, NULL, NULL),       -- 一级菜单
       ('个人看板', '/jira/personal', NULL, NULL, (SELECT id FROM public.menus WHERE name = 'jira中心'), 'jira:view'),
       ('创建工单', '/jira/create', NULL, NULL, (SELECT id FROM public.menus WHERE name = 'jira中心'), 'jira:create'),

       ('AIGC', '#', 'Code2', NULL, NULL, NULL),              -- 一级菜单
       ('Chat工具', '/aigc/chat', NULL, NULL, (SELECT id FROM public.menus WHERE name = 'AIGC'), 'aigc:chat'),
       ('模型调优', '/aigc/model', NULL, NULL, (SELECT id FROM public.menus WHERE name = 'AIGC'), 'aigc:model'),

       ('设置', '#', 'Settings2', NULL, NULL, NULL),          -- 一级菜单
       ('账户', '/settings', NULL, NULL, (SELECT id FROM public.menus WHERE name = '设置'), 'settings:view'),
       ('角色', '/role', NULL, NULL, (SELECT id FROM public.menus WHERE name = '设置'), 'role:view');
