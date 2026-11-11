'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RolesTab } from './components/roles-tab'
import { PermissionsTab } from './components/permissions-tab'
import { MenusTab } from './components/menus-tab'
import { UsersTab } from './components/users-tab'

export function RbacManager() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">角色与权限</h1>
        <p className="text-sm text-muted-foreground">
          RBAC 维护：角色 ↔ 权限 / 菜单 绑定，用户角色分配
        </p>
      </div>
      <Tabs defaultValue="roles" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="roles">角色</TabsTrigger>
          <TabsTrigger value="permissions">权限</TabsTrigger>
          <TabsTrigger value="menus">菜单</TabsTrigger>
          <TabsTrigger value="users">用户</TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="mt-4 min-h-0 flex-1 overflow-auto">
          <RolesTab />
        </TabsContent>
        <TabsContent value="permissions" className="mt-4 min-h-0 flex-1 overflow-auto">
          <PermissionsTab />
        </TabsContent>
        <TabsContent value="menus" className="mt-4 min-h-0 flex-1 overflow-auto">
          <MenusTab />
        </TabsContent>
        <TabsContent value="users" className="mt-4 min-h-0 flex-1 overflow-auto">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
