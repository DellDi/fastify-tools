import { randomUUID } from 'node:crypto'
import type { FastifyBaseLogger } from 'fastify'
import { JiraError, ValidationError } from '@/utils/errors.js'
import { expandHolidayDates, getValidVersions } from '../utils.js'
import type { JiraRestService } from '../jira-rest.service.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type { ReconcileLogEntry } from '../jira-reconcile-log.repository.js'
import {
  buildWorkloadSchedule,
  chooseFixVersion,
  decideDevCompleteDate,
  type FixVersionPick,
} from './dev-reply/schedule.js'
import { reviewSemanticDateFields } from './dev-reply/semantic-review.js'
import type {
  DevReplyBatchContext,
  PushStep,
  UpdateTicketHandler,
} from './dev-reply/types.js'
import type {
  DevReplyBatchData,
  DevReplyBatchResponse,
  DevReplyData,
  DevReplyResponse,
  DevReplyStepName,
  DevReplyStepResult,
  JiraLoginCredentials,
  JiraSession,
} from '../types.js'

type ReconcileAuditWriter = (entry: ReconcileLogEntry) => Promise<void>

export class DevReplyUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private jiraRestService: JiraRestService,
    private sessionService: JiraSessionService,
    private updateTicket?: UpdateTicketHandler,
    private auditWriter?: ReconcileAuditWriter,
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
    batchContext?: DevReplyBatchContext,
  ): Promise<DevReplyResponse> {
    const { issueKey, assignee } = data
    // 未显式指定项目时按工单号前缀推导（ARM-75059 → ARM），支持跨项目混投
    const projectKey = data.projectKey || issueKey.split('-')[0]
    const reconcile = data.reconcile !== false
    // 调用方注入的节假日/封网日期（单日或区间），并入节假日集合统一避开
    const extraHolidayDates = expandHolidayDates(data.extraHolidays ?? [])
    let allHolidays = new Set<string>(extraHolidayDates)
    const steps: DevReplyStepResult[] = []
    // 决策推理链：每一步"为什么这么决定"逐条落审计
    const reasoning: string[] = []
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
      let currentFixVersions: Array<{ id: string; name: string }> = []
      let currentDevDate: string | undefined
      let currentStatusName = ''

      if (reconcile) {
        try {
          const detail = await this.jiraRestService.getIssueDetail<{
            fields?: {
              fixVersions?: Array<{ id: string; name?: string }>
              customfield_10022?: string
              status?: { name?: string }
            }
          }>(issueKey, session.cookies, [
            'fixVersions',
            'customfield_10022',
            'status',
          ])
          currentFixVersions = (detail.fields?.fixVersions ?? []).map(
            (version) => ({ id: version.id, name: version.name ?? version.id }),
          )
          currentDevDate = detail.fields?.customfield_10022
          currentStatusName = detail.fields?.status?.name ?? ''
          pushStep('queryCurrentState', true, '已读取工单现状', {
            fixVersions: currentFixVersions.map((v) => v.id),
            devCompleteDate: currentDevDate,
            status: currentStatusName,
          })
        } catch (error) {
          const message = `读取工单现状失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('queryCurrentState', false, message)
        }
      }

      // 工作负载排期上下文：经办人全部未完成单的日期占用 + 版本分布。
      // 批内首个工单一次 JQL 建好缓存在 batchContext，后续工单直接复用。
      const workload = await buildWorkloadSchedule({
        jiraRestService: this.jiraRestService,
        logger: this.logger,
        assignee,
        cookies: session.cookies,
        reconcile,
        currentDevDate,
        batchContext,
      })
      const { usedDates, versionCounts } = workload
      if (workload.reason) reasoning.push(workload.reason)
      pushStep(
        'queryUsedDates',
        workload.step.success,
        workload.step.message,
        workload.step.data,
      )

      let fixVersion: FixVersionPick | null = null
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
          // 节假日提前取（版本容量判断也要用）：今年+明年，接口有缓存
          const currentYear = new Date().getFullYear()
          const holidays = await this.jiraRestService.getHolidays(currentYear)
          const nextYearHolidays = await this.jiraRestService.getHolidays(
            currentYear + 1,
          )
          allHolidays = new Set([
            ...holidays,
            ...nextYearHolidays,
            ...extraHolidayDates,
          ])

          const choice = await chooseFixVersion({
            jiraRestService: this.jiraRestService,
            validVersions: getValidVersions(versions),
            currentFixVersions,
            issueKey,
            usedDates,
            holidays: allHolidays,
            versionCounts,
          })
          reasoning.push(...choice.reasons)
          if (choice.pick) {
            fixVersion = choice.pick
            fixVersionId = choice.pick.version.id
            this.logger.info(
              `Selected fix version: ${choice.pick.version.name} (${choice.pick.version.id}) tier=${choice.tier}`,
            )
            pushStep(
              'selectFixVersion',
              true,
              choice.tier === 'keep' ? '现有修复版本仍可行，保留' : '已自动选择修复版本',
              {
                fixVersionId,
                fixVersionName: choice.pick.version.name,
                tier: choice.tier,
                reasoning: choice.reasons,
              },
            )
          } else {
            pushStep('selectFixVersion', false, '所有未发布版本均无剩余容量', {
              reasoning: choice.reasons,
            })
          }
        } catch (error) {
          const message = `获取项目版本失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('selectFixVersion', false, message)
        }
      }

      // 日期决策：现有日期在版本窗口内有效且未被他人占用 → 保留；
      // 否则记明失效原因，分配窗口内最近可工作日（一日一单）
      const dateDecision = decideDevCompleteDate({
        explicitDate: data.devCompleteDate,
        reconcile,
        currentDevDate,
        fixVersion,
        usedDates,
        holidays: allHolidays,
      })
      const devCompleteDate = dateDecision.devCompleteDate
      if (dateDecision.reservedDate) {
        batchContext?.reservedDates.add(dateDecision.reservedDate)
        this.logger.info(`Allocated dev complete date: ${dateDecision.reservedDate}`)
      }
      reasoning.push(...dateDecision.reasons)
      pushStep(
        'allocateDevCompleteDate',
        dateDecision.step.success,
        dateDecision.step.message,
        dateDecision.step.data,
      )

      // fixVersions 是单选语义：仅当现状恰好是 [目标版本] 时才视为符合预期，
      // 多选包含目标或其他版本都要整体替换为单选
      const versionNeedsUpdate =
        !!fixVersionId &&
        !(
          reconcile &&
          currentFixVersions.length === 1 &&
          currentFixVersions[0].id === fixVersionId
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
        semanticFieldNames?: string[]
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
        // 无内容可写有两种情形：现状合规（无需更新）或缺少可行版本/日期
        // （想写写不了）——措辞要区分开，否则审计看着像合规
        const nothingToWrite = !fixVersionId && !devCompleteDate
        pushStep(
          'updateFields',
          true,
          nothingToWrite
            ? '缺少确定的修复版本与预计完成时间，无字段可写'
            : '字段均符合预期，无需更新',
          { skipped: true },
        )
      }

      // 开发回复转换的必需输入缺失（Jira 转换校验器要求预计开发完成非空）——
      // 工单尚需转换却拿不出日期时，撞转换只会得到一个 400。直接短路。
      const needsTransition = !(reconcile && currentStatusName.includes('回复'))
      if (needsTransition && !devCompleteDate) {
        reasoning.push(
          '结论：未能确定预计开发完成时间（开发回复转换必需字段），不尝试工作流转换',
        )
        if (fieldUpdateSuccess) {
          return {
            success: true,
            status: 'partial_success',
            issueKey,
            fixVersionName: fixVersion?.version.name,
            devCompleteDate,
            message: `工单 ${issueKey} 字段已更新，但缺少预计开发完成时间，未执行工作流转换`,
            fieldUpdateSuccess,
            transitionSuccess,
            steps,
            reasoning,
            ...this.buildStepSummary(steps),
          }
        }
        return this.buildDevReplyFailure(
          issueKey,
          '未能确定预计开发完成时间，无法执行开发回复',
          steps,
          {
            fixVersionName: fixVersion?.version.name,
            fieldUpdateSuccess,
            transitionSuccess,
            reasoning,
          },
        )
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
          reasoning.push(`结论：字段已更新，但工作流转换失败 → ${message}`)
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
            reasoning,
            ...this.buildStepSummary(steps),
          }
        }
        reasoning.push(`结论：工作流转换获取失败 → ${message}`)
        return this.buildDevReplyFailure(issueKey, message, steps, {
          fixVersionName: fixVersion?.version.name,
          devCompleteDate,
          fieldUpdateSuccess,
          transitionSuccess,
          reasoning,
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
            reasoning.push(`结论：字段已更新，但工作流转换失败 → ${message}`)
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
              reasoning,
              ...this.buildStepSummary(steps),
            }
          }
          reasoning.push(`结论：工作流转换执行失败 → ${message}`)
          return this.buildDevReplyFailure(issueKey, message, steps, {
            fixVersionName: fixVersion?.version.name,
            devCompleteDate,
            transitionName,
            fieldUpdateSuccess,
            transitionSuccess,
            reasoning,
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

      // 动态时间字段语义巡检：识别 date/datetime 自定义字段 → LLM 按语义建议
      // → 确定性校验 → "开始类字段不晚于预计开发完成"硬规则兜底；失败只记 step
      if (reconcile && this.updateTicket) {
        try {
          const appliedNames = await reviewSemanticDateFields(
            {
              jiraRestService: this.jiraRestService,
              updateTicket: this.updateTicket,
              logger: this.logger,
            },
            {
              issueKey,
              credentials,
              session,
              anchorDate: devCompleteDate,
              holidays: allHolidays,
              reasoning,
              pushStep,
            },
          )
          if (appliedNames.length) {
            changes.semanticFieldNames = appliedNames
          }
        } catch (error) {
          const message = `动态时间字段语义巡检失败: ${error instanceof Error ? error.message : String(error)}`
          this.logger.warn(message)
          pushStep('semanticDateReview', false, message)
        }
      }

      // 有字段改动但（已回复态）没有执行转换 → 用独立评论接口补一条说明；
      // 转换已执行但语义巡检另有调整时，转换评论覆盖不到，也需补评
      const semanticChanged = !!changes.semanticFieldNames?.length
      if ((hasChanges || semanticChanged) && (!transitionSuccess || semanticChanged)) {
        await this.postCommentStep(
          issueKey,
          session,
          data.comment ?? this.buildAutoComment({ changes }),
          pushStep,
        )
      }

      const nothingChanged =
        !transitionSuccess &&
        !hasChanges &&
        !changes.startTimeTo &&
        !semanticChanged

      // 结论行：推理链最后一行，概括"为什么动/为什么不动"
      reasoning.push(
        nothingChanged
          ? `结论：${issueKey} 版本与日期均可行，巡检未产生改动 → 不做任何修改`
          : `结论：${issueKey} ` +
              [
                changes.versionTo && `版本调整为「${changes.versionTo}」`,
                changes.dateTo &&
                  `预计开发完成 ${changes.dateFrom ?? '未填'}→${changes.dateTo}`,
                changes.startTimeTo &&
                  `计划开始时间校正为 ${changes.startTimeTo.slice(0, 16).replace('T', ' ')}`,
                changes.semanticFieldNames?.length &&
                  `语义巡检调整 ${changes.semanticFieldNames.length} 项（${changes.semanticFieldNames.join('、')}）`,
                changes.additionalFields && '同步更新附加字段',
                transitionSuccess &&
                  transitionName &&
                  `工作流转换为「${transitionName}」`,
              ]
                .filter(Boolean)
                .join('；'),
      )

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
        reasoning,
        ...this.buildStepSummary(steps),
      }
    } catch (error) {
      const message = `开发回复执行异常: ${error instanceof Error ? error.message : String(error)}`
      this.logger.error(message)
      reasoning.push(`结论：执行异常 → ${message}`)
      return this.buildDevReplyFailure(issueKey, message, steps, { reasoning })
    }
  }

  /**
   * 巡检审计：把单工单执行结果写入审计表；写库失败只告警不阻塞
   */
  private async writeAudit(
    batchId: string,
    result: DevReplyResponse,
    assignee?: string,
    projectKey?: string,
  ): Promise<void> {
    if (!this.auditWriter) return
    try {
      await this.auditWriter({
        batchId,
        issueKey: result.issueKey,
        projectKey,
        assignee,
        status: result.status ?? (result.success ? 'success' : 'failure'),
        message: result.message,
        durationMs: result.durationMs,
        details: {
          fixVersionName: result.fixVersionName,
          devCompleteDate: result.devCompleteDate,
          transitionName: result.transitionName,
          successfulSteps: result.successfulSteps,
          failedSteps: result.failedSteps,
          reasoning: result.reasoning,
          steps: result.steps,
        },
      })
    } catch (error) {
      this.logger.warn(
        `巡检审计写入失败(${result.issueKey}): ${error instanceof Error ? error.message : String(error)}`,
      )
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
      semanticFieldNames?: string[]
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
    if (changes.semanticFieldNames?.length) {
      const names = changes.semanticFieldNames.join('、')
      parts.push(
        pick([
          `「${names}」已同步调整`,
          `相关计划时间（${names}）已同步更新`,
          `一并校正了「${names}」`,
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
    pushStep: PushStep,
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

  /**
   * 工作流级会话自愈：步骤内的 401/403 会被各步骤 catch 吞成失败步骤，
   * 因此除了 withSession 捕获的抛错重试外，还要扫结果里的失败步骤——
   * 命中会话失效特征则整单重登重跑一次。
   */
  private async runWorkflowWithSessionRetry(
    credentials: JiraLoginCredentials,
    data: DevReplyData,
    batchContext?: DevReplyBatchContext,
  ): Promise<DevReplyResponse> {
    const result = await this.sessionService.withSession(credentials, (session) =>
      this.executeDevReplyWorkflow(credentials, session, data, batchContext),
    )
    const sessionExpired = result.steps?.some(
      (step) =>
        !step.success && this.sessionService.isSessionExpiredError(step.message),
    )
    if (!sessionExpired) return result
    this.sessionService.invalidate(credentials)
    const fresh = await this.sessionService.login(credentials)
    return this.executeDevReplyWorkflow(credentials, fresh, data, batchContext)
  }

  async devReply(
    credentials: Partial<JiraLoginCredentials> | undefined,
    data: DevReplyData,
  ): Promise<DevReplyResponse> {
    const resolvedCredentials = this.sessionService.resolveCredentials(credentials)

    try {
      const startedAt = Date.now()
      const result = await this.runWorkflowWithSessionRetry(
        resolvedCredentials,
        data,
      )
      result.durationMs = Date.now() - startedAt
      await this.writeAudit(
        randomUUID(),
        result,
        data.assignee,
        data.projectKey ?? data.issueKey.split('-')[0],
      )
      return result
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
    const batchId = randomUUID()

    try {
      await this.sessionService.getSession(resolvedCredentials)
    } catch (error) {
      const message = `开发回复前置登录失败: ${error instanceof Error ? error.message : String(error)}`
      const results = data.issueKeys.map((issueKey) =>
        this.buildDevReplyFailure(issueKey, message),
      )

      await Promise.all(
        results.map((item) =>
          this.writeAudit(
            batchId,
            item,
            data.assignee,
            data.projectKey ?? item.issueKey.split('-')[0],
          ),
        ),
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
    const batchContext = shouldAllocateAutomatically
      ? { reservedDates: new Set<string>() }
      : undefined

    const settledResults = shouldAllocateAutomatically
      ? await (async () => {
          const results: PromiseSettledResult<DevReplyResponse>[] = []
          for (const issueKey of data.issueKeys) {
            try {
              const startedAt = Date.now()
              const value = await this.runWorkflowWithSessionRetry(
                resolvedCredentials,
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
                  extraHolidays: data.extraHolidays,
                },
                batchContext,
              )
              value.durationMs = Date.now() - startedAt
              results.push({ status: 'fulfilled', value })
            } catch (reason) {
              results.push({ status: 'rejected', reason })
            }
          }
          return results
        })()
      : await Promise.allSettled(
          data.issueKeys.map(async (issueKey) => {
            const startedAt = Date.now()
            const value = await this.runWorkflowWithSessionRetry(
              resolvedCredentials,
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
                extraHolidays: data.extraHolidays,
              },
            )
            value.durationMs = Date.now() - startedAt
            return value
          }),
        )

    const results = settledResults.map((result, index) =>
      result.status === 'fulfilled'
        ? result.value
        : this.buildDevReplyFailure(
            data.issueKeys[index],
            `开发回复执行异常: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`,
          ),
    )

    await Promise.all(
      results.map((item) =>
        this.writeAudit(
          batchId,
          item,
          data.assignee,
          data.projectKey ?? item.issueKey.split('-')[0],
        ),
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
