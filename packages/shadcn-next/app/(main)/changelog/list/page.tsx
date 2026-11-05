'use client'

import { motion } from 'motion/react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface ChangelogItem {
  version: string
  date: string
  changes: string[]
}

const changelogData: ChangelogItem[] = [
  {
    version: '2.0.0',
    date: '2025-12-01',
    changes: [
      '完全重新设计的用户界面',
      '新增AI驱动的内容推荐系统',
      '性能优化,页面加载速度提升50%',
    ],
  },
  {
    version: '1.5.0',
    date: '2025-11-15',
    changes: ['引入深色模式', '新增5种语言支持', '修复了几个关键的bug'],
  },
  {
    version: '1.4.2',
    date: '2025-11-01',
    changes: ['改进了移动端的响应式设计', '优化了图片加载速度', '更新了文档'],
  },
  {
    version: '1.4.1',
    date: '2025-10-15',
    changes: ['修复了登录页面的一个bug', '改进了错误处理机制'],
  },
  {
    version: '1.4.0',
    date: '2025-10-01',
    changes: [
      '新增了用户个人资料页面',
      '添加了暗黑模式切换',
      '优化了移动端导航',
    ],
  },
  {
    version: '1.3.0',
    date: '2025-09-15',
    changes: [
      '新增了通知中心',
      '改进了搜索功能',
      '修复了一些UI问题',
      '更新了依赖包',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">更新日志</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          平台的版本迭代与功能变更记录
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-4 left-[7px] top-4 w-px bg-border" />
        <div className="space-y-8">
          {changelogData.map((item, index) => (
            <motion.div
              key={item.version}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative pl-10"
            >
              <span
                className={
                  index === 0
                    ? 'absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-[3px] border-primary bg-background'
                    : 'absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-[3px] border-muted-foreground/30 bg-background'
                }
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  v{item.version}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(item.date), 'yyyy年M月d日')}
                </span>
                {index === 0 && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    最新
                  </Badge>
                )}
              </div>
              <Card className="mt-3 shadow-card">
                <CardContent className="p-5">
                  <ul className="space-y-2">
                    {item.changes.map((change, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
