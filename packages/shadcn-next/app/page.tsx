import ClientHeader from '@/components/custom/ClientHeader'
import { MarqueeDemoVertical } from '@/components/custom/base/banner-list'
import {
  MotionHeading,
  MotionParagraph,
  MotionButtonGroup,
  MotionSection,
} from '@/components/custom/base/motion-list'
import { getAllSections, type Section } from '@/lib/db'

// 静态渲染
async function getData(): Promise<{ data: Section[]; error: string | null }> {
  try {
    const sections = await getAllSections()
    return { data: sections, error: null }
  } catch (error) {
    console.error('获取首页数据失败:', error)
    return { data: [], error: '获取数据失败，请稍后再试' }
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
                <MotionParagraph className="mb-6">
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
