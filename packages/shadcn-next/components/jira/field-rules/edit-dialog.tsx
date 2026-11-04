'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import {
  deleteFieldRule,
  patchFieldRule,
  type JiraFieldRule,
} from '@/utils/fetch/jira/field-rules-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

export const STRATEGY_OPTIONS = [
  { value: 'fixed', desc: '复用学习值，不再调 LLM' },
  { value: 'llm', desc: '每次按标题描述智能推断' },
  { value: 'computed', desc: '确定性计算（日期/经办人等）' },
  { value: 'avoid', desc: '主动不下发该字段' },
]

export const STRATEGY_META: Record<string, { label: string; className: string }> = {
  fixed: { label: '固定', className: 'bg-emerald-600 text-white' },
  llm: { label: '智能', className: 'bg-blue-600 text-white' },
  computed: { label: '计算', className: 'bg-violet-600 text-white' },
  avoid: { label: '跳过', className: 'bg-zinc-500 text-white' },
}

interface EditDialogProps {
  rule: JiraFieldRule | null
  saving: boolean
  onClose: () => void
  onSaved: () => void
}

export const FieldRuleEditDialog = ({ rule, saving, onClose, onSaved }: EditDialogProps) => {
  const [strategy, setStrategy] = useState('llm')
  const [value, setValue] = useState('')
  const [streak, setStreak] = useState(0)
  const [required, setRequired] = useState(true)
  const [stale, setStale] = useState(false)
  const [pending, setPending] = useState(false)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  // 规则切换时同步表单初值（渲染期间派生状态，避免 effect 级联）；关闭时复位
  if (!rule && loadedFor !== null) setLoadedFor(null)
  if (rule && loadedFor !== rule.id) {
    setLoadedFor(rule.id)
    setStrategy(rule.strategy)
    setValue(
      rule.learnedValue == null ? '' : JSON.stringify(rule.learnedValue, null, 2),
    )
    setStreak(rule.valueStreak)
    setRequired(rule.required)
    setStale(rule.stale)
  }

  const save = async () => {
    if (!rule) return
    let learnedValue: unknown = null
    const raw = value.trim()
    if (raw) {
      try {
        learnedValue = JSON.parse(raw)
      } catch {
        toast.error('学习值不是合法 JSON')
        return
      }
    }
    setPending(true)
    try {
      await patchFieldRule(rule.id, {
        strategy,
        learnedValue,
        valueStreak: streak,
        required,
        stale,
      })
      toast.success('已保存校准')
      onSaved()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={!!rule} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>校准字段规则</DialogTitle>
          <DialogDescription>
            {rule?.fieldName}（{rule?.fieldId}）· {rule?.projectKey} / {rule?.issueTypeId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>策略</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STRATEGY_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {STRATEGY_META[s.value].label}（{s.value}）— {s.desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>学习值（JSON，留空表示清空重学）</Label>
            <textarea
              className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='例如 {"id":"12345"} 或 "文本值"'
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>连胜计数</Label>
              <Input
                type="number"
                min={0}
                value={streak}
                onChange={(e) => setStreak(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Switch checked={required} onCheckedChange={setRequired} />
              <Label>必填</Label>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Switch checked={stale} onCheckedChange={setStale} />
              <Label>失效</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={save} disabled={pending || saving}>
            {(pending || saving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存校准
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  rule: JiraFieldRule | null
  onClose: () => void
  onDeleted: () => void
}

export const FieldRuleDeleteDialog = ({ rule, onClose, onDeleted }: DeleteDialogProps) => {
  const [pending, setPending] = useState(false)

  const confirm = async () => {
    if (!rule) return
    setPending(true)
    try {
      await deleteFieldRule(rule.id)
      toast.success('已删除，下次建单将重新学习')
      onDeleted()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '删除失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={!!rule} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除这条字段规则？</AlertDialogTitle>
          <AlertDialogDescription>
            {rule?.fieldName}（{rule?.fieldId}）· {rule?.projectKey} / {rule?.issueTypeId}
            <br />
            删除后下次建单将从 Jira 元数据重新学习该字段，已积累的经验（连胜{' '}
            {rule?.valueStreak}、成功 {rule?.successCount} 次）将丢失。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} disabled={pending}>
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
