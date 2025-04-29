'use server'

import { serviceCache } from '@/store/service'
import { prisma } from "@/lib/prisma"
import { User } from "@/generated/client" 

export async function getUserInfo(userId: string): Promise<User | null> {
  const cachedUser = serviceCache.get(userId + '_user')
  if (cachedUser) {
    return cachedUser as User
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) return null
  serviceCache.set(userId + '_user', user)
  return user
}