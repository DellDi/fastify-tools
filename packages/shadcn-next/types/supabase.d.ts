import type { User } from '@supabase/supabase-js'  // 使用 import type

// 拓展 types/supabase.d.ts
declare module '@supabase/supabase-js' {
  interface User {
    role_id?: number;  // 这里添加你的自定义字段
  }

  export interface Role {
    id: string
    name: string
    description: string
    status: string
    created_by: string
    updated_by: string
    created_at: string
    updated_at: string
    deleted_at: string
  }

  export interface Permission {
    id: string
    name: string
    description: string
    group_name: string
    status: string
    created_at: string
    updated_at: string
    deleted_at: string
  }

  export interface RolePermission {
    role_id: string
    permission_id: string
    created_at: string
    deleted_at: string
  }

  export interface Menu {
    id: string
    name: string
    url: string
    parent_id: string
    sort_order: number
    icon: string
    description: string
    component: string
    created_at: string
    updated_at: string
    deleted_at: string
    children?: Menu[]
  }

  export interface RoleMenu {
    role_id: string
    menu_id: string
    created_at: string
  }
}

