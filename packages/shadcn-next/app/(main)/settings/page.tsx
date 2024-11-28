import AccountForm from './account-form'
import { getUser } from '@/app/lib/user'

export const metadata = {
  title: '账户设置',
  description: '账户设置页面',
}

export default async function AccountPage() {
  const user = await getUser()
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">请先登录</h1>
        <p className="text-gray-500">您需要先登录才能访问账户设置。</p>
        <a href="/login" className="text-blue-500 hover:underline">登录</a>
      </div>
    )
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">账户设置</h1>
      <AccountForm user={user}/>
    </div>
  )
}

