import Marquee from '@/components/ui/marquee'
import {
  KanbanSquare,
  ListFilter,
  MessageSquare,
  SlidersHorizontal,
  ListTodo,
  FileUp,
  FolderOpen,
  UploadCloud,
  KeyRound,
  History,
  Users,
  Search,
  type LucideIcon,
} from 'lucide-react'

const tools: { icon: LucideIcon; name: string; desc: string }[] = [
  { icon: KanbanSquare, name: 'Jira 工单', desc: '按模板快速创建与指派' },
  { icon: Search, name: '我的工单', desc: '追踪个人待办与进展' },
  { icon: ListFilter, name: '字段规则', desc: '可复用的 Jira 填表规则' },
  { icon: MessageSquare, name: 'AI 对话', desc: '接入 Dify 的智能会话' },
  { icon: SlidersHorizontal, name: '模型调优', desc: '对比不同模型的输出' },
  { icon: ListTodo, name: '任务面板', desc: '异步任务队列一览' },
  { icon: FileUp, name: '文件上传', desc: '单文件与批量上传' },
  { icon: UploadCloud, name: '大文件续传', desc: '分片上传，断点续传' },
  { icon: FolderOpen, name: '文件管理', desc: '已上传文件归档查询' },
  { icon: KeyRound, name: '密码工具', desc: '密文解密与安全校验' },
  { icon: History, name: '更新日志', desc: '平台版本与变更记录' },
  { icon: Users, name: '团队管理', desc: '角色、权限与菜单配置' },
]

const firstRow = tools.slice(0, tools.length / 2)
const secondRow = tools.slice(tools.length / 2)

function ToolChip({
  icon: Icon,
  name,
  desc,
}: {
  icon: LucideIcon
  name: string
  desc: string
}) {
  return (
    <div className="flex w-64 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-card">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

export function ToolTicker() {
  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden py-2">
      <Marquee pauseOnHover className="[--duration:32s]">
        {firstRow.map((tool) => (
          <ToolChip key={tool.name} {...tool} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:32s]">
        {secondRow.map((tool) => (
          <ToolChip key={tool.name} {...tool} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
