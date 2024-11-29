-- 插入默认角色
INSERT INTO public.roles (name, description)
VALUES ('basic_user', '基本用户，具有查看和编辑个人信息的权限');

-- 插入默认权限
INSERT INTO public.permissions (name, description)
VALUES ('view_dashboard', '查看仪表板权限'),
       ('edit_profile', '编辑个人信息权限');

-- 给角色分配权限
-- 你可以通过查询角色 ID 和权限 ID 来动态获取
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES ((SELECT id FROM public.roles WHERE name = 'basic_user'),
        (SELECT id FROM public.permissions WHERE name = 'view_dashboard')),
       ((SELECT id FROM public.roles WHERE name = 'basic_user'),
        (SELECT id FROM public.permissions WHERE name = 'edit_profile'));
-- 插入默认菜单
INSERT INTO public.menus (name, url)
VALUES ('dashboard', '/dashboard'),
       ('profile', '/profile');
-- 给角色分配菜单
INSERT INTO public.role_menus (role_id, menu_id)
VALUES ((SELECT id FROM public.roles WHERE name = 'basic_user'),
        (SELECT id FROM public.menus WHERE name = 'dashboard')),
       ((SELECT id FROM public.roles WHERE name = 'basic_user'), (SELECT id FROM public.menus WHERE name = 'profile'));
