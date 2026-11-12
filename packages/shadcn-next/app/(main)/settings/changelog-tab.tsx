'use client'

import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createChangelog,
  deleteChangelog,
  listChangelogs,
  updateChangelog,
} from '@/app/actions/changelog-actions'

type Item = Awaited<ReturnType<typeof listChangelogs>>[number]

interface FormState {
  version: string
  date: string
  changes: string[]
}

const emptyForm: FormState = { version: '', date: '', changes: [''] }

export function ChangelogTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [editTarget, setEditTarget] = useState<Item | 'new' | null>(null)
  const [delTarget, setDelTarget] = useState<Item | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const reload = useCallback(async () => {
    try {
      setItems(await listChangelogs())
    } catch (e) {
      toast({
        variant: 'destructive',
        title: e instanceof Error ? e.message : '加载失败',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void reload()
  }, [reload])

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true)
    try {
      await fn()
      toast({ title: ok })
      setEditTarget(null)
      setDelTarget(null)
      await reload()
    } catch (e) {
      toast({
        variant: 'destructive',
        title: e instanceof Error ? e.message : '操作失败',
      })
    } finally {
      setBusy(false)
    }
  }

  const openEdit = (item?: Item) => {
    setForm(
      item
        ? {
            version: item.version,
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            changes: item.changes.length ? item.changes : [''],
          }
        : emptyForm
    )
    setEditTarget(item ?? 'new')
  }

  const setChange = (index: number, value: string) =>
    setForm((f) => ({
      ...f,
      changes: f.changes.map((c, i) => (i === index ? value : c)),
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        加载中…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          维护首页「更新日志」弹窗对外展示的版本与变更记录
        </p>
        <Button size="sm" onClick={() => openEdit()}>
          <Plus className="mr-1 h-4 w-4" />
          新增版本
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={item.id} className="shadow-card">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
              <div className="flex items-baseline gap-3">
                <h3 className="text-base font-semibold tracking-tight">
                  v{item.version}
                </h3>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {format(new Date(item.date), 'yyyy-MM-dd')}
                </span>
                {index === 0 && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    最新
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDelTarget(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-1.5">
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
        ))}
        {!items.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            暂无记录，点击「新增版本」创建第一条更新日志
          </p>
        )}
      </div>

      {/* 新建/编辑 */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editTarget === 'new' ? '新增版本' : `编辑 v${(editTarget as Item)?.version}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>版本号</Label>
                <Input
                  placeholder="1.0.0"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>发布日期</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>更新内容</Label>
              {form.changes.map((change, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={change}
                    placeholder={`第 ${i + 1} 条变更`}
                    onChange={(e) => setChange(i, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    disabled={form.changes.length <= 1}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        changes: f.changes.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() =>
                  setForm((f) => ({ ...f, changes: [...f.changes, ''] }))
                }
              >
                添加一条
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              取消
            </Button>
            <Button
              disabled={busy || !form.version.trim() || !form.date}
              onClick={() =>
                run(
                  () =>
                    editTarget === 'new'
                      ? createChangelog(form)
                      : updateChangelog((editTarget as Item).id, form),
                  '已保存'
                )
              }
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除 */}
      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除版本{' '}
              <code className="rounded bg-muted px-1">v{delTarget?.version}</code>{' '}
              的更新日志，删除后不再对外展示。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={() => delTarget && run(() => deleteChangelog(delTarget.id), '已删除')}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
