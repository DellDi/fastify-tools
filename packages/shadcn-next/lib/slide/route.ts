import {
  Bird,
  BookOpen,
  Bot,
  Code2,
  Eclipse,
  Frame,
  History,
  Map,
  PieChart,
  Rabbit,
  Settings2,
  SnailIcon,
  SquareTerminal,
  Turtle,
} from 'lucide-react'


export const routesConfig = {
  teams: [
    {
      name: 'Dell DI Home',
      logo: SnailIcon,
      plan: 'Enterprise',
    },
    {
      name: 'Dell DI Corp',
      logo: Eclipse,
      plan: 'Startup',
    },
    {
      name: 'Dell DI Favorites',
      logo: Rabbit,
      plan: 'Free',
    },
  ],
  user: {
    name: 'delldi',
    email: 'delldi808611@outlook.com',
    avatar: 'https://avatars.githubusercontent.com/u/40460351?v=4',
  },
  navMain: [
    {
      title: '密码解析',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'neeseeERP',
          url: '/password/newsee',
          icon: History,
          description: 'neesee密码加解密',
        },
      ],
    },
    {
      title: '文件系统',
      url: '#',
      icon: Bot,
      items: [
        {
          title: '文件管理',
          url: '/file/manage',
          icon: Rabbit,
          description: '我们最快的通用模型。',
        },
        {
          title: '文件上传',
          url: '/file/upload',
          icon: Bird,
          description: '高效的性能和速度。',
        },
        {
          title: '大文件上传',
          url: '/file/bigLoad',
          icon: Turtle,
          description: '最强大的复杂计算模型。',
        },
      ],
    },
    {
      title: 'jira中心',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: '个人看板',
          url: '/jira/personal',
        },
        {
          title: '创建工单',
          url: '/jira/create',
        },
      ],
    },
    {
      title: 'AIGC',
      url: '#',
      icon: Code2,
      items: [
        {
          title: 'Chat工具',
          url: '/aigc/chat',
        },
        {
          title: '模型调优',
          url: '/aigc/model',
        },
      ],
    },
    {
      title: '设置',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: '通用',
          url: '#',
        },
        {
          title: '团队',
          url: '#',
        },
        {
          title: '计费',
          url: '#',
        },
        {
          title: '限制',
          url: '#',
        },
      ],
    },
  ],

  projects: [
    {
      name: '设计工程',
      url: '#',
      icon: Frame,
    },
    {
      name: '销售与市场',
      url: '#',
      icon: PieChart,
    },
    {
      name: '旅行',
      url: '#',
      icon: Map,
    },
  ],

  // navSecondary: [
  //   {
  //     title: "Support",
  //     url: "#",
  //     icon: LifeBuoy,
  //   },
  //   {
  //     title: "Feedback",
  //     url: "#",
  //     icon: Send,
  //   },
  // ],
  searchResults: [
    {
      title: '路由基础',
      teaser:
        '每个应用程序的骨架都是路由。本页将向您介绍 Web 路由的基本概念以及如何在 Next.js 中处理路由。',
      url: '#',
    },
    {
      title: '布局和模板',
      teaser:
        '特殊文件 layout.js 和 template.js 允许您创建在路由之间共享的 UI。本页将指导您如何以及何时使用这些特殊文件。',
      url: '#',
    },
    {
      title: '数据获取、缓存和重新验证',
      teaser:
        '数据获取是任何应用程序的核心部分。本页介绍了如何在 React 和 Next.js 中获取、缓存和重新验证数据。',
      url: '#',
    },
    {
      title: '服务器和客户端组合模式',
      teaser:
        '在构建 React 应用程序时，您需要考虑应用程序的哪些部分应在服务器或客户端上呈现。',
      url: '#',
    },
    {
      title: '服务器操作和变更',
      teaser:
        '服务器操作是异步函数，在服务器上执行。它们可以在服务器和客户端组件中使用，以处理表单提交和 Next.js 应用程序中的数据变更。',
      url: '#',
    },
  ],
}
