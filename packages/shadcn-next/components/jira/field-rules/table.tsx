'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle, Loader2, Pencil, RefreshCcw, Trash2 } from 'lucide-react'

import {
  fetchFieldRuleCombos,
  fetchFieldRules,
  patchFieldRule,
  type FieldRuleCombo,
  type FieldRuleQuery,
  type JiraFieldRule,
} from '@/utils/fetch/jira/field-rules-api'
import {
  FieldRuleDeleteDialog,
  FieldRuleEditDialog,
  STRATEGY_META,
  STRATEGY_OPTIONS,
} from './edit-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const compactDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const compactValue = (v: unknown) => {
  if (v === null || v === undefined) return '—'
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return s.length > 32 ? `${s.slice(0, 32)}…` : s
}

export const FieldRulesTable = () => {
  const [rules, setRules] = useState<JiraFieldRule[]>([])
  const [combos, setCombos] = useState<FieldRuleCombo[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const [filters, setFilters] = useState<FieldRuleQuery>({
    projectKey: '',
    issueTypeId: '',
    strategy: '',
    stale: '',
    keyword: '',
  })
  const [keywordInput, setKeywordInput] = useState('')

  const [editing, setEditing] = useState<JiraFieldRule | null>(null)
  const [deleting, setDeleting] = useState<JiraFieldRule | null>(null)

  const load = useCallback(async (query: FieldRuleQuery) => {
    setLoading(true)
    try {
      const [list, comboRes] = await Promise.all([
        fetchFieldRules({ ...query, take: 300 }),
        fetchFieldRuleCombos(),
      ])
      setRules(list.values)
      setTotal(list.total)
      setCombos(comboRes.values)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载字段规则失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const issueTypeOptions = useMemo(
    () => combos.filter((c) => !filters.projectKey || c.projectKey === filters.projectKey),
    [combos, filters.projectKey],
  )

  const quickStrategy = async (id: string, strategy: string) => {
    setSaving(id)
    try {
      await patchFieldRule(id, { strategy })
      toast.success('策略已更新')
      await load(filters)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '更新失败')
    } finally {
      setSaving(null)
    }
  }

  const reload = () => load(filters)

  return (
    <div className="flex flex-col gap-4">
      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.projectKey || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, projectKey: v === 'all' ? '' : v, issueTypeId: '' }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="项目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部项目</SelectItem>
            {[...new Set(combos.map((c) => c.projectKey))].map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.issueTypeId || 'all'}
          onValueChange={(v) => setFilters((f) => ({ ...f, issueTypeId: v === 'all' ? '' : v }))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="问题类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {issueTypeOptions.map((c) => (
              <SelectItem key={c.issueTypeId} value={c.issueTypeId}>
                {c.issueTypeId}（{c.count}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.strategy || 'all'}
          onValueChange={(v) => setFilters((f) => ({ ...f, strategy: v === 'all' ? '' : v }))}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="策略" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部策略</SelectItem>
            {STRATEGY_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {STRATEGY_META[s.value].label}（{s.value}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.stale || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, stale: (v === 'all' ? '' : v) as 'true' | 'false' | '' }))
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="false">生效中</SelectItem>
            <SelectItem value="true">已失效</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Input
            className="w-[200px]"
            placeholder="字段名 / fieldId 搜索"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setFilters((f) => ({ ...f, keyword: keywordInput }))
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((f) => ({ ...f, keyword: keywordInput }))}
          >
            搜索
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={reload} title="刷新">
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <span className="ml-auto text-sm text-muted-foreground">共 {total} 条规则</span>
      </div>

      {/* 数据表格 */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rules.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          暂无字段经验记录，先通过接口创建几张工单吧
        </div>
      ) : (
        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">项目 / 类型</TableHead>
                <TableHead className="min-w-[170px]">字段</TableHead>
                <TableHead className="w-[90px]">类型</TableHead>
                <TableHead className="w-[120px]">策略</TableHead>
                <TableHead className="min-w-[140px]">学习值</TableHead>
                <TableHead className="w-[60px] text-center">连胜</TableHead>
                <TableHead className="w-[80px] text-center">成 / 败</TableHead>
                <TableHead className="w-[110px]">状态</TableHead>
                <TableHead className="w-[110px]">最近学习</TableHead>
                <TableHead className="w-[90px] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{rule.projectKey}</div>
                    <div className="text-xs text-muted-foreground">{rule.issueTypeId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium leading-tight">{rule.fieldName}</div>
                    <div className="font-mono text-xs text-muted-foreground">{rule.fieldId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {rule.kind}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={rule.strategy}
                      disabled={saving === rule.id}
                      onValueChange={(v) => quickStrategy(rule.id, v)}
                    >
                      <SelectTrigger className="h-8 w-[105px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STRATEGY_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            <span className="flex flex-col">
                              <span>
                                {STRATEGY_META[s.value].label}（{s.value}）
                              </span>
                              <span className="text-xs text-muted-foreground">{s.desc}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <button
                      className="max-w-[200px] truncate text-left font-mono text-xs hover:text-primary"
                      title={
                        rule.learnedValue == null
                          ? '未学习'
                          : JSON.stringify(rule.learnedValue, null, 2)
                      }
                      onClick={() => setEditing(rule)}
                    >
                      {compactValue(rule.learnedValue)}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={rule.valueStreak >= 3 ? 'default' : 'outline'}
                      className="font-mono"
                    >
                      {rule.valueStreak}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    <span className="text-emerald-600">{rule.successCount}</span>
                    {' / '}
                    <span
                      className={rule.failCount > 0 ? 'text-red-500' : 'text-muted-foreground'}
                    >
                      {rule.failCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {rule.required && (
                        <Badge variant="destructive" className="text-xs">
                          必填
                        </Badge>
                      )}
                      {rule.stale && (
                        <Badge variant="secondary" className="text-xs">
                          失效
                        </Badge>
                      )}
                      {rule.lastError && (
                        <span title={rule.lastError}>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {compactDate(rule.lastSeenAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="校准规则"
                        onClick={() => setEditing(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        title="删除规则"
                        onClick={() => setDeleting(rule)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <FieldRuleEditDialog
        rule={editing}
        saving={saving === editing?.id}
        onClose={() => setEditing(null)}
        onSaved={reload}
      />
      <FieldRuleDeleteDialog
        rule={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={reload}
      />
    </div>
  )
}
