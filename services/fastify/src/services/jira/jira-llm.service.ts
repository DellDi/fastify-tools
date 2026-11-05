import { FastifyInstance } from 'fastify'
import { JiraMeta } from '@/schema/jira/meta.js'
import { getJiraConfig, getLLMConfig } from '@/utils/config-helpers.js'
import {
  buildStaticFieldValue,
  classifyJiraField,
  coerceFieldValue,
  matchFieldOptionByText,
  optionLabel,
  PROTECTED_FIELD_IDS,
  type FillableFieldKind,
} from './field-value.utils.js'
import type {
  JiraIssueType,
  JiraProject,
  ProjectIssueTypeMatch,
  ScheduleFieldDecision,
  ScheduleFieldReviewInput,
} from './types.js'

export class JiraLLMService {
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private llmConfig: ReturnType<typeof getLLMConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
    this.llmConfig = getLLMConfig(fastify)
  }

  async matchProjectAndIssueType(
    prompt: string,
    title: string,
    description: string,
    projects: JiraProject[],
    issueTypes: JiraIssueType[],
  ): Promise<ProjectIssueTypeMatch> {
    if (!this.llmConfig.apiKey) {
      this.fastify.log.warn(
        'LLM_API_KEY not provided, using default project and issueType',
      )
      return {
        componentId: this.jiraConfig.defaultComponent,
        projectKey: this.jiraConfig.defaultProject,
        projectName: '默认项目',
        issueTypeId: this.jiraConfig.defaultIssueType,
        issueTypeName: '默认类型',
        confidence: 'low',
      }
    }

    const projectsInfo = projects.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      description: p.description || '',
    }))

    this.fastify.log.info({ projectsInfo, count: projectsInfo.length })

    const issueTypesInfo = issueTypes
      .filter((t) => !t.subtask)
      .map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
      }))

    const systemPrompt = `你是一个专业的 JIRA 项目助手，负责根据用户的需求描述，智能匹配最合适的项目和问题类型。

## 任务说明：
- 分析用户的标题、描述和额外提示信息
- 从提供的项目列表中选择最匹配的项目
- 从提供的问题类型列表中选择最匹配的类型
- 返回 JSON 格式的匹配结果

## 可选项目列表：
${JSON.stringify(projectsInfo, null, 2)}

## 可选问题类型列表：
${JSON.stringify(issueTypesInfo, null, 2)}

## 匹配规则：
1. 优先根据关键词匹配（如 "Bug"、"需求"、"任务" 等）
2. 考虑项目名称和描述的相关性
3. 如果无法确定，选择最通用的选项
4. confidence 字段表示匹配置信度：high(明确匹配)、medium(推测匹配)、low(默认选择)`

    const userPrompt = `## 工单标题：
${title}

## 工单描述：
${description}

## 额外提示：
${prompt || '无'}

请返回 JSON 格式：
{
  "projectKey": "项目KEY",
  "projectName": "项目名称",
  "issueTypeId": "问题类型ID",
  "issueTypeName": "问题类型名称",
  "confidence": "high|medium|low"
}`

    try {
      const response = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ])

      const parsed = JSON.parse(response) as ProjectIssueTypeMatch
      const validProject = projects.find((p) => p.key === parsed.projectKey)
      const validIssueType = issueTypes.find((t) => t.id === parsed.issueTypeId)

      const jiraConfig = getJiraConfig(this.fastify)
      const { components: matchedComponents } =
        await this.fastify.jiraService.getIssueTypes(
          {
            jiraUser: jiraConfig.auth.username || '',
            jiraPassword: jiraConfig.auth.password || '',
          },
          parsed.projectKey,
        )

      if (validProject && validIssueType) {
        this.fastify.log.info(
          `LLM matched:matchedComponents=${JSON.stringify(
            matchedComponents,
          )},issueTypeId=${parsed.issueTypeId}, project=${parsed.projectKey}, issueType=${parsed.issueTypeName}, confidence=${parsed.confidence}`,
        )
        return {
          ...parsed,
          componentId: matchedComponents[0]?.id,
        }
      }

      this.fastify.log.warn(
        'LLM returned invalid project/issueType, using defaults',
      )
    } catch (error) {
      this.fastify.log.error(
        `LLM matching failed: ${error instanceof Error ? error.message : String(error)}`,
      )
    }

    return {
      componentId: this.jiraConfig.defaultComponent,
      projectKey: this.jiraConfig.defaultProject,
      projectName:
        projects.find((p) => p.key === this.jiraConfig.defaultProject)?.name ||
        '默认项目',
      issueTypeId: this.jiraConfig.defaultIssueType,
      issueTypeName:
        issueTypes.find((t) => t.id === this.jiraConfig.defaultIssueType)
          ?.name || '默认类型',
      confidence: 'low',
    }
  }

  /**
   * 单批字段的 LLM 填充：构造提示词、解析响应、逐字段转 Jira 值。
   * 失败时整批回退为确定性取值，不向上抛错。
   */
  private async fillFieldsWithLLM(
    items: Array<{ field: JiraMeta; kind: FillableFieldKind }>,
    summary: string,
    description: string,
    assignee?: string,
  ): Promise<Record<string, any>> {
    const resolveFallback = (): Record<string, any> => {
      const result: Record<string, any> = {}
      for (const { field, kind } of items) {
        const value = buildStaticFieldValue(field, kind, assignee)
        if (value !== undefined) result[field.fieldId] = value
      }
      return result
    }

    try {
      const MAX_OPTIONS = 40
      const fieldsInfo = items.map(({ field, kind }) => {
        const info: Record<string, any> = {
          fieldId: field.fieldId,
          name: field.name,
          valueKind: kind,
        }
        const allowedValues = field.allowedValues ?? []
        if (allowedValues.length > 0 && kind !== 'named') {
          info.options = allowedValues.slice(0, MAX_OPTIONS).map((v) => ({
            label: optionLabel(v),
            ...(v.children?.length
              ? { children: v.children.map((c) => optionLabel(c)) }
              : {}),
          }))
          if (allowedValues.length > MAX_OPTIONS) {
            info.optionsTruncated = allowedValues.length - MAX_OPTIONS
          }
        }
        if (kind === 'date') {
          info.format =
            field.schema?.type === 'datetime'
              ? 'YYYY-MM-DDTHH:mm:ss.SSSZZ'
              : 'YYYY-MM-DD'
        }
        if (kind === 'named') {
          info.hint = '返回合适的 Jira 用户名'
        }
        if (kind === 'multi' && field.schema?.items === 'user') {
          info.hint = '返回逗号分隔的 Jira 用户名'
        }
        return info
      })

      const systemPrompt = `你是一个专业的JIRA问题助手，负责根据问题描述为必填字段生成合适的值。

## 任务说明：
- 请根据提供的"问题标题"和"问题描述"，为每个必填字段生成合适的值
- 每个字段的 valueKind 指明取值方式：
  - text: 返回合适的字符串
  - option: 从 options 中选择最匹配的一项，返回其 label
  - cascading: 返回 "父级label>子级label" 格式
  - multi: 从 options 中选择一项或多项，label 用英文逗号分隔
  - date: 按 format 指定的格式返回日期
  - number: 返回数字
  - named: 返回合适的 Jira 用户名
- optionsTruncated 表示未展示的剩余候选数，若展示的选项都不匹配可返回你认为正确的 label
- 如果无法确定合适的值，也要返回一个值。一定要是明确的，不能出现可能相关字眼
- 必须返回有效的JSON对象，键是字段ID，值是字符串
- 不要包含任何解释性文字，只返回JSON对象

## 必填字段信息：
${JSON.stringify(fieldsInfo)}`

      const userPrompt = `## 问题标题：
${summary}

## 问题描述：
${description}

请为上述必填字段生成合适的值，直接返回JSON对象，格式如下：
{
  "customfield_xxxxx": "值1",
  "customfield_yyyyy": "值2"
}`

      const response = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ])

      let parsed: Record<string, unknown> = {}
      try {
        const raw = JSON.parse(response)
        if (typeof raw === 'object' && raw !== null) {
          parsed = raw as Record<string, unknown>
        }
      } catch (parseError) {
        this.fastify.log.error(
          `Failed to parse LLM response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        )
        throw new Error('解析LLM响应失败，返回的不是有效的JSON格式')
      }

      const result: Record<string, any> = {}
      for (const { field, kind } of items) {
        const value =
          field.fieldId in parsed
            ? coerceFieldValue(field, kind, parsed[field.fieldId], assignee)
            : buildStaticFieldValue(field, kind, assignee)
        if (value !== undefined) result[field.fieldId] = value
      }

      return result
    } catch (error) {
      this.fastify.log.error(
        `Error in genCustomInfo: ${error instanceof Error ? error.message : String(error)}`,
      )
      return resolveFallback()
    }
  }

  async genCustomInfo(
    values: JiraMeta[],
    summary: string,
    description: string,
    assignee?: string,
  ): Promise<Record<string, any>> {
    const fillableFields = values
      .map((field) => ({ field, kind: classifyJiraField(field) }))
      .filter(
        ({ field, kind }) =>
          kind !== null &&
          Boolean(field.fieldId) &&
          field.required &&
          !field.hasDefaultValue &&
          !PROTECTED_FIELD_IDS.has(field.fieldId) &&
          Boolean(field.name) &&
          (!field.operations || field.operations.includes('set')),
      ) as Array<{ field: JiraMeta; kind: FillableFieldKind }>

    if (fillableFields.length === 0) {
      return {}
    }

    // 先用确定性文本匹配处理选项类字段，命中即选定、不进 LLM
    const haystack = `${summary}\n${description}`
    const result: Record<string, any> = {}
    const llmFields = fillableFields.filter(({ field, kind }) => {
      const hit = matchFieldOptionByText(field, kind, haystack)
      if (hit !== undefined) {
        result[field.fieldId] = hit
        return false
      }
      return true
    })

    const resolveFallback = (): Record<string, any> => {
      const fallback: Record<string, any> = {}
      for (const { field, kind } of llmFields) {
        const value = buildStaticFieldValue(field, kind, assignee)
        if (value !== undefined) fallback[field.fieldId] = value
      }
      return fallback
    }

    if (llmFields.length === 0) {
      return result
    }

    if (!this.llmConfig.apiKey) {
      this.fastify.log.warn(
        'LLM_API_KEY not provided, using fallback values for required fields',
      )
      return { ...result, ...resolveFallback() }
    }

    // 分批并行调用，控制单次 prompt 体积；单批失败仅该批回退
    const BATCH_SIZE = 10
    const chunks: Array<Array<{ field: JiraMeta; kind: FillableFieldKind }>> = []
    for (let i = 0; i < llmFields.length; i += BATCH_SIZE) {
      chunks.push(llmFields.slice(i, i + BATCH_SIZE))
    }

    const filled = await Promise.all(
      chunks.map((chunk) =>
        this.fillFieldsWithLLM(chunk, summary, description, assignee),
      ),
    )

    for (const part of filled) {
      Object.assign(result, part)
    }
    return result
  }

  /**
   * 动态时间字段语义评审：让 LLM 根据字段名语义判断哪些排期字段过期/冲突，
   * 返回 keep/update 建议。调用方必须做确定性校验后才可写入；
   * 本方法失败（无 key / 网络 / JSON 非法）时向上抛错由调用方兜底。
   */
  async reviewScheduleFields(
    input: ScheduleFieldReviewInput,
  ): Promise<ScheduleFieldDecision[]> {
    if (!this.llmConfig.apiKey) {
      throw new Error('LLM_API_KEY 未配置，跳过语义评审')
    }
    if (input.fields.length === 0) {
      return []
    }

    const systemPrompt = `你是 Jira 排期巡检助手，负责审查工单上的计划/预计类时间字段是否合理。

## 背景
- 今天是 ${input.today}（${input.weekday}）
- 法定节假日或封网日期：${input.holidays.length ? input.holidays.join('、') : '无'}
- 锚点字段「预计开发完成」当前值：${input.anchorDate || '未设置'}

## 判定规则
1. 已过期（早于今天）的"计划/预计"类字段视为失效，建议 update
2. 名称含"开始"的字段不应晚于锚点「预计开发完成」时间
3. 排期建议值必须是工作日，且不得在节假日/封网日期中
4. 拿不准或当前值合理的字段 action=keep，不要为改而改
5. date 类型字段返回 YYYY-MM-DD；datetime 类型字段返回 YYYY-MM-DDTHH:mm:ss.SSS+0800
6. 本次评审仅从开发排期视角出发；若字段语义属于测试/上线/发布/验收等其他角色的职责范围，一律 keep

只输出 JSON 对象，不要任何解释文字：
{"decisions":[{"fieldId":"字段ID","action":"keep|update","value":"新值(update时必填)","reason":"一句话中文理由"}]}`

    const userPrompt = `工单 ${input.issueKey} 的时间类字段当前值：
${JSON.stringify(input.fields, null, 2)}`

    const response = await this.callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ])

    let parsed: { decisions?: unknown }
    try {
      parsed = JSON.parse(response)
    } catch {
      throw new Error('LLM 返回的不是有效 JSON')
    }

    const raw = Array.isArray(parsed?.decisions) ? parsed.decisions : []
    return raw
      .filter(
        (d): d is ScheduleFieldDecision =>
          !!d &&
          typeof (d as any).fieldId === 'string' &&
          ((d as any).action === 'keep' || (d as any).action === 'update'),
      )
      .map((d) => ({
        fieldId: d.fieldId,
        action: d.action,
        value: typeof d.value === 'string' ? d.value : undefined,
        reason: typeof d.reason === 'string' ? d.reason : undefined,
      }))
  }

  private async callLLM(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const response = await fetch(this.llmConfig.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.llmConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.llmConfig.model,
          messages,
          temperature: 0.1,
          top_p: 0.5,
          response_format: { type: 'json_object' },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`LLM API error: ${response.status} - ${error}`)
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>
      }
      this.fastify.log.info(
        data.choices[0],
        'data.choices[0]?.message?.content?.trim()',
      )

      return data.choices[0]?.message?.content?.trim() || '{}'
    } catch (error: any) {
      this.fastify.log.error('LLM API call failed:', error)
      throw new Error(`调用LLM接口失败: ${error?.message || String(error)}`)
    }
  }
}
