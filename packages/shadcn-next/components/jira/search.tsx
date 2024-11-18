'use client'
// 新增客户端组件、查询search组件
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'


export default function SearchJiraComponent() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [query, setSearchTerm] = useState(searchParams.get('query') || '')

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex h-20 py-2 items-center justify-start">
      <Textarea
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mr-2 border-2 shadow-sm flex-1"
        value={query}
        defaultValue={query}
        placeholder="Search Jira Issues"
      />
      <Button onClick={
        () => handleSearch(query)
      }>Search</Button>
    </div>
  )
}
