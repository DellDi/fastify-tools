// `pages/api/jira-filtered.ts` 主要目的内置了过滤saas的客户名称
import { NextRequest, NextResponse } from 'next/server'
import { serviceCache } from '@/utils/store/service'

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

// 异步函数，直到回调函数被调用时才会resolve
let cachePromiseResolve: () => void
const cachePromise = new Promise<void>((resolve) => {
  cachePromiseResolve = resolve
})

export async function POST(req: NextRequest) {
  const { jql, jiraCookies, secondaryPage, secondaryPageSize } = await req.json()
  try {
    // Fetch all pages of data from the primary API
    let allIssues: JiraResponse['issues'] = []
    let startAt = 1
    const maxResults = 1000 // Adjust based on your primary API's max results per page

    while (true) {
      const response = await fetch(`${process.env.BASE_API_URL}/jira/search`, {
        headers: {
          Authorization: `Bearer bmV3c2VlOm5ld3NlZQ==`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          startAt,
          maxResults,
          jql,
          jiraCookies,
        }),
      })

      if (!response.ok) {
        return NextResponse.json({ message: 'Failed to fetch Jira issues' }, {
          status: 500,
        })
      }

      const data = await response.json()
      allIssues = allIssues.concat(data.issues)
      if (data.issues.length < maxResults) {
        break
      }
      startAt += maxResults
    }
    // Apply secondary filtering
    const filteredIssues = allIssues.filter((issue) => {
      if (issue.fields?.customFieldCode) {
        return issue.fields.customFieldCode >= 6000 && issue.fields.customFieldCode <= 7000
      }
      // 默认保留杭州新视窗的客户名称
      return issue.fields.customfield_10000?.id === 13163
    })

    // Apply secondary pagination
    const totalFilteredIssues = filteredIssues.length
    const start = (secondaryPage - 1) * secondaryPageSize
    const end = start + secondaryPageSize
    const paginatedIssues = filteredIssues.slice(start, end)

    serviceCache.set('pageJiraTotal', totalFilteredIssues)
    cachePromiseResolve() // Resolve the promise to indicate that the cache is set

    return NextResponse.json({
      total: totalFilteredIssues,
      issues: paginatedIssues,
    }, {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ message: JSON.stringify(error) }, {
      status: 500,
    })
  }
}

export async function GET() {
  await cachePromise // Wait for the cache to be set
  const total = serviceCache.get('pageJiraTotal')
  return NextResponse.json({ total: total ? total : 666 }, { status: 200 })
}
