'use client'

import { motion } from 'motion/react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface ChangelogEntry {
  id: string
  version: string
  date: string | Date
  changes: string[]
}

export function ChangelogTimeline({ items }: { items: ChangelogEntry[] }) {
  if (!items.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        暂无更新记录
      </p>
    )
  }

  return (
    <div className="relative">
      {/* 时间轴主线：移动端靠左，md+ 居中 */}
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border md:left-1/2" />

      <div className="space-y-10 md:space-y-14">
        {items.map((item, index) => {
          const cardLeft = index % 2 === 0
          const isLatest = index === 0
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, x: cardLeft ? -16 : 16 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative md:grid md:grid-cols-2 md:gap-x-16"
            >
              {/* 轴上节点 */}
              <span
                className={`absolute left-0 top-1.5 z-10 h-[15px] w-[15px] rounded-full border-[3px] bg-background md:left-1/2 md:-translate-x-1/2 ${
                  isLatest ? 'border-primary' : 'border-muted-foreground/30'
                }`}
              />
              {/* 节点与卡片之间的连接线 */}
              <span
                className={`absolute top-[13px] hidden h-px w-8 bg-border md:block ${
                  cardLeft ? 'right-1/2' : 'left-1/2'
                }`}
              />

              {/* 版本与日期：贴轴的另一侧 */}
              <div
                className={`pl-9 md:pl-0 ${
                  cardLeft
                    ? 'md:col-start-2 md:row-start-1'
                    : 'md:col-start-1 md:row-start-1 md:text-right'
                }`}
              >
                <div
                  className={`flex flex-wrap items-baseline gap-x-3 md:pt-0.5 ${
                    cardLeft ? '' : 'md:justify-end'
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold tracking-tight ${
                      cardLeft ? '' : 'md:order-last'
                    }`}
                  >
                    v{item.version}
                  </h3>
                  {isLatest && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                      最新
                    </Badge>
                  )}
                  <time className="text-sm tabular-nums text-muted-foreground">
                    {format(new Date(item.date), 'yyyy年M月d日')}
                  </time>
                </div>
              </div>

              {/* 变更卡片：左右交替 */}
              <div
                className={`mt-3 pl-9 md:mt-0 md:pl-0 ${
                  cardLeft
                    ? 'md:col-start-1 md:row-start-1'
                    : 'md:col-start-2 md:row-start-1'
                }`}
              >
                <Card
                  className={`text-left shadow-card transition-transform duration-300 hover:-translate-y-0.5 ${
                    isLatest ? 'border-primary/30' : ''
                  }`}
                >
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
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
