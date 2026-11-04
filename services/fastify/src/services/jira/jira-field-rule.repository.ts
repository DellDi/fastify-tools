/**
 * Jira 字段经验规则仓库
 * 按 projectKey + issueTypeId 维度持久化必填/自定义字段的取值策略。
 * 所有读写均降级容错：表缺失或 DB 异常时回退为空规则集，不阻塞建单主流程。
 */

import { FastifyInstance } from 'fastify'
import type { JiraMeta } from '@/schema/jira/meta.js'
import {
  classifyJiraField,
  initialStrategyForKind,
  isFillableRequiredField,
  learnedStrategyForField,
  type FieldRuleStrategy,
} from './field-value.utils.js'

export interface JiraFieldRuleRecord {
  fieldId: string
  fieldName: string
  kind: string
  strategy: FieldRuleStrategy
  learnedValue: unknown
  required: boolean
  stale: boolean
  successCount: number
  failCount: number
  lastError: string | null
}

type RuleDelegate = {
  findMany(args: Record<string, unknown>): Promise<JiraFieldRuleRecord[]>
  upsert(args: Record<string, unknown>): Promise<unknown>
}

export class JiraFieldRuleRepository {
  constructor(private fastify: FastifyInstance) {}

  /**
   * prisma generate 生成 jiraFieldRule 访问器前的轻量封装，
   * 生成后运行时行为一致
   */
  private get delegate(): RuleDelegate {
    return (
      this.fastify.prisma as unknown as { jiraFieldRule: RuleDelegate }
    ).jiraFieldRule
  }

  private whereKey(projectKey: string, issueTypeId: string, fieldId: string) {
    return {
      projectKey_issueTypeId_fieldId: { projectKey, issueTypeId, fieldId },
    }
  }

  /** update 载荷中的 {increment:n} 在 create 中不合法，转换为绝对值 */
  private static toCreateValue(value: unknown): unknown {
    if (
      value !== null &&
      typeof value === 'object' &&
      'increment' in (value as Record<string, unknown>)
    ) {
      return (value as Record<string, unknown>).increment
    }
    return value
  }

  private async safeUpsert(
    projectKey: string,
    issueTypeId: string,
    fieldId: string,
    update: Record<string, unknown>,
    createPatch: Record<string, unknown> = {},
  ): Promise<void> {
    try {
      const merged = { ...update, ...createPatch }
      const create = Object.fromEntries(
        Object.entries({
          projectKey,
          issueTypeId,
          fieldId,
          fieldName: fieldId,
          kind: 'unknown',
          strategy: 'llm',
          required: true,
          stale: false,
          ...merged,
        }).map(([key, value]) => [key, JiraFieldRuleRepository.toCreateValue(value)]),
      )

      await this.delegate.upsert({
        where: this.whereKey(projectKey, issueTypeId, fieldId),
        update,
        create,
      })
    } catch (error) {
      this.fastify.log.warn(
        `Jira field rule upsert failed for ${fieldId}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async getRuleMap(
    projectKey: string,
    issueTypeId: string,
  ): Promise<Map<string, JiraFieldRuleRecord>> {
    try {
      const rows = await this.delegate.findMany({
        where: { projectKey, issueTypeId },
      })
      return new Map(rows.map((r) => [r.fieldId, r]))
    } catch (error) {
      this.fastify.log.warn(
        `Load jira field rules failed (fallback to empty): ${error instanceof Error ? error.message : String(error)}`,
      )
      return new Map()
    }
  }

  /**
   * 与最新 createmeta 对齐规则集：
   * 新出现的必填字段建壳、已有规则刷新元信息、meta 中消失的字段标记 stale
   * 返回对齐后的规则 Map
   */
  async syncRulesWithMeta(
    projectKey: string,
    issueTypeId: string,
    metaValues: JiraMeta[],
  ): Promise<Map<string, JiraFieldRuleRecord>> {
    const rules = await this.getRuleMap(projectKey, issueTypeId)
    const metaIds = new Set(metaValues.map((v) => v.fieldId))
    const ops: Promise<unknown>[] = []

    for (const field of metaValues) {
      if (!isFillableRequiredField(field)) continue
      const kind = classifyJiraField(field) ?? 'unknown'
      const existing = rules.get(field.fieldId)

      if (!existing) {
        const strategy = initialStrategyForKind(classifyJiraField(field))
        const record: JiraFieldRuleRecord = {
          fieldId: field.fieldId,
          fieldName: field.name,
          kind,
          strategy,
          learnedValue: null,
          required: true,
          stale: false,
          successCount: 0,
          failCount: 0,
          lastError: null,
        }
        rules.set(field.fieldId, record)
        ops.push(
          this.safeUpsert(projectKey, issueTypeId, field.fieldId, {
            fieldName: field.name,
            kind,
            strategy,
            required: true,
            stale: false,
          }),
        )
      } else if (
        existing.stale ||
        existing.fieldName !== field.name ||
        existing.kind !== kind ||
        existing.required !== field.required
      ) {
        existing.stale = false
        existing.fieldName = field.name
        existing.kind = kind
        existing.required = field.required
        ops.push(
          this.safeUpsert(projectKey, issueTypeId, field.fieldId, {
            fieldName: field.name,
            kind,
            required: field.required,
            stale: false,
          }),
        )
      }
    }

    for (const rule of rules.values()) {
      if (!metaIds.has(rule.fieldId) && !rule.stale) {
        rule.stale = true
        ops.push(
          this.safeUpsert(projectKey, issueTypeId, rule.fieldId, {
            stale: true,
          }),
        )
      }
    }

    await Promise.allSettled(ops)
    return rules
  }

  /**
   * 创建成功后沉淀经验：按字段类型决定策略并记录成功值
   */
  async learnFromSuccess(
    projectKey: string,
    issueTypeId: string,
    metaValues: JiraMeta[],
    sentFields: Record<string, any>,
    rules: Map<string, JiraFieldRuleRecord>,
  ): Promise<void> {
    const metaById = new Map(metaValues.map((v) => [v.fieldId, v]))
    const now = new Date()
    const ops: Promise<unknown>[] = []

    for (const [fieldId, value] of Object.entries(sentFields)) {
      if (value === undefined) continue
      const field = metaById.get(fieldId)
      const kind = (field ? classifyJiraField(field) : null) ?? 'unknown'
      const strategy = learnedStrategyForField(field, kind)
      const existing = rules.get(fieldId)

      ops.push(
        this.safeUpsert(
          projectKey,
          issueTypeId,
          fieldId,
          {
            fieldName: field?.name ?? existing?.fieldName ?? fieldId,
            kind,
            strategy,
            learnedValue: value,
            required: existing?.required ?? field?.required ?? true,
            stale: false,
            lastError: null,
            lastSeenAt: now,
            successCount: { increment: 1 },
          },
          { strategy, learnedValue: value },
        ),
      )

      if (existing) {
        existing.strategy = strategy
        existing.learnedValue = value
        existing.successCount += 1
        existing.stale = false
        existing.lastError = null
      }
    }

    await Promise.allSettled(ops)
  }

  /**
   * 记录被 Jira 拒绝（不可设置）的字段，下次建单主动跳过
   */
  async markAvoid(
    projectKey: string,
    issueTypeId: string,
    fieldIds: string[],
    errors: Record<string, string>,
  ): Promise<void> {
    const ops = fieldIds.map((fieldId) =>
      this.safeUpsert(projectKey, issueTypeId, fieldId, {
        strategy: 'avoid',
        failCount: { increment: 1 },
        lastError: errors[fieldId] ?? 'field cannot be set',
        lastSeenAt: new Date(),
      }),
    )
    await Promise.allSettled(ops)
  }
}
