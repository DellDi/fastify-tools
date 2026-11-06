/**
 * Jira 巡检审计日志仓库
 * 记录 dev-reply reconcile 每次巡检的逐单结果（状态/改动明细/耗时）。
 * 所有写操作降级容错：表缺失或 DB 异常时只告警，不阻塞巡检主流程。
 */

import { FastifyInstance } from 'fastify'

export interface ReconcileLogEntry {
  batchId: string
  issueKey: string
  projectKey?: string
  assignee?: string
  status: string
  message?: string
  details?: Record<string, unknown>
  durationMs?: number
}

export interface ReconcileLogQuery {
  batchId?: string
  issueKey?: string
  status?: string
  assignee?: string
  from?: string
  to?: string
  take?: number
  skip?: number
}

export interface ReconcileLogRow {
  id: string
  batchId: string
  issueKey: string
  projectKey: string | null
  assignee: string | null
  status: string
  message: string | null
  details: unknown
  durationMs: number | null
  createdAt: string
}

type ReconcileLogDbRow = Omit<ReconcileLogRow, 'createdAt'> & {
  createdAt: Date
}

type LogDelegate = {
  create(args: Record<string, unknown>): Promise<unknown>
  findMany(args: Record<string, unknown>): Promise<ReconcileLogDbRow[]>
  count(args: Record<string, unknown>): Promise<number>
  deleteMany(args: Record<string, unknown>): Promise<{ count: number }>
}

export class JiraReconcileLogRepository {
  constructor(private fastify: FastifyInstance) {}

  private get delegate(): LogDelegate {
    return (
      this.fastify.prisma as unknown as { jiraReconcileLog: LogDelegate }
    ).jiraReconcileLog
  }

  async write(entry: ReconcileLogEntry): Promise<void> {
    try {
      await this.delegate.create({ data: entry })
    } catch (error) {
      this.fastify.log.warn(
        `reconcile log write failed for ${entry.issueKey}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async query(
    q: ReconcileLogQuery,
  ): Promise<{ total: number; values: ReconcileLogRow[] }> {
    const where: Record<string, unknown> = {}
    if (q.batchId) where.batchId = q.batchId
    if (q.issueKey) where.issueKey = q.issueKey
    if (q.status) where.status = q.status
    if (q.assignee) where.assignee = q.assignee
    if (q.from || q.to) {
      where.createdAt = {
        ...(q.from ? { gte: new Date(q.from) } : {}),
        ...(q.to ? { lte: new Date(q.to) } : {}),
      }
    }

    const take = Math.min(Math.max(q.take ?? 50, 1), 200)
    const skip = Math.max(q.skip ?? 0, 0)

    const [total, rows] = await Promise.all([
      this.delegate.count({ where }),
      this.delegate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ])
    return {
      total,
      values: rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    }
  }

  /** 经办人去重列表（筛选下拉选项用） */
  async listAssignees(): Promise<string[]> {
    const rows = await this.delegate.findMany({
      where: { assignee: { not: null } },
      distinct: ['assignee'],
      select: { assignee: true },
    })
    return rows
      .map((row) => row.assignee)
      .filter((name): name is string => !!name)
      .sort()
  }

  /** 按 id 批量删除巡检记录，返回实际删除条数（非法 UUID 直接跳过） */
  async deleteByIds(ids: string[]): Promise<number> {
    const valid = ids.filter((id) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      ),
    )
    if (!valid.length) return 0
    const result = await this.delegate.deleteMany({
      where: { id: { in: valid } },
    })
    return result.count
  }
}
