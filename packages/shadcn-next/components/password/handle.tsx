'use client'

import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { PasswordCard } from '@/components/password/box-decrypt'

export function PasswordComponent() {
  const [mode, setMode] = useState('database')
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let aesEnOrDeType = ''

    if (mode === 'database') {
      aesEnOrDeType = selectValue
    } else if (mode === 'business') {
      aesEnOrDeType = selectValue === 'aesEnOrigin' ? 'encrypt' : 'decrypt'
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsee/handlePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, aesEnOrDeType }),
      })
      const data = await response.json()

      setResult(data.result)

      const statusFail = data.statusCode !== 200
      toast({
        title: statusFail ? '解析异常' : '解析成功',
        variant: statusFail ? 'destructive' : 'default',
        description: statusFail ? `${data.code}:${data.message}` : (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              处理结果: {data.result} ({aesEnOrDeType})
            </code>
          </pre>
        ),
        duration: 1500,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: '处理失败',
        variant: 'destructive',
        description: '发生了一个错误，请稍后再试。',
        duration: 1500,
      })
    }
  }

  const [selectValue, setSelectValue] = useState(mode === 'database' ? 'decrypt' : 'aesEnOrigin')

  const modeOptions = [
    { value: 'database', label: '数据库模式' },
    { value: 'business', label: '业务模式' },
  ]

  const selectOptions = mode === 'database'
    ? [
      { value: 'decrypt', label: '解密（数据库）' },
      { value: 'encrypt', label: '加密（数据库）' },
    ]
    : [
      { value: 'aesEnOrigin', label: 'AES加密' },
      { value: 'aesDeOrigin', label: 'AES解密' },
    ]

  return (
    <div className="mt-4">
      <PasswordCard
        title="密码处理"
        description="支持数据库模式和业务模式的密码加密解密"
        mode={mode}
        setMode={setMode}
        modeOptions={modeOptions}
        content={content}
        setContent={setContent}
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        selectOptions={selectOptions}
        onSubmit={handleSubmit}
        result={result}
      />
    </div>
  )
}

