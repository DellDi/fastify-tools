// types/supabase.d.ts
declare module '@supabase/supabase-js' {
  interface User {
    role_id?: number;  // 这里添加你的自定义字段
  }
}
