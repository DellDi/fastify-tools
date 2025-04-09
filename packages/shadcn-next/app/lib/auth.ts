'use server'

import { type User } from '@supabase/supabase-js'

export async function initRolePermission(authUser: User) {
  const defaultRoleName = authUser.role === 'admin' ? authUser.role : 'user' // 默认角色为 user
  const supabase = await createServerBaseClient()

  try {
    const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', defaultRoleName)
    .single()

    if (roleError || !role) {
      return new Error(`角色 "${defaultRoleName}" 不存在`)
    }

    // 2. 更新 auth.users 表，设置角色
    const { error: updateRoleError } = await supabase
    .from('auth.users')
    .update({ role_id: role.id })
    .eq('id', authUser.id)

    if (updateRoleError) {
      return new Error(`更新角色失败: ${updateRoleError.message}`)
    }
  } catch (e) {
    throw new Error(`初始化角色失败: ${(e as Error).message}`)
  }
}
