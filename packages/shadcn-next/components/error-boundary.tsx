'use client'

import React, { ErrorInfo } from 'react'
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 你同样可以将错误日志上报给服务器
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI 并渲染
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">出错了</h2>
          <p className="text-gray-600 mb-4">很抱歉，发生了一些错误。</p>
          <Button onClick={() => this.setState({ hasError: false })}>
            重试
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

