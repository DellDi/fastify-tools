import { cookies } from 'next/headers'
import AccountForm from './account-form'
import SecurityForm from './security-form'
import { jwt } from '@/utils/auth/jwt'
import { getUserInfo } from '@/app/actions/user-actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'

export const metadata = {
  title: '账户设置',
  description: '账户设置页面',
}

export default async function AccountPage() {
  // 从cookie中获取用户信息
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  const userBaseInfo = jwt.verifyToken(authToken?.value || '')
  if (!userBaseInfo || userBaseInfo instanceof Error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">请先登录</h1>
        <p className="text-gray-500">您需要先登录才能访问账户设置。</p>
        <a href="/login" className="text-blue-500 hover:underline">
          登录
        </a>
      </div>
    )
  }

  const user = await getUserInfo(userBaseInfo.id)
  if (!user || user instanceof Error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">账户设置</h1>
        <p className="text-gray-500">获取用户信息失败，请稍后再试。</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            账户设置
          </h1>
          <p className="mt-2 text-muted-foreground">
            管理您的账户信息和安全设置
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-lg bg-muted/20 p-1 gap-1">
            <TabsTrigger
              value="account"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs flex items-center gap-2"
            >
              <Icons.userCircle className="h-4 w-4" />
              基本信息
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs flex items-center gap-2"
            >
              <Icons.lock className="h-4 w-4" />
              安全设置
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="account"
            className="mt-6 rounded-xl border bg-background p-6 shadow-sm transition-all"
          >
            <AccountForm user={user} />
          </TabsContent>

          <TabsContent
            value="security"
            className="mt-6 rounded-xl border bg-background p-6 shadow-sm transition-all"
          >
            <SecurityForm user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
