'use client'

import React, { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { PasswordCard } from '@/components/password/box-decrypt'

const selectOptions = {
  database: [
    { value: 'decrypt', label: '解密（数据库）' },
    { value: 'encrypt', label: '加密（数据库）' },
  ],
  business: [
    { value: 'aesEnOrigin', label: 'AES加密' },
    { value: 'aesDeOrigin', label: 'AES解密' },
  ],
  fatfs: [
    { value: 'decryptFs', label: '解密（附件）' },
    { value: 'encryptFs', label: '加密（附件）' },
  ],
}

const modeOptions = [
  { value: 'database', label: '数据库模式' },
  { value: 'business', label: '业务模式' },
  { value: 'fatfs', label: '附件模式' },
]

export type ModeSelect = 'database' | 'business' | 'fatfs';
type SelectValue = typeof selectOptions[keyof typeof selectOptions][number]['value'];

export function PasswordComponent() {
  // 取modeOptions的value 做枚举类型
  const [mode, setMode] = useState<ModeSelect>('database')
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')
  const [selectValue, setSelect] = useState<SelectValue>(
    selectOptions[mode][0].value,
  )

  const setSelectValue = () => {
    if (mode === 'database') {
      setSelect(selectOptions[mode][0].value)
    } else if (mode === 'business') {
      setSelect(selectOptions[mode][0].value)
    } else if (mode === 'fatfs') {
      setSelect(selectOptions[mode][0].value)
    }
  }

  useEffect(() => {
    setSelectValue()
  }, [mode])

  const options = selectOptions[mode]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsee/handlePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, aesEnOrDeType: selectValue }),
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
              处理结果: {data.result} ({selectValue})
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
        setSelectValue={setSelect}
        selectOptions={options}
        onSubmit={handleSubmit}
        result={result}
      />
    </div>
  )
}

