'use client'

import { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'

/**
 * Props for the Providers component.
 *
 * @property {ReactNode} children - The child elements to be rendered within the Providers context.
 */
interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        // 全局 SWR 配置
        revalidateOnFocus: false,
        dedupingInterval: 5000,
        errorRetryCount: 3,
        onError: (error) => {
          console.error('全局数据获取错误:', error)
        },
      }}
    >
      {/* ThemeProvider 是导致 html 标签属性变化的原因 */}
      <ThemeProvider
        attribute="class" // 如果你是用 class 来切换主题，推荐加上 attribute="class"
        defaultTheme="system" // 显式设置默认主题可能也有帮助
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </SWRConfig>
  )
}
