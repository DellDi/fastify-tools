import type { FastifyBaseLogger } from 'fastify'
import { createHash } from 'node:crypto'
import { JiraCreateError, ValidationError } from '@/utils/errors.js'
import type { JiraMeta } from '@/schema/jira/meta.js'
import { isFillableRequiredField } from '../field-value.utils.js'
import type { JiraFieldRuleRecord } from '../jira-field-rule.repository.js'
import type { JiraRestService } from '../jira-rest.service.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type {
  JiraCreateTicketData,
  JiraCreateTicketResponse,
  JiraLoginCredentials,
  JiraUpdateTicketData,
} from '../types.js'

type JiraConfigLike = {
  baseUrl: string
  defaultProject: string
  defaultIssueType: string
  defaultComponent?: string
}

type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

export class CreateTicketUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private jiraRestService: JiraRestService,
    private sessionService: JiraSessionService,
    private jiraConfig: JiraConfigLike,
    private updateTicket: UpdateTicketHandler,
  ) {}

  private async resolveComponentId(
    projectKey: string,
    matchedComponentId: string | undefined,
    cookies: string,
  ) {
    try {
      const { components } = await this.jiraRestService.getIssueTypes(
        projectKey,
        cookies,
      )

      const hasMatchedComponent = components.some(
        (component) => component.id === matchedComponentId,
      )
      if (matchedComponentId && hasMatchedComponent) {
        return matchedComponentId
      }

      const hasDefaultComponent = components.some(
        (component) => component.id === this.jiraConfig.defaultComponent,
      )
      if (projectKey === this.jiraConfig.defaultProject && hasDefaultComponent) {
        return this.jiraConfig.defaultComponent
      }

      return components[0]?.id
    } catch (error) {
      this.logger.warn(
        `Resolve Jira component failed, creating without project component: ${error instanceof Error ? error.message : String(error)}`,
      )
      return matchedComponentId
    }
  }

  /**
   * 从 JiraCreateError 中提取"必填字段缺失"类的字段 ID
   * Jira 报错文案可能是中文（"是必需的"）或英文（"is required"）
   */
  private extractMissingRequiredFieldIds(error: unknown): string[] {
    if (!(error instanceof JiraCreateError) || !error.jiraErrors) return []
    const requiredPattern = /required|必需|必填|不能为空|cannot be empty/i
    return Object.entries(error.jiraErrors)
      .filter(
        ([fieldKey, message]) =>
          !['project', 'summary', 'issuetype'].includes(fieldKey) &&
          requiredPattern.test(String(message)),
      )
      .map(([fieldKey]) => fieldKey)
  }

  /**
   * 按经验规则拆分必填字段：
   * - presetFields: fixed 复用成功值 / computed 确定性重算，无需 LLM
   * - llmFields: 无可用规则的字段交给 LLM
   * - avoidFieldIds: 曾被 Jira 拒绝下发的字段，主动剔除
   */
  private planFieldFill(
    metaValues: JiraMeta[],
    rules: Map<string, JiraFieldRuleRecord>,
    assignee: string,
  ): {
    presetFields: Record<string, any>
    llmFields: JiraMeta[]
    avoidFieldIds: Set<string>
  } {
    const presetFields: Record<string, any> = {}
    const avoidFieldIds = new Set<string>()

    for (const rule of rules.values()) {
      if (rule.strategy === 'avoid') avoidFieldIds.add(rule.fieldId)
    }

    const llmFields = metaValues.filter((field) => {
      if (!isFillableRequiredField(field)) return false
      const rule = rules.get(field.fieldId)
      if (!rule || rule.stale) return true

      if (rule.strategy === 'fixed' && rule.learnedValue != null) {
        presetFields[field.fieldId] = rule.learnedValue
        return false
      }
      if (rule.strategy === 'computed') {
        const value = this.jiraRestService.genStaticFieldValue(field, assignee)
        if (value !== undefined) {
          presetFields[field.fieldId] = value
          return false
        }
      }
      return true
    })

    return { presetFields, llmFields, avoidFieldIds }
  }

  /**
   * 创建工单；若因缺失必填字段失败，针对缺失字段生成值后重试一次
   * 返回创建结果与实际上送的自定义字段（用于经验回写）
   */
  private async createIssueWithRequiredFieldRetry(
    metaValues: JiraMeta[],
    base: { title: string; description: string; assignee: string },
    customAutoFields: Record<string, any>,
    cookies: string,
    options: {
      projectKey: string
      issueTypeId: string
      componentId?: string
      onFieldsRemoved?: (
        fieldIds: string[],
        errors: Record<string, string>,
      ) => void | Promise<void>
    },
  ): Promise<{
    createResponse: Awaited<ReturnType<JiraRestService['createIssue']>>
    sentFields: Record<string, any>
  }> {
    try {
      const createResponse = await this.jiraRestService.createIssue(
        { ...base, customAutoFields },
        cookies,
        options,
      )
      return { createResponse, sentFields: customAutoFields }
    } catch (error) {
      const missingIds = this.extractMissingRequiredFieldIds(error)
      const missingMeta = metaValues.filter((field) =>
        missingIds.includes(field.fieldId),
      )
      if (missingMeta.length === 0) throw error

      this.logger.warn(
        {
          missingFieldIds: missingIds,
          projectKey: options.projectKey,
          issueTypeId: options.issueTypeId,
        },
        'Jira create failed: required fields missing, generating values and retrying',
      )

      const filled = await this.jiraRestService.genCustomInfo(
        missingMeta,
        base.title,
        base.description,
        base.assignee,
      )

      const mergedFields = { ...customAutoFields, ...filled }
      const createResponse = await this.jiraRestService.createIssue(
        { ...base, customAutoFields: mergedFields },
        cookies,
        options,
      )
      return { createResponse, sentFields: mergedFields }
    }
  }

  async createTicket(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData,
  ): Promise<JiraCreateTicketResponse> {
    if (!data.title || !data.description) {
      throw new ValidationError('缺少必需字段: title 和 description')
    }

    try {
      const session = await this.sessionService.getSession(credentials)

      let projectKey = data.projectKey || this.jiraConfig.defaultProject
      let issueTypeId = data.issueTypeId || this.jiraConfig.defaultIssueType
      let matchInfo: JiraCreateTicketResponse['matchInfo'] | undefined

      if (data.smartMatch && (!data.projectKey || !data.issueTypeId)) {
        try {
          const projects = await this.jiraRestService.getProjects(session.cookies)
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

          const resolvedProjectKey = data.projectKey || match.projectKey
          const resolvedIssueTypeId = data.issueTypeId || match.issueTypeId

          projectKey = resolvedProjectKey
          issueTypeId = resolvedIssueTypeId
          matchInfo = {
            ...match,
            projectKey: resolvedProjectKey,
            projectName: data.projectKey || match.projectName,
            issueTypeId: resolvedIssueTypeId,
          }

          this.logger.info(
            `Smart match result: componentId=${match.componentId}, project=${resolvedProjectKey}, issueType=${resolvedIssueTypeId}, confidence=${match.confidence}`,
          )
        } catch (matchError) {
          this.logger.warn(
            `Smart match failed, using defaults: ${matchError instanceof Error ? matchError.message : String(matchError)}`,
          )
        }
      }

      const metaResponse = await this.jiraRestService.createMetaAll(
        projectKey,
        issueTypeId,
        session.cookies,
      )

      const assignee = data.assignee || credentials.jiraUser

      const rules = await this.jiraRestService.getFieldRules(
        projectKey,
        issueTypeId,
        metaResponse.values,
      )

      const { presetFields, llmFields, avoidFieldIds } = this.planFieldFill(
        metaResponse.values,
        rules,
        assignee,
      )

      const genCustomInfo =
        llmFields.length > 0
          ? await this.jiraRestService.genCustomInfo(
              llmFields,
              data.title,
              data.description,
              assignee,
            )
          : {}

      this.logger.info(
        { presetFieldIds: Object.keys(presetFields), llmFieldIds: llmFields.map((f) => f.fieldId), genCustomInfo },
        'field fill plan',
      )

      const autoFields = { ...presetFields, ...genCustomInfo }
      for (const fieldId of avoidFieldIds) {
        delete autoFields[fieldId]
      }
      const customAutoFields = { ...autoFields, ...data.customAutoFields }

      const componentId = await this.resolveComponentId(
        projectKey,
        matchInfo?.componentId,
        session.cookies,
      )

      const { createResponse, sentFields } =
        await this.createIssueWithRequiredFieldRetry(
          metaResponse.values,
          { title: data.title, description: data.description, assignee },
          customAutoFields,
          session.cookies,
          {
            projectKey,
            issueTypeId,
            componentId,
            onFieldsRemoved: (fieldIds, errors) =>
              this.jiraRestService.markFieldRulesAvoid(
                projectKey,
                issueTypeId,
                fieldIds,
                errors,
              ),
          },
        )

      if (!createResponse.id || !createResponse.key) {
        throw new JiraCreateError('创建 Jira 工单返回数据缺少必要字段')
      }

      // 工单指纹：与 LLM 输入上下文一致（标题/描述/经办人），相同输入的重复成功不构成新证据
      const sourceHash = createHash('sha256')
        .update(`${data.title}\n${data.description}\n${data.assignee ?? ''}`)
        .digest('hex')
        .slice(0, 16)

      try {
        await this.jiraRestService.learnFieldValues(
          projectKey,
          issueTypeId,
          metaResponse.values,
          sentFields,
          rules,
          sourceHash,
        )
      } catch (learnError) {
        this.logger.warn(
          `Learn jira field values failed: ${learnError instanceof Error ? learnError.message : String(learnError)}`,
        )
      }

      if (data.customerName) {
        const customInfo = this.jiraRestService.getCustomInfo(
          metaResponse.values,
          data.customerName,
        )

        if (Object.keys(customInfo).length > 0) {
          this.logger.info(
            {
              issueKey: createResponse.key,
              customerName: data.customerName,
              customFieldKeys: Object.keys(customInfo),
              customInfo,
            },
            'Updating Jira customer-related fields after issue creation',
          )
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
      this.logger.error(`Create ticket error: ${error instanceof Error ? error.message : String(error)}`)
      if (
        error instanceof JiraCreateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraCreateError(`创建 Jira 工单失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
