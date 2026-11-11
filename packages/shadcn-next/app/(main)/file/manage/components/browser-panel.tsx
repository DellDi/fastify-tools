'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  ChevronRight,
  Download,
  Eye,
  File,
  FileWarning,
  Folder,
  FolderPlus,
  Link2,
  Loader2,
  Lock,
  MoreVertical,
  Move,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  fsApi,
  fsUrl,
  FsEntry,
  searchFs,
  SearchHit,
  useFsList,
} from '@/hooks/use-fs'
import { PreviewPanel } from './preview-panel'

const fmtSize = (n: number | null) => {
  if (n === null) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} K`
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} M`
  return `${(n / 1024 ** 3).toFixed(2)} G`
}
const fmtTime = (ms: number) => (ms ? new Date(ms).toLocaleString('zh-CN', { hour12: false }) : '—')
const join = (dir: string, name: string) => `${dir === '/' ? '' : dir}/${name}`
const parentOf = (p: string) => p.slice(0, p.lastIndexOf('/')) || '/'

const iconOf = (e: FsEntry) =>
  e.denied ? (
    <Lock className="h-4 w-4 text-amber-500" />
  ) : e.type === 'dir' ? (
    <Folder className="h-4 w-4 text-sky-500" />
  ) : e.type === 'link' ? (
    <Link2 className="h-4 w-4 text-muted-foreground" />
  ) : (
    <File className="h-4 w-4 text-muted-foreground" />
  )

type Op = { kind: 'mkdir' } | { kind: 'rename' | 'move' | 'delete'; entry: FsEntry } | null

export function BrowserPanel() {
  const [path, setPath] = useState('/opt')
  const [preview, setPreview] = useState<string | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [opValue, setOpValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const { data, error, isLoading, mutate } = useFsList(path)

  const entries = data?.entries ?? []
  const writable = data?.writable ?? false
  const crumbs = path.split('/').filter(Boolean)

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    setBusy(true)
    try {
      await fn()
      toast.success(okMsg)
      setOp(null)
      await mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  const submitOp = () =>
    run(async () => {
      if (op?.kind === 'mkdir') {
        await fsApi('/api/fs/mkdir', { body: { path: join(path, opValue) } })
      } else if (op?.kind === 'rename') {
        await fsApi('/api/fs/rename', {
          body: { path: join(path, op.entry.name), newName: opValue },
        })
      } else if (op?.kind === 'move') {
        await fsApi('/api/fs/move', {
          body: { src: join(path, op.entry.name), dest: opValue },
        })
      }
    }, '操作成功')

  const doDelete = (e: FsEntry) =>
    run(
      () =>
        fsApi(
          `/api/fs?path=${encodeURIComponent(join(path, e.name))}&confirm=true&recursive=${e.type === 'dir'}`,
          { method: 'DELETE' }
        ),
      '已删除'
    )

  const doUpload = async (files: FileList | null) => {
    if (!files?.length) return
    const form = new FormData()
    Array.from(files).forEach((f) => form.append('file', f))
    await run(
      () => fsApi(`/api/fs/upload?path=${encodeURIComponent(path)}`, { form }),
      `已上传 ${files.length} 个文件`
    )
    if (uploadRef.current) uploadRef.current.value = ''
  }

  const navigate = (e: FsEntry) => {
    if (e.type === 'dir') {
      setPath(join(path, e.name))
      setPreview(null)
    } else if (!e.denied) {
      setPreview(join(path, e.name))
    }
  }

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* 左：面包屑 + 文件表 */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav className="flex min-w-0 items-center gap-0.5 text-sm">
            <button
              className="font-medium text-primary hover:underline"
              onClick={() => {
                setPath('/')
                setPreview(null)
              }}
            >
              /
            </button>
            {crumbs.map((seg, i) => {
              const p = '/' + crumbs.slice(0, i + 1).join('/')
              return (
                <span key={p} className="flex items-center gap-0.5">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <button
                    className="max-w-40 truncate font-medium hover:underline"
                    onClick={() => {
                      setPath(p)
                      setPreview(null)
                    }}
                  >
                    {seg}
                  </button>
                </span>
              )
            })}
            {writable ? (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                可写
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-2 text-[10px]">
                只读
              </Badge>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setSearchOpen(true)}>
              <Search className="mr-1 h-4 w-4" />
              搜索
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!writable}
              title={writable ? '' : '仅 /opt、/srv 可写'}
              onClick={() => {
                setOp({ kind: 'mkdir' })
                setOpValue('')
              }}
            >
              <FolderPlus className="mr-1 h-4 w-4" />
              新建目录
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!writable}
              onClick={() => uploadRef.current?.click()}
            >
              <Upload className="mr-1 h-4 w-4" />
              上传
            </Button>
            <Button size="sm" variant="ghost" onClick={() => mutate()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <input
              ref={uploadRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => void doUpload(e.target.files)}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead className="w-24">大小</TableHead>
                <TableHead className="w-44">修改时间</TableHead>
                <TableHead className="w-20">权限</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    加载中…
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-destructive">
                    {error.message}
                  </TableCell>
                </TableRow>
              )}
              {path !== '/' && (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => {
                    setPath(parentOf(path))
                    setPreview(null)
                  }}
                >
                  <TableCell colSpan={5} className="text-muted-foreground">
                    <Folder className="mr-2 inline h-4 w-4" />
                    ..
                  </TableCell>
                </TableRow>
              )}
              {entries.map((e) => (
                <TableRow
                  key={e.name}
                  className={`cursor-pointer ${preview === join(path, e.name) ? 'bg-muted/60' : ''}`}
                  onClick={() => navigate(e)}
                >
                  <TableCell className="max-w-0">
                    <div className="flex items-center gap-2">
                      {iconOf(e)}
                      <span className={`truncate ${e.denied ? 'text-muted-foreground' : ''}`}>
                        {e.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {fmtSize(e.size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtTime(e.mtimeMs)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {e.mode}
                  </TableCell>
                  <TableCell onClick={(ev) => ev.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" disabled={e.denied}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {e.type !== 'dir' && (
                          <DropdownMenuItem onClick={() => setPreview(join(path, e.name))}>
                            <Eye className="mr-2 h-4 w-4" />
                            预览
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <a
                            href={fsUrl('download', { path: join(path, e.name) })}
                            download
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {e.type === 'dir' ? '打包下载' : '下载'}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={!writable}
                          onClick={() => {
                            setOp({ kind: 'rename', entry: e })
                            setOpValue(e.name)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          重命名
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!writable}
                          onClick={() => {
                            setOp({ kind: 'move', entry: e })
                            setOpValue(path)
                          }}
                        >
                          <Move className="mr-2 h-4 w-4" />
                          移动到…
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!writable}
                          className="text-destructive focus:text-destructive"
                          onClick={() => setOp({ kind: 'delete', entry: e })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !error && entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    空目录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 右：预览 */}
      <PreviewPanel path={preview} onClose={() => setPreview(null)} />

      {/* mkdir / rename / move 对话框 */}
      <Dialog open={!!op && op.kind !== 'delete'} onOpenChange={(o) => !o && setOp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {op?.kind === 'mkdir' ? '新建目录' : op?.kind === 'rename' ? '重命名' : '移动到'}
            </DialogTitle>
            <DialogDescription>
              {op?.kind === 'move' ? '输入目标目录的绝对路径' : `当前目录 ${path}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>{op?.kind === 'move' ? '目标目录' : '名称'}</Label>
            <Input
              value={opValue}
              onChange={(e) => setOpValue(e.target.value)}
              placeholder={op?.kind === 'move' ? '/opt/…' : 'name'}
              onKeyDown={(e) => e.key === 'Enter' && submitOp()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOp(null)}>
              取消
            </Button>
            <Button disabled={busy || !opValue.trim()} onClick={submitOp}>
              {busy && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog
        open={op?.kind === 'delete'}
        onOpenChange={(o) => !o && setOp(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              {op?.kind === 'delete' && (
                <>
                  将删除 {op.entry.type === 'dir' ? '目录（递归）' : '文件'}{' '}
                  <code className="rounded bg-muted px-1">{join(path, op.entry.name)}</code>
                  ，操作不可恢复。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={() => op?.kind === 'delete' && doDelete(op.entry)}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SearchDialog
        open={searchOpen}
        root={path}
        onOpenChange={setSearchOpen}
        onJump={(hit) => {
          setSearchOpen(false)
          if (hit.type === 'dir') {
            setPath(hit.path)
            setPreview(null)
          } else {
            setPath(parentOf(hit.path))
            setPreview(hit.path)
          }
        }}
      />
    </div>
  )
}

// ---------- 检索对话框（文件名 / 文本内容） ----------

function SearchDialog({
  open,
  root,
  onOpenChange,
  onJump,
}: {
  open: boolean
  root: string
  onOpenChange: (o: boolean) => void
  onJump: (hit: SearchHit) => void
}) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [depth, setDepth] = useState('4')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    hits: SearchHit[]
    truncated: boolean
    timedOut: boolean
  } | null>(null)

  const doSearch = async () => {
    if (!name.trim() && !content.trim()) return
    setLoading(true)
    try {
      setResult(
        await searchFs({
          path: root,
          name: name.trim() || undefined,
          content: content.trim() || undefined,
          depth: Number(depth) || 4,
        })
      )
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '搜索失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>检索</DialogTitle>
          <DialogDescription>
            范围 {root}（限深/限量/限时；内容检索仅扫 &lt;2MB 文本）
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_1fr_80px] gap-2">
          <Input
            placeholder="文件名包含…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          />
          <Input
            placeholder="文本内容包含…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          />
          <Input
            placeholder="深度"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            title="递归深度 1-8"
          />
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={doSearch} disabled={loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            搜索
          </Button>
        </div>
        {result && (
          <div className="max-h-72 overflow-auto rounded-md border">
            {(result.truncated || result.timedOut) && (
              <div className="border-b bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                <FileWarning className="mr-1 inline h-3.5 w-3.5" />
                结果已截断（{result.truncated ? '达到条数上限' : ''}
                {result.truncated && result.timedOut ? '、' : ''}
                {result.timedOut ? '超时' : ''}），请缩小范围或关键词
              </div>
            )}
            {result.hits.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">无匹配</div>
            )}
            {result.hits.map((h) => (
              <button
                key={h.path + h.match}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted/60"
                onClick={() => onJump(h)}
              >
                {h.type === 'dir' ? (
                  <Folder className="h-4 w-4 shrink-0 text-sky-500" />
                ) : (
                  <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate font-mono text-xs">{h.path}</span>
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
                  {h.match === 'name' ? '文件名' : '内容'}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
