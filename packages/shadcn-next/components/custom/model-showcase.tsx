'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 更新后的模拟数据
const models = [
  {
    id: 1,
    title: 'GPT-4',
    logo: '/placeholder.svg?height=50&width=50',
    totalCredit: 1000,
    availableCredit: 750,
    description: '最先进的语言模型，能够理解和生成人类水平的文本。',
    debtInfo: null,
    docUrl: 'https://example.com/gpt4-docs',
  },
  {
    id: 2,
    title: 'DALL-E 2',
    logo: '/placeholder.svg?height=50&width=50',
    totalCredit: 500,
    availableCredit: 200,
    description: '强大的图像生成AI，可以从文本描述创建独特的图像。',
    debtInfo: null,
    docUrl: 'https://example.com/dalle2-docs',
  },
  {
    id: 3,
    title: 'Whisper',
    logo: '/placeholder.svg?height=50&width=50',
    totalCredit: 300,
    availableCredit: 0,
    description: '高精度的语音识别模型，支持多种语言。',
    debtInfo: '欠费 ¥50',
    docUrl: 'https://example.com/whisper-docs',
  },
  {
    id: 4,
    title: 'Codex',
    logo: '/placeholder.svg?height=50&width=50',
    totalCredit: 800,
    availableCredit: 600,
    description: '专门用于理解和生成代码的AI模型。',
    debtInfo: null,
    docUrl: 'https://example.com/codex-docs',
  },
]

const ModelCard = ({ model }) => {
  const creditPercentage = (model.availableCredit / model.totalCredit) * 100
  const gradientClass = creditPercentage > 50
    ? 'from-green-500 to-blue-500'
    : creditPercentage > 20
      ? 'from-yellow-500 to-orange-500'
      : 'from-red-500 to-pink-500'

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/25 group relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-20 group-hover:opacity-30 transition-all duration-300 ease-in-out`}/>
      <CardHeader className="flex flex-row items-center gap-4">
        <img src={model.logo} alt={`${model.title} logo`} className="w-12 h-12 rounded-full"/>
        <div>
          <CardTitle>{model.title}</CardTitle>
          <CardDescription>{model.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">可用额度</span>
            <span className="text-sm font-medium">{model.availableCredit} / {model.totalCredit} 积分</span>
          </div>
          <Progress value={creditPercentage} className="h-2"/>
        </div>
        {model.debtInfo && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4"/>
            {model.debtInfo}
          </Badge>
        )}
        <Button variant="outline" className="w-full group" asChild>
          <a href={model.docUrl} target="_blank" rel="noopener noreferrer">
            查看文档
            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"/>
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ModelShowcase() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-8 text-center">AI 模型展示</h1>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {models.map(model => (
            <ModelCard key={model.id} model={model}/>
          ))}
        </div>
      </div>
    </div>
  )
}
