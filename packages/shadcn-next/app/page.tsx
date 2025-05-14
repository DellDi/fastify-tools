'use server'

import ClientHeader from '@/components/custom/ClientHeader'
import { MarqueeDemoVertical } from '@/components/custom/base/banner-list'
import {
  MotionHeading,
  MotionParagraph,
  MotionButtonGroup,
  MotionSection,
} from '@/components/custom/base/motion-list'
import { getAllSections, type Section } from '@/lib/db'
import { toast } from 'sonner'

// 静态渲染
async function getData(): Promise<{ data: Section[]; error: string | null }> {
  console.log(
    'getData 函数被调用，当前 URL:',
    process.env.NEXT_PUBLIC_BASE_PATH
  )
  try {
    console.log('开始获取 sections 数据...')
    const sections = await getAllSections()
    console.log(
      '获取到的 sections 数据:',
      sections.length ? '有数据' : '无数据'
    )
    return { data: sections, error: null }
  } catch (error) {
    console.error(
      '⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔获取首页数据失败:⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔',
      error
    )
    toast.error(`⛔获取数据失败，请稍后再试${error}`)
    return {
      data: [],
      error: '⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔获取数据失败，请稍后再试',
    }
  }
}

export default async function Home() {
  const { data: sections, error } = await getData()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ClientHeader />
      <div className="w-full">
        <MarqueeDemoVertical />
      </div>

      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">数据加载失败</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <MotionSection
                key={String(section.id)}
                className={`p-6 rounded-lg ${section.gradient}`}
              >
                <MotionHeading className="text-2xl font-bold mb-4">
                  {section.title}
                </MotionHeading>
                <MotionParagraph className="mb-6 h-10">
                  {section.description}
                </MotionParagraph>
                <MotionButtonGroup
                  buttons={[
                    {
                      text: section.linkText,
                      href: section.linkHref,
                      variant: 'outline',
                    },
                  ]}
                />
              </MotionSection>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
