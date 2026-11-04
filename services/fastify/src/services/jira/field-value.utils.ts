/**
 * Jira 字段取值工具
 * 将 createmeta 中的字段元数据分类为可填充类型，并负责把
 * LLM 返回值 / 兜底值转换为 Jira REST API 接受的字段值结构。
 */

import { JiraMeta } from '@/schema/jira/meta.js'
import { dayjs } from './utils.js'

export type FillableFieldKind =
  | 'text'
  | 'option'
  | 'cascading'
  | 'multi'
  | 'date'
  | 'number'
  | 'named'

export type FieldRuleStrategy = 'fixed' | 'llm' | 'computed' | 'avoid'

type AllowedValueLike = {
  id: string
  value?: string
  name?: string
}

/** 这些核心字段始终由流程显式赋值，禁止自动填充覆盖 */
export const PROTECTED_FIELD_IDS = new Set(['project', 'summary', 'issuetype'])

/**
 * 判定必填字段的取值类型，决定提示词和 Jira 值格式的映射方式
 */
export function classifyJiraField(field: JiraMeta): FillableFieldKind | null {
  const type = field.schema?.type
  const allowedValues = field.allowedValues ?? []
  const hasChildren = allowedValues.some((v) => (v.children?.length ?? 0) > 0)

  if (hasChildren) return 'cascading'

  switch (type) {
    case 'string':
      return 'text'
    case 'option':
      return 'option'
    case 'array':
      return 'multi'
    case 'date':
    case 'datetime':
      return 'date'
    case 'number':
    case 'float':
      return 'number'
    case 'user':
    case 'group':
      return 'named'
    default:
      return allowedValues.length > 0 ? 'option' : null
  }
}

/**
 * 是否为需要自动填充的必填字段
 * （必填、无 Jira 默认值、非核心字段、createmeta 中可 set、类型可填充）
 */
export function isFillableRequiredField(field: JiraMeta): boolean {
  return (
    Boolean(field.fieldId) &&
    field.required &&
    !field.hasDefaultValue &&
    !PROTECTED_FIELD_IDS.has(field.fieldId) &&
    Boolean(field.name) &&
    (!field.operations || field.operations.includes('set')) &&
    classifyJiraField(field) !== null
  )
}

/**
 * 首次发现字段（尚无成功值）时的初始策略：
 * 可确定性重算的走 computed，其余先交给 LLM
 */
export function initialStrategyForKind(
  kind: FillableFieldKind | null,
): Exclude<FieldRuleStrategy, 'avoid'> {
  if (kind === 'date' || kind === 'number' || kind === 'named') return 'computed'
  return 'llm'
}

/**
 * 一次成功创建后为字段沉淀的复用策略：
 * 选项/级联/带候选值的多选 → fixed 复用成功值；
 * 日期/数字/人员 → computed 确定性重算；文本 → llm
 */
export function learnedStrategyForField(
  field: JiraMeta | undefined,
  kind: FillableFieldKind | 'unknown',
): Exclude<FieldRuleStrategy, 'avoid'> {
  if (!field || kind === 'unknown') return 'fixed'

  switch (kind) {
    case 'option':
    case 'cascading':
      return 'fixed'
    case 'multi':
      if (field.schema?.items === 'user') return 'computed'
      return (field.allowedValues?.length ?? 0) > 0 ? 'fixed' : 'llm'
    case 'date':
    case 'number':
    case 'named':
      return 'computed'
    case 'text':
    default:
      return 'llm'
  }
}

export function optionLabel(option: AllowedValueLike): string {
  return (option.value ?? option.name ?? option.id ?? '').trim()
}

/**
 * 统计候选 label 在文本中的命中数，仅当恰好一个命中时返回该项。
 * 过短的 label（<2 字符，如"无"/"是"）不参与，避免高频误命中。
 */
export function matchSingleOptionByText<T extends AllowedValueLike>(
  text: string,
  allowedValues: T[],
): T | undefined {
  const haystack = text.toLowerCase()
  const matched = allowedValues.filter((v) => {
    const label = optionLabel(v).toLowerCase()
    return label.length >= 2 && haystack.includes(label)
  })
  return matched.length === 1 ? matched[0] : undefined
}

/**
 * 无需 LLM 的确定性选项填充：
 * 标题/描述中恰好命中唯一候选 label 时直接选定；
 * 级联字段要求父级唯一命中且子级也能确定（唯一子项或文本唯一命中）。
 */
export function matchFieldOptionByText(
  field: JiraMeta,
  kind: FillableFieldKind,
  text: string,
): any {
  const allowedValues = field.allowedValues ?? []

  if (kind === 'option') {
    const matched = matchSingleOptionByText(text, allowedValues)
    return matched ? { id: matched.id } : undefined
  }

  if (kind === 'cascading') {
    const parent = matchSingleOptionByText(text, allowedValues)
    if (!parent) return undefined
    const children = parent.children ?? []
    if (children.length === 0) return { id: parent.id }
    if (children.length === 1) {
      return { id: parent.id, child: { id: children[0].id } }
    }
    const child = matchSingleOptionByText(text, children)
    return child ? { id: parent.id, child: { id: child.id } } : undefined
  }

  return undefined
}

/**
 * 按 id 精确匹配 → label 全等 → label 模糊包含，逐级匹配候选值
 */
export function matchAllowedValue<T extends AllowedValueLike>(
  raw: string,
  allowedValues: T[],
): T | undefined {
  const target = raw.trim().toLowerCase()
  if (!target) return undefined

  return (
    allowedValues.find((v) => v.id === raw.trim()) ??
    allowedValues.find((v) => optionLabel(v).toLowerCase() === target) ??
    allowedValues.find((v) => {
      const label = optionLabel(v).toLowerCase()
      return (
        Boolean(label) && (label.includes(target) || target.includes(label))
      )
    })
  )
}

function buildMultiValue(
  field: JiraMeta,
  labels: string[],
  assignee?: string,
): any {
  const allowedValues = field.allowedValues ?? []

  if (field.schema?.items === 'user') {
    const names =
      labels.length > 0 ? labels : ([assignee].filter(Boolean) as string[])
    return names.length > 0 ? names.map((name) => ({ name })) : undefined
  }

  if (allowedValues.length > 0) {
    const matched = labels
      .map((label) => matchAllowedValue(label, allowedValues))
      .filter((v) => v !== undefined)
    const chosen = matched.length > 0 ? matched : [allowedValues[0]]
    return chosen.map((v) => ({ id: v.id }))
  }

  const values = labels.length > 0 ? labels : [field.name]
  return values.map((v) => String(v))
}

function coerceDateValue(field: JiraMeta, text: string): string {
  const isDatetime = field.schema?.type === 'datetime'
  const parsed = text ? dayjs(text) : null
  const base = parsed?.isValid() ? parsed : dayjs().add(3, 'day')
  return isDatetime
    ? base.format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    : base.format('YYYY-MM-DD')
}

/**
 * 不依赖 LLM 的确定性取值，保证必填字段始终有值可提交
 */
export function buildStaticFieldValue(
  field: JiraMeta,
  kind: FillableFieldKind,
  assignee?: string,
): any {
  const allowedValues = field.allowedValues ?? []

  switch (kind) {
    case 'text':
      return field.name
    case 'number':
      return 0
    case 'date':
      return coerceDateValue(field, '')
    case 'named': {
      const name = assignee || field.name
      return name ? { name } : undefined
    }
    case 'cascading': {
      const parent = allowedValues[0]
      if (!parent) return undefined
      const child = parent.children?.[0]
      return child
        ? { id: parent.id, child: { id: child.id } }
        : { id: parent.id }
    }
    case 'multi':
      return buildMultiValue(field, [], assignee)
    case 'option': {
      const first = allowedValues[0]
      return first ? { id: first.id } : undefined
    }
  }
}

/**
 * 将 LLM 返回的原始值转换为 Jira REST API 接受的字段值结构
 */
export function coerceFieldValue(
  field: JiraMeta,
  kind: FillableFieldKind,
  raw: unknown,
  assignee?: string,
): any {
  const text = raw === null || raw === undefined ? '' : String(raw).trim()
  const allowedValues = field.allowedValues ?? []

  switch (kind) {
    case 'text':
      return text || field.name
    case 'number': {
      const n = Number(text)
      return Number.isFinite(n) ? n : 0
    }
    case 'date':
      return coerceDateValue(field, text)
    case 'named': {
      const name = text || assignee || field.name
      return name ? { name } : undefined
    }
    case 'option': {
      const matched =
        matchAllowedValue(text, allowedValues) ?? allowedValues[0]
      if (matched) return { id: matched.id }
      return text ? { value: text } : undefined
    }
    case 'cascading': {
      const [parentLabel = '', childLabel = ''] = text
        .split(/[>|｜/]/)
        .map((s) => s.trim())
      const parent =
        matchAllowedValue(parentLabel, allowedValues) ?? allowedValues[0]
      if (!parent) return undefined
      const children = parent.children ?? []
      if (children.length === 0) return { id: parent.id }
      const child = matchAllowedValue(childLabel, children) ?? children[0]
      return { id: parent.id, child: { id: child.id } }
    }
    case 'multi': {
      const labels = text
        ? text
            .split(/[,，、;；\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      return buildMultiValue(field, labels, assignee)
    }
  }
}
