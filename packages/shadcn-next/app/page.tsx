import ClientHeader from '@/components/custom/ClientHeader'
import { GithubIcon } from '@/components/custom/base/custom-icon'
import { MotionHeading, MotionParagraph, MotionButtonGroup, MotionSection } from '@/components/custom/base/motion-list'
import { createClient } from '@/utils/supabase/server'

const sections = [
  {
    title: '零配置',
    description: '自动编译并打包，从一开始就为生产环境而优化。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-blue-400 to-purple-500',
  },
  {
    title: '混合模式：SSG和SSR',
    description: '在一个项目中同时支持静态生成页面（SSG）和服务器端渲染页面（SSR）。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-green-400 to-cyan-500',
  },
  {
    title: '增量静态生成',
    description: '在构建之后以增量的方式为新增加的页面生成静态页面。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    title: '支持 TypeScript',
    description: '自动配置并编译 TypeScript。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-pink-400 to-red-500',
  },
  {
    title: '快速刷新',
    description: '快速、可靠的实时编辑体验，已在 Facebook 数以万计的组件中使用。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    title: '基于文件系统的路由',
    description: '每个 `pages` 目录下的组件都自动成为一个路由。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-teal-400 to-green-500',
  },
]

// 静态渲染
async function getData() {
  const supabase = await createClient()
  const res = await supabase.from('dl_ai_sections').select('*')
  console.log('🚀 ~ file:page.tsx, line:55-----', res)
  return res
}

export default async function Home() {
  const { data, error } = await getData()
  return (
    <div className="max-w-screen-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black min-h-screen">
      <ClientHeader/>
      <main className="text-center mt-16 px-4">
        <MotionHeading text="这是一个用于生产环境的 React 框架"/>
        <MotionParagraph
          text="Next.js 为您提供生产环境所需的所有功能以及最佳的开发体验：包括静态及服务器端渲染合流架、支持 TypeScript、智能化打包、路由预取等功能无需任何配置。"/>
        <MotionButtonGroup/>
        <div className="mt-4 text-gray-600 dark:text-blue-100">
          开源协议：MIT
          <a href="#"
             className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2 inline-flex items-center">
            <GithubIcon className="w-4 h-4 mr-1"/>
            GitHub
          </a>
        </div>
      </main>
      <section className="mt-16 px-6 pb-16">
        <MotionHeading text="为什么选择 Next.js" className="text-center"/>
        <MotionParagraph text="全球领先的公司都在使用并喜爱 Next.js" className="text-center"/>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <MotionSection
              key={index}
              title={section.title}
              description={section.description}
              linkText={section.linkText}
              linkHref={section.linkHref}
              gradient={section.gradient}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
