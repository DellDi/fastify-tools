import { PrismaClient } from '@/types/prisma';

const prisma = new PrismaClient();

export async function seedChangelog() {
  const entries = [
    {
      version: '1.8.0',
      date: new Date('2026-11-11'),
      changes: [
        '新增 RBAC 管理界面：角色、权限、菜单、用户四个页签统一维护',
        '文件管理重构为服务器文件中心，Docker prune 改为异步任务',
        '更新日志改版：首页弹窗直接查看，后台可视化维护',
      ],
    },
    {
      version: '1.7.0',
      date: new Date('2026-11-08'),
      changes: [
        'dashboard 按资源分区改为三层标准栅格布局',
        '新增宿主机系统监控与服务器资源图表',
        '补齐网络 I/O 与 Docker 容器监控',
      ],
    },
    {
      version: '1.6.0',
      date: new Date('2026-11-05'),
      changes: [
        'jira 中心新增「巡检日志」：对账台账、日期筛选、经办人选项',
        '巡检日志支持展开查看改动明细与决策推理链',
        '字段经验与巡检日志表格接入服务端分页',
      ],
    },
    {
      version: '1.5.0',
      date: new Date('2026-10-20'),
      changes: [
        '后台改版为 SaaS 轻奢橙视觉体系',
        '新增 Pages 站点管理与审计能力，静态站点一键部署',
        '爬虫任务产物支持在线预览（zip 解析 + Markdown 渲染对比）',
      ],
    },
    {
      version: '1.4.0',
      date: new Date('2026-09-15'),
      changes: [
        '新增字段经验规则审计页，支持人工校准学习策略',
        '登录流程迁移至 Server Actions，优化加载状态',
        '统一环境变量配置至根目录',
      ],
    },
    {
      version: '1.3.0',
      date: new Date('2026-08-01'),
      changes: [
        '新增 AI 对话工具，接入 Dify 智能会话',
        '新增模型调优页，对比不同模型输出',
        '新增密码解析工具，支持 newsee 密文加解密',
      ],
    },
  ];

  await prisma.changelog.deleteMany();
  await prisma.changelog.createMany({ data: entries });

  console.log('Changelog seeded successfully');
}
