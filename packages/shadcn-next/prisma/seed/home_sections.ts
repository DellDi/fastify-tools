import { PrismaClient } from '../../generated/client/index.js';
const prisma = new PrismaClient();

export async function seedHomeSections() {
  const sections = [
    {
      title: '首页看板',
      description: '统计中心的专项个人看板概览视图',
      linkText: '进入首页',
      linkHref: '/',
      gradient: 'from-green-400 to-cyan-500',
      status: '在用'
    },
    {
      title: 'RAG与爬虫',
      description: '解决获取新视窗数据格式文档的规范化的相关难题，支持RAG知识获取、dify对接',
      linkText: '进入爬虫中心',
      linkHref: '/aigc/task',
      gradient: 'from-yellow-400 to-orange-500',
      status: '在用'
    },
    {
      title: 'jira中心',
      description: '解决了saas组非标签立项的bug单和运维单的检索过程',
      linkText: 'SaaS专项单',
      linkHref: '/jira/personal',
      gradient: 'from-blue-400 to-purple-500',
      status: '在用'
    },
    {
      title: '密码解析',
      description: '可以解析出newsee的服务器对应的密文的密码，也可以做加密',
      linkText: '试试看',
      linkHref: '/password/newsee',
      gradient: 'from-pink-400 to-red-500',
      status: '在用'
    },
    {
      title: '快速刷新',
      description: '快速、可靠的实时编辑体验，已在 Facebook 数以万计的组件中使用。',
      linkText: '中文文档',
      linkHref: '/login',
      gradient: 'from-indigo-400 to-purple-500',
      status: '在用'
    },
    {
      title: '基于文件系统的路由',
      description: '每个 `pages` 目录下的组件都自动成为一个路由。',
      linkText: '中文文档',
      linkHref: '/login',
      gradient: 'from-teal-400 to-green-500',
      status: '在用'
    }
  ]

  for (const section of sections) {
    await prisma.homeSection.upsert({
      where: { id: 0 }, // 这里的id会被忽略，因为是自增的
      update: {},
      create: {
        ...section
      }
    })
  }

  console.log('Home sections seeded successfully')
}