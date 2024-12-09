-- 启用 RLS
ALTER TABLE public.roles
    ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新自己创建的角色
CREATE
    POLICY "Allow users to view and update their own roles"
    ON public.roles
    FOR
    SELECT ,
UPDATE
    USING (created_by = auth.uid());

-- 策略：管理员可以访问所有角色数据
CREATE
    POLICY "Allow admins to manage all roles"
    ON public.roles
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE public.permissions
    ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看与自己角色相关的权限
CREATE
    POLICY "Allow users to view their own permissions"
    ON public.permissions
    FOR
    SELECT
    USING (EXISTS (SELECT 1
                   FROM public.role_permissions rp
                            JOIN public.roles r ON rp.role_id = r.id
                   WHERE rp.permission_id = public.permissions.id
                     AND r.created_by = auth.uid()));

-- 策略：管理员可以访问所有权限数据
CREATE
    POLICY "Allow admins to manage all permissions"
    ON public.permissions
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE public.role_permissions
    ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新与自己角色相关的权限关联
CREATE
    POLICY "Allow users to view and update their role permissions"
    ON public.role_permissions
    FOR
    SELECT ,
UPDATE
    USING (EXISTS (
    SELECT 1
    FROM public.roles r
    WHERE r.id = public.role_permissions.role_id
    AND r.created_by = auth.uid()
    ));

-- 策略：管理员可以访问所有角色与权限的关联
CREATE
    POLICY "Allow admins to manage all role permissions"
    ON public.role_permissions
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE public.role_menus
    ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看与自己角色相关的菜单
CREATE
    POLICY "Allow users to view and manage their own role menus"
    ON public.role_menus
    FOR
    SELECT
    USING (EXISTS (SELECT 1
                   FROM public.roles r
                   WHERE r.id = public.role_menus.role_id
                     AND r.created_by = auth.uid()));

-- 策略：管理员可以访问所有角色与菜单的关联
CREATE
    POLICY "Allow admins to manage all role menus"
    ON public.role_menus
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE auth.users
    ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新自己的用户信息
CREATE
    POLICY "Allow users to view and update their own data"
    ON auth.users
    FOR
    SELECT ,
UPDATE
    USING (auth.uid() = auth.users.id);

-- 策略：管理员可以访问所有用户数据
CREATE
    POLICY "Allow admins to manage all users"
    ON auth.users
    FOR ALL
    USING (auth.role() = 'admin');

-- 初始化： roles 表 内置几个默认角色
INSERT INTO public.roles (name, created_by)
VALUES ('admin', 'admin'),
       ('user', 'admin');

-- 初始化： permissions 表 内置几个默认权限
INSERT INTO public.permissions (name, description, group_name)
VALUES ('manage:users', '管理用户', 'Admin'),
       ('manage:roles', '管理角色', 'Admin'),
       ('manage:permissions', '管理权限', 'Admin'),
       ('manage:menus', '管理菜单', 'Admin'),
       ('del:users', '删除用户', 'Admin'),
       ('del:roles', '删除角色', 'Admin'),
       ('del:permissions', '删除权限', 'Admin'),
       ('del:menus', '删除菜单', 'Admin'),
       ('view:changelog', '查看更新日志', 'User'),
       ('edit:changelog', '编辑更新日志', 'User'),
       ('view:dashboard', '查看首页面板', 'User'),
       ('view:users', '查看用户', 'User'),
       ('view:roles', '查看角色', 'User'),
       ('view:permissions', '查看权限', 'User'),
       ('view:menus', '查看菜单', 'User');

-- 初始化： menus 表 内置几个默认菜单
INSERT INTO public.menus (name, url)
VALUES ('dashboard', '/dashboard'),
       ('users', '/users'),
       ('roles', '/roles'),
       ('permissions', '/permissions'),
       ('menus', '/menus');

-- 初始化： role_permissions 表 内置默认角色与权限关联
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES ((SELECT id FROM public.roles WHERE name = 'admin'),
        (SELECT id FROM public.permissions WHERE name = 'manage:users')),
       ((SELECT id FROM public.roles WHERE name = 'admin'),
        (SELECT id FROM public.permissions WHERE name = 'manage:roles')),
       ((SELECT id FROM public.roles WHERE name = 'admin'),
        (SELECT id FROM public.permissions WHERE name = 'manage:permissions')),
       ((SELECT id FROM public.roles WHERE name = 'admin'),
        (SELECT id FROM public.permissions WHERE name = 'manage:menus')),
       ((SELECT id FROM public.roles WHERE name = 'user'),
        (SELECT id FROM public.permissions WHERE name = 'view:dashboard')),
       ((SELECT id FROM public.roles WHERE name = 'user'),
        (SELECT id FROM public.permissions WHERE name = 'view:users')),
       ((SELECT id FROM public.roles WHERE name = 'user'),
        (SELECT id FROM public.permissions WHERE name = 'view:roles')),
       ((SELECT id FROM public.roles WHERE name = 'user'),
        (SELECT id FROM public.permissions WHERE name = 'view:permissions'));

-- 初始化： role_menus 表 内置默认角色与菜单关联
INSERT INTO public.role_menus (role_id, menu_id)
VALUES ((SELECT id FROM public.roles WHERE name = 'admin'), (SELECT id FROM public.menus WHERE name = 'dashboard')),
       ((SELECT id FROM public.roles WHERE name = 'admin'), (SELECT id FROM public.menus WHERE name = 'users')),
       ((SELECT id FROM public.roles WHERE name = 'admin'), (SELECT id FROM public.menus WHERE name = 'roles')),
       ((SELECT id FROM public.roles WHERE name = 'admin'), (SELECT id FROM public.menus WHERE name = 'permissions')),
       ((SELECT id FROM public.roles WHERE name = 'admin'), (SELECT id FROM public.menus WHERE name = 'menus'));


-- ALTER TABLE public.roles ENABLE POLICY;
-- ALTER TABLE public.permissions ENABLE POLICY;
-- ALTER TABLE public.role_permissions ENABLE POLICY;
-- ALTER TABLE public.role_menus ENABLE POLICY;
-- ALTER TABLE auth.users ENABLE POLICY;
