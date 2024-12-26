import EmailVerificationWaiting from './email-verification-waiting'

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const email = typeof params.email === 'string' ? params.email : ''
  return <EmailVerificationWaiting email={email}/>
}

