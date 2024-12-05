import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/app/lib/email'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const { username, email, password, phoneNumber } = await request.json()

  try {
    // 使用 Supabase Auth 创建用户
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        phone_number: phoneNumber
      }
    })

    if (authError) {
      if (authError.message.includes('User already registered')) {
        return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 })
      }
      throw authError
    }

    // 生成验证码
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // 插入验证码
    const { error: insertError } = await supabase
    .from('verification_codes')
    .insert({ user_id: authUser.user.id, code: verificationCode, expires_at: expiresAt })

    if (insertError) throw insertError

    // 发送验证邮件（这里需要实现实际的邮件发送逻辑）
    await sendVerificationEmail(email, verificationCode)

    // 1. 给新用户分配角色
    const defaultRole = 'basic_user' // 假设我们有一个默认角色 basic_user

    const { data: role, error: roleError } = await supabase
    .from('roles')
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
    .eq('id', authUser.user.id)

    if (updateRoleError) throw updateRoleError

    // 3. 为新角色赋予基本权限 (这里假设我们有基本权限如：`view:dashboard`, `edit:profile`)
    const permissions = ['view:dashboard', 'edit:profile'] // 默认权限

    for (const permissionName of permissions) {
      const { data: permission, error: permissionError } = await supabase
      .from('permissions')
      .select('id')
      .eq('name', permissionName)
      .single()

      if (permissionError || !permission) {
        throw new Error(`权限 "${permissionName}" 不存在`)
      }

      // 为角色分配权限
      const { error: rolePermissionError } = await supabase
      .from('role_permissions')
      .upsert([
        { role_id: role.id, permission_id: permission.id }
      ])

      if (rolePermissionError) throw rolePermissionError
    }

    // 4. 给新角色分配菜单权限（假设我们有基本菜单：`dashboard`, `profile`）
    const menus = ['dashboard', 'profile'] // 默认菜单

    for (const menuName of menus) {
      const { data: menu, error: menuError } = await supabase
      .from('menus')
      .select('id')
      .eq('name', menuName)
      .single()

      if (menuError || !menu) {
        throw new Error(`菜单 "${menuName}" 不存在`)
      }

      // 为角色分配菜单
      const { error: roleMenuError } = await supabase
      .from('role_menus')
      .upsert([
        { role_id: role.id, menu_id: menu.id }
      ])

      if (roleMenuError) throw roleMenuError
    }

    return NextResponse.json({ message: "注册成功，请查收验证邮件" })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "注册失败，请稍后再试"
    }, { status: 500 })
  }
}
