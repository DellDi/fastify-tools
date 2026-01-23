import { FastifyInstance } from 'fastify'
import { request } from 'undici'
import { JiraRestService } from './jira-rest.service.js'
import { fastifyCache } from '@/utils/cache.js'
import { createHash } from 'crypto'
import { getJiraConfig, getCacheConfig } from '@/utils/config-helpers.js'
import {
  JiraLoginError,
  JiraCreateError,
  JiraUpdateError,
  ValidationError,
  JiraError,
} from '@/utils/errors.js'
import type {
  JiraLoginCredentials,
  JiraSession,
  JiraCreateTicketData,
  JiraUpdateTicketData,
  JiraCreateTicketResponse,
  DevReplyData,
  DevReplyResponse,
} from './types.js'

// 重新导出类型，保持向后兼容
export type {
  JiraLoginCredentials,
  JiraSession,
  JiraCreateTicketData,
  JiraUpdateTicketData,
  JiraCreateTicketResponse,
  DevReplyData,
  DevReplyResponse,
}

/**
 * JiraService - A high-level service that encapsulates all Jira operations
 * Handles authentication, session management, and business logic
 */
export class JiraService {
  private jiraRestService: JiraRestService
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private cacheConfig: ReturnType<typeof getCacheConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraRestService = new JiraRestService(fastify)
    this.jiraConfig = getJiraConfig(fastify)
    this.cacheConfig = getCacheConfig(fastify)
  }

  /**
   * Generate user-specific cache key for session
   */
  private getSessionKey(jiraUser: string): string {
    return `${this.cacheConfig.sessionPrefix}-${createHash('md5').update(jiraUser).digest('hex')}`
  }

  /**
   * Login to Jira and cache session information
   */
  async login(credentials: JiraLoginCredentials): Promise<JiraSession> {
    if (!credentials.jiraUser || !credentials.jiraPassword) {
      throw new ValidationError('缺少 Jira 登录凭据: jiraUser 和 jiraPassword')
    }

    const sessionKey = this.getSessionKey(credentials.jiraUser)
    const session = fastifyCache.get(sessionKey) || {}
    if (session.cookies && session.atlToken) {
      return { cookies: session.cookies, atlToken: session.atlToken }
    }

    const jiraUrl = this.jiraConfig.endpoints.session

    try {
      const loginResponse = await request(jiraUrl, {
        method: 'POST',
        headers: {
          // 使用 Nginx 代理认证
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.jiraUser,
          password: credentials.jiraPassword,
        }),
      })

      if (loginResponse.statusCode !== 200) {
        const errorMessages: Record<number, string> = {
          401: '用户名或密码错误',
          403: '账户被锁定或无权限访问',
          404: 'Jira 服务地址不正确',
          500: 'Jira 服务器内部错误',
        }
        const friendlyMsg =
          errorMessages[loginResponse.statusCode] || `未知错误`
        throw new JiraLoginError(
          `登录失败: ${friendlyMsg} (HTTP ${loginResponse.statusCode})`,
        )
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
          cookie.startsWith('atlassian.xsrf.token='),
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
      if (error instanceof JiraLoginError) {
        throw error
      }
      throw new JiraLoginError(`Jira 登录失败: ${error}`)
    }
  }

  /**
   * Get cached session or login if needed
   */
  public async getSession(
    credentials: JiraLoginCredentials,
  ): Promise<JiraSession> {
    const sessionKey = this.getSessionKey(credentials.jiraUser)
    const session = fastifyCache.get(sessionKey)
    if (session?.cookies && session?.atlToken) {
      return session
    }
    return this.login(credentials)
  }

  /**
   * 获取项目列表
   */
  async getProjects(credentials: JiraLoginCredentials) {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getProjects(session.cookies)
  }

  /**
   * 获取指定项目的问题类型列表
   */
  async getIssueTypes(credentials: JiraLoginCredentials, projectKey: string) {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getIssueTypes(projectKey, session.cookies)
  }

  /**
   * Create a Jira ticket with all necessary steps
   * 支持动态 projectKey 和 issueTypeId，以及 LLM 智能匹配
   */
  async createTicket(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData,
  ): Promise<JiraCreateTicketResponse> {
    if (!data.title || !data.description) {
      throw new ValidationError('缺少必需字段: title 和 description')
    }

    try {
      // Login and get session
      const session = await this.getSession(credentials)

      // 确定 projectKey 和 issueTypeId
      let projectKey = data.projectKey || this.jiraConfig.defaultProject
      let issueTypeId = data.issueTypeId || this.jiraConfig.defaultIssueType
      let matchInfo: JiraCreateTicketResponse['matchInfo'] | undefined

      // 如果启用智能匹配且未显式指定 project/issueType
      if (data.smartMatch && (!data.projectKey || !data.issueTypeId)) {
        try {
          const projects = await this.jiraRestService.getProjects(
            session.cookies,
          )
          const { issueTypes } = await this.jiraRestService.getIssueTypes(
            projectKey,
            session.cookies,
          )

          const match = await this.jiraRestService.matchProjectAndIssueType(
            data.matchPrompt || '',
            data.title,
            data.description,
            projects,
            issueTypes,
          )

          projectKey = match.projectKey
          issueTypeId = match.issueTypeId
          matchInfo = match

          this.fastify.log.info(
            `Smart match result: componentId=${match.componentId}, project=${projectKey}, issueType=${issueTypeId}, confidence=${match.confidence}`,
          )
        } catch (matchError) {
          this.fastify.log.warn(
            'Smart match failed, using defaults:',
            matchError,
          )
        }
      }

      // Get metadata for custom fields
      const metaResponse = await this.jiraRestService.createMeta(
        projectKey,
        issueTypeId,
        session.cookies,
        25,
        0,
      )

      // Generate custom field information
      const genCustomInfo = await this.jiraRestService.genCustomInfo(
        metaResponse.values,
        data.title,
        data.description,
      )

      this.fastify.log.info(genCustomInfo, 'genCustomInfo')

      // Create the issue with dynamic projectKey and issueTypeId
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
        session.cookies,
        { projectKey, issueTypeId, componentId: matchInfo?.componentId },
      )

      if (!createResponse.id || !createResponse.key) {
        throw new JiraCreateError('创建 Jira 工单返回数据缺少必要字段')
      }

      // Update ticket with additional information if needed
      if (data.customerName) {
        const customInfo = this.jiraRestService.getCustomInfo(
          metaResponse.values,
          data.customerName,
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
        issueUrl: `${this.jiraConfig.baseUrl}/browse/${createResponse.key}`,
        updateMsg: '工单创建成功',
        matchInfo,
      }
    } catch (error) {
      this.fastify.log.error('Create ticket error:', error)
      if (
        error instanceof JiraCreateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraCreateError(`创建 Jira 工单失败: ${error}`)
    }
  }

  /**
   * Update a Jira ticket
   */
  async updateTicket(
    credentials: JiraLoginCredentials,
    data: JiraUpdateTicketData,
  ): Promise<{ message: string }> {
    if (!data.issueIdOrKey || !data.fields) {
      throw new ValidationError('缺少必需字段: issueIdOrKey 和 fields')
    }

    try {
      const session = await this.getSession(credentials)

      const updateResponse = await request(
        `${this.jiraConfig.endpoints.updateIssue}/${data.issueIdOrKey}`,
        {
          method: 'PUT',
          headers: {
            Cookie: session.cookies,
            Authorization: this.jiraConfig.auth.proxyAuthToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: data.fields,
          }),
        },
      )

      if (updateResponse?.statusCode !== 204) {
        throw new JiraUpdateError(`更新失败: ${updateResponse?.statusCode}`)
      }

      return {
        message: `Jira 工单：${data.issueIdOrKey} 已经更新成功，涉及字段：${Object.keys(
          data.fields,
        ).join(',')}`,
      }
    } catch (error) {
      this.fastify.log.error('Update ticket error:', error)
      if (
        error instanceof JiraUpdateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraUpdateError(`更新 Jira 工单失败: ${error}`)
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
    startAt: number = 0,
  ) {
    try {
      const session = await this.getSession(credentials)

      return await this.jiraRestService.createMeta(
        projectKey,
        issueTypeId,
        session.cookies,
        maxResults,
        startAt,
      )
    } catch (error) {
      this.fastify.log.error('Get create meta error:', error)
      throw new JiraError(`获取 Jira 元数据失败: ${error}`)
    }
  }

  /**
   * Create and update ticket with labels (used by dify route)
   */
  async createTicketWithLabels(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData & { labels?: string; autoDevReply?: boolean },
  ): Promise<JiraCreateTicketResponse & { devReply?: DevReplyResponse }> {
    const result = await this.createTicket(credentials, data)

    // Update with labels if provided
    if (data.labels) {
      const labelArr = data.labels.split(',').filter((label) => label.trim())
      if (labelArr.length > 0) {
        await this.updateTicket(credentials, {
          issueIdOrKey: result.issueKey,
          fields: { labels: labelArr },
        })
      }
    }

    // 自动执行开发回复
    let devReplyResult: DevReplyResponse | undefined
    if (data.autoDevReply) {
      try {
        devReplyResult = await this.devReply(credentials, {
          issueKey: result.issueKey,
          projectKey:
            result.matchInfo?.projectKey ||
            data.projectKey ||
            this.jiraConfig.defaultProject,
          assignee: data.assignee || credentials.jiraUser,
        })
        this.fastify.log.info(`Dev reply completed for ${result.issueKey}`)
      } catch (devReplyError) {
        this.fastify.log.warn(
          `Dev reply failed for ${result.issueKey}:`,
          devReplyError,
        )
        devReplyResult = {
          success: false,
          issueKey: result.issueKey,
          message: `开发回复失败: ${devReplyError}`,
        }
      }
    }

    return {
      ...result,
      devReply: devReplyResult,
    }
  }

  /**
   * 执行开发回复工作流转换
   * 1. 获取项目版本列表，选择合适的修复版本
   * 2. 智能分配预计开发完成时间
   * 3. 执行工作流转换
   */
  async devReply(
    credentials: JiraLoginCredentials,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const session = await this.getSession(credentials)
    const { issueKey, projectKey, assignee } = data

    // 1. 获取项目版本列表，选择合适的修复版本
    let fixVersion = null
    let fixVersionId = data.fixVersionId

    if (!fixVersionId) {
      try {
        const versions = await this.jiraRestService.getProjectVersions(
          projectKey,
          session.cookies,
          'unreleased',
        )
        fixVersion = this.jiraRestService.selectFixVersion(versions)
        if (fixVersion) {
          fixVersionId = fixVersion.id
          this.fastify.log.info(
            `Selected fix version: ${fixVersion.name} (${fixVersion.id})`,
          )
        }
      } catch (error) {
        this.fastify.log.warn('Failed to get project versions:', error)
      }
    }

    // 2. 智能分配预计开发完成时间
    let devCompleteDate = data.devCompleteDate

    if (!devCompleteDate && fixVersion) {
      const versionDate = this.jiraRestService.parseVersionDate(fixVersion.name)
      if (versionDate) {
        try {
          devCompleteDate = await this.jiraRestService.allocateDevCompleteDate(
            session.cookies,
            assignee,
            versionDate,
          )
          this.fastify.log.info(
            `Allocated dev complete date: ${devCompleteDate}`,
          )
        } catch (error) {
          this.fastify.log.warn('Failed to allocate dev complete date:', error)
        }
      }
    }

    // 3. 获取可用的工作流转换
    const transitions = await this.jiraRestService.getTransitions(
      issueKey,
      session.cookies,
    )

    // 查找"开发回复"转换，默认使用 ID 11
    const transitionId = data.transitionId || '11'
    const targetTransition = transitions.find((t) => t.id === transitionId)

    if (!targetTransition) {
      // 尝试通过名称查找
      const devReplyTransition = transitions.find(
        (t) =>
          t.name.includes('开发回复') ||
          t.name.toLowerCase().includes('dev reply') ||
          t.name.toLowerCase().includes('development'),
      )

      if (!devReplyTransition) {
        this.fastify.log.warn(
          `Available transitions: ${transitions.map((t) => `${t.id}:${t.name}`).join(', ')}`,
        )
        throw new JiraError(`找不到开发回复工作流转换 (ID: ${transitionId})`)
      }
    }

    // 4. 构建转换字段
    const transitionFields: Record<string, any> = {
      ...data.additionalFields,
    }

    // 添加修复版本
    if (fixVersionId) {
      transitionFields.fixVersions = [{ id: fixVersionId }]
    }

    // 添加预计开发完成时间 (customfield_10022)
    if (devCompleteDate) {
      transitionFields.customfield_10022 = devCompleteDate
    }

    // 5. 执行工作流转换
    await this.jiraRestService.doTransition(
      issueKey,
      session.cookies,
      transitionId,
      Object.keys(transitionFields).length > 0 ? transitionFields : undefined,
      data.comment,
    )

    return {
      success: true,
      issueKey,
      fixVersionName: fixVersion?.name,
      devCompleteDate,
      transitionName: targetTransition?.name || '开发回复',
      message: `工单 ${issueKey} 已执行开发回复`,
    }
  }

  /**
   * 获取项目版本列表
   */
  async getProjectVersions(
    credentials: JiraLoginCredentials,
    projectKey: string,
    status?: 'released' | 'unreleased' | 'archived',
  ) {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getProjectVersions(
      projectKey,
      session.cookies,
      status,
    )
  }

  /**
   * 获取工单可用的工作流转换
   */
  async getTransitions(credentials: JiraLoginCredentials, issueKey: string) {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getTransitions(issueKey, session.cookies)
  }

  /**
   * 获取工单详情
   */
  async getIssueDetail<T = Record<string, any>>(
    credentials: JiraLoginCredentials,
    issueIdOrKey: string,
    fields?: string[],
  ): Promise<T> {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getIssueDetail<T>(
      issueIdOrKey,
      session.cookies,
      fields,
    )
  }
}
