'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Folder, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createMenu, deleteMenu, listMenus, updateMenu } from '@/app/actions/rbac-actions'

type Menu = Awaited<ReturnType<typeof listMenus>>[number]

const ROOT = '__root__'

export function MenusTab() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [editTarget, setEditTarget] = useState<Menu | 'new' | null>(null)
  const [delTarget, setDelTarget] = useState<Menu | null>(null)
  const [form, setForm] = useState({
    name: '',
    url: '#',
    parentId: ROOT,
    icon: '',
    description: '',
    sortOrder: 0,
  })

  const reload = useCallback(async () => {
    try {
      setMenus(await listMenus())
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  // 拍平为树顺序行：根菜单先，子菜单缩进
  const rows: { m: Menu; depth: number }[] = []
  const pushTree = (parentId: string | null, depth: number) => {
    menus
      .filter((m) => m.parentId === parentId)
      .forEach((m) => {
        rows.push({ m, depth })
        pushTree(m.id, depth + 1)
      })
  }
  pushTree(null, 0)

  const submit = async () => {
    setBusy(true)
    try {
      const data = {
        name: form.name,
        url: form.url || '#',
        parentId: form.parentId === ROOT ? null : form.parentId,
        icon: form.icon || undefined,
        description: form.description || undefined,
        sortOrder: form.sortOrder,
      }
      if (editTarget === 'new') {
        await createMenu(data)
      } else if (editTarget) {
        await updateMenu(editTarget.id, data)
      }
      toast.success('已保存')
      setEditTarget(null)
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '保存失败')
    } finally {
      setBusy(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        加载中…
      </div>
    )

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setForm({ name: '', url: '#', parentId: ROOT, icon: '', description: '', sortOrder: 0 })
            setEditTarget('new')
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          新建菜单
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-28">图标</TableHead>
              <TableHead className="w-16">排序</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ m, depth }) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${depth * 24}px` }}
                  >
                    <Folder className="h-4 w-4 text-sky-500" />
                    {m.name}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{m.url}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {m.icon || '—'}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {m.sortOrder}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setForm({
                          name: m.name,
                          url: m.url || '#',
                          parentId: m.parentId ?? ROOT,
                          icon: m.icon || '',
                          description: m.description || '',
                          sortOrder: m.sortOrder ?? 0,
                        })
                        setEditTarget(m)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDelTarget(m)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 新建/编辑 */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget === 'new' ? '新建菜单' : '编辑菜单'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>名称</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>URL（分组填 #）</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>父菜单</Label>
                <Select
                  value={form.parentId}
                  onValueChange={(v) => setForm({ ...form, parentId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROOT}>（顶层）</SelectItem>
                    {menus
                      .filter((m) => m.parentId === null && m.id !== (editTarget as Menu)?.id)
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>图标（lucide 名）</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="SquareTerminal"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>描述</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              取消
            </Button>
            <Button disabled={busy || !form.name.trim()} onClick={submit}>
              确定
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
              删除菜单 <code className="rounded bg-muted px-1">{delTarget?.name}</code>
              及其全部子菜单、各角色的菜单授权。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={async () => {
                if (!delTarget) return
                setBusy(true)
                try {
                  const res = await deleteMenu(delTarget.id)
                  toast.success(`已删除 ${res.count} 项`)
                  setDelTarget(null)
                  await reload()
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : '删除失败')
                } finally {
                  setBusy(false)
                }
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
