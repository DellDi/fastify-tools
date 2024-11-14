'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react').catch(err => console.error('Failed to load Monaco Editor:', err)), { ssr: false })

export default function APITestingPlatform() {
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState({
    url: 'https://culture.hnbxwhy.com/report/send',
    callCount: 1,
    method: 'POST',
    jsonParams: {
      'gCategory': 3,
      'venueId': 10325,
      'relId': 193559,
      'areaCode': '411300',
      'url': 'pages/resource/soundDetails_1',
      'userId': '',
      'source': 1,
      'accessUrl': 'pages/resource/soundDetails_1',
      'ip': '',
      'lng': '112.5283',
      'lat': '32.9908',
    },
    results: {
      success: 0,
      fail: 0,
      failReasons: [] as string [],
    },
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setValue(0)
    setInitialData(
      {
        ...initialData,
        results: {
          success: 0,
          fail: 0,
          failReasons: [] as string [],
        },
      },
    )
    setLoading(true)
    const form = initialData
    const url = form.url
    const callCount = form.callCount
    const method = form.method
    const jsonParams = form.jsonParams
    const results = {
      success: 0,
      fail: 0,
      failReasons: [] as string [],
    }
    for (let i = 0; i < callCount; i++) {
      try {
        // userId 模拟 20-2000 之间的随机数, 如何大于1000返回""
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...jsonParams, userId: Math.random() * 2000 > 1000 ? '' : Math.floor(Math.random() * 2000) }),
        })
        if (response.ok) {
        } else {
          results.fail++
          results.failReasons.push(`第 ${i + 1} 次调用失败，状态码: ${response.status}`)
        }

        const body = await response.json() as unknown as { code: number, msg: string, data: string | null }
        if (body.code === 0) {
          results.success++
        } else {
          results.fail++
          results.failReasons.push(`第 ${i + 1} 次调用失败，错误信息: ${body.msg}`)
        }
      } catch (error) {
        results.fail++
        results.failReasons.push(`第 ${i + 1} 次调用失败，错误信息: ${error}`)
      }
      // callCount换算值,向上取整最大值是100
      setValue(Math.ceil(((i + 1) / callCount) * 100))
    }
    setInitialData({
      ...initialData,
      results,
    })
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">河南百姓云-访问平台</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API测试参数</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/test" method="POST" className="space-y-4">
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={initialData.url}
                  onChange={(e) => setInitialData({ ...initialData, url: e.target.value })}
                  placeholder="请输入API URL"
                />
              </div>
              <div>
                <Label htmlFor="callCount">调用次数</Label>
                <Input
                  id="callCount"
                  name="callCount"
                  type="number"
                  value={initialData.callCount}
                  onChange={(e) => setInitialData({ ...initialData, callCount: Number(e.target.value) })}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="method">调用方法</Label>
                <Select name="method" defaultValue={initialData.method}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择调用方法"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jsonParams">JSON参数</Label>
                <div className="h-64 border rounded-md overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="json"
                    value={JSON.stringify(initialData.jsonParams, null, 2)}
                    onChange={(value) => setInitialData({ ...initialData, jsonParams: JSON.parse(value || '') })}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
              <Button onClick={(e) => handleSubmit(e)} className="w-full">
                开始测试
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent className={`mx-0 flex flex-col justify-center items-center`}>
            {loading && (
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={value}
                gaugePrimaryColor="rgb(79 70 229)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
              />
            )}
            {initialData.results && !loading ? (
              <>
                <div className="flex w-full space-x-2 mb-2 mt-4">
                  <CheckCircle className="text-green-500"/>
                  <span>成功: {initialData.results.success} 条</span>
                </div>
                <div className="flex w-full space-x-2 mb-4">
                  <AlertCircle className="text-red-500"/>
                  <span>失败: {initialData.results.fail} 条</span>
                </div>
                {initialData.results.failReasons.length > 0 && (
                  <div className={`text-left shadow`}>
                    <h3 className="font-semibold mb-2">失败原因:</h3>
                    <ul className="list-disc p-2">
                      {initialData.results.failReasons.map((reason, index) => (
                        <li key={index} className="text-red-500">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground">尚未进行测试</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
