'use client'

import { useState } from 'react'
import { Download, FileImage, FileQuestion, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fsUrl, useFsRead } from '@/hooks/use-fs'

const CHUNK = 256 * 1024
const fmtSize = (n: number) =>
  n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} K` : `${(n / 1024 ** 2).toFixed(1)} M`

export function PreviewPanel({ path, onClose }: { path: string | null; onClose: () => void }) {
  const [offset, setOffset] = useState(0)
  const { data, isLoading, error } = useFsRead(path, offset)

  if (!path) return null
  const name = path.split('/').pop() ?? path
  const tail = () => setOffset(Math.max(0, (data?.size ?? 0) - CHUNK))

  return (
    <aside className="flex w-96 shrink-0 flex-col gap-3 rounded-md border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium" title={path}>
            {name}
          </div>
          <div className="truncate text-xs text-muted-foreground" title={path}>
            {path}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon" variant="ghost" asChild>
            <a href={fsUrl('download', { path })} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {error && <div className="text-sm text-destructive">{error.message}</div>}

      {data?.type === 'text' && (
        <>
          {data.size > CHUNK && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {fmtSize(data.size)}
                {data.truncated && ` · 显示 ${offset === 0 ? '头' : '尾'} ${fmtSize(CHUNK)}`}
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => setOffset(0)} disabled={offset === 0}>
                  头部
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={tail} disabled={offset > 0}>
                  尾部
                </Button>
              </div>
            </div>
          )}
          <pre className="min-h-0 flex-1 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
            {data.content}
          </pre>
        </>
      )}

      {data?.type === 'image' && (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-md bg-muted/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fsUrl('raw', { path })} alt={name} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {data?.type === 'binary' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
          <div className="text-sm">二进制文件（{fmtSize(data.size)}），不支持预览</div>
          <Button size="sm" variant="outline" asChild>
            <a href={fsUrl('download', { path })} download>
              <Download className="mr-1 h-4 w-4" />
              下载查看
            </a>
          </Button>
        </div>
      )}

      {data?.type === 'dir' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
          <FileImage className="h-8 w-8" />
          <div className="text-sm">这是一个目录</div>
        </div>
      )}
    </aside>
  )
}
