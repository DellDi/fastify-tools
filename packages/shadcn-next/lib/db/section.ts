import { prisma } from '../prisma'
import type { HomeSection } from '@prisma/client'

// 导出 Prisma 生成的类型，便于在其他地方使用
export type Section = HomeSection

/**
 * 获取所有区块数据
 */
export async function getAllSections(): Promise<Section[]> {
  try {
    const sections = await prisma.homeSection.findMany({
      where: { status: '在用' },
      orderBy: { createdAt: 'desc' }
    })
    return sections
  } catch (error) {
    console.error('获取区块数据失败:', error)
    return []
  }
}

/**
 * 根据ID获取区块
 */
export async function getSectionById(id: bigint): Promise<Section | null> {
  try {
    const section = await prisma.homeSection.findUnique({
      where: { id }
    })
    return section
  } catch (error) {
    console.error(`获取区块(ID: ${id})失败:`, error)
    return null
  }
}

/**
 * 创建新区块
 */
export async function createSection(data: Omit<Section, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Section | null> {
  try {
    const section = await prisma.homeSection.create({
      data
    })
    return section
  } catch (error) {
    console.error('创建区块失败:', error)
    return null
  }
}

/**
 * 更新区块
 */
export async function updateSection(id: bigint, data: Partial<Omit<Section, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Section | null> {
  try {
    const section = await prisma.homeSection.update({
      where: { id },
      data
    })
    return section
  } catch (error) {
    console.error(`更新区块(ID: ${id})失败:`, error)
    return null
  }
}

/**
 * 删除区块（软删除，更新状态）
 */
export async function deleteSection(id: bigint): Promise<boolean> {
  try {
    await prisma.homeSection.update({
      where: { id },
      data: { status: '已删除' }
    })
    return true
  } catch (error) {
    console.error(`删除区块(ID: ${id})失败:`, error)
    return false
  }
}

/**
 * 批量创建区块
 */
export async function createManySections(data: Omit<Section, 'id' | 'createdAt' | 'updatedAt' | 'status'>[]): Promise<number> {
  try {
    const result = await prisma.homeSection.createMany({
      data,
      skipDuplicates: true
    })
    return result.count
  } catch (error) {
    console.error('批量创建区块失败:', error)
    return 0
  }
}
