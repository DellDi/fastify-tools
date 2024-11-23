import ClientHeader from '@/components/custom/ClientHeader'
import { MarqueeDemoVertical } from '@/components/custom/base/banner-list'
import {
  MotionHeading,
  MotionParagraph,
  MotionButtonGroup,
  MotionSection,
} from '@/components/custom/base/motion-list'
import { mapKeys, snakeToCamel } from '@/utils/func'
import { createClient } from '@/supabase/server'

interface Section {
  title: string
  description: string
  linkText: string
  linkHref: string
  gradient: string
}

// 静态渲染
async function getData(): Promise<{ data: Section[]; error: { message: string } | null }> {
  const supabase = await createClient()
  const res = await supabase.from('dl_ai_sections').select('*')

  if (res.error) {
    return { data: [], error: res.error }
  }

  const data: Section[] = (res.data || []).map((item: {
    title: string;
    description: string;
    link_text: string;
    link_href: string;
    gradient: string
  }) => (mapKeys(item, snakeToCamel) as unknown) as Section)

  return { data, error: null }
}

export default async function Home() {
  const { data, error } = await getData()

  if (error) {
    return <div>加载数据时出错: {error.message}</div>
  }

  const sections = (data || []).map((item) => ({
    title: item.title,
    description: item.description,
    linkText: item.linkText,
    linkHref: item.linkHref,
    gradient: item.gradient,
  }))

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black min-h-screen">
      <ClientHeader/>
      <div className="max-w-screen-xl mx-auto">
        <main className="text-center mt-16 px-4">
          <MotionHeading text="这是一个用于展示工具集合和AIGC的作品集合"/>
          <MotionParagraph text="后端使用next和fastify组合使用、对接丰富的AIGC资源和文件系统资源、知识库等"/>
          <MotionButtonGroup/>
        </main>
        <section className="mt-16 px-6 pb-16">
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

          <MotionHeading
            text="为什么选择 Next.js"
            className="text-center mt-16  "
          />
          <MotionParagraph
            text="全球领先的公司都在使用并喜爱 Next.js，AI驱动的先行者，支持最新的 Web 技术，提供最佳的开发体验。"
            className="text-center"
          />
        </section>
        <MarqueeDemoVertical/>
      </div>
    </div>
  )
}
