import { forbidden } from 'next/navigation'
import RoleManagement from './role-management'

export default async function UsersPage() {

  const isAdmin = true
  if (!isAdmin) {
    forbidden()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">用户管理</h1>
      <RoleManagement />
    </div>
  )
}

