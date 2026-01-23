/**
 * Jira 服务工具函数
 * 日期处理、版本选择等通用逻辑
 */

import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import type { JiraVersion } from './types.js'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

/**
 * 解析版本名称中的日期
 * 支持格式：DC_V10.1.20260122、V10.1.20260122、xxx_20260122 等
 */
export function parseVersionDate(versionName: string): Date | null {
  // 匹配 8 位日期格式 YYYYMMDD
  const match = versionName.match(/(\d{4})(\d{2})(\d{2})$/)
  if (!match) {
    return null
  }

  const [, year, month, day] = match
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

  // 验证日期有效性
  if (isNaN(date.getTime())) {
    return null
  }

  return date
}

/**
 * 获取所有有效版本（未发布、未归档、日期 >= 今天）
 * 按日期升序排列
 */
export function getValidVersions(versions: JiraVersion[]): Array<{ version: JiraVersion; date: Date }> {
  const today = dayjs().startOf('day')

  return versions
    .filter(v => !v.released && !v.archived)
    .map(v => ({
      version: v,
      date: parseVersionDate(v.name),
    }))
    .filter((item): item is { version: JiraVersion; date: Date } => 
      item.date !== null && dayjs(item.date).isSameOrAfter(today)
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

/**
 * 选择合适的修复版本（简单版本，选择最近的）
 * @deprecated 使用 selectFixVersionSmart 替代
 */
export function selectFixVersion(versions: JiraVersion[]): JiraVersion | null {
  const validVersions = getValidVersions(versions)
  return validVersions.length > 0 ? validVersions[0].version : null
}

/**
 * 智能选择修复版本
 * 规则：
 * 1. 如果用户最新已占用日期 >= 版本日期 - 1天，则选择下一个版本
 * 2. 否则选择当前版本
 * 
 * @param versions 所有版本列表
 * @param maxUsedDate 用户最新已占用日期（YYYY-MM-DD 格式）
 * @returns 选中的版本及其日期
 */
export function selectFixVersionSmart(
  versions: JiraVersion[],
  maxUsedDate?: string
): { version: JiraVersion; date: Date } | null {
  const validVersions = getValidVersions(versions)
  
  if (validVersions.length === 0) {
    return null
  }

  // 如果没有已占用日期，直接返回第一个版本
  if (!maxUsedDate) {
    return validVersions[0]
  }

  const maxUsed = dayjs(maxUsedDate).startOf('day')

  // 遍历版本，找到第一个“版本日期 - 1天 > 最新已占用日期”的版本
  for (const item of validVersions) {
    const versionDeadline = dayjs(item.date).subtract(1, 'day')
    // 如果版本截止日期 > 最新已占用日期，说明这个版本还有空间
    if (versionDeadline.isAfter(maxUsed)) {
      return item
    }
  }

  // 所有版本都满了，返回最后一个版本（降级处理）
  return validVersions[validVersions.length - 1]
}

/**
 * 检查日期是否是周末
 */
export function isWeekend(date: dayjs.Dayjs): boolean {
  const dayOfWeek = date.day()
  return dayOfWeek === 0 || dayOfWeek === 6
}

/**
 * 智能分配可用日期
 * 规则：
 * 1. >= 当前日期
 * 2. < 版本日期（不能等于版本日，最多到版本前一天）
 * 3. 不与已占用日期重复
 * 4. 不是节假日或周末
 */
export function findAvailableDate(
  versionDate: Date,
  usedDates: Set<string>,
  holidays: Set<string>
): string {
  let candidate = dayjs().startOf('day')
  // 最大可用日期 = 版本日期 - 1天
  const maxDate = dayjs(versionDate).subtract(1, 'day').startOf('day')

  while (candidate.isSameOrBefore(maxDate)) {
    const dateStr = candidate.format('YYYY-MM-DD')

    // 检查是否是周末
    const weekend = isWeekend(candidate)
    // 检查是否是节假日
    const isHoliday = holidays.has(dateStr)
    // 检查是否已被占用
    const isUsed = usedDates.has(dateStr)

    if (!weekend && !isHoliday && !isUsed) {
      return dateStr
    }

    candidate = candidate.add(1, 'day')
  }

  // 如果没有可用日期，返回版本前一天（降级）
  return maxDate.format('YYYY-MM-DD')
}

/**
 * 获取已占用日期中的最大日期
 */
export function getMaxUsedDate(usedDates: Set<string>): string | undefined {
  if (usedDates.size === 0) {
    return undefined
  }
  const sorted = Array.from(usedDates).sort()
  return sorted[sorted.length - 1]
}

export { dayjs }
