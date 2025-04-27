'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { fetchBase } from '@/utils/fetch/fetch'
import { errorMessagesCodeMap } from '@/types/email'

interface AuthTransitionProps {
  params: Record<string, string | undefined>
}

export default function AuthTransition({ params }: AuthTransitionProps) {
  const [effectExecuted, setEffectExecuted] = useState(false)
  const [status, setStatus] = useState<
    'base' | 'loading' | 'success' | 'error'
  >('base')
  const [message, setMessage] = useState('正在验证您的身份...')
  const router = useRouter()

  const authCodeLogin = useCallback(async () => {
    const code = params.code
    if (code) {
      setStatus('loading') // 在开始请求前设置 loading 状态
      setMessage('正在验证您的身份...')
      try {
        const user = await fetchBase('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ email: params.email, code }),
        })
        console.log("🚀 ~ authCodeLogin ~ user:", user)
        setStatus('success')
        setMessage('身份验证成功！正在跳转...')
        toast({
          title: '身份验证成功',
          description: '正在跳转到您的账户',
        })
        setTimeout(() => router.push(params.redirect || '/dashboard'), 1000)
        return user
      } catch (error: unknown) {
        console.log("🚀 ~ authCodeLogin ~ error:", error)
        setStatus('error')
        
        // 处理API返回的错误对象
        if (error instanceof Response) {
          // 解析Response对象
          const errorData = await error.json()
          console.log("🚀 ~ authCodeLogin ~ errorData:", errorData)
          
          if (errorData.error && errorMessagesCodeMap[errorData.error as keyof typeof errorMessagesCodeMap]) {
            const errorCode = errorData.error as keyof typeof errorMessagesCodeMap
            const errorInfo = errorMessagesCodeMap[errorCode]
            
            setMessage(`身份验证失败。请稍后重试: ${errorInfo.message}`)
            toast({
              title: '身份验证失败',
              description: `身份验证失败。请稍后重试: ${errorInfo.message}`,
              variant: 'destructive',
            })
            
            setTimeout(
              () => router.push(`/error?errorCode=${errorInfo.code}&email=${params.email}`),
              2000
            )
            return
          }
        }
        
        // 处理普通Error对象（兜底处理）
        if (error instanceof Error) {
          const errorMessage = error.message
          const errorCode = Object.keys(errorMessagesCodeMap).find(
            (key) => errorMessagesCodeMap[key as keyof typeof errorMessagesCodeMap].code === errorMessage
          ) as keyof typeof errorMessagesCodeMap | undefined
          
          if (errorCode) {
            setMessage(
              `身份验证失败。请稍后重试: ${errorMessagesCodeMap[errorCode].message}`
            )
            toast({
              title: '身份验证失败',
              description: `身份验证失败。请稍后重试: ${errorMessagesCodeMap[errorCode].message}`,
              variant: 'destructive',
            })
            setTimeout(
              () => router.push(`/error?errorCode=${errorMessagesCodeMap[errorCode].code}&email=${params.email}`),
              2000
            )
          } else {
            // 未知错误处理
            setMessage(`身份验证失败。请稍后重试: ${error.message}`)
            toast({
              title: '身份验证失败',
              description: `身份验证失败。请稍后重试: ${error.message}`,
              variant: 'destructive',
            })
            setTimeout(
              () => router.push(`/error?errorCode=UNKNOWN_ERROR&email=${params.email}`),
              2000
            )
          }
        }
        throw error // 重新抛出错误，以便调用者进行进一步处理
      }
    }
  }, [params.code, params.redirect, router]) // 移除 status 依赖项

  useEffect(() => {
    if (effectExecuted) return
    setEffectExecuted(true)
    authCodeLogin()
      .then(() => {})
      .catch(() => {})
  }, [authCodeLogin, params, effectExecuted])

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          {status === 'loading' && (
            <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          )}
          {status === 'error' && (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          身份验证
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        {Object.keys(params).length > 0 && (
          <div className="mb-6 text-left">
            <h3 className="text-lg font-semibold mb-2">URL 参数：</h3>
            <ul className="list-disc pl-5">
              {Object.entries(params).map(([key, value]) => (
                <li
                  key={key}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: status === 'loading' ? '100%' : 0 }}
          transition={{ duration: 3 }}
          className="h-1 bg-blue-500 rounded-full"
        />
      </motion.div>
    </div>
  )
}
