import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSettingsForm } from './user-settings-form'
import { getUser } from '@/app/lib/user'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    notFound()
  }

  try {
    const decoded = verify(token, process.env.SUPABASE_JWT_SECRET!) as { userId: string }
    const user = await getUser()

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
            <UserSettingsForm user={user}/>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error verifying token:', error)
    notFound()
  }
}

