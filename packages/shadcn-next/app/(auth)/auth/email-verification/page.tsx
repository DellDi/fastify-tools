import EmailVerificationWaiting from './email-verification-waiting'

export default function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const email = typeof searchParams.email === 'string' ? searchParams.email : ''
  return <EmailVerificationWaiting email={email}/>
}

