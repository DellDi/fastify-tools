import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCurrentUser } from '@/store/client/userStore'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">用户配置文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={user.avatarUrl || ''}
                alt={user.username || ''}
              />
              <AvatarFallback>
                {(user.username || '').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">手机号码</h3>
              <p>{user.phone || '未设置'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">注册时间</h3>
              <p>{new Date(user.createdAt || '').toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
