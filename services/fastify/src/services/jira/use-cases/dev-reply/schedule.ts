import type { FastifyBaseLogger } from 'fastify'
import {
  dayjs,
  isValidDevCompleteDate,
  versionPrefix,
  versionWindowCapacity,
} from '../../utils.js'
import type { JiraRestService } from '../../jira-rest.service.js'
import type { DevReplyBatchContext, StepResult } from './types.js'

type FixVersionItem = {
  version: { id: string; name: string }
  date: Date
}

export type FixVersionPick = FixVersionItem & {
  capacity: {
    workableDays: number
    occupiedDays: number
    firstFreeDate?: string
  }
}

export type FixVersionChoice = {
  pick: FixVersionPick | null
  tier?: 'keep' | 'prefix' | 'workload' | 'llm' | 'fallback'
  reasons: string[]
}

/**
 * 工作负载排期查询：经办人全部未完成单的日期占用 + 版本分布。
 * 批内首个工单一次 JQL 建好缓存在 batchContext，后续工单直接复用。
 * reconcile 模式下本单旧日期不视为占用——保留校验和重新分配都以"他人占用"
 * 为准，否则重复执行会把日期一天天往后顺延（漂移）。
 */
export async function buildWorkloadSchedule(args: {
  jiraRestService: JiraRestService
  logger: FastifyBaseLogger
  assignee: string
  cookies: string
  reconcile: boolean
  currentDevDate?: string
  batchContext?: DevReplyBatchContext
}): Promise<{
  usedDates: Set<string>
  versionCounts: Map<string, { name: string; count: number }>
  step: StepResult
  reason?: string
}> {
  const {
    jiraRestService,
    logger,
    assignee,
    cookies,
    reconcile,
    currentDevDate,
    batchContext,
  } = args
  try {
    let schedule =
      batchContext?.schedule?.assignee === assignee
        ? batchContext.schedule
        : undefined
    if (!schedule) {
      const jql = `assignee = "${assignee}" AND resolution = Unresolved ORDER BY cf[10022] ASC`
      const searchResult = await jiraRestService.searchIssuesByJql(jql, cookies, [
        'customfield_10022',
        'fixVersions',
      ])
      const builtUsed = new Set<string>()
      const builtCounts = new Map<string, { name: string; count: number }>()
      for (const issue of searchResult.issues) {
        if (issue.fields.customfield_10022) {
          builtUsed.add(issue.fields.customfield_10022)
        }
        for (const v of issue.fields.fixVersions ?? []) {
          const entry = builtCounts.get(v.id) ?? {
            name: v.name ?? v.id,
            count: 0,
          }
          entry.count += 1
          builtCounts.set(v.id, entry)
        }
      }
      schedule = {
        assignee,
        usedDates: builtUsed,
        versionCounts: builtCounts,
      }
      if (batchContext) batchContext.schedule = schedule
    }
    const usedDates = new Set(schedule.usedDates)
    const versionCounts = schedule.versionCounts
    if (batchContext) {
      for (const reservedDate of batchContext.reservedDates) {
        usedDates.add(reservedDate)
      }
    }
    if (reconcile && currentDevDate) {
      usedDates.delete(currentDevDate)
    }
    const dominantVersion = [...versionCounts.entries()].sort(
      (a, b) => b[1].count - a[1].count,
    )[0]
    logger.info(
      `Workload for ${assignee}: ${usedDates.size} used dates, ${versionCounts.size} versions`,
    )
    const distLines = [...versionCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((v) => `${v.name}×${v.count}`)
    return {
      usedDates,
      versionCounts,
      reason: `经办人 ${assignee} 未完成单已占用 ${usedDates.size} 个工作日，版本分布 ${distLines.join('、') || '无'}`,
      step: {
        success: true,
        message: '已完成工作负载排期查询',
        data: {
          usedDateCount: usedDates.size,
          dominantVersion: dominantVersion?.[1].name,
          versionDistribution: distLines,
        },
      },
    }
  } catch (error) {
    const message = `查询工作负载排期失败: ${error instanceof Error ? error.message : String(error)}`
    logger.warn(message)
    return {
      usedDates: new Set<string>(),
      versionCounts: new Map<string, { name: string; count: number }>(),
      step: { success: false, message },
    }
  }
}

/**
 * 版本选择（排期模型核心），五级优先级：
 *   keep     现有版本未过期且窗口仍有余量 → 保留（历史参照最强）
 *   prefix   同前缀车次（现有版本不可行时的就近换班）
 *   workload 经办人工作负载主流版本 → 汇入
 *   llm      AI 在可行候选里结合整体上下文给建议
 *   fallback 算法兜底：发车日最近的有余量车次
 * 全程记 reasoning 推理链；无可行版本返回 pick=null。
 */
export async function chooseFixVersion(args: {
  jiraRestService: JiraRestService
  validVersions: FixVersionItem[]
  currentFixVersions: Array<{ id: string; name: string }>
  issueKey: string
  usedDates: Set<string>
  holidays: Set<string>
  versionCounts: Map<string, { name: string; count: number }>
}): Promise<FixVersionChoice> {
  const {
    jiraRestService,
    validVersions,
    currentFixVersions,
    issueKey,
    usedDates,
    holidays,
    versionCounts,
  } = args
  const reasons: string[] = []
  const fmt = (d: Date) => dayjs(d).format('YYYY-MM-DD')
  const capacityOf = (item: { date: Date }) =>
    versionWindowCapacity(item.date, usedDates, holidays)

  // 第一级：现有版本仍可行 → 保留。
  // 多版本工单逐个检查池内成员，任一仍有余量就认它为现状（稍后收敛为单选）
  const inPool = currentFixVersions
    .map((v) => ({
      name: v.name,
      item: validVersions.find((item) => item.version.id === v.id),
    }))
    .filter(
      (x): x is { name: string; item: (typeof validVersions)[number] } =>
        !!x.item,
    )
  for (const x of inPool) {
    const c = capacityOf(x.item)
    if (c.firstFreeDate) {
      reasons.push(
        `现有版本「${x.name}」发车日 ${fmt(x.item.date)} 未过期，窗口可工作日 ${c.workableDays} 天/已占用 ${c.occupiedDays} 天 → 保留`,
      )
      return { pick: { ...x.item, capacity: c }, tier: 'keep', reasons }
    }
  }
  if (inPool.length) {
    reasons.push(
      `现有版本「${inPool.map((x) => x.name).join('、')}」窗口可工作日均已占满 → 需换版`,
    )
  } else if (currentFixVersions.length) {
    reasons.push(
      `现有版本「${currentFixVersions.map((v) => v.name).join('、')}」不在未发布有效池（已发布/归档/发车日已过期）→ 需换版`,
    )
  } else {
    reasons.push('工单未挂修复版本，需要选择')
  }

  // 可行候选 = 窗口内至少还有 1 个可分配工作日（一日一单）
  const feasible = validVersions
    .map((item) => ({ item, capacity: capacityOf(item) }))
    .filter((x) => x.capacity.firstFreeDate)
  if (!feasible.length) {
    reasons.push('所有未发布版本窗口均无剩余可工作日')
    return { pick: null, reasons }
  }

  // 第二级：同前缀车次（现挂版本前缀优先，退化工单号前缀）
  const prefix =
    versionPrefix(inPool[0]?.name ?? currentFixVersions[0]?.name ?? '') ||
    issueKey.split('-')[0]
  const samePrefix = feasible.find(
    (x) => versionPrefix(x.item.version.name) === prefix,
  )
  if (samePrefix) {
    reasons.push(
      `同前缀车次「${samePrefix.item.version.name}」（发车 ${fmt(samePrefix.item.date)}，余量 ${samePrefix.capacity.workableDays - samePrefix.capacity.occupiedDays} 个工作日）→ 选中`,
    )
    return {
      pick: { ...samePrefix.item, capacity: samePrefix.capacity },
      tier: 'prefix',
      reasons,
    }
  }

  // 第三级：经办人工作负载主流版本 → 汇入
  for (const [vid, info] of [...versionCounts.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )) {
    const hit = feasible.find((x) => x.item.version.id === vid)
    if (hit) {
      reasons.push(
        `经办人工作负载主流版本「${info.name}」（${info.count} 单在用，发车 ${fmt(hit.item.date)}）→ 汇入`,
      )
      return {
        pick: { ...hit.item, capacity: hit.capacity },
        tier: 'workload',
        reasons,
      }
    }
  }

  // 第四级：AI 建议（候选已被确定性层过滤为可行集，LLM 只做语义选择）
  try {
    const suggested = await jiraRestService.suggestFixVersion({
      issueKey,
      today: dayjs().format('YYYY-MM-DD'),
      currentVersionName: inPool[0]?.name ?? currentFixVersions[0]?.name,
      workloadVersions: [...versionCounts.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((v) => ({ name: v.name, count: v.count })),
      candidates: feasible.map((x) => ({
        name: x.item.version.name,
        releaseDate: fmt(x.item.date),
        freeDays: x.capacity.workableDays - x.capacity.occupiedDays,
      })),
    })
    const hit =
      suggested && feasible.find((x) => x.item.version.name === suggested.version)
    if (hit) {
      reasons.push(
        `AI 建议「${hit.item.version.name}」${suggested.reason ? `（${suggested.reason}）` : ''}→ 采纳`,
      )
      return {
        pick: { ...hit.item, capacity: hit.capacity },
        tier: 'llm',
        reasons,
      }
    }
    if (suggested) {
      reasons.push(`AI 建议「${suggested.version}」不在可行候选内，忽略`)
    }
  } catch (error) {
    reasons.push(
      `AI 建议不可用（${error instanceof Error ? error.message : String(error)}），走算法兜底`,
    )
  }

  // 第五级：兜底——发车日最近的有余量车次
  const fb = feasible[0]
  reasons.push(
    `兜底选择发车日最近的有余量车次「${fb.item.version.name}」（发车 ${fmt(fb.item.date)}）`,
  )
  return {
    pick: { ...fb.item, capacity: fb.capacity },
    tier: 'fallback',
    reasons,
  }
}

/**
 * 日期决策：现有日期在版本窗口内有效且未被他人占用 → 保留；
 * 否则记明失效原因，分配窗口内最近可工作日（一日一单）。
 * reservedDate 交给调用方并入批次占用集合。
 */
export function decideDevCompleteDate(args: {
  explicitDate?: string
  reconcile: boolean
  currentDevDate?: string
  fixVersion: FixVersionPick | null
  usedDates: Set<string>
  holidays: Set<string>
}): {
  devCompleteDate?: string
  reservedDate?: string
  reasons: string[]
  step: StepResult
} {
  const {
    explicitDate,
    reconcile,
    currentDevDate,
    fixVersion,
    usedDates,
    holidays,
  } = args
  const reasons: string[] = []

  if (explicitDate) {
    return {
      devCompleteDate: explicitDate,
      reasons,
      step: {
        success: true,
        message: '使用请求指定的预计开发完成时间',
        data: { devCompleteDate: explicitDate },
      },
    }
  }

  if (!fixVersion) {
    return {
      reasons,
      step: {
        success: false,
        message: '缺少可用修复版本，无法自动分配预计开发完成时间',
      },
    }
  }

  if (reconcile && currentDevDate) {
    if (!isValidDevCompleteDate(currentDevDate, fixVersion.date, holidays)) {
      const why: string[] = []
      if (currentDevDate < dayjs().format('YYYY-MM-DD')) why.push('已过期')
      if (dayjs(currentDevDate).isSameOrAfter(dayjs(fixVersion.date).startOf('day')))
        why.push('晚于版本发车日')
      if ([0, 6].includes(dayjs(currentDevDate).day())) why.push('非工作日')
      if (holidays.has(currentDevDate)) why.push('落在节假日/封网期')
      reasons.push(
        `现有预计开发完成 ${currentDevDate} 失效（${why.join('、') || '校验未过'}）`,
      )
    } else if (usedDates.has(currentDevDate)) {
      reasons.push(`现有预计开发完成 ${currentDevDate} 已被经办人其他工单占用`)
    } else {
      reasons.push(
        `现有预计开发完成 ${currentDevDate} 在版本窗口内且未被占用 → 保留`,
      )
      return {
        devCompleteDate: currentDevDate,
        reasons,
        step: {
          success: true,
          message: '现有预计开发完成时间仍有效，保留原值',
          data: {
            devCompleteDate: currentDevDate,
            kept: true,
            reasoning: reasons,
          },
        },
      }
    }
  }

  const slot = fixVersion.capacity?.firstFreeDate
  if (!slot) {
    return {
      reasons,
      step: {
        success: false,
        message: '所选版本窗口内无可分配工作日',
        data: { reasoning: reasons },
      },
    }
  }
  reasons.push(
    `在「${fixVersion.version.name}」窗口分配最近可工作日 ${slot}` +
      (fixVersion.capacity
        ? `（窗口可工作日 ${fixVersion.capacity.workableDays} 天/已占用 ${fixVersion.capacity.occupiedDays} 天）`
        : ''),
  )
  return {
    devCompleteDate: slot,
    reservedDate: slot,
    reasons,
    step: {
      success: true,
      message: '已自动分配预计开发完成时间',
      data: { devCompleteDate: slot, reasoning: reasons },
    },
  }
}
