'use client'

import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function JiraPaginator({ page, pageSize, totalIssues }: {
  page: number
  pageSize: number
  totalIssues: number
}) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalIssues / pageSize)
  const hasRows = page <= totalPages

  function handlePageChange(pageNum: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', `${pageNum}`)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <div>
        Showing {hasRows ? (page - 1) * pageSize + 1 : 0} -{' '}
        {hasRows ? Math.min(page * pageSize, totalIssues) : 0} of {totalIssues}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Math.max(1, Math.min(totalPages, page - 1)))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4"/>
        </Button>
        <div>
          Page {totalPages ? page : 0} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4"/>
        </Button>
      </div>
    </>
  )
}
