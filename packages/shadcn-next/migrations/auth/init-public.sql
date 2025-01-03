create table if not exists public.home_sections
(
    id          bigint generated always as identity not null,
    title       text                                not null,
    description text                                not null,
    link_text   text                                not null,
    link_href   text                                not null,
    gradient    text                                not null,
    created_at  timestamp with time zone            null default current_timestamp,
    updated_at  timestamp with time zone            null default current_timestamp,
    status      text                                null default '在用'::text,
    constraint home_sections_pkey primary key (id)
) tablespace pg_default;


INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('零配置', '自动编译并打包，从一开始就为生产环境而优化。', '中文文档', '/login', 'from-blue-400 to-purple-500',
        now(), now(), '在用');
INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('混合模式：SSG和SSR', '在一个项目中同时支持静态生成页面（SSG）和服务器端渲染页面（SSR）。', '中文文档', '/login',
        'from-green-400 to-cyan-500', now(), now(), '在用');
INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('增量静态生成', '在构建之后以增量的方式为新增加的页面生成静态页面。', '中文文档', '/login',
        'from-yellow-400 to-orange-500', now(), now(), '在用');
INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('支持 TypeScript', '自动配置并编译 TypeScript。', '中文文档', '/login', 'from-pink-400 to-red-500', now(), now(),
        '在用');
INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('快速刷新', '快速、可靠的实时编辑体验，已在 Facebook 数以万计的组件中使用。', '中文文档', '/login',
        'from-indigo-400 to-purple-500', now(), now(), '在用');
INSERT INTO "public"."home_sections" ("title", "description", "link_text", "link_href", "gradient", "created_at",
                                       "updated_at", "status")
VALUES ('基于文件系统的路由', '每个 `pages` 目录下的组件都自动成为一个路由。', '中文文档',
        '/login', 'from-teal-400 to-green-500', now(), now(), '在用');
