import { Metadata } from 'next'
import { DashboardClient } from './dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: '服务器资源运行状态看板。',
}

export default function DashboardPage() {
  return <DashboardClient />
}
