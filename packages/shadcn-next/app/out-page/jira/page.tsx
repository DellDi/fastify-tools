import JiraIssuesTable from '@/app/(main)/jira/personal/page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS专用工单',
  description: 'SaaS专用工单筛选器',
  icons: 'https://qw.yswg360.com/api/fastdfs/fastdfs/pictureUrl?fileId=aTNanGuCnThUvxMQT3Xv5Q%3D%3D',
}

export default function jiraPage() {
  return (
    <JiraIssuesTable/>
  )
}
