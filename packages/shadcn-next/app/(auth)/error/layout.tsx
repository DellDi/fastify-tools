import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '错误 | 我们的应用',
  description: '发生错误，请重试',
}

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      {children}
    </div>
  )
}

