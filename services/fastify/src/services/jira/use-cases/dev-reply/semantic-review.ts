import type { FastifyBaseLogger } from 'fastify'
import { dayjs } from '../../utils.js'
import type { JiraRestService } from '../../jira-rest.service.js'
import type {
  JiraLoginCredentials,
  JiraSession,
  ScheduleFieldDecision,
} from '../../types.js'
import type { PushStep, UpdateTicketHandler } from './types.js'

/**
 * 动态时间字段语义巡检（reconcile 模式）
 * 1) /rest/api/2/field 识别 date/datetime 自定义字段（排除确定性负责的 customfield_10022）
 * 2) LLM 按字段名语义给 keep/update 建议（注入节假日、锚点日期）
 * 3) 确定性校验：格式、不早于今天、工作日、开始类字段不晚于锚点、新值≠现值；
 *    "开始"类字段值 ≤ 今天属已发生的历史锚点，不判过期/周末、日期不可被改写
 * 4) 硬规则兜底：无论 LLM 成败，"开始"类字段晚于锚点的一律回退到锚点日
 * 返回实际写入的字段名；失败不向上抛，由调用方记 step
 */
export async function reviewSemanticDateFields(
  deps: {
    jiraRestService: JiraRestService
    updateTicket?: UpdateTicketHandler
    logger: FastifyBaseLogger
  },
  args: {
    issueKey: string
    credentials: JiraLoginCredentials
    session: JiraSession
    anchorDate?: string
    holidays: Set<string>
    reasoning?: string[]
    pushStep: PushStep
  },
): Promise<string[]> {
  const { jiraRestService, updateTicket, logger } = deps
  const { issueKey, credentials, session, anchorDate, pushStep } = args
  if (!updateTicket) return []

  const today = dayjs()
  const todayStr = today.format('YYYY-MM-DD')
  const holidays = args.holidays.size
    ? args.holidays
    : await jiraRestService.getHolidays(today.year())

  const meta = await jiraRestService.getFields(session.cookies)
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

  const detail = await jiraRestService.getIssueDetail<{
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

  const isWorkDay = (date: string) => {
    const day = dayjs(date).day()
    return day !== 0 && day !== 6 && !holidays.has(date)
  }
  const isStartField = (name: string) => name.includes('开始')
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

  // 违规预扫描：只有存在确定性违规的字段才允许被改写——
  // LLM 的建议必须对应一个真实违规，不许"为改而改"。
  // 历史事实类字段（接单/创建/评审通过/实际…）过去时间是正常态，不算过期；
  // "开始"类字段值 ≤ 今天代表开发已启动，属历史锚点而非排期漂移，同样不判
  const HISTORICAL_FIELD = /接单|创建|提交|申请|登记|记录|实际|通过|批准/
  const startAlreadyBegan = (name: string, datePart: string) =>
    isStartField(name) && datePart <= todayStr
  const violations = new Map<string, string[]>()
  for (const field of devCandidates) {
    const datePart = field.value.slice(0, 10)
    const list: string[] = []
    const began = startAlreadyBegan(field.name, datePart)
    if (datePart < todayStr && !HISTORICAL_FIELD.test(field.name) && !began) {
      list.push('已过期')
    }
    if (!isWorkDay(datePart) && !began) list.push('落在周末/节假日')
    if (anchorDate && isStartField(field.name) && datePart > anchorDate) {
      list.push('晚于预计开发完成')
    }
    if (field.type === 'datetime' && /T00:00:00/.test(field.value)) {
      list.push('零点占位时间')
    }
    if (list.length) violations.set(field.fieldId, list)
  }
  if (!violations.size) {
    pushStep(
      'semanticDateReview',
      true,
      `${devCandidates.length} 个开发域时间字段全部合规，跳过评审`,
      { reviewed: devCandidates.length },
    )
    args.reasoning?.push(
      `语义巡检预扫描：${devCandidates.length} 个开发域时间字段全部合规 → 跳过`,
    )
    return []
  }
  const violationLines = [...violations.entries()].map(
    ([fieldId, list]) =>
      `${devCandidates.find((f) => f.fieldId === fieldId)?.name ?? fieldId}: ${list.join('、')}`,
  )
  args.reasoning?.push(`语义巡检预扫描发现违规：${violationLines.join('；')}`)

  let decisions: ScheduleFieldDecision[] = []
  let llmError: string | undefined
  try {
    decisions = await jiraRestService.reviewScheduleFields({
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
    logger.warn(`LLM 语义评审失败(${issueKey})，转入硬规则兜底: ${llmError}`)
  }

  const updates: Record<string, string> = {}
  const notes: string[] = []

  for (const decision of decisions) {
    const field = devCandidates.find((item) => item.fieldId === decision.fieldId)
    if (!field || decision.action !== 'update' || !decision.value) continue
    if (!violations.has(field.fieldId)) {
      notes.push(
        `${field.name}: 字段无违规，忽略 LLM 改写建议（${decision.value.slice(0, 10)}）`,
      )
      continue
    }
    const datePart = decision.value.slice(0, 10)
    if (datePart === field.value.slice(0, 10)) continue
    // 已启动的"开始"类字段：日期是已发生事实，LLM 挪日期一律拒绝
    // （字段因零点占位等其他违规进入评审时，仍只允许动时间部分）
    if (startAlreadyBegan(field.name, field.value.slice(0, 10))) {
      notes.push(`${field.name}: 开发已启动属历史锚点，拒绝改写日期（${datePart}）`)
      continue
    }
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
      `${field.name}: ${violations.get(field.fieldId)!.join('、')} → ${decision.reason || '按语义建议调整'} → ${datePart}`,
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
          notes.push(`${field.name}: 现值晚于预计开发完成，回退至 ${anchorDate}`)
        }
      }
    }
  }
  args.reasoning?.push(...notes)

  if (!Object.keys(updates).length) {
    args.reasoning?.push(
      `语义巡检：违规字段未产生改动（${llmError ? 'LLM 不可用' : 'LLM 建议保留或建议值被校验拒绝'}）`,
    )
    pushStep(
      'semanticDateReview',
      true,
      llmError
        ? `LLM 不可用，硬规则校验通过无需调整（${llmError}）`
        : '动态时间字段评审通过，无需调整',
      { reviewed: devCandidates.length, violations: violationLines, notes, llmError },
    )
    return []
  }

  await updateTicket(credentials, {
    issueIdOrKey: issueKey,
    fields: updates,
  })
  const appliedNames = Object.keys(updates).map(
    (id) => devCandidates.find((item) => item.fieldId === id)?.name ?? id,
  )
  pushStep('semanticDateReview', true, `已调整 ${appliedNames.length} 项时间字段`, {
    reviewed: devCandidates.length,
    applied: Object.keys(updates),
    violations: violationLines,
    notes,
    llmError,
  })
  return appliedNames
}
