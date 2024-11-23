import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { verify } from 'jsonwebtoken'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserSettingsForm } from './user-settings-form'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function getUser(userId: string) {
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

export default async function SettingsPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    notFound()
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await getUser(decoded.userId)

    if (!user) {
      notFound()
    }

    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">用户设置</CardTitle>
          </CardHeader>
          <CardContent>
            <UserSettingsForm user={user} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error verifying token:', error)
    notFound()
  }
}

