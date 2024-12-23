'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { getCurrentUserRole, getUser } from '@/app/lib/user'
import { toast } from '@/components/ui/use-toast'
import { initRolePermission } from '@/app/api/auth/register/role_permission'

interface AuthTransitionProps {
  params: Record<string, string | undefined>
}

export default function AuthTransition({ params }: AuthTransitionProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('正在验证您的身份...')
  const router = useRouter()

  useEffect(() => {
    const simulateAuth = async () => {
      let authSuccess = false
      const user = await getUser()
      const userRole = await getCurrentUserRole()
      if (!user) {
        toast({
          title: '用户不存在',
          description: '请检查您的用户名和密码是否正确,重新登录',
          variant: 'destructive',
        })
        return router.replace('/login')
      }
      if (!userRole) {
        // 身份授权过程
        await new Promise(resolve => setTimeout(async () => {
          await initRolePermission(user)
          authSuccess = true
          resolve(true)
        }, 2000))
      }

      if (authSuccess) {
        setStatus('success')
        setMessage('身份验证成功！正在跳转...')
        // 使用 params 中的 redirect 参数进行跳转，如果没有则默认到 dashboard
        setTimeout(() => router.push(params.redirect || '/dashboard'), 1000)
      } else {
        setStatus('error')
        setMessage('身份验证失败。请重试。')
        setTimeout(() => router.push('/login'), 1000)
      }
    }

    simulateAuth().then(r => r)
  }, [router, params])

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
          {status === 'loading' && <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin"/>}
          {status === 'success' && <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>}
          {status === 'error' && <XCircle className="mx-auto h-16 w-16 text-red-500"/>}
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">身份验证</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        {Object.keys(params).length > 0 && (
          <div className="mb-6 text-left">
            <h3 className="text-lg font-semibold mb-2">URL 参数：</h3>
            <ul className="list-disc pl-5">
              {Object.entries(params).map(([key, value]) => (
                <li key={key} className="text-sm text-gray-600 dark:text-gray-400">
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

