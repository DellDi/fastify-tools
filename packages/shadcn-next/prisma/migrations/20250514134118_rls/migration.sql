--种子版本控制表
COMMENT ON TABLE seed_versions IS '种子版本控制表';
COMMENT ON COLUMN seed_versions.id IS '主键ID';
COMMENT ON COLUMN seed_versions.version IS '版本号';
COMMENT ON COLUMN seed_versions.applied_at IS '应用时间';

-- 用户表
COMMENT ON TABLE users IS '用户表，存储系统所有用户的基础信息';
COMMENT ON COLUMN users.id IS '主键ID';
COMMENT ON COLUMN users.instance_id IS '实例ID';
COMMENT ON COLUMN users.aud IS '受众标识';
COMMENT ON COLUMN users.role IS '用户角色（冗余字段，推荐用 role_id）';
COMMENT ON COLUMN users.email IS '邮箱地址';
COMMENT ON COLUMN users.encrypted_password IS '加密后的密码';
COMMENT ON COLUMN users.email_confirmed_at IS '邮箱确认时间';
COMMENT ON COLUMN users.invited_at IS '邀请注册时间';
COMMENT ON COLUMN users.confirmation_token IS '邮箱确认令牌';
COMMENT ON COLUMN users.confirmation_sent_at IS '邮箱确认发送时间';
COMMENT ON COLUMN users.recovery_token IS '找回密码令牌';
COMMENT ON COLUMN users.recovery_sent_at IS '找回密码发送时间';
COMMENT ON COLUMN users.email_change_token_new IS '新邮箱变更令牌';
COMMENT ON COLUMN users.email_change IS '新邮箱地址';
COMMENT ON COLUMN users.email_change_sent_at IS '邮箱变更发送时间';
COMMENT ON COLUMN users.last_sign_in_at IS '最后登录时间';
COMMENT ON COLUMN users.raw_app_meta_data IS '应用元数据';
COMMENT ON COLUMN users.raw_user_meta_data IS '用户元数据';
COMMENT ON COLUMN users.is_super_admin IS '是否为超级管理员';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';
COMMENT ON COLUMN users.phone IS '手机号';
COMMENT ON COLUMN users.phone_confirmed_at IS '手机号确认时间';
COMMENT ON COLUMN users.phone_change IS '新手机号';
COMMENT ON COLUMN users.phone_change_token IS '手机号变更令牌';
COMMENT ON COLUMN users.phone_change_sent_at IS '手机号变更发送时间';
COMMENT ON COLUMN users.email_change_token_current IS '当前邮箱变更令牌';
COMMENT ON COLUMN users.email_change_confirm_status IS '邮箱变更确认状态：0=未确认，1=已确认，2=已取消';
COMMENT ON COLUMN users.banned_until IS '禁止登录时间';
COMMENT ON COLUMN users.reauthentication_token IS '重新认证令牌';
COMMENT ON COLUMN users.reauthentication_sent_at IS '重新认证发送时间';
COMMENT ON COLUMN users.is_sso_user IS '是否为单点登录用户（true=是，false=否）';
COMMENT ON COLUMN users.deleted_at IS '删除时间';
COMMENT ON COLUMN users.is_anonymous IS '是否为匿名用户（true=匿名，false=实名）';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users."phoneNumber" IS '手机号';
COMMENT ON COLUMN users.avatar_url IS '头像URL';
COMMENT ON COLUMN users.role_id IS '角色ID，关联 roles 表';
COMMENT ON COLUMN users.status IS '用户状态：active=正常，banned=封禁，pending=待激活，deleted=已删除';

-- 角色表
COMMENT ON TABLE roles IS '角色表，定义系统中的角色类型';
COMMENT ON COLUMN roles.id IS '主键ID';
COMMENT ON COLUMN roles.name IS '角色名称，唯一';
COMMENT ON COLUMN roles.description IS '角色描述';
COMMENT ON COLUMN roles.status IS '角色状态：active=正常，banned=禁用，deleted=已删除';
COMMENT ON COLUMN roles.created_by IS '创建人ID';
COMMENT ON COLUMN roles.updated_by IS '更新人ID';
COMMENT ON COLUMN roles.created_at IS '创建时间';
COMMENT ON COLUMN roles.updated_at IS '更新时间';
COMMENT ON COLUMN roles.deleted_at IS '删除时间';

-- 权限表
COMMENT ON TABLE permissions IS '权限表，定义系统所有权限点';
COMMENT ON COLUMN permissions.id IS '主键ID';
COMMENT ON COLUMN permissions.name IS '权限名称，唯一';
COMMENT ON COLUMN permissions.description IS '权限描述';
COMMENT ON COLUMN permissions.group_name IS '权限分组';
COMMENT ON COLUMN permissions.status IS '权限状态：active=正常，banned=禁用，deleted=已删除';
COMMENT ON COLUMN permissions.created_at IS '创建时间';
COMMENT ON COLUMN permissions.updated_at IS '更新时间';
COMMENT ON COLUMN permissions.deleted_at IS '删除时间';

-- 角色权限关联表
COMMENT ON TABLE role_permissions IS '角色-权限关联表';
COMMENT ON COLUMN role_permissions.role_id IS '角色ID，关联 roles 表';
COMMENT ON COLUMN role_permissions.permission_id IS '权限ID，关联 permissions 表';
COMMENT ON COLUMN role_permissions.created_at IS '创建时间';
COMMENT ON COLUMN role_permissions.deleted_at IS '删除时间';

-- 菜单表
COMMENT ON TABLE menus IS '菜单表，定义系统菜单结构';
COMMENT ON COLUMN menus.id IS '主键ID';
COMMENT ON COLUMN menus.name IS '菜单名称';
COMMENT ON COLUMN menus.url IS '菜单URL';
COMMENT ON COLUMN menus.parent_id IS '父菜单ID，关联自身';
COMMENT ON COLUMN menus.sort_order IS '排序号';
COMMENT ON COLUMN menus.icon IS '菜单图标';
COMMENT ON COLUMN menus.description IS '菜单描述';
COMMENT ON COLUMN menus.component IS '前端组件路径';
COMMENT ON COLUMN menus.created_at IS '创建时间';
COMMENT ON COLUMN menus.updated_at IS '更新时间';
COMMENT ON COLUMN menus.deleted_at IS '删除时间';

-- 角色菜单关联表
COMMENT ON TABLE role_menus IS '角色-菜单关联表';
COMMENT ON COLUMN role_menus.role_id IS '角色ID，关联 roles 表';
COMMENT ON COLUMN role_menus.menu_id IS '菜单ID，关联 menus 表';
COMMENT ON COLUMN role_menus.created_at IS '创建时间';

-- 审计日志表
COMMENT ON TABLE audit_log_entries IS '审计日志表';
COMMENT ON COLUMN audit_log_entries.id IS '主键ID';
COMMENT ON COLUMN audit_log_entries.instance_id IS '实例ID';
COMMENT ON COLUMN audit_log_entries.payload IS '变更内容快照';
COMMENT ON COLUMN audit_log_entries.created_at IS '创建时间';
COMMENT ON COLUMN audit_log_entries.ip_address IS '操作IP地址';

-- 登录日志表
COMMENT ON TABLE login_logs IS '登录日志表';
COMMENT ON COLUMN login_logs.id IS '主键ID';
COMMENT ON COLUMN login_logs.user_id IS '用户ID，关联 users 表';
COMMENT ON COLUMN login_logs.login_time IS '登录时间';
COMMENT ON COLUMN login_logs.ip_address IS '登录IP';
COMMENT ON COLUMN login_logs.user_agent IS 'UserAgent';

-- 验证码表
COMMENT ON TABLE verification_codes IS '验证码表';
COMMENT ON COLUMN verification_codes.id IS '主键ID';
COMMENT ON COLUMN verification_codes.user_id IS '用户ID，关联 users 表';
COMMENT ON COLUMN verification_codes.code IS '验证码';
COMMENT ON COLUMN verification_codes.created_at IS '创建时间';
COMMENT ON COLUMN verification_codes.expires_at IS '过期时间';

-- 首页区块表
COMMENT ON TABLE home_sections IS '首页区块表';
COMMENT ON COLUMN home_sections.id IS '主键ID';
COMMENT ON COLUMN home_sections.title IS '区块标题';
COMMENT ON COLUMN home_sections.description IS '区块描述';
COMMENT ON COLUMN home_sections.link_text IS '链接文本';
COMMENT ON COLUMN home_sections.link_href IS '链接地址';
COMMENT ON COLUMN home_sections.gradient IS '渐变色';
COMMENT ON COLUMN home_sections.created_at IS '创建时间';
COMMENT ON COLUMN home_sections.updated_at IS '更新时间';
COMMENT ON COLUMN home_sections.status IS '区块状态';

-- 启用行级安全
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;