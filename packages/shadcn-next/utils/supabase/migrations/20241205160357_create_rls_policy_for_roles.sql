-- 启用 RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新自己创建的角色
CREATE
POLICY "Allow users to view and update their own roles"
    ON public.roles
    FOR
SELECT,
UPDATE
    USING (created_by = auth.uid());

-- 策略：管理员可以访问所有角色数据
CREATE
POLICY "Allow admins to manage all roles"
    ON public.roles
    FOR ALL
    USING (auth.role() = 'admin');
       -- 启用 RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看与自己角色相关的权限
CREATE
POLICY "Allow users to view their own permissions"
    ON public.permissions
    FOR
SELECT
    USING (EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    JOIN public.roles r ON rp.role_id = r.id
    WHERE rp.permission_id = public.permissions.id
    AND r.created_by = auth.uid()
    ));

-- 策略：管理员可以访问所有权限数据
CREATE
POLICY "Allow admins to manage all permissions"
    ON public.permissions
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新与自己角色相关的权限关联
CREATE
POLICY "Allow users to view and update their role permissions"
    ON public.role_permissions
    FOR
SELECT,
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
ALTER TABLE public.role_menus ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看与自己角色相关的菜单
CREATE
POLICY "Allow users to view and manage their own role menus"
    ON public.role_menus
    FOR
SELECT
    USING (EXISTS (
    SELECT 1
    FROM public.roles r
    WHERE r.id = public.role_menus.role_id
    AND r.created_by = auth.uid()
    ));

-- 策略：管理员可以访问所有角色与菜单的关联
CREATE
POLICY "Allow admins to manage all role menus"
    ON public.role_menus
    FOR ALL
    USING (auth.role() = 'admin');
-- 启用 RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 策略：普通用户只能查看和更新自己的用户信息
CREATE
POLICY "Allow users to view and update their own data"
    ON auth.users
    FOR
SELECT,
UPDATE
    USING (auth.uid() = auth.users.id);

-- 策略：管理员可以访问所有用户数据
CREATE
POLICY "Allow admins to manage all users"
    ON auth.users
    FOR ALL
    USING (auth.role() = 'admin');

-- ALTER TABLE public.roles ENABLE POLICY;
-- ALTER TABLE public.permissions ENABLE POLICY;
-- ALTER TABLE public.role_permissions ENABLE POLICY;
-- ALTER TABLE public.role_menus ENABLE POLICY;
-- ALTER TABLE auth.users ENABLE POLICY;
