
import AuthTransition from './auth-transition'
import { redirect } from 'next/navigation'

export default function AuthTransitionPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 将searchParams转换为一个简单的对象
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  )
  if (params.error) {
    redirect(
      `/error?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    )
  }
  return <AuthTransition params={params} />
}
