"use server"

import { prisma } from '../prisma'
import type { Changelog } from '../../generated/client'

export type { Changelog }

/**
 * 获取所有更新日志（按日期倒序）
 */
export async function getChangelogs(): Promise<Changelog[]> {
  try {
    return await prisma.changelog.findMany({
      orderBy: { date: 'desc' },
    })
  } catch (error) {
    console.error('获取更新日志失败:', error)
    return []
  }
}
