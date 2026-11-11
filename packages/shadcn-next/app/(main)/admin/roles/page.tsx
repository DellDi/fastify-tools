import { isCurrentUserAdmin } from '@/app/actions/rbac-actions'
import { RbacManager } from './rbac-manager'

export default async function AdminRolesPage() {
  if (!(await isCurrentUserAdmin())) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
        <p className="text-lg font-medium">需要管理员权限</p>
        <p className="text-sm">仅超级管理员或 admin 角色可访问 RBAC 管理</p>
      </div>
    )
  }
  return <RbacManager />
}
