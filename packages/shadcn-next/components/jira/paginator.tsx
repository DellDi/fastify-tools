'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { jiraPageTotal } from '@/utils/fetch/jira/jira-api'

export function JiraPaginator() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [query] = useState(searchParams.get('query') || '')
  const [page, setPage] = useState(+(searchParams.get('page') || '') || 1)
  const [pageSize] = useState(+(searchParams.get('pageSize') || '') || 50)
  const [totalIssues, setTotalIssues] = useState(0)

  useEffect(() => {
    jiraPageTotal().then(r => {
      setTotalIssues(r.total)
    })
  }, [query])

  const totalPages = Math.ceil(totalIssues / pageSize)

  function handlePageChange(pageNum: number) {
    const params = new URLSearchParams(searchParams)
    if (pageNum) {
      setPage(pageNum)
      params.set('page', `${pageNum}`)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <div>
        Showing {(page - 1) * pageSize + 1} -{' '}
        {Math.min(page * pageSize, totalIssues)} of {totalIssues}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4"/>
        </Button>
        <div>
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4"/>
        </Button>
      </div>
    </>
  )
}
