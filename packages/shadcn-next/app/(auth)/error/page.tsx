import { ErrorCard } from './error-card'
import { errorMessagesCodeMap } from '@/types/email'

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const urlParams = await searchParams
  const errorCode = urlParams.errorCode as string
  const email = urlParams.email as string
  const errorMessage = errorMessagesCodeMap[errorCode as keyof typeof errorMessagesCodeMap].message

  if (!errorMessage || !email) {
    return (
      <ErrorCard
        errorMessage={'发生未知错误，请重试。'}
        errorCode={errorCode}
        email={email ? email : ''}
      />
    )
  }

  return <ErrorCard errorCode={errorCode} errorMessage={errorMessage} email={email} />
}
