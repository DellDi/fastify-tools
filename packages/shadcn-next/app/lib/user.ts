'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserStore } from '@/utils/store/user'
import { UserRole } from '@/utils/store/role'
import { type User } from '@supabase/supabase-js'

export async function getUser(): Promise<User | null> {
  const userInfo = getUserStore()
  if (userInfo) return userInfo
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return user
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: userRole, error } = await supabase
  .from('roles')
  .select('name')
  .eq('id', user.role_id)
  .single()

  if (error) {
    console.error('Error fetching role:', error)
    return null
  }
  return userRole
}
