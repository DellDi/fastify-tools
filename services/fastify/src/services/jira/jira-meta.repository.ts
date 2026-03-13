import { FastifyInstance } from 'fastify'
import { request } from 'undici'
import { JiraMeta } from '@/schema/jira/meta.js'
import { fastifyCache } from '@/utils/cache.js'
import { getCacheConfig, getJiraConfig } from '@/utils/config-helpers.js'
import type {
  JiraComponent,
  JiraIssueType,
  JiraProject,
  JiraVersion,
} from './types.js'

export class JiraMetaRepository {
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private cacheConfig: ReturnType<typeof getCacheConfig>

  constructor(fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
    this.cacheConfig = getCacheConfig(fastify)
  }

  async getProjects(cookies: string): Promise<JiraProject[]> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-projects`
    const cached = fastifyCache.get(cacheKey) as JiraProject[] | undefined
    if (cached) {
      return cached
    }

    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/project`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取项目列表失败: HTTP ${response.statusCode}`)
    }

    const projects = (await response.body.json()) as JiraProject[]
    fastifyCache.set(cacheKey, projects)

    return projects
  }

  async getIssueTypes(
    projectKey: string,
    cookies: string,
  ): Promise<{ issueTypes: JiraIssueType[]; components: JiraComponent[] }> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-issuetypes-${projectKey}`
    const cached = fastifyCache.get(cacheKey) as
      | { issueTypes: JiraIssueType[]; components: JiraComponent[] }
      | undefined
    if (cached) {
      return cached
    }

    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/project/${projectKey}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取问题类型失败: HTTP ${response.statusCode}`)
    }

    const projectData = (await response.body.json()) as {
      issueTypes: JiraIssueType[]
      components: JiraComponent[]
    }
    const issueTypes = projectData.issueTypes || []
    const components = projectData.components || []
    fastifyCache.set(cacheKey, { issueTypes, components })
    return { issueTypes, components }
  }

  async createMeta(
    projectKey: string,
    issueTypeId: string,
    cookies: string,
    maxResults: number,
    startAt: number,
  ) {
    const metaCacheKey = `${this.cacheConfig.metaPrefix}-${projectKey}-${issueTypeId}-${maxResults}-${startAt}`
    const metaInfo = fastifyCache.get(metaCacheKey)
    if (metaInfo) {
      return metaInfo
    }

    const requestCreateMeta = await request(
      `${this.jiraConfig.endpoints.createMeta}/${projectKey}/issuetypes/${issueTypeId}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check',
        },
        query: {
          maxResults,
          startAt,
        },
      },
    )

    if (requestCreateMeta.statusCode !== 200) {
      throw new Error(`HTTP ${requestCreateMeta.statusCode}`)
    }

    const responseBody = (await requestCreateMeta.body.json()) as {
      maxResults: number
      startAt: number
      total: number
      isLast: boolean
      values: JiraMeta[]
    }

    const result = {
      maxResults,
      startAt,
      total: responseBody.total,
      isLast: responseBody.isLast,
      values: responseBody.values,
    }

    fastifyCache.set(metaCacheKey, result)

    return result
  }

  async getProjectVersions(
    projectKey: string,
    cookies: string,
    status?: 'released' | 'unreleased' | 'archived',
  ): Promise<JiraVersion[]> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-versions-${projectKey}-${status || 'all'}`
    const cached = fastifyCache.get(cacheKey) as JiraVersion[] | undefined
    if (cached) {
      return cached
    }

    let url = `${this.jiraConfig.baseUrl}/rest/api/2/project/${projectKey}/versions`
    if (status) {
      url += `?status=${status}`
    }

    const response = await request(url, {
      method: 'GET',
      headers: {
        Cookie: cookies,
        Authorization: this.jiraConfig.auth.proxyAuthToken,
        'Content-Type': 'application/json',
      },
    })

    if (response.statusCode !== 200) {
      throw new Error(`获取项目版本列表失败: HTTP ${response.statusCode}`)
    }

    const versions = (await response.body.json()) as JiraVersion[]
    fastifyCache.set(cacheKey, versions)

    return versions
  }
}
