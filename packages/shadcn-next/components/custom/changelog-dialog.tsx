'use client'

import { History } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ChangelogTimeline,
  type ChangelogEntry,
} from '@/components/custom/changelog-timeline'

export function ChangelogDialog({
  items,
  triggerClassName,
  open,
  onOpenChange,
}: {
  items: ChangelogEntry[]
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={triggerClassName}>更新日志</DialogTrigger>
      <DialogContent className="flex max-h-[82vh] w-[calc(100vw-2rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl border-border/60 p-0 shadow-2xl">
        <DialogHeader className="items-center gap-1.5 border-b border-border/60 px-6 pb-5 pt-7 text-center">
          <DialogTitle className="flex items-center justify-center gap-2.5 whitespace-nowrap text-xl font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <History className="h-4 w-4 text-primary" />
            </span>
            更新日志
          </DialogTitle>
          <DialogDescription>
            平台的版本迭代与功能变更 · 共 {items.length} 个版本
          </DialogDescription>
        </DialogHeader>
        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-y-auto px-5 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-10">
            <ChangelogTimeline items={items} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
