import { useState, useEffect } from 'react'


export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPermissions() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
        .from('public.permissions')
        .select('permissions(name)')
        .eq('role_id', user.role_id)

        if (!error && data) {
          setPermissions(data.map(item => item.permissions.name))
        }
      }
      setIsLoading(false)
    }

    fetchPermissions().then(r => {
    })
  }, [])

  function hasPermission(permissionName: string): boolean {
    return permissions.includes(permissionName)
  }

  return { permissions, hasPermission, isLoading }
}

