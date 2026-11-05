import type { FastifyBaseLogger } from 'fastify'
import { JiraError, ValidationError } from '@/utils/errors.js'
import { isValidDevCompleteDate } from '../utils.js'
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

type DevReplyBatchAllocationState = {
  reservedDates: Set<string>
}

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
    batchAllocationState?: DevReplyBatchAllocationState,
  ): Promise<DevReplyResponse> {
    const { issueKey, assignee } = data
    // 未显式指定项目时按工单号前缀推导（ARM-75059 → ARM），支持跨项目混投
    const projectKey = data.projectKey || issueKey.split('-')[0]
    const reconcile = data.reconcile !== false
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
      let currentFixVersionIds: string[] = []
      let currentDevDate: string | undefined
      let currentStatusName = ''

      if (reconcile) {
        try {
          const detail = await this.jiraRestService.getIssueDetail<{
            fields?: {
              fixVersions?: Array<{ id: string }>
              customfield_10022?: string
              status?: { name?: string }
            }
          }>(issueKey, session.cookies, [
            'fixVersions',
            'customfield_10022',
            'status',
          ])
          currentFixVersionIds = (detail.fields?.fixVersions ?? []).map(
            (version) => version.id,
          )
          currentDevDate = detail.fields?.customfield_10022
          currentStatusName = detail.fields?.status?.name ?? ''
          pushStep('queryCurrentState', true, '已读取工单现状', {
            fixVersions: currentFixVersionIds,
            devCompleteDate: currentDevDate,
            status: currentStatusName,
          })
        } catch (error) {
          const message = `读取工单现状失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('queryCurrentState', false, message)
        }
      }

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
        if (batchAllocationState) {
          for (const reservedDate of batchAllocationState.reservedDates) {
            usedDates.add(reservedDate)
          }
        }
        // reconcile 模式下本单旧日期不视为占用：保留校验和重新分配都以"他人占用"为准，
        // 否则重复执行会把日期一天天往后顺延（漂移）
        if (reconcile && currentDevDate) {
          usedDates.delete(currentDevDate)
        }
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

          if (
            reconcile &&
            currentDevDate &&
            isValidDevCompleteDate(currentDevDate, fixVersion.date, allHolidays)
          ) {
            devCompleteDate = currentDevDate
            pushStep(
              'allocateDevCompleteDate',
              true,
              '现有预计开发完成时间仍有效，保留原值',
              { devCompleteDate, kept: true },
            )
          } else {
            const { findAvailableDate } = await import('../utils.js')
            devCompleteDate = findAvailableDate(
              fixVersion.date,
              usedDates,
              allHolidays,
            )
            if (batchAllocationState) {
              batchAllocationState.reservedDates.add(devCompleteDate)
            }
            this.logger.info(`Allocated dev complete date: ${devCompleteDate}`)
            pushStep('allocateDevCompleteDate', true, '已自动分配预计开发完成时间', {
              devCompleteDate,
            })
          }
        } catch (error) {
          const message = `分配预计开发完成时间失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('allocateDevCompleteDate', false, message)
        }
      } else {
        pushStep('allocateDevCompleteDate', false, '缺少可用修复版本，无法自动分配预计开发完成时间')
      }

      // fixVersions 是单选语义：仅当现状恰好是 [目标版本] 时才视为符合预期，
      // 多选包含目标或其他版本都要整体替换为单选
      const versionNeedsUpdate =
        !!fixVersionId &&
        !(
          reconcile &&
          currentFixVersionIds.length === 1 &&
          currentFixVersionIds[0] === fixVersionId
        )
      const dateNeedsUpdate =
        !!devCompleteDate && !(reconcile && currentDevDate === devCompleteDate)

      const updateFields: Record<string, any> = {
        ...data.additionalFields,
      }

      if (versionNeedsUpdate) {
        updateFields.fixVersions = [{ id: fixVersionId }]
      }

      if (dateNeedsUpdate) {
        updateFields.customfield_10022 = devCompleteDate
      }

      const changes: {
        versionTo?: string
        dateFrom?: string
        dateTo?: string
        additionalFields?: boolean
        startTimeTo?: string
      } = {}
      if (versionNeedsUpdate) {
        changes.versionTo = fixVersion?.version.name ?? fixVersionId
      }
      if (dateNeedsUpdate && devCompleteDate) {
        changes.dateFrom = currentDevDate
        changes.dateTo = devCompleteDate
      }
      if (data.additionalFields && Object.keys(data.additionalFields).length > 0) {
        changes.additionalFields = true
      }
      const hasChanges = !!(
        changes.versionTo ||
        changes.dateTo ||
        changes.additionalFields
      )

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
      } else {
        pushStep('updateFields', true, '字段均符合预期，无需更新', {
          skipped: true,
        })
      }

      const transitionId = data.transitionId || '11'
      let resolvedTransitionId = transitionId
      let transitionName = '开发回复'
      let matchedTransition: Awaited<
        ReturnType<JiraRestService['getTransitions']>
      >[number] | undefined

      try {
        const transitions = await this.jiraRestService.getTransitions(
          issueKey,
          session.cookies,
        )
        matchedTransition =
          transitions.find((transition) => transition.id === transitionId) ||
          transitions.find(
            (transition) =>
              transition.name.includes('开发回复') ||
              transition.name.toLowerCase().includes('dev reply') ||
              transition.name.toLowerCase().includes('development'),
          )

        if (!matchedTransition) {
          if (reconcile && currentStatusName.includes('回复')) {
            pushStep(
              'getTransitions',
              true,
              `工单已是「${currentStatusName}」状态，无需转换`,
              { statusName: currentStatusName, skipped: true },
            )
          } else {
            this.logger.warn(
              `Available transitions: ${transitions.map((transition) => `${transition.id}:${transition.name}`).join(', ')}`,
            )
            throw new JiraError(
              `找不到开发回复工作流转换 (ID: ${transitionId})`,
            )
          }
        } else {
          resolvedTransitionId = matchedTransition.id
          transitionName = matchedTransition.name
          pushStep('getTransitions', true, '已获取并匹配工作流转换', {
            transitionId: resolvedTransitionId,
            transitionName,
          })
        }
      } catch (error) {
        const message = `获取工作流转换失败: ${error instanceof Error ? error.message : String(error)}`
        this.logger.warn(message)
        pushStep('getTransitions', false, message)
        if (fieldUpdateSuccess) {
          await this.postCommentStep(
            issueKey,
            session,
            data.comment ?? this.buildAutoComment({ changes }),
            pushStep,
          )
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

      if (matchedTransition) {
        const resolvedComment =
          data.comment ??
          this.buildAutoComment({
            transitionName,
            fixVersionName: fixVersion?.version.name,
            devCompleteDate,
            changes,
          })
        const transitionFields: Record<string, any> = {
          ...(resolvedComment ? {} : updateFields),
        }

        try {
          await this.jiraRestService.doTransition(
            issueKey,
            session.cookies,
            resolvedTransitionId,
            Object.keys(transitionFields).length > 0
              ? transitionFields
              : undefined,
            resolvedComment,
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
            await this.postCommentStep(
              issueKey,
              session,
              data.comment ?? this.buildAutoComment({ changes }),
              pushStep,
            )
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
      }

      // "计划开始时间"(customfield_10100) 若为 T00:00:00（转换 post-function
      // 或人工只选日期产生），在转换执行完之后校正为同日期+随机工作时段，
      // 避免批量处理出的时间全是整点 00:00 一眼假
      if (reconcile && this.updateTicket) {
        try {
          const latest = await this.jiraRestService.getIssueDetail<{
            fields?: { customfield_10100?: string }
          }>(issueKey, session.cookies, ['customfield_10100'])
          const cur = latest.fields?.customfield_10100
          if (cur && /T00:00:00/.test(cur)) {
            const hh = String(9 + Math.floor(Math.random() * 9)).padStart(2, '0')
            const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0')
            const newStart = `${cur.slice(0, 10)}T${hh}:${mm}:00.000+0800`
            await this.updateTicket(credentials, {
              issueIdOrKey: issueKey,
              fields: { customfield_10100: newStart },
            })
            changes.startTimeTo = newStart
            pushStep('normalizeStartTime', true, '已校正计划开始时间', {
              planStartTime: newStart,
            })
          }
        } catch (error) {
          const message = `校正计划开始时间失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('normalizeStartTime', false, message)
        }
      }

      // 有字段改动但（已回复态）没有执行转换 → 用独立评论接口补一条说明
      if (!transitionSuccess && hasChanges) {
        await this.postCommentStep(
          issueKey,
          session,
          data.comment ?? this.buildAutoComment({ changes }),
          pushStep,
        )
      }

      const nothingChanged =
        !transitionSuccess && !hasChanges && !changes.startTimeTo

      return {
        success: true,
        status: nothingChanged ? 'unchanged' : 'success',
        issueKey,
        fixVersionName: fixVersion?.version.name,
        devCompleteDate,
        transitionName,
        message: nothingChanged
          ? `工单 ${issueKey} 状态与字段均符合预期，无需调整`
          : transitionSuccess
            ? `工单 ${issueKey} 已执行开发回复`
            : `工单 ${issueKey} 已是回复状态，字段已按需调整`,
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

  private buildAutoComment(options: {
    transitionName?: string
    fixVersionName?: string
    devCompleteDate?: string
    changes: {
      versionTo?: string
      dateFrom?: string
      dateTo?: string
      additionalFields?: boolean
    }
  }): string | undefined {
    const pick = <T>(pool: T[]): T =>
      pool[Math.floor(Math.random() * pool.length)]
    const { changes } = options

    if (options.transitionName) {
      const ver = options.fixVersionName
      const date = options.devCompleteDate
      if (ver && date) {
        return pick([
          `开发已回复，修复版本「${ver}」，预计 ${date} 完成`,
          `已回复，预计 ${date} 完成，修复版本「${ver}」`,
          `已安排开发，修复版本「${ver}」，预计 ${date} 完成`,
        ])
      }
      if (date) {
        return pick([
          `开发已回复，预计 ${date} 完成`,
          `已回复，预计 ${date} 完成`,
        ])
      }
      return '开发已回复'
    }

    const parts: string[] = []
    if (changes.versionTo) {
      parts.push(
        pick([
          `修复版本调整为「${changes.versionTo}」`,
          `修复版本更新至「${changes.versionTo}」`,
          `按最新发版计划，修复版本调整至「${changes.versionTo}」`,
        ]),
      )
    }
    if (changes.dateTo) {
      const from = changes.dateFrom ? `（原 ${changes.dateFrom}）` : ''
      parts.push(
        pick([
          `预计完成时间调整为 ${changes.dateTo}${from}`,
          `排期顺延，预计 ${changes.dateTo} 完成`,
          `与实施沟通过，预计 ${changes.dateTo} 完成`,
        ]),
      )
    }
    if (parts.length === 0 && changes.additionalFields) {
      parts.push('工单信息已同步更新')
    }
    return parts.length ? `${parts.join('，')}。` : undefined
  }

  private async postCommentStep(
    issueKey: string,
    session: JiraSession,
    comment: string | undefined,
    pushStep: (
      step: DevReplyStepName,
      success: boolean,
      message: string,
      data?: Record<string, any>,
    ) => void,
  ): Promise<void> {
    if (!comment) {
      return
    }
    try {
      await this.jiraRestService.addComment(issueKey, session.cookies, comment)
      pushStep('addComment', true, '已补充评论说明')
    } catch (error) {
      const message = `补充评论失败: ${error instanceof Error ? error.message : String(error)}`
      this.logger.warn(message)
      pushStep('addComment', false, message)
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
        unchangedIssueKeys: [],
        results,
      }
    }

    const shouldAllocateAutomatically = !data.devCompleteDate
    const batchAllocationState = shouldAllocateAutomatically
      ? { reservedDates: new Set<string>() }
      : undefined

    const settledResults = shouldAllocateAutomatically
      ? await (async () => {
          const results: PromiseSettledResult<DevReplyResponse>[] = []
          for (const issueKey of data.issueKeys) {
            try {
              const value = await this.executeDevReplyWorkflow(
                resolvedCredentials,
                session,
                {
                  issueKey,
                  projectKey: data.projectKey,
                  assignee: data.assignee,
                  transitionId: data.transitionId,
                  fixVersionId: data.fixVersionId,
                  devCompleteDate: data.devCompleteDate,
                  comment: data.comment,
                  additionalFields: data.additionalFields,
                  reconcile: data.reconcile,
                },
                batchAllocationState,
              )
              results.push({ status: 'fulfilled', value })
            } catch (reason) {
              results.push({ status: 'rejected', reason })
            }
          }
          return results
        })()
      : await Promise.allSettled(
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
              reconcile: data.reconcile,
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
      unchangedIssueKeys: results
        .filter((item) => item.status === 'unchanged')
        .map((item) => item.issueKey),
      results,
    }
  }
}
