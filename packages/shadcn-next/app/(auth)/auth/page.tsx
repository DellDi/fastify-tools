import AuthTransition from './auth-transition'
import { redirect } from 'next/navigation'

export default async function AuthTransitionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const urlParams = await searchParams
  // 将searchParams转换为一个简单的对象
  const params = Object.fromEntries(
    Object.entries(urlParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  )
  if (!params.code) {
    redirect('/error')
  }
  return <AuthTransition params={params}/>
}
