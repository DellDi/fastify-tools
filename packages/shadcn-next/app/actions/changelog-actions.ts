'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { isCurrentUserAdmin } from './rbac-actions'

export interface ChangelogInput {
  version: string
  date: string
  changes: string[]
}

async function requireAdmin() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error('需要管理员权限')
  }
}

function normalize(input: ChangelogInput) {
  const version = input.version.trim().replace(/^v/i, '')
  const date = new Date(input.date)
  const changes = input.changes.map((c) => c.trim()).filter(Boolean)
  if (!version) throw new Error('版本号不能为空')
  if (isNaN(date.getTime())) throw new Error('日期无效')
  if (!changes.length) throw new Error('至少填写一条更新内容')
  return { version, date, changes }
}

const refresh = () => revalidatePath('/')

export async function listChangelogs() {
  return prisma.changelog.findMany({ orderBy: { date: 'desc' } })
}

export async function createChangelog(input: ChangelogInput) {
  await requireAdmin()
  const created = await prisma.changelog.create({ data: normalize(input) })
  refresh()
  return created
}

export async function updateChangelog(id: string, input: ChangelogInput) {
  await requireAdmin()
  const updated = await prisma.changelog.update({
    where: { id },
    data: normalize(input),
  })
  refresh()
  return updated
}

export async function deleteChangelog(id: string) {
  await requireAdmin()
  await prisma.changelog.delete({ where: { id } })
  refresh()
}
