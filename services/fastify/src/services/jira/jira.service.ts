import { FastifyInstance } from 'fastify'
import { request } from 'undici'
import { JiraRestService } from './jira-rest.service.js'
import { fastifyCache } from '@/utils/cache.js'
import { createHash } from 'crypto'

export interface JiraLoginCredentials {
  jiraUser: string
  jiraPassword: string
}

export interface JiraCreateTicketData {
  title: string
  description: string
  assignee?: string
  customerName?: string
  customAutoFields?: Record<string, any>
}

export interface JiraUpdateTicketData {
  issueIdOrKey: string
  fields: Record<string, any>
}

export interface JiraCreateTicketResponse {
  issueId: string
  issueKey: string
  issueUrl: string
  updateMsg: string
}

export interface JiraSession {
  cookies: string
  atlToken: string
}

/**
 * JiraService - A high-level service that encapsulates all Jira operations
 * Handles authentication, session management, and business logic
 */
export class JiraService {
  private jiraRestService: JiraRestService

  constructor(private fastify: FastifyInstance) {
    this.jiraRestService = new JiraRestService(fastify)
  }

  /**
   * Generate user-specific cache key for session
   */
  private getSessionKey(jiraUser: string): string {
    return `jira-session-${createHash('md5').update(jiraUser).digest('hex')}`
  }

  /**
   * Login to Jira and cache session information
   */
  async login(credentials: JiraLoginCredentials): Promise<JiraSession> {
    const sessionKey = this.getSessionKey(credentials.jiraUser)
    const session = fastifyCache.get(sessionKey) || {}
    if (session.cookies && session.atlToken) {
      return { cookies: session.cookies, atlToken: session.atlToken }
    }

    const jiraUrl = 'http://bug.new-see.com:8088/rest/auth/1/session'

    try {
      const loginResponse = await request(jiraUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.jiraUser,
          password: credentials.jiraPassword,
        }),
      })

      if (loginResponse.statusCode !== 200) {
        throw new Error('Login failed')
      }

      // Extract cookies from response
      const setCookieHeader = loginResponse.headers['set-cookie'] ?? []
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
            .map((cookie: string) => cookie.split(';')[0])
            .join(';')
        : setCookieHeader.split(';')[0]

      // Extract XSRF token
      let atlToken = ''
      if (Array.isArray(setCookieHeader)) {
        const xsrfCookie = setCookieHeader.find((cookie) =>
          cookie.startsWith('atlassian.xsrf.token=')
        )
        if (xsrfCookie) {
          atlToken = xsrfCookie.split(';')[0].split('=')[1]
        }
      }

      const sessionData: JiraSession = { cookies, atlToken }
      fastifyCache.set(sessionKey, sessionData)
      
      return sessionData
    } catch (error) {
      this.fastify.log.error('Jira login error:', error)
      throw new Error(`Jira 登录失败: ${error}`)
    }
  }

  /**
   * Get cached session or login if needed
   */
  private async getSession(credentials: JiraLoginCredentials): Promise<JiraSession> {
    const sessionKey = this.getSessionKey(credentials.jiraUser)
    const session = fastifyCache.get(sessionKey)
    if (session?.cookies && session?.atlToken) {
      return session
    }
    return this.login(credentials)
  }

  /**
   * Create a Jira ticket with all necessary steps
   */
  async createTicket(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData
  ): Promise<JiraCreateTicketResponse> {
    try {
      // Login and get session
      const session = await this.getSession(credentials)

      // Get metadata for custom fields
      const metaResponse = await this.jiraRestService.createMeta(
        'V10',
        '4',
        session.cookies,
        25,
        0
      )

      // Generate custom field information
      const genCustomInfo = await this.jiraRestService.genCustomInfo(
        metaResponse.values,
        data.title,
        data.description
      )

      this.fastify.log.info(genCustomInfo, 'genCustomInfo')

      // Create the issue
      const createResponse = await this.jiraRestService.createIssue(
        {
          title: data.title,
          description: data.description,
          assignee: data.assignee,
          customAutoFields: {
            ...genCustomInfo,
            ...data.customAutoFields,
          },
        },
        session.cookies
      )

      if (!createResponse.id || !createResponse.key) {
        throw new Error('创建 Jira 工单返回数据缺少必要字段')
      }

      // Update ticket with additional information if needed
      if (data.customerName) {
        const customInfo = this.jiraRestService.getCustomInfo(
          metaResponse.values,
          data.customerName
        )
        
        if (Object.keys(customInfo).length > 0) {
          await this.updateTicket(credentials, {
            issueIdOrKey: createResponse.key,
            fields: customInfo,
          })
        }
      }

      return {
        issueId: createResponse.id,
        issueKey: createResponse.key,
        issueUrl: `http://bug.new-see.com:8088/browse/${createResponse.key}`,
        updateMsg: '工单创建成功',
      }
    } catch (error) {
      this.fastify.log.error('Create ticket error:', error)
      throw new Error(`创建 Jira 工单失败: ${error}`)
    }
  }

  /**
   * Update a Jira ticket
   */
  async updateTicket(
    credentials: JiraLoginCredentials,
    data: JiraUpdateTicketData
  ): Promise<{ message: string }> {
    try {
      const session = await this.getSession(credentials)

      const updateResponse = await request(
        `http://bug.new-see.com:8088/rest/api/2/issue/${data.issueIdOrKey}`,
        {
          method: 'PUT',
          headers: {
            Cookie: session.cookies,
            Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: data.fields,
          }),
        }
      )

      if (updateResponse?.statusCode !== 204) {
        throw new Error(
          `更新失败: ${updateResponse?.statusCode} - ${JSON.stringify(data)}`
        )
      }

      return {
        message: `Jira 工单：${data.issueIdOrKey} 已经更新成功，涉及字段：${Object.keys(
          data.fields
        ).join(',')}`,
      }
    } catch (error) {
      this.fastify.log.error('Update ticket error:', error)
      throw new Error(`更新 Jira 工单失败: ${error}`)
    }
  }

  /**
   * Get metadata for creating tickets
   */
  async getCreateMeta(
    credentials: JiraLoginCredentials,
    projectKey: string = 'V10',
    issueTypeId: string = '4',
    maxResults: number = 25,
    startAt: number = 0
  ) {
    try {
      const session = await this.getSession(credentials)
      
      return await this.jiraRestService.createMeta(
        projectKey,
        issueTypeId,
        session.cookies,
        maxResults,
        startAt
      )
    } catch (error) {
      this.fastify.log.error('Get create meta error:', error)
      throw new Error(`获取 Jira 元数据失败: ${error}`)
    }
  }

  /**
   * Create and update ticket with labels (used by dify route)
   */
  async createTicketWithLabels(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData & { labels?: string }
  ): Promise<JiraCreateTicketResponse> {
    const result = await this.createTicket(credentials, data)

    // Update with labels if provided
    if (data.labels) {
      const labelArr = data.labels.split(',').filter(label => label.trim())
      if (labelArr.length > 0) {
        await this.updateTicket(credentials, {
          issueIdOrKey: result.issueKey,
          fields: { labels: labelArr },
        })
      }
    }

    return result
  }
}
