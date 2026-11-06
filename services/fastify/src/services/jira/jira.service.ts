import { FastifyInstance } from 'fastify'
import { JiraRestService } from './jira-rest.service.js'
import { JiraSessionService } from './jira-session.service.js'
import { DevReplyUseCase } from './use-cases/dev-reply.use-case.js'
import { CreateTicketUseCase } from './use-cases/create-ticket.use-case.js'
import { CreateTicketWithLabelsUseCase } from './use-cases/create-ticket-with-labels.use-case.js'
import { UpdateTicketUseCase } from './use-cases/update-ticket.use-case.js'
import {
  JiraReconcileLogRepository,
  type ReconcileLogQuery,
} from './jira-reconcile-log.repository.js'
import { getJiraConfig } from '@/utils/config-helpers.js'
import { JiraError } from '@/utils/errors.js'
import type {
  JiraLoginCredentials,
  JiraSession,
  JiraCreateTicketData,
  JiraUpdateTicketData,
  JiraUploadAttachmentData,
  JiraUploadAttachmentResponse,
  JiraCreateTicketResponse,
  DevReplyData,
  DevReplyResponse,
  DevReplyBatchData,
  DevReplyBatchResponse,
} from './types.js'

// 重新导出类型，保持向后兼容
export type {
  JiraLoginCredentials,
  JiraSession,
  JiraCreateTicketData,
  JiraUpdateTicketData,
  JiraUploadAttachmentData,
  JiraUploadAttachmentResponse,
  JiraCreateTicketResponse,
  DevReplyData,
  DevReplyResponse,
  DevReplyBatchData,
  DevReplyBatchResponse,
}

/**
 * JiraService - A high-level service that encapsulates all Jira operations
 * Handles authentication, session management, and business logic
 */
export class JiraService {
  private jiraRestService: JiraRestService
  private jiraSessionService: JiraSessionService
  private devReplyUseCase: DevReplyUseCase
  private createTicketUseCase: CreateTicketUseCase
  private createTicketWithLabelsUseCase: CreateTicketWithLabelsUseCase
  private updateTicketUseCase: UpdateTicketUseCase
  private jiraReconcileLogRepository: JiraReconcileLogRepository
  private jiraConfig: ReturnType<typeof getJiraConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraRestService = new JiraRestService(fastify)
    this.jiraSessionService = new JiraSessionService(fastify)
    this.jiraReconcileLogRepository = new JiraReconcileLogRepository(fastify)
    this.jiraConfig = getJiraConfig(fastify)
    this.updateTicketUseCase = new UpdateTicketUseCase(
      fastify.log,
      this.jiraSessionService,
      this.jiraConfig,
    )
    this.devReplyUseCase = new DevReplyUseCase(
      fastify.log,
      this.jiraRestService,
      this.jiraSessionService,
      this.updateTicket.bind(this),
      this.jiraReconcileLogRepository.write.bind(
        this.jiraReconcileLogRepository,
      ),
    )
    this.createTicketUseCase = new CreateTicketUseCase(
      fastify.log,
      this.jiraRestService,
      this.jiraSessionService,
      this.jiraConfig,
      this.updateTicket.bind(this),
    )
    this.createTicketWithLabelsUseCase = new CreateTicketWithLabelsUseCase(
      fastify.log,
      this.jiraConfig,
      this.createTicket.bind(this),
      this.updateTicket.bind(this),
      this.devReply.bind(this),
    )
  }

  /**
   * Login to Jira and cache session information
   */
  async login(credentials: JiraLoginCredentials, force = false): Promise<JiraSession> {
    return this.jiraSessionService.login(credentials, force)
  }

  /**
   * Get cached session or login if needed
   */
  public async getSession(
    credentials: JiraLoginCredentials,
  ): Promise<JiraSession> {
    return this.jiraSessionService.getSession(credentials)
  }

  /**
   * 会话失效自愈执行器：解析凭据（缺省用服务端账号）取会话执行调用，
   * 401/403 时剔除缓存重登并重试一次。供路由层直接使用。
   */
  public async withSession<T>(
    credentials: Partial<JiraLoginCredentials> | undefined,
    fn: (session: JiraSession) => Promise<T>,
  ): Promise<T> {
    const resolved = this.jiraSessionService.resolveCredentials(credentials)
    return this.jiraSessionService.withSession(resolved, fn)
  }

  /**
   * 获取项目列表
   */
  async getProjects(credentials: JiraLoginCredentials) {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getProjects(session.cookies),
    )
  }

  /**
   * 获取指定项目的问题类型列表
   */
  async getIssueTypes(credentials: JiraLoginCredentials, projectKey: string) {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getIssueTypes(projectKey, session.cookies),
    )
  }

  /**
   * Create a Jira ticket with all necessary steps
   * 支持动态 projectKey 和 issueTypeId，以及 LLM 智能匹配
   */
  async createTicket(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData,
  ): Promise<JiraCreateTicketResponse> {
    return this.createTicketUseCase.createTicket(credentials, data)
  }

  /**
   * Update a Jira ticket
   */
  async updateTicket(
    credentials: JiraLoginCredentials,
    data: JiraUpdateTicketData,
  ): Promise<{ message: string }> {
    return this.updateTicketUseCase.updateTicket(credentials, data)
  }

  async uploadAttachment(
    credentials: JiraLoginCredentials,
    data: JiraUploadAttachmentData,
  ): Promise<JiraUploadAttachmentResponse> {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.addAttachment(data, session.cookies),
    )
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
      return await this.jiraSessionService.withSession(credentials, (session) =>
        this.jiraRestService.createMeta(
          projectKey,
          issueTypeId,
          session.cookies,
          maxResults,
          startAt,
        ),
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
    return this.createTicketWithLabelsUseCase.execute(credentials, data)
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
    return this.devReplyUseCase.devReply(credentials, data)
  }

  async devReplyBatch(
    credentials: Partial<JiraLoginCredentials> | undefined,
    data: DevReplyBatchData,
  ): Promise<DevReplyBatchResponse> {
    return this.devReplyUseCase.devReplyBatch(credentials, data)
  }

  /**
   * 查询巡检审计日志（dev-reply reconcile 每次执行逐单记录）
   */
  async getReconcileLogs(query: ReconcileLogQuery) {
    return this.jiraReconcileLogRepository.query(query)
  }

  /** 巡检日志经办人去重列表（前端筛选用） */
  async getReconcileLogAssignees() {
    return this.jiraReconcileLogRepository.listAssignees()
  }

  /** 按 id 批量删除巡检记录 */
  async deleteReconcileLogs(ids: string[]) {
    return this.jiraReconcileLogRepository.deleteByIds(ids)
  }

  /**
   * 获取所有可用的工单链接类型
   */
  async getIssueLinkTypes(credentials: JiraLoginCredentials) {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getIssueLinkTypes(session.cookies),
    )
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
    return this.jiraSessionService.withSession(credentials, async (session) => {
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
    })
  }

  /**
   * 获取项目版本列表
   */
  async getProjectVersions(
    credentials: JiraLoginCredentials,
    projectKey: string,
    status?: 'released' | 'unreleased' | 'archived',
  ) {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getProjectVersions(
        projectKey,
        session.cookies,
        status,
      ),
    )
  }

  /**
   * 获取工单可用的工作流转换
   */
  async getTransitions(credentials: JiraLoginCredentials, issueKey: string) {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getTransitions(issueKey, session.cookies),
    )
  }

  /**
   * 获取工单详情
   */
  async getIssueDetail<T = Record<string, any>>(
    credentials: JiraLoginCredentials,
    issueIdOrKey: string,
    fields?: string[],
  ): Promise<T> {
    return this.jiraSessionService.withSession(credentials, (session) =>
      this.jiraRestService.getIssueDetail<T>(
        issueIdOrKey,
        session.cookies,
        fields,
      ),
    )
  }
}
