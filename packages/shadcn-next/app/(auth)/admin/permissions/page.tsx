import { redirect } from 'next/navigation'
import PermissionManagement from './permission-management'
import { createClient } from '@/utils/supabase/server'

export default async function PermissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 检查用户是否有管理权限的权限
  const { data: userRole } = await supabase
  .from('roles')
  .select('name')
  .eq('id', user?.role_id)
  .single()

  if (userRole?.name !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">权限管理</h1>
      <PermissionManagement />
    </div>
  )
}

