'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Send, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  '帮我总结本周的 Jira 工单进展',
  '根据描述生成一个 Jira 工单',
  '这段报错日志可能是什么原因',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pending])

  const send = (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || pending) return
    setInput('')
    setMessages((m) => [...m, { id: Date.now(), role: 'user', content }])
    setPending(true)
    // TODO: 接入 /dify/chat-workflow 后替换为真实流式回复
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '对话服务尚未连接。请在 Fastify 服务中配置 Dify API 后重试。',
        },
      ])
      setPending(false)
    }, 800)
  }

  return (
    <div className="mx-auto flex h-full max-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">AI 对话</h1>
            <p className="text-xs text-muted-foreground">接入 Dify 工作流的智能助手</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMessages([])}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" /> 新对话
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div className="text-center">
              <p className="font-medium">开始一段新对话</p>
              <p className="mt-1 text-sm text-muted-foreground">
                试试下面的一个问题
              </p>
            </div>
            <div className="grid w-full max-w-md gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border bg-card px-4 py-3 text-left text-sm text-muted-foreground shadow-card transition-all duration-200 hover:-translate-y-px hover:bg-accent/60 hover:text-foreground hover:shadow-lift"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    m.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground'
                        : 'max-w-[80%] rounded-2xl rounded-tl-sm border bg-card px-4 py-2.5 text-sm leading-relaxed shadow-card'
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border bg-card px-4 py-3 shadow-card">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border pb-2 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行"
            rows={2}
            className="max-h-32 min-h-[44px] flex-1 resize-none bg-card"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || pending}
            className="h-10 w-10 shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
