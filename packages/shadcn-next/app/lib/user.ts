import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function getUser(userId: string) {
  const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}
