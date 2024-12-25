import { ErrorCard } from './error-card'

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = searchParams.error as string
  const errorCode = searchParams.error_code as string
  const errorDescription = searchParams.error_description as string
  const email = searchParams.email as string

  let errorMessage = '发生未知错误，请重试。'
  if (error === 'access_denied') {
    errorMessage = '拒绝访问，您没有权限执行该操作。'
  }
  if (errorCode === 'otp_expired') {
    errorMessage = 'OTP 已过期，请重新获取验证链接。'
  }
  if (errorDescription) {
    errorMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '))
  }

  return <ErrorCard errorMessage={errorMessage} email={email} />
}

