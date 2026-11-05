import { JiraMeta } from '@/schema/jira/meta.js'
import { FastifyInstance } from 'fastify'
import { fastifyCache } from '@/utils/cache.js'
import {
  getJiraConfig,
} from '@/utils/config-helpers.js'
import { getCustomerFieldInfo } from './customer-field.utils.js'
import { JiraLLMService } from './jira-llm.service.js'
import { JiraMetaRepository } from './jira-meta.repository.js'
import { JiraIssueRepository } from './jira-issue.repository.js'
import { JiraFieldRuleRepository } from './jira-field-rule.repository.js'
import type { JiraFieldRuleRecord } from './jira-field-rule.repository.js'
import {
  buildStaticFieldValue,
  classifyJiraField,
} from './field-value.utils.js'
import {
    dayjs,
    parseVersionDate,
    selectFixVersion,
    selectFixVersionSmart,
    findAvailableDate,
    getMaxUsedDate,
} from './utils.js'
import type {
  JiraProject,
  JiraIssueType,
  JiraVersion,
  JiraTransition,
  JiraSearchResult,
  ProjectIssueTypeMatch,
  JiraComponent,
  JiraUploadAttachmentData,
  JiraUploadAttachmentResponse,
} from './types.js'

export class JiraRestService {
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private jiraLLMService: JiraLLMService
  private jiraMetaRepository: JiraMetaRepository
  private jiraIssueRepository: JiraIssueRepository
  private jiraFieldRuleRepository: JiraFieldRuleRepository

  constructor(private fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
    this.jiraLLMService = new JiraLLMService(fastify)
    this.jiraMetaRepository = new JiraMetaRepository(fastify)
    this.jiraIssueRepository = new JiraIssueRepository(fastify)
    this.jiraFieldRuleRepository = new JiraFieldRuleRepository(fastify)

    // 移除敏感信息日志记录，只记录用户名
    this.fastify.log.info(
      `Jira service initialized for user: ${this.jiraConfig.auth.username}`,
    )
  }

  /**
   * 获取用户有权限的所有项目列表
   */
  async getProjects(cookies: string): Promise<JiraProject[]> {
    return this.jiraMetaRepository.getProjects(cookies)
  }

  /**
   * 获取指定项目的问题类型列表
   */
  async getIssueTypes(
    projectKey: string,
    cookies: string,
  ): Promise<{ issueTypes: JiraIssueType[]; components: JiraComponent[] }> {
    return this.jiraMetaRepository.getIssueTypes(projectKey, cookies)
  }

  async addAttachment(
    data: JiraUploadAttachmentData,
    cookies: string,
  ): Promise<JiraUploadAttachmentResponse> {
    return this.jiraIssueRepository.addAttachment(data, cookies)
  }

  /**
   * 使用 LLM 智能匹配 project 和 issueType
   */
  async matchProjectAndIssueType(
    prompt: string,
    title: string,
    description: string,
    projects: JiraProject[],
    issueTypes: JiraIssueType[],
  ): Promise<ProjectIssueTypeMatch> {
    return this.jiraLLMService.matchProjectAndIssueType(
      prompt,
      title,
      description,
      projects,
      issueTypes,
    )
  }

  async createIssue(
    restData: { [key: string]: any },
    cookies: string,
    options?: {
      projectKey?: string
      issueTypeId?: string
      componentId?: string
      onFieldsRemoved?: (
        fieldIds: string[],
        errors: Record<string, string>,
      ) => void | Promise<void>
    },
  ) {
    return this.jiraIssueRepository.createIssue(restData, cookies, options)
  }

  /** 加载并与最新 createmeta 对齐字段经验规则 */
  async getFieldRules(
    projectKey: string,
    issueTypeId: string,
    metaValues: JiraMeta[],
  ): Promise<Map<string, JiraFieldRuleRecord>> {
    return this.jiraFieldRuleRepository.syncRulesWithMeta(
      projectKey,
      issueTypeId,
      metaValues,
    )
  }

  /** 建单成功后沉淀字段取值经验 */
  async learnFieldValues(
    projectKey: string,
    issueTypeId: string,
    metaValues: JiraMeta[],
    sentFields: Record<string, any>,
    rules: Map<string, JiraFieldRuleRecord>,
    sourceHash?: string,
  ): Promise<void> {
    return this.jiraFieldRuleRepository.learnFromSuccess(
      projectKey,
      issueTypeId,
      metaValues,
      sentFields,
      rules,
      sourceHash,
    )
  }

  /** 记录被 Jira 拒绝下发的字段，后续建单主动跳过 */
  async markFieldRulesAvoid(
    projectKey: string,
    issueTypeId: string,
    fieldIds: string[],
    errors: Record<string, string>,
  ): Promise<void> {
    return this.jiraFieldRuleRepository.markAvoid(
      projectKey,
      issueTypeId,
      fieldIds,
      errors,
    )
  }

  /** 不依赖 LLM 的确定性字段取值（供 computed 策略复用） */
  genStaticFieldValue(field: JiraMeta, assignee?: string): any {
    const kind = classifyJiraField(field)
    return kind ? buildStaticFieldValue(field, kind, assignee) : undefined
  }

  async createMeta(
    projectKey: string,
    issueTypeId: string,
    cookies: string,
    maxResults: number,
    startAt: number,
  ) {
    return this.jiraMetaRepository.createMeta(
      projectKey,
      issueTypeId,
      cookies,
      maxResults,
      startAt,
    )
  }

  /**
   * 分页拉取全部创建字段元数据
   */
  async createMetaAll(
    projectKey: string,
    issueTypeId: string,
    cookies: string,
  ) {
    return this.jiraMetaRepository.createMetaAll(
      projectKey,
      issueTypeId,
      cookies,
    )
  }

  /**
   * 获取自定义字段信息-动态遍历拼接，客户相关信息
   */
  getCustomInfo(
    values: JiraMeta[],
    cusstomName: string,
  ): {
    [key: string]: any
  } {
    return getCustomerFieldInfo(values, cusstomName)
  }

  /**
   * 获取项目版本列表
   */
  async getProjectVersions(
    projectKey: string,
    cookies: string,
    status?: 'released' | 'unreleased' | 'archived',
  ): Promise<JiraVersion[]> {
    return this.jiraMetaRepository.getProjectVersions(
      projectKey,
      cookies,
      status,
    )
  }

  /**
   * 使用 JQL 搜索工单
   */
  async searchIssuesByJql(
    jql: string,
    cookies: string,
    fields: string[] = ['summary', 'status', 'customfield_10022'],
    maxResults: number = 100,
  ): Promise<JiraSearchResult> {
    return this.jiraIssueRepository.searchIssuesByJql(
      jql,
      cookies,
      fields,
      maxResults,
    )
  }

  /**
   * 获取中国节假日列表（使用第三方 API）
   * @param year 年份
   */
  async getHolidays(year: number): Promise<Set<string>> {
    const cacheKey = `holidays-${year}`
    const cached = fastifyCache.get(cacheKey) as Set<string> | undefined
    if (cached) {
      return cached
    }

    try {
      // 使用 timor.tech 免费节假日 API
      const response = await fetch(
        `https://timor.tech/api/holiday/year/${year}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as {
        code: number
        holiday: Record<
          string,
          {
            holiday: boolean
            name: string
            wage: number
            date: string
          }
        >
      }

      const holidays = new Set<string>()

      if (data.code === 0 && data.holiday) {
        // 只添加 holiday: true 的日期（法定节假日）
        Object.values(data.holiday).forEach((item) => {
          if (item.holiday) {
            holidays.add(item.date)
          }
        })
      }

      fastifyCache.set(cacheKey, holidays)
      this.fastify.log.info(`Loaded ${holidays.size} holidays for year ${year}`)

      return holidays
    } catch (error) {
      this.fastify.log.warn(`Failed to fetch holidays for ${year}: ${error instanceof Error ? error.message : String(error)}`)
      // 返回空集合，不阻塞业务
      return new Set<string>()
    }
  }

  /**
   * 获取工单可用的工作流转换
   */
  async getTransitions(
    issueKey: string,
    cookies: string,
  ): Promise<JiraTransition[]> {
    return this.jiraIssueRepository.getTransitions(issueKey, cookies)
  }

  /**
   * 获取工单详情
   */
  async getIssueDetail<T = Record<string, any>>(
    issueIdOrKey: string,
    cookies: string,
    fields?: string[],
  ): Promise<T> {
    return this.jiraIssueRepository.getIssueDetail<T>(
      issueIdOrKey,
      cookies,
      fields,
    )
  }

  async addComment(
    issueKey: string,
    cookies: string,
    body: string,
  ): Promise<void> {
    return this.jiraIssueRepository.addComment(issueKey, cookies, body)
  }

  async doTransition(
    issueKey: string,
    cookies: string,
    transitionId: string,
    fields?: Record<string, any>,
    comment?: string,
  ): Promise<void> {
    return this.jiraIssueRepository.doTransition(
      issueKey,
      cookies,
      transitionId,
      fields,
      comment,
    )
  }

  /**
   * 获取所有可用的工单链接类型
   */
  async getIssueLinkTypes(cookies: string): Promise<Array<{ id: string; name: string; inward: string; outward: string }>> {
    return this.jiraIssueRepository.getIssueLinkTypes(cookies)
  }

  /**
   * 创建工单关联（relates to）
   */
  async linkIssue(
    inwardIssueKey: string,
    outwardIssueKey: string,
    cookies: string,
    linkTypeName: string = 'Relates',
  ): Promise<void> {
    return this.jiraIssueRepository.linkIssue(
      inwardIssueKey,
      outwardIssueKey,
      cookies,
      linkTypeName,
    )
  }

  /**
   * 解析版本名称中的日期
   * 委托给 utils.ts 中的工具函数
   */
  parseVersionDate(versionName: string): Date | null {
    return parseVersionDate(versionName)
  }

  /**
   * 选择合适的修复版本（简单版本）
   * @deprecated 使用 selectFixVersionSmart 替代
   */
  selectFixVersion(versions: JiraVersion[]): JiraVersion | null {
    return selectFixVersion(versions)
  }

  /**
   * 智能选择修复版本
   * 根据用户已占用日期动态选择合适的版本
   */
  selectFixVersionSmart(
    versions: JiraVersion[],
    maxUsedDate?: string
  ): { version: JiraVersion; date: Date } | null {
    return selectFixVersionSmart(versions, maxUsedDate)
  }

  /**
   * 获取已占用日期中的最大日期
   */
  getMaxUsedDate(usedDates: Set<string>): string | undefined {
    return getMaxUsedDate(usedDates)
  }

  /**
   * 智能分配预计开发完成时间
   */
  async allocateDevCompleteDate(
    cookies: string,
    assignee: string,
    versionDate: Date,
  ): Promise<string> {
    // 1. 查询用户未完成工单的预计开发完成时间
    const jql = `assignee = "${assignee}" AND resolution = Unresolved ORDER BY cf[10022] ASC`
    let usedDates = new Set<string>()

    try {
      const searchResult = await this.searchIssuesByJql(jql, cookies, [
        'customfield_10022',
      ])
      usedDates = new Set(
        searchResult.issues
          .map((issue) => issue.fields.customfield_10022)
          .filter(Boolean),
      )
      this.fastify.log.info(
        `Found ${usedDates.size} used dates for ${assignee}`,
      )
    } catch (error) {
      this.fastify.log.warn(`Failed to query existing issues: ${error instanceof Error ? error.message : String(error)}`)
    }

    // 2. 获取节假日
    const currentYear = dayjs().year()
    const holidays = await this.getHolidays(currentYear)
    const nextYearHolidays =
      versionDate.getFullYear() > currentYear
        ? await this.getHolidays(currentYear + 1)
        : new Set<string>()

    const allHolidays = new Set([...holidays, ...nextYearHolidays])

    // 3. 使用工具函数查找可用日期
    const allocatedDate = findAvailableDate(versionDate, usedDates, allHolidays)
    this.fastify.log.info(`Allocated dev complete date: ${allocatedDate}`)
    return allocatedDate
  }

  async genCustomInfo(
    values: JiraMeta[],
    summary: string,
    description: string,
    assignee?: string,
  ): Promise<Record<string, any>> {
    return this.jiraLLMService.genCustomInfo(
      values,
      summary,
      description,
      assignee,
    )
  }
}
