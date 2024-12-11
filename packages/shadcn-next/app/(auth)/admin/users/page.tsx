import { redirect } from 'next/navigation'
import UserManagement from './user-management'
import { getUser } from '@/app/lib/user'
import { createClient } from '@/utils/supabase/server'

export default async function UsersPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  const supabase = await createClient()
  // 检查用户是否有管理用户的权限
  const { data: userRole } = await supabase
  .from('roles')
  .select('name')
  .eq('id', user.role_id)
  .single()

  if (userRole?.name !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">用户管理</h1>
      <UserManagement/>
    </div>
  )
}

