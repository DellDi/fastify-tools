CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA if not exists auth;
-- 审计日志表
create table if not exists auth.audit_log_entries (
    instance_id uuid null,
    id uuid not null,
    payload json null,
    created_at timestamp with time zone null,
    ip_address character varying(64) not null default ''::character varying,
    constraint audit_log_entries_pkey primary key (id)
) tablespace pg_default;
create index if not exists audit_logs_instance_id_idx on auth.audit_log_entries using btree (instance_id) tablespace pg_default;
comment on column auth.audit_log_entries.instance_id IS 'The ID of the instance this log entry belongs to.';
comment on column auth.audit_log_entries.id IS 'The ID of the log entry.';
comment on column auth.audit_log_entries.payload IS 'The payload of the log entry.';
comment on column auth.audit_log_entries.created_at IS 'The timestamp when the log entry was created.';
comment on column auth.audit_log_entries.ip_address IS 'The IP address of the client that made the request.';
comment on TABLE auth.audit_log_entries IS 'Audit log entries table.';
-- 用户表
create table if not exists auth.users (
    instance_id uuid null,
    id uuid not null,
    aud character varying(255) null,
    role character varying(255) null,
    email character varying(255) null,
    encrypted_password character varying(255) null,
    email_confirmed_at timestamp with time zone null,
    invited_at timestamp with time zone null,
    confirmation_token character varying(255) null,
    confirmation_sent_at timestamp with time zone null,
    recovery_token character varying(255) null,
    recovery_sent_at timestamp with time zone null,
    email_change_token_new character varying(255) null,
    email_change character varying(255) null,
    email_change_sent_at timestamp with time zone null,
    last_sign_in_at timestamp with time zone null,
    raw_app_meta_data jsonb null,
    raw_user_meta_data jsonb null,
    is_super_admin boolean null,
    created_at timestamp with time zone null,
    updated_at timestamp with time zone null,
    phone text null default null::character varying,
    phone_confirmed_at timestamp with time zone null,
    phone_change text null default ''::character varying,
    phone_change_token character varying(255) null default ''::character varying,
    phone_change_sent_at timestamp with time zone null,
    confirmed_at timestamp with time zone generated always as (least(email_confirmed_at, phone_confirmed_at)) stored null,
    email_change_token_current character varying(255) null default ''::character varying,
    email_change_confirm_status smallint null default 0,
    banned_until timestamp with time zone null,
    reauthentication_token character varying(255) null default ''::character varying,
    reauthentication_sent_at timestamp with time zone null,
    is_sso_user boolean not null default false,
    deleted_at timestamp with time zone null,
    is_anonymous boolean not null default false,
    username character varying(255) null,
    phone_number character varying(20) null,
    avatar_url text null,
    role_id uuid null,
    status character varying(20) null default 'active'::character varying,
    constraint users_pkey primary key (id),
    constraint users_phone_key unique (phone),
    constraint users_email_change_confirm_status_check check (
        (
            (email_change_confirm_status >= 0)
            and (email_change_confirm_status <= 2)
        )
    )
) tablespace pg_default;
-- 添加中文字段注释
comment on column auth.users.email_change_confirm_status is '0: 未确认, 1: 已确认, 2: 已取消';
comment on column auth.users.banned_until is '禁止登录时间';
comment on column auth.users.reauthentication_token is '重新认证令牌';
comment on column auth.users.reauthentication_sent_at is '重新认证发送时间';
comment on column auth.users.is_sso_user is '是否为单点登录用户';
comment on column auth.users.deleted_at is '删除时间';
comment on column auth.users.is_anonymous is '是否为匿名用户';
comment on column auth.users.username is '用户名';
comment on column auth.users.phone_number is '手机号';
comment on column auth.users.avatar_url is '头像URL';
comment on column auth.users.role_id is '角色ID';
comment on column auth.users.status is '用户状态';
create unique index if not exists confirmation_token_idx on auth.users using btree (confirmation_token) tablespace pg_default
where ((confirmation_token)::text !~ '^[0-9 ]*$'::text);
create unique index if not exists email_change_token_current_idx on auth.users using btree (email_change_token_current) tablespace pg_default
where (
        (email_change_token_current)::text !~ '^[0-9 ]*$'::text
    );
create unique index if not exists email_change_token_new_idx on auth.users using btree (email_change_token_new) tablespace pg_default
where (
        (email_change_token_new)::text !~ '^[0-9 ]*$'::text
    );
create unique index if not exists reauthentication_token_idx on auth.users using btree (reauthentication_token) tablespace pg_default
where (
        (reauthentication_token)::text !~ '^[0-9 ]*$'::text
    );
create unique index if not exists recovery_token_idx on auth.users using btree (recovery_token) tablespace pg_default
where ((recovery_token)::text !~ '^[0-9 ]*$'::text);
create unique index if not exists users_email_partial_key on auth.users using btree (email) tablespace pg_default
where (is_sso_user = false);
create index if not exists users_instance_id_email_idx on auth.users using btree (instance_id, lower((email)::text)) tablespace pg_default;
create index if not exists users_instance_id_idx on auth.users using btree (instance_id) tablespace pg_default;
create index if not exists users_is_anonymous_idx on auth.users using btree (is_anonymous) tablespace pg_default;
create index if not exists idx_users_username on auth.users using btree (username) tablespace pg_default;
create index if not exists idx_users_email on auth.users using btree (email) tablespace pg_default;
create index if not exists idx_users_role_id on auth.users using btree (role_id) tablespace pg_default;
-- 创建 login_logs 表
create table if not exists auth.login_logs (
    id uuid primary key DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users (id),
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
-- 创建 verification_codes 表
create table if not exists auth.verification_codes (
    id uuid primary key DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users (id),
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
-- 创建索引
create index if not exists idx_login_logs_user_id on auth.login_logs (user_id);
create index if not exists idx_verification_codes_user_id on auth.verification_codes (user_id);
-- 1. 创建角色表 (roles)
create table if not exists auth.roles (
    id uuid primary key DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    -- active, inactive, deleted
    created_by UUID,
    -- 创建者
    updated_by UUID,
    -- 更新者
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- 软删除字段
);
-- 2. 创建权限表 (permissions)
create table if not exists auth.permissions (
    id uuid primary key DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    -- "模块:权限" 格式，例如 "user:view", "user:create"
    description TEXT,
    group_name VARCHAR(255),
    -- 权限分组，保留此字段
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- 3. 创建角色权限关联表 (role_permissions)
create table if not exists auth.role_permissions (
    role_id UUID REFERENCES auth.roles (id) on DELETE CASCADE,
    permission_id UUID REFERENCES auth.permissions (id) on DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    -- 软删除字段
    PRIMARY KEY (role_id, permission_id)
);
-- 4. 为 auth.users 表添加 role_id 字段
alter table auth.users
add column if not exists role_id UUID REFERENCES auth.roles (id);
-- 用户状态字段（active、inactive、suspended）
-- 5. 创建角色权限关联表的索引
create index if not exists idx_role_permissions_role_id on auth.role_permissions (role_id);
create index if not exists idx_role_permissions_permission_id on auth.role_permissions (permission_id);
-- 6. 为权限表创建索引
create index if not exists idx_permissions_group_name on auth.permissions (group_name);
create index if not exists idx_permissions_status on auth.permissions (status);
-- 7.菜单表
create table if not exists auth.menus (
    id uuid primary key DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    parent_id UUID REFERENCES auth.menus (id),
    sort_order INT DEFAULT 0,
    icon VARCHAR(255),
    description TEXT,
    component VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- 8.角色与菜单关联表
create table if not exists auth.role_menus (
    role_id UUID REFERENCES auth.roles (id) on DELETE CASCADE,
    menu_id UUID REFERENCES auth.menus (id) on DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, menu_id)
);
-- 9. 为角色与菜单关联表创建索引
create index if not exists idx_role_menus_role_id on auth.role_menus (role_id);
create index if not exists idx_role_menus_menu_id on auth.role_menus (menu_id);
-- 初始化权限数据
INSERT INTO auth.permissions (name, description, group_name)
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
INSERT INTO auth.menus (name, url, icon, description, parent_id)
VALUES ('密码解析', '#', 'SquareTerminal', NULL, NULL),
    -- 一级菜单，不需要权限控制
    (
        'v10加密中心',
        '/password/newsee',
        'History',
        'neesee密码加解密',
        (
            SELECT id
            FROM auth.menus
            WHERE name = '密码解析'
        )
    ),
    ('文件系统', '#', 'Bot', NULL, NULL),
    -- 一级菜单
    (
        '文件管理',
        '/file/manage',
        'Rabbit',
        '我们最快的通用模型。',
        (
            SELECT id
            FROM auth.menus
            WHERE name = '文件系统'
        )
    ),
    (
        '文件上传',
        '/file/upload',
        'Bird',
        '高效的性能和速度。',
        (
            SELECT id
            FROM auth.menus
            WHERE name = '文件系统'
        )
    ),
    (
        '大文件上传',
        '/file/bigLoad',
        'Turtle',
        '最强大的复杂计算模型。',
        (
            SELECT id
            FROM auth.menus
            WHERE name = '文件系统'
        )
    ),
    ('jira中心', '#', 'BookOpen', NULL, NULL),
    -- 一级菜单
    (
        '个人看板',
        '/jira/personal',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = 'jira中心'
        )
    ),
    (
        '创建工单',
        '/jira/create',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = 'jira中心'
        )
    ),
    ('AIGC', '#', 'Code2', NULL, NULL),
    -- 一级菜单
    (
        'Chat工具',
        '/aigc/chat',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = 'AIGC'
        )
    ),
    (
        '模型调优',
        '/aigc/model',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = 'AIGC'
        )
    ),
    ('设置', '#', 'Settings2', NULL, NULL),
    -- 一级菜单
    (
        '账户',
        '/settings',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = '设置'
        )
    ),
    (
        '角色',
        '/role',
        NULL,
        NULL,
        (
            SELECT id
            FROM auth.menus
            WHERE name = '设置'
        )
    );
-- 新增一个超级管理员的角色admin，包含所有菜单和权限
INSERT INTO auth.roles (name)
VALUES ('admin');
INSERT INTO auth.role_menus (role_id, menu_id)
SELECT (
        SELECT id
        FROM auth.roles
        WHERE name = 'admin'
    ),
    id
FROM auth.menus;
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT (
        SELECT id
        FROM auth.roles
        WHERE name = 'admin'
    ),
    id
FROM auth.permissions;
-- 新增一个普通用户角色user，包含部分菜单和权限
INSERT INTO auth.roles (name)
VALUES ('user');
INSERT INTO auth.role_menus (role_id, menu_id)
SELECT (
        SELECT id
        FROM auth.roles
        WHERE name = 'user'
    ),
    id
FROM auth.menus
WHERE name IN (
        'v10加密中心',
        '文件管理',
        '文件上传',
        '文件上传',
        '个人看板',
        'Chat工具'
    );
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT (
        SELECT id
        FROM auth.roles
        WHERE name = 'user'
    ),
    id
FROM auth.permissions
WHERE name IN (
        'password:view',
        'password:create',
        'file:manage',
        'file:upload',
        'jira:view',
        'jira:create',
        'aigc:chat'
    );
-- 清空相关权限表
-- TRUNCATE TABLE auth.role_permissions;
-- TRUNCATE TABLE auth.permissions RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE auth.role_menus;
-- TRUNCATE TABLE auth.menus RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE auth.roles RESTART IDENTITY CASCADE;