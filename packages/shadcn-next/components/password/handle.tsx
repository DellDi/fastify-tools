"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast";

export default function Component() {
    const [content, setContent] = useState('')
    const [aesEnOrDeType, setAesEnOrDeType] = useState('decrypt')
    const [result, setResult] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // 这里应该是实际的API调用
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsee/handlePassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, aesEnOrDeType })
        })
        const data = await response.json()
        setResult(data.result)
        toast({
            title: '成功',
            description: `处理结果: ${content} (${aesEnOrDeType})`,
            duration: 3000,
        })
        // 模拟API响应
        setResult(`处理结果: ${content} (${aesEnOrDeType})`)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>密码处理</CardTitle>
                <CardDescription>零和加密、零和解密、AES加密、AES解密</CardDescription>
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
                                <SelectItem value="encrypt">加密（数据库SS）</SelectItem>
                                <SelectItem value="aesEnOrigin">AES加密</SelectItem>
                                <SelectItem value="aesDeOrigin">AES解密</SelectItem>
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
    )
}
