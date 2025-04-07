import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedHomeSections() {
  const sections = [
    {
      title: '零配置',
      description: '自动编译并打包，从一开始就为生产环境而优化。',
      linkText: '中文文档',
      linkHref: '/login',
      gradient: 'from-blue-400 to-purple-500',
      status: '在用'
    },
    {
      title: '混合模式：SSG和SSR',
      description: '在一个项目中同时支持静态生成页面（SSG）和服务器端渲染页面（SSR）。',
      linkText: '中文文档',
      linkHref: '/login',
      gradient: 'from-green-400 to-cyan-500',
      status: '在用'
    },
    {
      title: '增量静态生成',
      description: '在构建之后以增量的方式为新增加的页面生成静态页面。',
      linkText: '中文文档',
      linkHref: '/login',
      gradient: 'from-yellow-400 to-orange-500',
      status: '在用'
    },
    {
      title: '支持 TypeScript',
      description: '自动配置并编译 TypeScript。',
      linkText: '中文文档',
      linkHref: '/login',
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