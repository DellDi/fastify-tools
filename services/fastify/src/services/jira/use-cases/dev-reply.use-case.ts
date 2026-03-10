import type { FastifyBaseLogger } from 'fastify'
import { JiraError, ValidationError } from '@/utils/errors.js'
import type { JiraRestService } from '../jira-rest.service.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type {
  DevReplyBatchData,
  DevReplyBatchResponse,
  DevReplyData,
  DevReplyResponse,
  DevReplyStepName,
  DevReplyStepResult,
  JiraLoginCredentials,
  JiraSession,
  JiraUpdateTicketData,
} from '../types.js'

type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

export class DevReplyUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private jiraRestService: JiraRestService,
    private sessionService: JiraSessionService,
    private updateTicket?: UpdateTicketHandler,
  ) {}

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
      status: 'failure',
      issueKey,
      message,
      ...extra,
      steps,
      ...this.buildStepSummary(steps),
    }
  }

  private async executeDevReplyWorkflow(
    credentials: JiraLoginCredentials,
    session: JiraSession,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const { issueKey, projectKey, assignee } = data
    const steps: DevReplyStepResult[] = []
    let fieldUpdateSuccess = false
    let transitionSuccess = false
    const pushStep = (
      step: DevReplyStepName,
      success: boolean,
      message: string,
      stepData?: Record<string, any>,
    ) => {
      steps.push({ step, success, message, data: stepData })
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
        this.logger.info(
          `Found ${usedDates.size} used dates for ${assignee}, max: ${maxUsedDate || 'none'}`,
        )
        pushStep('queryUsedDates', true, '已完成已占用日期查询', {
          usedDateCount: usedDates.size,
          maxUsedDate,
        })
      } catch (error) {
        const message = `查询已占用日期失败: ${error instanceof Error ? error.message : String(error)}`
        this.logger.warn(message)
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
            this.logger.info(
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
          this.logger.warn(message)
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
          const { findAvailableDate } = await import('../utils.js')
          devCompleteDate = findAvailableDate(
            fixVersion.date,
            usedDates,
            allHolidays,
          )
          this.logger.info(`Allocated dev complete date: ${devCompleteDate}`)
          pushStep('allocateDevCompleteDate', true, '已自动分配预计开发完成时间', {
            devCompleteDate,
          })
        } catch (error) {
          const message = `分配预计开发完成时间失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('allocateDevCompleteDate', false, message)
        }
      } else {
        pushStep('allocateDevCompleteDate', false, '缺少可用修复版本，无法自动分配预计开发完成时间')
      }

      const updateFields: Record<string, any> = {
        ...data.additionalFields,
      }

      if (fixVersionId) {
        updateFields.fixVersions = [{ id: fixVersionId }]
      }

      if (devCompleteDate) {
        updateFields.customfield_10022 = devCompleteDate
      }

      if (Object.keys(updateFields).length > 0 && this.updateTicket) {
        try {
          await this.updateTicket(credentials, {
            issueIdOrKey: issueKey,
            fields: updateFields,
          })
          fieldUpdateSuccess = true
          pushStep('updateFields', true, '字段更新成功', {
            updatedFields: Object.keys(updateFields),
          })
        } catch (error) {
          const message = `字段更新失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('updateFields', false, message)
        }
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
          this.logger.warn(
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
        this.logger.warn(message)
        pushStep('getTransitions', false, message)
        if (fieldUpdateSuccess) {
          return {
            success: true,
            status: 'partial_success',
            issueKey,
            fixVersionName: fixVersion?.version.name,
            devCompleteDate,
            message: `工单 ${issueKey} 字段已更新，但未执行工作流转换：${message}`,
            fieldUpdateSuccess,
            transitionSuccess,
            steps,
            ...this.buildStepSummary(steps),
          }
        }
        return this.buildDevReplyFailure(issueKey, message, steps, {
          fixVersionName: fixVersion?.version.name,
          devCompleteDate,
          fieldUpdateSuccess,
          transitionSuccess,
        })
      }

      const transitionFields: Record<string, any> = {
        ...(data.comment ? {} : updateFields),
      }

      try {
        await this.jiraRestService.doTransition(
          issueKey,
          session.cookies,
          resolvedTransitionId,
          Object.keys(transitionFields).length > 0 ? transitionFields : undefined,
          data.comment,
        )
        transitionSuccess = true
        pushStep('doTransition', true, '工作流转换执行成功', {
          transitionId: resolvedTransitionId,
          transitionName,
        })
      } catch (error) {
        const message = `执行工作流转换失败: ${error instanceof Error ? error.message : String(error)}`
        this.logger.warn(message)
        pushStep('doTransition', false, message)
        if (fieldUpdateSuccess) {
          return {
            success: true,
            status: 'partial_success',
            issueKey,
            fixVersionName: fixVersion?.version.name,
            devCompleteDate,
            transitionName,
            message: `工单 ${issueKey} 字段已更新，但工作流转换失败：${message}`,
            fieldUpdateSuccess,
            transitionSuccess,
            steps,
            ...this.buildStepSummary(steps),
          }
        }
        return this.buildDevReplyFailure(issueKey, message, steps, {
          fixVersionName: fixVersion?.version.name,
          devCompleteDate,
          transitionName,
          fieldUpdateSuccess,
          transitionSuccess,
        })
      }

      return {
        success: true,
        status: 'success',
        issueKey,
        fixVersionName: fixVersion?.version.name,
        devCompleteDate,
        transitionName,
        message: `工单 ${issueKey} 已执行开发回复`,
        fieldUpdateSuccess,
        transitionSuccess,
        steps,
        ...this.buildStepSummary(steps),
      }
    } catch (error) {
      const message = `开发回复执行异常: ${error instanceof Error ? error.message : String(error)}`
      this.logger.error(message)
      return this.buildDevReplyFailure(issueKey, message, steps)
    }
  }

  async devReply(
    credentials: Partial<JiraLoginCredentials> | undefined,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const resolvedCredentials = this.sessionService.resolveCredentials(credentials)

    try {
      const session = await this.sessionService.getSession(resolvedCredentials)
      return await this.executeDevReplyWorkflow(resolvedCredentials, session, data)
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

    const resolvedCredentials = this.sessionService.resolveCredentials(credentials)

    let session: JiraSession
    try {
      session = await this.sessionService.getSession(resolvedCredentials)
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
        this.executeDevReplyWorkflow(resolvedCredentials, session, {
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
}
