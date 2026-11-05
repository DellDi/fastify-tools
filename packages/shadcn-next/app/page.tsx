export const revalidate = 60 // 每60秒重新验证数据

import ClientHeader from '@/components/custom/ClientHeader'
import { ToolTicker } from '@/components/custom/base/banner-list'
import { BrandHero } from '@/components/custom/BrandHero'

import { getAllSections, type Section } from '@/lib/db'
import { SectionCard } from '@/components/custom/SectionCard'

// 静态渲染
async function getData(): Promise<{ data: Section[]; error: string | null }> {
  'use server'
  try {
    const sections = await getAllSections()
    return { data: sections, error: null }
  } catch {
    return {
      data: [],
      error: '获取数据失败，请稍后再试',
    }
  }
}

export default async function Home() {
  const { data: sections, error } = await getData()

  return (
    <main className="flex min-h-screen flex-col">
      <ClientHeader />
      <BrandHero />
      <ToolTicker />
      <section className="container mx-auto w-full max-w-7xl px-4 pb-20 pt-14">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">全部工具</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            选择一个模块，直接进入工作
          </p>
        </div>
        {error ? (
          <div className="py-10 text-center">
            <h3 className="mb-2 text-xl font-semibold">数据加载失败</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
        )}
      </section>
      <footer className="mt-auto border-t py-8">
        <p className="text-center text-xs text-muted-foreground">
          Built by DellDi · Next.js 15 / Fastify 5 / Prisma 6 / PostgreSQL 17
        </p>
      </footer>
    </main>
  )
}
