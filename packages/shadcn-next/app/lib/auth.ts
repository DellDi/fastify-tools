'use server'

import { type User } from '@supabase/supabase-js'
import { createServerBaseClient } from '@/utils/supabase/server'

export async function initRolePermission(authUser: User) {
  // 1. 给新用户分配角色,先查询roles表的初始化默认角色
  const defaultRole = authUser.role === 'admin' ? authUser.role : 'user' // 默认角色为 user
  const supabase = await createServerBaseClient()
  const { data: role, error: roleError } = await supabase
  .from('public.roles')
  .select('id')
  .eq('name', defaultRole)
  .single()

  if (roleError || !role) {
    throw new Error(`角色 "${defaultRole}" 不存在`)
  }

  // 2. 更新 auth.users 表，设置角色
  const { error: updateRoleError } = await supabase
  .from('auth.users')
  .update({ role_id: role.id })
  .eq('id', authUser.id)
  console.log('🚀 ~ file:auth.ts, line:25-----', updateRoleError)
  if (updateRoleError) throw updateRoleError
}
