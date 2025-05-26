'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AlertCircle, ArrowLeft, LogIn } from 'lucide-react'

export default function Forbidden() {
  const [tip, setTip] = useState('')

  useEffect(() => {
    const tips = [
      '请确保您已经登录。',
      '检查您的账户权限。',
      '如果您认为这是个错误，请联系管理员。',
      '尝试刷新页面或清除浏览器缓存。',
      '确保您的网络连接正常。',
    ]
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-6"/>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">未授权访问</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">很抱歉，您没有权限访问此页面。</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>小贴士：</strong> {tip}
          </p>
        </motion.div>
        <div className="space-y-4">
          <Link href="/"
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            返回首页
          </Link>
          <Link href="/login"
                className="flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition duration-300">
            <LogIn className="mr-2 h-4 w-4"/>
            返回登录
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

