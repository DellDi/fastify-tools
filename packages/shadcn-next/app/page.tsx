export const revalidate = 60 // 每60秒重新验证数据

import ClientHeader from '@/components/custom/ClientHeader'
import { MarqueeDemoVertical } from '@/components/custom/base/banner-list'
import { SparklesPreview } from '@/components/custom/SparklesPreview'

import { getAllSections, type Section } from '@/lib/db'
import { toast } from 'sonner'
import { SectionCard } from '@/components/custom/SectionCard'

// 静态渲染
async function getData(): Promise<{ data: Section[]; error: string | null }> {
  'use server'
  try {
    const sections = await getAllSections()
    return { data: sections, error: null }
  } catch (error) {
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
    <main className="flex min-h-screen flex-col items-center gap-12">
      <ClientHeader />
      <div className="text-2xl font-bold">
        <SparklesPreview />
      </div>
      <div className="w-full">
        <MarqueeDemoVertical />
      </div>
      <div className="container mx-auto px-4 py-2">
        {error ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">数据加载失败</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  linkText={section.linkText}
                  linkHref={section.linkHref}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
