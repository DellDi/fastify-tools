import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@fastify/type-provider-typebox'
import { Prisma } from '@/types/prisma.js'

const STRATEGIES = ['fixed', 'llm', 'computed', 'avoid'] as const
const StrategyEnum = Type.Union(
  STRATEGIES.map((s) => Type.Literal(s)),
  { description: '字段取值策略：fixed 复用学习值 / llm 每次推断 / computed 确定性计算 / avoid 不下发' },
)

const FieldRuleSchema = Type.Object({
  id: Type.String(),
  projectKey: Type.String(),
  issueTypeId: Type.String(),
  fieldId: Type.String(),
  fieldName: Type.String(),
  kind: Type.String(),
  strategy: Type.String(),
  learnedValue: Type.Any(),
  valueStreak: Type.Number(),
  required: Type.Boolean(),
  stale: Type.Boolean(),
  lastError: Type.Union([Type.String(), Type.Null()]),
  successCount: Type.Number(),
  failCount: Type.Number(),
  lastSeenAt: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
  updatedAt: Type.String(),
})

const fieldRules: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.get('/', {
    schema: {
      description: '分页查询 Jira 字段经验规则，支持项目/类型/策略/状态/关键词过滤。',
      querystring: Type.Object({
        projectKey: Type.Optional(Type.String({ description: '按项目 Key 过滤' })),
        issueTypeId: Type.Optional(Type.String({ description: '按问题类型 ID 过滤' })),
        strategy: Type.Optional(Type.String({ description: '按策略过滤：fixed/llm/computed/avoid' })),
        stale: Type.Optional(
          Type.Union([Type.Literal('true'), Type.Literal('false')], {
            description: '按是否失效过滤',
          }),
        ),
        keyword: Type.Optional(Type.String({ description: '按 fieldId 或字段名模糊搜索' })),
        take: Type.Optional(Type.Integer({ default: 100, maximum: 500 })),
        skip: Type.Optional(Type.Integer({ default: 0 })),
      }),
      response: {
        200: Type.Object({
          total: Type.Number(),
          values: Type.Array(FieldRuleSchema),
        }),
      },
    },
    handler: async (req) => {
      const { projectKey, issueTypeId, strategy, stale, keyword, take = 100, skip = 0 } = req.query
      const where = {
        ...(projectKey ? { projectKey } : {}),
        ...(issueTypeId ? { issueTypeId } : {}),
        ...(strategy ? { strategy } : {}),
        ...(stale !== undefined ? { stale: stale === 'true' } : {}),
        ...(keyword
          ? {
              OR: [
                { fieldId: { contains: keyword, mode: 'insensitive' as const } },
                { fieldName: { contains: keyword, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      }

      const [total, values] = await Promise.all([
        fastify.prisma.jiraFieldRule.count({ where }),
        fastify.prisma.jiraFieldRule.findMany({
          where,
          orderBy: [{ projectKey: 'asc' }, { issueTypeId: 'asc' }, { fieldId: 'asc' }],
          take,
          skip,
        }),
      ])

      return {
        total,
        values: values.map((r) => ({
          ...r,
          lastSeenAt: r.lastSeenAt?.toISOString() ?? null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })),
      }
    },
  })

  fastify.get('/combos', {
    schema: {
      description: '获取已学习规则的项目 Key + 问题类型组合，用于前端筛选项。',
      response: {
        200: Type.Object({
          values: Type.Array(
            Type.Object({
              projectKey: Type.String(),
              issueTypeId: Type.String(),
              count: Type.Number(),
            }),
          ),
        }),
      },
    },
    handler: async () => {
      const groups = await fastify.prisma.jiraFieldRule.groupBy({
        by: ['projectKey', 'issueTypeId'],
        _count: { _all: true },
        orderBy: [{ projectKey: 'asc' }, { issueTypeId: 'asc' }],
      })
      return {
        values: groups.map((g) => ({
          projectKey: g.projectKey,
          issueTypeId: g.issueTypeId,
          count: g._count._all,
        })),
      }
    },
  })

  fastify.patch('/:id', {
    schema: {
      description:
        '人工校准字段规则：可调整策略、学习值、连胜计数、必填与失效标记。用于审计纠偏。',
      params: Type.Object({ id: Type.String() }),
      body: Type.Object({
        strategy: Type.Optional(StrategyEnum),
        learnedValue: Type.Optional(
          Type.Any({ description: '学习值（JSON）。传 null 清空已学值并重新学习。' }),
        ),
        valueStreak: Type.Optional(Type.Integer({ minimum: 0 })),
        required: Type.Optional(Type.Boolean()),
        stale: Type.Optional(Type.Boolean()),
        fieldName: Type.Optional(Type.String()),
      }),
      response: { 200: FieldRuleSchema },
    },
    handler: async (req, reply) => {
      const { id } = req.params
      const { strategy, learnedValue, valueStreak, required, stale, fieldName } = req.body

      const data: Record<string, unknown> = {
        ...(strategy !== undefined ? { strategy } : {}),
        ...(valueStreak !== undefined ? { valueStreak } : {}),
        ...(required !== undefined ? { required } : {}),
        ...(stale !== undefined ? { stale } : {}),
        ...(fieldName !== undefined ? { fieldName } : {}),
      }
      if (learnedValue !== undefined) {
        data.learnedValue = learnedValue === null ? Prisma.DbNull : learnedValue
      }

      const rule = await fastify.prisma.jiraFieldRule.update({ where: { id }, data })
      fastify.log.info({ ruleId: id, patch: req.body }, 'field rule manually calibrated')
      return {
        ...rule,
        lastSeenAt: rule.lastSeenAt?.toISOString() ?? null,
        createdAt: rule.createdAt.toISOString(),
        updatedAt: rule.updatedAt.toISOString(),
      }
    },
  })

  fastify.delete('/:id', {
    schema: {
      description: '删除字段经验规则，下次建单时从元数据重新学习。',
      params: Type.Object({ id: Type.String() }),
      response: { 200: Type.Object({ ok: Type.Boolean() }) },
    },
    handler: async (req) => {
      await fastify.prisma.jiraFieldRule.delete({ where: { id: req.params.id } })
      return { ok: true }
    },
  })
}

export default fieldRules
