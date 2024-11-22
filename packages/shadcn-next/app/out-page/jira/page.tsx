import JiraIssuesTablePage from '@/app/(main)/jira/personal/page'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InvoicesTableSkeleton } from '@/components/jira/tableSkeleton'

export const experimental_ppr = true

export const metadata: Metadata = {
  title: 'SaaS专用工单',
  description: 'SaaS专用工单筛选器',
  icons: 'https://qw.yswg360.com/api/fastdfs/fastdfs/pictureUrl?fileId=aTNanGuCnThUvxMQT3Xv5Q%3D%3D',
}

export default async function jiraPage({ searchParams }: { searchParams?: Promise<{ query?: string; pageSize?: string; page?: string }> }) {
  return (
    <Suspense fallback={<InvoicesTableSkeleton pageSize={40}/>}>
      <JiraIssuesTablePage searchParams={searchParams}/>
    </Suspense>
  )
}
