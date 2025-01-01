'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NumberGuessingGame() {
  const [targetNumber] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const handleGuess = () => {
    const guessNumber = parseInt(guess)
    if (isNaN(guessNumber)) {
      setMessage('请输入一个有效的数字！')
      return
    }

    setAttempts(attempts + 1)

    if (guessNumber === targetNumber) {
      setMessage(`恭喜你猜对了！答案就是 ${targetNumber}。你用了 ${attempts + 1} 次尝试。`)
      setGameOver(true)
    } else if (guessNumber < targetNumber) {
      setMessage('太小了，再猜大一点！')
    } else {
      setMessage('太大了，再猜小一点！')
    }

    setGuess('')
  }

  const resetGame = () => {
    setGuess('')
    setMessage('')
    setAttempts(0)
    setGameOver(false)
  }

  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">猜一个 1 到 100 之间的数字</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="border rounded-md px-3 py-2 mb-4 w-full"
        placeholder="输入你的猜测"
        disabled={gameOver}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={gameOver ? resetGame : handleGuess}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 w-full"
      >
        {gameOver ? '重新开始' : '猜！'}
      </motion.button>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-indigo-600 font-semibold"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

