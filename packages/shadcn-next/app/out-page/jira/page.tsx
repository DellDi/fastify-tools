import JiraIssuesTablePage from '@/app/(main)/jira/personal/page'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InvoicesTableSkeleton } from '@/components/jira/tableSkeleton'
import { SAAS_JQL_3M } from '@/utils/jira/jql'

export const experimental_ppr = true

export const metadata: Metadata = {
  title: 'SaaS专用工单',
  description: 'SaaS专用工单筛选器',
  icons:
    'https://qw.yswg360.com/api/fastdfs/fastdfs/pictureUrl?fileId=aTNanGuCnThUvxMQT3Xv5Q%3D%3D',
}

export default async function jiraPage() {
  return (
    <Suspense fallback={<InvoicesTableSkeleton pageSize={40} />}>
      <JiraIssuesTablePage page={1} pageSize={40} query={SAAS_JQL_3M} />
    </Suspense>
  )
}
