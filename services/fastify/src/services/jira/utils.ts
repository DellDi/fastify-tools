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
 * 选择合适的修复版本
 * 规则：选择日期 >= 当前日期的最近版本
 */
export function selectFixVersion(versions: JiraVersion[]): JiraVersion | null {
  const today = dayjs().startOf('day')

  const validVersions = versions
    .filter(v => !v.released && !v.archived)
    .map(v => ({
      version: v,
      date: parseVersionDate(v.name),
    }))
    .filter(item => item.date !== null && dayjs(item.date).isSameOrAfter(today))
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())

  return validVersions.length > 0 ? validVersions[0].version : null
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
 * 2. <= 版本日期
 * 3. 不与已占用日期重复
 * 4. 不是节假日或周末
 */
export function findAvailableDate(
  versionDate: Date,
  usedDates: Set<string>,
  holidays: Set<string>
): string {
  let candidate = dayjs().startOf('day')
  const maxDate = dayjs(versionDate).startOf('day')

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

  // 如果没有可用日期，返回版本日期（降级）
  return maxDate.format('YYYY-MM-DD')
}

export { dayjs }
