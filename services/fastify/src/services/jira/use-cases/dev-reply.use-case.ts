import { randomUUID } from 'node:crypto'
import type { FastifyBaseLogger } from 'fastify'
import { JiraError, ValidationError } from '@/utils/errors.js'
import { dayjs, expandHolidayDates, isValidDevCompleteDate } from '../utils.js'
import type { JiraRestService } from '../jira-rest.service.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type { ReconcileLogEntry } from '../jira-reconcile-log.repository.js'
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
  ScheduleFieldDecision,
} from '../types.js'

type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

type ReconcileAuditWriter = (entry: ReconcileLogEntry) => Promise<void>

type DevReplyBatchAllocationState = {
  reservedDates: Set<string>
}

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
    batchAllocationState?: DevReplyBatchAllocationState,
  ): Promise<DevReplyResponse> {
    const { issueKey, assignee } = data
    // 未显式指定项目时按工单号前缀推导（ARM-75059 → ARM），支持跨项目混投
    const projectKey = data.projectKey || issueKey.split('-')[0]
    const reconcile = data.reconcile !== false
    // 调用方注入的节假日/封网日期（单日或区间），并入节假日集合统一避开
    const extraHolidayDates = expandHolidayDates(data.extraHolidays ?? [])
    let allHolidays = new Set<string>(extraHolidayDates)
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
          allHolidays = new Set([
            ...holidays,
            ...nextYearHolidays,
            ...extraHolidayDates,
          ])

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

      // 动态时间字段语义巡检：识别 date/datetime 自定义字段 → LLM 按语义建议
      // → 确定性校验 → "开始类字段不晚于预计开发完成"硬规则兜底；失败只记 step
      if (reconcile && this.updateTicket) {
        try {
          const appliedNames = await this.reviewSemanticDateFields({
            issueKey,
            credentials,
            session,
            anchorDate: devCompleteDate,
            holidays: allHolidays,
            pushStep,
          })
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

  /**
   * 动态时间字段语义巡检（reconcile 模式）
   * 1) /rest/api/2/field 识别 date/datetime 自定义字段（排除确定性负责的 customfield_10022）
   * 2) LLM 按字段名语义给 keep/update 建议（注入节假日、锚点日期）
   * 3) 确定性校验：格式、不早于今天、工作日、开始类字段不晚于锚点、新值≠现值
   * 4) 硬规则兜底：无论 LLM 成败，"开始"类字段晚于锚点的一律回退到锚点日
   * 返回实际写入的字段名；失败不向上抛，由调用方记 step
   */
  private async reviewSemanticDateFields(args: {
    issueKey: string
    credentials: JiraLoginCredentials
    session: JiraSession
    anchorDate?: string
    holidays: Set<string>
    pushStep: (
      step: DevReplyStepName,
      success: boolean,
      message: string,
      data?: Record<string, any>,
    ) => void
  }): Promise<string[]> {
    const { issueKey, credentials, session, anchorDate, pushStep } = args
    if (!this.updateTicket) return []

    const today = dayjs()
    const todayStr = today.format('YYYY-MM-DD')
    const holidays = args.holidays.size
      ? args.holidays
      : await this.jiraRestService.getHolidays(today.year())

    const meta = await this.jiraRestService.getFields(session.cookies)
    const dateMeta = meta.filter(
      (field) =>
        field.id.startsWith('customfield_') &&
        field.id !== 'customfield_10022' &&
        (field.schema?.type === 'date' || field.schema?.type === 'datetime'),
    )
    if (!dateMeta.length) {
      pushStep('semanticDateReview', true, '无动态时间字段需要评审')
      return []
    }

    const detail = await this.jiraRestService.getIssueDetail<{
      fields?: Record<string, any>
    }>(
      issueKey,
      session.cookies,
      dateMeta.map((field) => field.id),
    )
    const rawFields = detail.fields ?? {}

    const candidates = dateMeta
      .map((field) => ({
        fieldId: field.id,
        name: field.name,
        type: field.schema!.type as 'date' | 'datetime',
        value: typeof rawFields[field.id] === 'string' ? rawFields[field.id] : '',
      }))
      .filter((item) => /^\d{4}-\d{2}-\d{2}/.test(item.value))

    // 开发视角：测试/上线/发布/验收类排期归其他角色管，不进 LLM 评审也不兜底
    const NON_DEV_FIELD = /测试|上线|发布|验收|交付/
    const devCandidates = candidates.filter((item) => !NON_DEV_FIELD.test(item.name))

    if (!devCandidates.length) {
      pushStep('semanticDateReview', true, '无开发域动态时间字段需要评审')
      return []
    }

    let decisions: ScheduleFieldDecision[] = []
    let llmError: string | undefined
    try {
      decisions = await this.jiraRestService.reviewScheduleFields({
        issueKey,
        today: todayStr,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
          today.day()
        ],
        holidays: [...holidays].sort(),
        anchorDate,
        fields: devCandidates,
      })
    } catch (error) {
      llmError = error instanceof Error ? error.message : String(error)
      this.logger.warn(
        `LLM 语义评审失败(${issueKey})，转入硬规则兜底: ${llmError}`,
      )
    }

    const isWorkDay = (date: string) => {
      const day = dayjs(date).day()
      return day !== 0 && day !== 6 && !holidays.has(date)
    }
    // date 字段写 YYYY-MM-DD；datetime 字段保留 LLM 给的时间，缺省随机工作时段
    const normalizeValue = (
      field: (typeof devCandidates)[number],
      value: string,
    ): string | undefined => {
      const datePart = value.slice(0, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart) || !dayjs(datePart).isValid()) {
        return undefined
      }
      if (field.type === 'date') return datePart
      const tm = /T(\d{2}):(\d{2})/.exec(value)
      const hh = tm ? tm[1] : String(9 + Math.floor(Math.random() * 9)).padStart(2, '0')
      const mm = tm ? tm[2] : String(Math.floor(Math.random() * 60)).padStart(2, '0')
      return `${datePart}T${hh}:${mm}:00.000+0800`
    }

    const updates: Record<string, string> = {}
    const notes: string[] = []
    const isStartField = (name: string) => name.includes('开始')

    for (const decision of decisions) {
      const field = devCandidates.find((item) => item.fieldId === decision.fieldId)
      if (!field || decision.action !== 'update' || !decision.value) continue
      const datePart = decision.value.slice(0, 10)
      if (datePart === field.value.slice(0, 10)) continue
      if (datePart < todayStr) {
        notes.push(`${field.name}: 建议值 ${datePart} 早于今天，拒绝`)
        continue
      }
      if (!isWorkDay(datePart)) {
        notes.push(`${field.name}: 建议值 ${datePart} 为周末/节假日，拒绝`)
        continue
      }
      if (anchorDate && isStartField(field.name) && datePart > anchorDate) {
        notes.push(
          `${field.name}: 建议值 ${datePart} 晚于预计开发完成 ${anchorDate}，拒绝`,
        )
        continue
      }
      const normalized = normalizeValue(field, decision.value)
      if (!normalized) {
        notes.push(`${field.name}: 建议值格式非法，拒绝`)
        continue
      }
      updates[field.fieldId] = normalized
      notes.push(
        `${field.name}: ${decision.reason || '按语义建议调整'} → ${datePart}`,
      )
    }

    // 硬规则兜底（与 LLM 无关）：名称含"开始"的字段不得晚于「预计开发完成」
    if (anchorDate) {
      for (const field of devCandidates) {
        if (updates[field.fieldId] || !isStartField(field.name)) continue
        if (field.value.slice(0, 10) > anchorDate) {
          const normalized = normalizeValue(field, anchorDate)
          if (normalized) {
            updates[field.fieldId] = normalized
            notes.push(
              `${field.name}: 现值晚于预计开发完成，回退至 ${anchorDate}`,
            )
          }
        }
      }
    }

    if (!Object.keys(updates).length) {
      pushStep(
        'semanticDateReview',
        true,
        llmError
          ? `LLM 不可用，硬规则校验通过无需调整（${llmError}）`
          : '动态时间字段评审通过，无需调整',
        { reviewed: devCandidates.length, llmError },
      )
      return []
    }

    await this.updateTicket(credentials, {
      issueIdOrKey: issueKey,
      fields: updates,
    })
    const appliedNames = Object.keys(updates).map(
      (id) => devCandidates.find((item) => item.fieldId === id)?.name ?? id,
    )
    pushStep('semanticDateReview', true, `已调整 ${appliedNames.length} 项时间字段`, {
      reviewed: devCandidates.length,
      applied: Object.keys(updates),
      notes,
      llmError,
    })
    return appliedNames
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

  /**
   * 工作流级会话自愈：步骤内的 401/403 会被各步骤 catch 吞成失败步骤，
   * 因此除了 withSession 捕获的抛错重试外，还要扫结果里的失败步骤——
   * 命中会话失效特征则整单重登重跑一次。
   */
  private async runWorkflowWithSessionRetry(
    credentials: JiraLoginCredentials,
    data: DevReplyData,
    batchAllocationState?: DevReplyBatchAllocationState,
  ): Promise<DevReplyResponse> {
    const result = await this.sessionService.withSession(credentials, (session) =>
      this.executeDevReplyWorkflow(credentials, session, data, batchAllocationState),
    )
    const sessionExpired = result.steps?.some(
      (step) =>
        !step.success && this.sessionService.isSessionExpiredError(step.message),
    )
    if (!sessionExpired) return result
    this.sessionService.invalidate(credentials)
    const fresh = await this.sessionService.login(credentials)
    return this.executeDevReplyWorkflow(credentials, fresh, data, batchAllocationState)
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
    const batchAllocationState = shouldAllocateAutomatically
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
                batchAllocationState,
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
