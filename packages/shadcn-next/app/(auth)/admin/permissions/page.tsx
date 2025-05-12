import { redirect } from 'next/navigation'
import PermissionManagement from './permission-management'


export default async function PermissionsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">权限管理</h1>
      <PermissionManagement />
    </div>
  )
}

