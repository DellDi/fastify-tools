'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Clock, } from 'lucide-react'

interface JiraIssue {
  key: string
  fields: {
    summary: string
    status: {
      name: string
    }
    assignee: {
      displayName: string
    }
    created: string
  }
}

interface JiraResponse {
  issues: JiraIssue[]
  total: number
  maxResults: number
  startAt: number
}

export default function JiraIssuesTable() {
  const [jiraSql, setJiraSql] = useState<string>('resolution = Unresolved AND  labels in (SAAS202410)  ORDER BY resolution DESC, fixVersion ASC, cf[10022] ASC, updated DESC')
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [totalIssues, setTotalIssues] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchIssues()
  }, [page])

  async function fetchIssues() {
    setLoading(true)
    try {
      // First, login to Jira
      const loginResponse = await fetch('/api/jira-login', { method: 'POST' })
      if (!loginResponse.ok) {
        return new Error('Failed to login to Jira')
      }
      const { cookies, data: loginData } = await loginResponse.json()
      // Now use the token to fetch issues
      const startAt = (page - 1) * pageSize
      const issuesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jira/search`,
          {
            headers: {
              Authorization: `Bearer bmV3c2VlOm5ld3NlZQ==`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              startAt,
              maxResults: pageSize,
              jql: jiraSql,
              jiraCookies: cookies,
            }),
          }
      )
      if (!issuesResponse.ok) {
        throw new Error('Failed to fetch Jira issues')
      }
      const issuesData: JiraResponse = await issuesResponse.json()
      setIssues(issuesData.issues)
      setTotalIssues(issuesData.total)
    } catch (err) {
      setError('Error fetching Jira issues')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500"/>
      case 'in progress':
        return <Clock className="w-5 h-5 text-yellow-500"/>
      default:
        return <AlertCircle className="w-5 h-5 text-red-500"/>
    }
  }
  const totalPages = Math.ceil(totalIssues / pageSize)

  if (error) {
    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
    )
  }
  return (
      <div className="h-full flex flex-col flex-grow mx-auto">
        <Card className="w-full sm:w-full md:w-9/10 lg:w-3/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Jira Issues
              <div className="flex h-20 py-2 items-center justify-start">
                <Input
                    onChange={(e) => setJiraSql(e.target.value)}
                    className="max-w-sm mr-2 border-2 shadow-sm flex-1"
                    value={jiraSql}
                    placeholder="Search Jira Issues"
                />
                <Button onClick={
                  async () => {
                    await fetchIssues()
                  }
                }>Search</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            {loading ? (
                <div className="space-y-4 w-full">
                  {[...Array(pageSize)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 w-full">
                        <Skeleton className="h-20 w-20 rounded-full"/>
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-6 w-full"/>
                          <Skeleton className="h-6 w-3/4"/>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                        <TableRow
                            key={issue.key}
                            className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <Button variant="link" asChild className="p-0">
                              <a
                                  href={`http://bug.new-see.com:8088/browse/${issue.key}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                              >
                                {issue.key}
                              </a>
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            {issue.fields.summary}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(issue.fields.status.name)}
                              <span>{issue.fields.status.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{issue.fields.assignee.displayName}</TableCell>
                          <TableCell>
                            {new Date(issue.fields.created).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              Showing {(page - 1) * pageSize + 1} -{' '}
              {Math.min(page * pageSize, totalIssues)} of {totalIssues}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4"/>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}
