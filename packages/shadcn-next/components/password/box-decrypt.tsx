import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { type ModeSelect } from '@/components/password/handle'

interface PasswordCardProps {
  title: string
  description: string
  mode: string
  setMode: (string: ModeSelect) => void
  modeOptions: { value: string; label: string }[]
  content: string
  setContent: (value: string) => void
  selectValue: string
  setSelectValue: (value: string) => void
  selectOptions: { value: string; label: string }[]
  onSubmit: (e: React.FormEvent) => void
  result: string
}

export function PasswordCard({
  title,
  description,
  mode,
  setMode,
  modeOptions,
  content,
  setContent,
  selectValue,
  setSelectValue,
  selectOptions,
  onSubmit,
  result
}: PasswordCardProps) {
  const [isBatchInput, setIsBatchInput] = React.useState(false)

  return (
    <Card className="w-full max-w-md mx-auto text-left">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mode">处理模式</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger id="mode">
                <SelectValue placeholder="选择处理模式"/>
              </SelectTrigger>
              <SelectContent>
                {modeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="batch-input"
              checked={isBatchInput}
              onCheckedChange={setIsBatchInput}
            />
            <Label htmlFor="batch-input">批量输入</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">需要处理的字符串</Label>
            {isBatchInput ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入需要处理的字符串（每行一个）"
                required
              />
            ) : (
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入需要处理的字符串"
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="selectValue">处理类型</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger id="selectValue">
                <SelectValue placeholder="选择处理类型"/>
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">处理</Button>
        </form>
        {result && (
          <div className="mt-4 p-2 bg-gray-100 rounded dark:bg-gray-900">
            <Label htmlFor="result">结果</Label>
            <p className="text-sm font-medium">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

