import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export interface JiraIssue {
  key: string
  fields: {
    summary: string
    status: {
      name: string
    }
    fixVersions: [
      {
        name: string
      }
    ]
    labels: string[]
    customfield_10000?: {
      value: string,
      id: number
    },
    customFieldCode?: number
    creator: {
      displayName: string
    }
    assignee: {
      displayName: string
    }
    created: string
  }
}

export interface JiraResponse {
  issues: JiraIssue[]
  total: number
}

export async function POST(req: NextRequest) {
  const { jql, secondaryPage, secondaryPageSize } = await req.json().catch(() => null) ?? {}
  if (typeof jql !== 'string' || !jql.trim() ||
      !Number.isSafeInteger(secondaryPage) || secondaryPage < 1 ||
      !Number.isSafeInteger(secondaryPageSize) || secondaryPageSize < 1 || secondaryPageSize > 1000) {
    return NextResponse.json({ message: 'JQL 或分页参数无效' }, { status: 400 })
  }

  try {
    const data: JiraResponse = await fastifyFetch('/jira/search', {
      method: 'POST',
      body: JSON.stringify({
        jql,
        saasOnly: true,
        startAt: (secondaryPage - 1) * secondaryPageSize,
        maxResults: secondaryPageSize,
      }),
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Jira SaaS 查询失败:', error)
    return NextResponse.json({ message: '获取 Jira 工单失败' }, { status: 502 })
  }
}
