"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast";

export function PasswordComponent() {
  // 原始模式
  const [aesEnOrDeType, setAesEnOrDeType] = useState('decrypt')
  const [contentAes, setContentAes] = useState('')
  // 业务模式
  const [sqlAesValue, setSqlAesValue] = useState('aesEnOrigin')
  const [content, setContent] = useState('')

  const [result, setResult] = useState('')
  const [resultSQL, setResultSQL] = useState('')

  const handleSubmit = async (e: React.FormEvent, type: string = 'aes') => {
    e.preventDefault()
    // 这里应该是实际的API调用
    const contentVal = type === 'sql' ? contentAes : content
    const aesOrDeTypeVal = type === 'sql' ? sqlAesValue : aesEnOrDeType

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsee/handlePassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: contentVal, aesEnOrDeType: aesOrDeTypeVal }),
    })
    const data = await response.json()
    if (type === 'sql') {
      setResultSQL(data.result)
    } else {
      setResult(data.result)
    }

    const statusFail = data.statusCode !== 200
    toast({
      title: statusFail ? '解析异常' : '解析成功',
      variant: statusFail ? 'destructive' : 'default',
      description: statusFail ? `${data.code}:${data.message}` : (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
          <code className="text-white whitespace-pre-wrap break-words">
            处理结果: {data.result} ({aesOrDeTypeVal})
          </code>
        </pre>)
      ,
      duration: 1500
    })
  }

  return (
      <div className="grid gap-8 md:grid-cols-2 sm:grid-cols-1">
        <Card className="w-full max-w-md mx-auto text-left">
          <CardHeader>
            <CardTitle>数据库模式</CardTitle>
            <CardDescription>原生数据库加密的解密方式：支持加密和解密</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">需要处理的字符串</Label>
                <Input
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="输入需要处理的字符串"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aesEnOrDeType">处理类型</Label>
                <Select value={aesEnOrDeType} onValueChange={setAesEnOrDeType}>
                  <SelectTrigger id="aesEnOrDeType">
                    <SelectValue placeholder="选择处理类型"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decrypt">解密（数据库）</SelectItem>
                    <SelectItem value="encrypt">加密（数据库）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">处理</Button>
            </form>
            {result && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                  <p className="text-sm font-medium">{result}</p>
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full max-w-md mx-auto text-left">
          <CardHeader>
            <CardTitle>业务模式</CardTitle>
            <CardDescription>接口和页面默认支持的密码加密模式、解密模式</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, 'sql')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">需要处理的字符串</Label>
                <Input
                    id="content"
                    value={contentAes}
                    onChange={(e) => setContentAes(e.target.value)}
                    placeholder="输入需要处理的字符串"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqlAesValue">处理类型</Label>
                <Select value={sqlAesValue} onValueChange={setSqlAesValue}>
                  <SelectTrigger id="sqlAesValue">
                    <SelectValue placeholder="选择处理类型"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aesEnOrigin">AES加密</SelectItem>
                    <SelectItem value="aesDeOrigin">AES解密</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">处理</Button>
            </form>
            {resultSQL && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                  <Label htmlFor="content">结果</Label>
                  <p className="text-sm font-medium">{resultSQL}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
