"use client"

import { Timeline } from "@/components/ui/timeline"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

interface ChangelogItem {
  version: string
  date: string
  changes: string[]
  color: string
}

const changelogData: ChangelogItem[] = [
  {
    version: "2.0.0",
    date: "2023-12-01",
    changes: [
      "完全重新设计的用户界面",
      "新增AI驱动的内容推荐系统",
      "性能优化,页面加载速度提升50%"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    version: "1.5.0",
    date: "2023-11-15",
    changes: [
      "引入深色模式",
      "新增5种语言支持",
      "修复了几个关键的bug"
    ],
    color: "from-yellow-400 to-orange-500"
  },
  {
    version: "1.4.2",
    date: "2023-11-01",
    changes: [
      "改进了移动端的响应式设计",
      "优化了图片加载速度",
      "更新了文档"
    ],
    color: "from-green-400 to-cyan-500"
  },
  {
    version: "1.4.1",
    date: "2023-10-15",
    changes: [
      "修复了登录页面的一个bug",
      "改进了错误处理机制"
    ],
    color: "from-blue-400 to-indigo-500"
  },
  {
    version: "1.4.0",
    date: "2023-10-01",
    changes: [
      "新增了用户个人资料页面",
      "添加了暗黑模式切换",
      "优化了移动端导航"
    ],
    color: "from-red-400 to-pink-500"
  },
  {
    version: "1.3.0",
    date: "2023-09-15",
    changes: [
      "新增了通知中心",
      "改进了搜索功能",
      "修复了一些UI问题",
      "更新了依赖包"
    ],
    color: "from-purple-400 to-indigo-500"
  },
  // 添加更多的更新日志项...
]

const ChangeLogPage = () => {
  // 转换数据格式以适配 Timeline 组件
  const timelineData = changelogData.map(item => ({
    title: `${item.version} - ${item.date}`,
    content: (
      <div className="space-y-4">
        <div className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
          `bg-gradient-to-r ${item.color} text-white`
        )}>
          {item.version}
        </div>
        <ul className="space-y-2">
          {item.changes.map((change, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground">{change}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            更新日志
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            了解我们产品的最新更新和改进
          </p>
        </div>

        <div className="relative w-full overflow-clip
          [--primary:0,0%,50%]
          [--secondary:0,0%,60%]
          [--accent:0,0%,40%]
          [--background:0,0%,100%]
          [--foreground:0,0%,10%]
          dark:[--primary:0,0%,80%]
          dark:[--secondary:0,0%,70%]
          dark:[--accent:0,0%,90%]
          dark:[--background:0,0%,5%]
          dark:[--foreground:0,0%,95%]">
          <Timeline data={timelineData} />
        </div>
      </div>
    </div>
  )
}

export default ChangeLogPage
