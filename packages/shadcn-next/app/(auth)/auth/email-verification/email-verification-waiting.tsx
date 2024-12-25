'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ExternalLink } from 'lucide-react'
import NumberGuessingGame from './number-guessing-game'

interface EmailVerificationWaitingProps {
  email: string
}

export default function EmailVerificationWaiting({ email }: EmailVerificationWaitingProps) {
  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowGame(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Mail className="mx-auto h-16 w-16 text-blue-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">查看您的邮箱</h2>
        <p className="text-gray-600 mb-6">
          我们已经向 <span className="font-semibold">{email}</span> 发送了一封验证邮件。
          请查看您的收件箱并点击验证链接来完成注册过程。
        </p>
        <a
          href={`https://${email.split('@')[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          打开邮箱
        </a>
      </motion.div>

      <AnimatePresence>
        {showGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">等待时玩个小游戏吧！</h3>
            <NumberGuessingGame />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

