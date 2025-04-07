-- AddComments
COMMENT ON COLUMN users.email_change_confirm_status IS '0: 未确认, 1: 已确认, 2: 已取消';
COMMENT ON COLUMN users.banned_until IS '禁止登录时间';
COMMENT ON COLUMN users.reauthentication_token IS '重新认证令牌';
COMMENT ON COLUMN users.reauthentication_sent_at IS '重新认证发送时间';
COMMENT ON COLUMN users.is_sso_user IS '是否为单点登录用户';
COMMENT ON COLUMN users.deleted_at IS '删除时间';
COMMENT ON COLUMN users.is_anonymous IS '是否为匿名用户';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users."phoneNumber" IS '手机号';
COMMENT ON COLUMN users.avatar_url IS '头像URL';
COMMENT ON COLUMN users.role_id IS '角色ID';
COMMENT ON COLUMN users.status IS '用户状态';
-- EnableRLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;