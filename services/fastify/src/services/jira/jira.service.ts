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
  DevReplyBatchData,
  DevReplyBatchResponse,
  DevReplyStepName,
  DevReplyStepResult,
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
  DevReplyBatchData,
  DevReplyBatchResponse,
  DevReplyStepName,
  DevReplyStepResult,
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
      this.fastify.log.error(`Jira login error: ${error instanceof Error ? error.message : String(error)}`)
      if (error instanceof JiraLoginError) {
        throw error
      }
      throw new JiraLoginError(`Jira 登录失败: ${error instanceof Error ? error.message : String(error)}`)
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

  private resolveCredentials(
    credentials?: Partial<JiraLoginCredentials>,
  ): JiraLoginCredentials {
    const config = (this.fastify as any).config || {}
    const jiraUser = credentials?.jiraUser || config.JIRA_USERNAME
    const jiraPassword = credentials?.jiraPassword || config.JIRA_PASSWORD

    if (!jiraUser || !jiraPassword) {
      throw new ValidationError('缺少 Jira 登录凭据: jiraUser 和 jiraPassword')
    }

    return {
      jiraUser,
      jiraPassword,
    }
  }

  private buildStepSummary(steps: DevReplyStepResult[]) {
    return {
      successfulSteps: steps
        .filter((step) => step.success)
        .map((step) => step.step),
      failedSteps: steps
        .filter((step) => !step.success)
        .map((step) => step.step),
    }
  }

  private buildDevReplyFailure(
    issueKey: string,
    message: string,
    steps: DevReplyStepResult[] = [],
    extra: Partial<DevReplyResponse> = {},
  ): DevReplyResponse {
    return {
      success: false,
      issueKey,
      message,
      ...extra,
      steps,
      ...this.buildStepSummary(steps),
    }
  }

  private async executeDevReplyWorkflow(
    session: JiraSession,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const { issueKey, projectKey, assignee } = data
    const steps: DevReplyStepResult[] = []
    const pushStep = (
      step: DevReplyStepName,
      success: boolean,
      message: string,
      data?: Record<string, any>,
    ) => {
      steps.push({ step, success, message, data })
    }

    try {
      let usedDates = new Set<string>()
      let maxUsedDate: string | undefined

      try {
        const jql = `assignee = "${assignee}" AND resolution = Unresolved ORDER BY cf[10022] ASC`
        const searchResult = await this.jiraRestService.searchIssuesByJql(
          jql,
          session.cookies,
          ['customfield_10022'],
        )
        usedDates = new Set(
          searchResult.issues
            .map((issue) => issue.fields.customfield_10022)
            .filter(Boolean),
        )
        maxUsedDate = this.jiraRestService.getMaxUsedDate(usedDates)
        this.fastify.log.info(
          `Found ${usedDates.size} used dates for ${assignee}, max: ${maxUsedDate || 'none'}`,
        )
        pushStep('queryUsedDates', true, '已完成已占用日期查询', {
          usedDateCount: usedDates.size,
          maxUsedDate,
        })
      } catch (error) {
        const message = `查询已占用日期失败: ${error instanceof Error ? error.message : String(error)}`
        this.fastify.log.warn(message)
        pushStep('queryUsedDates', false, message)
      }

      let fixVersion: { version: { id: string; name: string }; date: Date } | null = null
      let fixVersionId = data.fixVersionId

      if (fixVersionId) {
        pushStep('selectFixVersion', true, '使用请求指定的修复版本', {
          fixVersionId,
        })
      } else {
        try {
          const versions = await this.jiraRestService.getProjectVersions(
            projectKey,
            session.cookies,
            'unreleased',
          )
          fixVersion = this.jiraRestService.selectFixVersionSmart(
            versions,
            maxUsedDate,
          )
          if (fixVersion) {
            fixVersionId = fixVersion.version.id
            this.fastify.log.info(
              `Selected fix version: ${fixVersion.version.name} (${fixVersion.version.id})`,
            )
            pushStep('selectFixVersion', true, '已自动选择修复版本', {
              fixVersionId,
              fixVersionName: fixVersion.version.name,
            })
          } else {
            pushStep('selectFixVersion', false, '未找到可用的修复版本')
          }
        } catch (error) {
          const message = `获取项目版本失败: ${error instanceof Error ? error.message : String(error)}`
          this.fastify.log.warn(message)
          pushStep('selectFixVersion', false, message)
        }
      }

      let devCompleteDate = data.devCompleteDate

      if (devCompleteDate) {
        pushStep('allocateDevCompleteDate', true, '使用请求指定的预计开发完成时间', {
          devCompleteDate,
        })
      } else if (fixVersion) {
        try {
          const currentYear = new Date().getFullYear()
          const holidays = await this.jiraRestService.getHolidays(currentYear)
          const nextYearHolidays =
            fixVersion.date.getFullYear() > currentYear
              ? await this.jiraRestService.getHolidays(currentYear + 1)
              : new Set<string>()
          const allHolidays = new Set([...holidays, ...nextYearHolidays])
          const { findAvailableDate } = await import('./utils.js')
          devCompleteDate = findAvailableDate(
            fixVersion.date,
            usedDates,
            allHolidays,
          )
          this.fastify.log.info(
            `Allocated dev complete date: ${devCompleteDate}`,
          )
          pushStep('allocateDevCompleteDate', true, '已自动分配预计开发完成时间', {
            devCompleteDate,
          })
        } catch (error) {
          const message = `分配预计开发完成时间失败: ${error instanceof Error ? error.message : String(error)}`
          this.fastify.log.warn(message)
          pushStep('allocateDevCompleteDate', false, message)
        }
      } else {
        pushStep('allocateDevCompleteDate', false, '缺少可用修复版本，无法自动分配预计开发完成时间')
      }

      const transitionId = data.transitionId || '11'
      let resolvedTransitionId = transitionId
      let transitionName = '开发回复'

      try {
        const transitions = await this.jiraRestService.getTransitions(
          issueKey,
          session.cookies,
        )
        const matchedTransition =
          transitions.find((transition) => transition.id === transitionId) ||
          transitions.find(
            (transition) =>
              transition.name.includes('开发回复') ||
              transition.name.toLowerCase().includes('dev reply') ||
              transition.name.toLowerCase().includes('development'),
          )

        if (!matchedTransition) {
          this.fastify.log.warn(
            `Available transitions: ${transitions.map((transition) => `${transition.id}:${transition.name}`).join(', ')}`,
          )
          throw new JiraError(`找不到开发回复工作流转换 (ID: ${transitionId})`)
        }

        resolvedTransitionId = matchedTransition.id
        transitionName = matchedTransition.name
        pushStep('getTransitions', true, '已获取并匹配工作流转换', {
          transitionId: resolvedTransitionId,
          transitionName,
        })
      } catch (error) {
        const message = `获取工作流转换失败: ${error instanceof Error ? error.message : String(error)}`
        this.fastify.log.warn(message)
        pushStep('getTransitions', false, message)
        return this.buildDevReplyFailure(issueKey, message, steps, {
          fixVersionName: fixVersion?.version.name,
          devCompleteDate,
        })
      }

      const transitionFields: Record<string, any> = {
        ...data.additionalFields,
      }

      if (fixVersionId) {
        transitionFields.fixVersions = [{ id: fixVersionId }]
      }

      if (devCompleteDate) {
        transitionFields.customfield_10022 = devCompleteDate
      }

      try {
        await this.jiraRestService.doTransition(
          issueKey,
          session.cookies,
          resolvedTransitionId,
          Object.keys(transitionFields).length > 0 ? transitionFields : undefined,
          data.comment,
        )
        pushStep('doTransition', true, '工作流转换执行成功', {
          transitionId: resolvedTransitionId,
          transitionName,
        })
      } catch (error) {
        const message = `执行工作流转换失败: ${error instanceof Error ? error.message : String(error)}`
        this.fastify.log.warn(message)
        pushStep('doTransition', false, message)
        return this.buildDevReplyFailure(issueKey, message, steps, {
          fixVersionName: fixVersion?.version.name,
          devCompleteDate,
          transitionName,
        })
      }

      return {
        success: true,
        issueKey,
        fixVersionName: fixVersion?.version.name,
        devCompleteDate,
        transitionName,
        message: `工单 ${issueKey} 已执行开发回复`,
        steps,
        ...this.buildStepSummary(steps),
      }
    } catch (error) {
      const message = `开发回复执行异常: ${error instanceof Error ? error.message : String(error)}`
      this.fastify.log.error(message)
      return this.buildDevReplyFailure(issueKey, message, steps)
    }
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
            `Smart match failed, using defaults: ${matchError instanceof Error ? matchError.message : String(matchError)}`,
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
      this.fastify.log.error(`Create ticket error: ${error instanceof Error ? error.message : String(error)}`)
      if (
        error instanceof JiraCreateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraCreateError(`创建 Jira 工单失败: ${error instanceof Error ? error.message : String(error)}`)
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
      this.fastify.log.error(`Update ticket error: ${error instanceof Error ? error.message : String(error)}`)
      if (
        error instanceof JiraUpdateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraUpdateError(`更新 Jira 工单失败: ${error instanceof Error ? error.message : String(error)}`)
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
      this.fastify.log.error(`Get create meta error: ${error instanceof Error ? error.message : String(error)}`)
      throw new JiraError(`获取 Jira 元数据失败: ${error instanceof Error ? error.message : String(error)}`)
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
        if (devReplyResult.success) {
          this.fastify.log.info(`Dev reply completed for ${result.issueKey}`)
        } else {
          this.fastify.log.warn(`Dev reply failed for ${result.issueKey}: ${devReplyResult.message}`)
        }
      } catch (devReplyError) {
        this.fastify.log.warn(
          `Dev reply failed for ${result.issueKey}: ${devReplyError instanceof Error ? devReplyError.message : String(devReplyError)}`,
        )
        devReplyResult = {
          success: false,
          issueKey: result.issueKey,
          message: `开发回复失败: ${devReplyError instanceof Error ? devReplyError.message : String(devReplyError)}`,
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
    credentials: Partial<JiraLoginCredentials> | undefined,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const resolvedCredentials = this.resolveCredentials(credentials)

    try {
      const session = await this.getSession(resolvedCredentials)
      return await this.executeDevReplyWorkflow(session, data)
    } catch (error) {
      return this.buildDevReplyFailure(
        data.issueKey,
        `开发回复前置登录失败: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async devReplyBatch(
    credentials: Partial<JiraLoginCredentials> | undefined,
    data: DevReplyBatchData,
  ): Promise<DevReplyBatchResponse> {
    if (!data.issueKeys.length) {
      throw new ValidationError('issueKeys 不能为空')
    }

    const resolvedCredentials = this.resolveCredentials(credentials)

    let session: JiraSession
    try {
      session = await this.getSession(resolvedCredentials)
    } catch (error) {
      const message = `开发回复前置登录失败: ${error instanceof Error ? error.message : String(error)}`
      const results = data.issueKeys.map((issueKey) =>
        this.buildDevReplyFailure(issueKey, message),
      )

      return {
        total: results.length,
        successCount: 0,
        failureCount: results.length,
        successfulIssueKeys: [],
        failedIssueKeys: results.map((item) => item.issueKey),
        results,
      }
    }

    const settledResults = await Promise.allSettled(
      data.issueKeys.map((issueKey) =>
        this.executeDevReplyWorkflow(session, {
          issueKey,
          projectKey: data.projectKey,
          assignee: data.assignee,
          transitionId: data.transitionId,
          fixVersionId: data.fixVersionId,
          devCompleteDate: data.devCompleteDate,
          comment: data.comment,
          additionalFields: data.additionalFields,
        }),
      ),
    )

    const results = settledResults.map((result, index) =>
      result.status === 'fulfilled'
        ? result.value
        : this.buildDevReplyFailure(
            data.issueKeys[index],
            `开发回复执行异常: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`,
          ),
    )

    return {
      total: results.length,
      successCount: results.filter((item) => item.success).length,
      failureCount: results.filter((item) => !item.success).length,
      successfulIssueKeys: results
        .filter((item) => item.success)
        .map((item) => item.issueKey),
      failedIssueKeys: results
        .filter((item) => !item.success)
        .map((item) => item.issueKey),
      results,
    }
  }

  /**
   * 获取所有可用的工单链接类型
   */
  async getIssueLinkTypes(credentials: JiraLoginCredentials) {
    const session = await this.getSession(credentials)
    return this.jiraRestService.getIssueLinkTypes(session.cookies)
  }

  /**
   * 批量关联工单到目标工单（relates to）
   */
  async linkIssues(
    credentials: JiraLoginCredentials,
    sourceIssueKeys: string[],
    targetIssueKey: string,
    linkTypeName?: string,
  ): Promise<{ results: Array<{ issueKey: string; success: boolean; message: string }> }> {
    const session = await this.getSession(credentials)

    const results = await Promise.allSettled(
      sourceIssueKeys.map((key) =>
        this.jiraRestService.linkIssue(key, targetIssueKey, session.cookies, linkTypeName),
      ),
    )

    return {
      results: results.map((result, i) => ({
        issueKey: sourceIssueKeys[i],
        success: result.status === 'fulfilled',
        message:
          result.status === 'fulfilled'
            ? `${sourceIssueKeys[i]} 已关联到 ${targetIssueKey}`
            : (result.reason instanceof Error ? result.reason.message : String(result.reason)),
      })),
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
