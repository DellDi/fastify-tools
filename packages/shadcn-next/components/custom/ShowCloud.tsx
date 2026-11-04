import { IconCloud } from '@/components/ui/icon-cloud'
import { Card } from '@/components/ui/card'

const slugs = [
  'typescript',
  'javascript',
  'dart',
  'react',
  'flutter',
  'android',
  'html5',
  'nodedotjs',
  'express',
  'nextdotjs',
  'prisma',
  'postgresql',
  'firebase',
  'nginx',
  'vercel',
  'testinglibrary',
  'jest',
  'cypress',
  'docker',
  'git',
  'jira',
  'github',
  'gitlab',
  'androidstudio',
  'figma',
]

export function ShowCloud() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
  )

  return (
    <Card className="min-w-80 relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </Card>
  )
}
