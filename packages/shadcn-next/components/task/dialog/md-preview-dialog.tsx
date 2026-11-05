'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import JSZip from 'jszip'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { FileText, File as FileIcon, Loader2 } from 'lucide-react'
import { fetchFastApi } from '@/utils/fetch/fastFetch'
import { cn } from '@/lib/utils'

interface ZipEntry {
  path: string
  isMd: boolean
}

interface MdPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
  mode: string
}

const MD_EXT = /\.(md|markdown|mdx)$/i

type ViewMode = 'preview' | 'source' | 'compare'

export function MdPreviewDialog({
  open,
  onOpenChange,
  taskId,
  mode,
}: MdPreviewDialogProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [entries, setEntries] = useState<ZipEntry[]>([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [contentLoading, setContentLoading] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const zipRef = useRef<JSZip | null>(null)
  const loadSeq = useRef(0)

  // 打开时下载并解析压缩包
  useEffect(() => {
    if (!open || !taskId) return
    const seq = ++loadSeq.current
    setStatus('loading')
    setErrorMsg('')
    setEntries([])
    setSelected(null)
    setContent('')
    setFilter('')

    ;(async () => {
      try {
        const res = await fetchFastApi(
          `/scrapy/api/${mode}/download/${taskId}`,
          { method: 'GET' }
        )
        const blob = await res.blob()
        const zip = await JSZip.loadAsync(blob)
        if (seq !== loadSeq.current) return

        const list: ZipEntry[] = Object.values(zip.files)
          .filter((f) => !f.dir)
          .map((f) => ({ path: f.name, isMd: MD_EXT.test(f.name) }))
          .sort(
            (a, b) =>
              Number(b.isMd) - Number(a.isMd) || a.path.localeCompare(b.path)
          )

        zipRef.current = zip
        setEntries(list)
        setSelected(list[0]?.path ?? null)
        setStatus('ready')
      } catch (e) {
        if (seq !== loadSeq.current) return
        setErrorMsg(e instanceof Error ? e.message : '压缩包解析失败')
        setStatus('error')
      }
    })()
  }, [open, taskId, mode])

  // 读取选中文件内容
  useEffect(() => {
    const entry = entries.find((e) => e.path === selected)
    if (!selected || !entry?.isMd || !zipRef.current) {
      setContent('')
      return
    }
    let cancelled = false
    setContentLoading(true)
    zipRef.current
      .file(selected)
      ?.async('string')
      .then((text) => {
        if (!cancelled) setContent(text)
      })
      .catch(() => {
        if (!cancelled) setContent('')
      })
      .finally(() => {
        if (!cancelled) setContentLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selected, entries])

  const filteredEntries = useMemo(() => {
    if (!filter) return entries
    const kw = filter.toLowerCase()
    return entries.filter((e) => e.path.toLowerCase().includes(kw))
  }, [entries, filter])

  const selectedEntry = entries.find((e) => e.path === selected)

  const renderMarkdown = (text: string) => (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[92vw] w-[92vw] h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-base truncate">
              任务产物预览
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {taskId.slice(0, 8)}
              </span>
            </DialogTitle>
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
            >
              <TabsList>
                <TabsTrigger value="preview">渲染预览</TabsTrigger>
                <TabsTrigger value="source">源码</TabsTrigger>
                <TabsTrigger value="compare">对比</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {status === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">正在下载并解析压缩包...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex-1 flex items-center justify-center text-destructive text-sm">
            {errorMsg}
          </div>
        )}

        {status === 'ready' && (
          <div className="flex flex-1 min-h-0">
            {/* 文件列表 */}
            <div className="w-72 shrink-0 border-r flex flex-col min-h-0">
              <div className="p-2 border-b shrink-0">
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="过滤文件..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                {filteredEntries.length === 0 && (
                  <p className="px-3 py-4 text-xs text-muted-foreground">
                    暂无文件
                  </p>
                )}
                {filteredEntries.map((e) => (
                  <button
                    key={e.path}
                    onClick={() => setSelected(e.path)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors',
                      selected === e.path && 'bg-accent font-medium'
                    )}
                    title={e.path}
                  >
                    {e.isMd ? (
                      <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    ) : (
                      <FileIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{e.path}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容区 */}
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
              {contentLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !selectedEntry ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  请选择文件
                </div>
              ) : !selectedEntry.isMd ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  该文件类型暂不支持在线预览
                </div>
              ) : viewMode === 'preview' ? (
                <div className="h-full overflow-y-auto p-6">
                  {renderMarkdown(content)}
                </div>
              ) : viewMode === 'source' ? (
                <pre className="h-full overflow-auto p-6 text-xs font-mono whitespace-pre-wrap break-words">
                  {content}
                </pre>
              ) : (
                <div className="grid grid-cols-2 h-full divide-x">
                  <pre className="overflow-auto p-4 text-xs font-mono whitespace-pre-wrap break-words bg-muted/30">
                    {content}
                  </pre>
                  <div className="overflow-y-auto p-6">
                    {renderMarkdown(content)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
