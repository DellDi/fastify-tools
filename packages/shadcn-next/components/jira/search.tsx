'use client'
import { SAAS_JQL_3M } from '@/utils/jira/jql'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function SearchJiraComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [query, setSearchTerm] = useState(searchParams.get('query') || SAAS_JQL_3M)

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
    <div className="flex w-full h-20 py-2 items-center justify-start">
      <Textarea
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mr-2 border-2 shadow-xs flex-1"
        value={query}
        placeholder="Search Jira Issues"
      />
      <Button onClick={
        () => handleSearch(query)
      }>Search</Button>
    </div>
  )
}
