// `pages/api/jira-filtered.ts` 主要目的内置了过滤saas的客户名称
import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'
import { serviceCache } from '@/store/service'

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
let cachePromise = new Promise<void>((resolve) => {
  cachePromiseResolve = resolve
})

export async function POST(req: NextRequest) {
  const { jql, jiraCookies, secondaryPage, secondaryPageSize } = await req.json()

  if (!jiraCookies) {
    return NextResponse.json({ message: 'Missing jiraCookies' }, { status: 400 })
  }

  try {
    // Fetch all pages of data from the primary API
    let allIssues: JiraResponse['issues'] = []
    let startAt = 0 // Jira API starts at 0, not 1
    const maxResults = 100 // Reduce page size to avoid timeouts
    const MAX_PAGES = 10 // Limit total pages to fetch to avoid infinite loops or overly long requests

    let pageCount = 0
    while (true) {
      if (pageCount >= MAX_PAGES) {
        console.warn(`Reached maximum page limit of ${MAX_PAGES}. Stopping fetch.`)
        break
      }

      const response = await fastifyFetch(`/jira/search`, {
        headers: {
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

      if (!response || !response.issues) {
        console.error('Invalid response from Jira search API', response)
        return NextResponse.json({ message: 'Failed to fetch Jira issues' }, {
          status: 500,
        })
      }

      const data = response
      allIssues = allIssues.concat(data.issues)
      
      // If we got fewer issues than maxResults, we've reached the end
      if (data.issues.length < maxResults) {
        break
      }
      
      startAt += maxResults
      pageCount++
    }
    // SaaS客户的ID范围是6000-7000
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
  // 重置一个全新的resolve
  cachePromise = new Promise<void>((resolve) => {
    cachePromiseResolve = resolve
  })
  serviceCache.set('pageJiraTotal', 0)
  return NextResponse.json({ total: total ? total : 0 }, { status: 200 })
}
