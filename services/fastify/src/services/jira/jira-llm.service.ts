import { FastifyInstance } from 'fastify'
import { JiraMeta } from '@/schema/jira/meta.js'
import { getJiraConfig, getLLMConfig } from '@/utils/config-helpers.js'
import type {
  JiraIssueType,
  JiraProject,
  ProjectIssueTypeMatch,
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
        'DASHSCOPE_API_KEY not provided, using default project and issueType',
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
          componentId: matchedComponents[0]?.id || this.jiraConfig.defaultComponent,
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

  async genCustomInfo(
    values: JiraMeta[],
    summary: string,
    description: string,
  ): Promise<Record<string, string>> {
    const requiredCustomFields = values.filter((field) => {
      const isCustomField = field.fieldId?.startsWith('customfield')
      const isRequired = field.required
      const isStringType = field.schema?.type === 'string'
      return isCustomField && isRequired && isStringType && field.name
    })

    if (requiredCustomFields.length === 0) {
      return {}
    }

    if (!this.llmConfig.apiKey) {
      this.fastify.log.warn(
        'DASHSCOPE_API_KEY not provided, using field names as values',
      )
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, field.name]),
      )
    }

    try {
      const fieldsInfo = requiredCustomFields.map((field) => ({
        fieldId: field.fieldId,
        name: field.name,
        description:
          'schema' in field &&
          field.schema &&
          typeof field.schema === 'object' &&
          'custom' in field.schema
            ? `字段类型：${field.schema.type}，控件类型:${field.schema.custom}`
            : '无描述信息',
      }))

      const systemPrompt = `你是一个专业的JIRA问题助手，负责根据问题描述为必填字段生成合适的值。

## 任务说明：
- 请根据提供的"问题标题"和"问题描述"，为每个必填字段生成合适的值
- 请确保生成的值符合字段的描述要求
- 如果无法确定合适的值，也要返回一个值。一定要是明确的，不能出现可能相关字眼
- 必须返回有效的JSON对象，键是字段ID，值是字符串
- 不要包含任何解释性文字，只返回JSON对象

## 必填字段信息：
${JSON.stringify(fieldsInfo, null, 2)}`

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

      let result: Record<string, string> = {}
      try {
        const parsed = JSON.parse(response)
        if (typeof parsed === 'object' && parsed !== null) {
          result = Object.fromEntries(
            Object.entries(parsed).filter(
              ([key, value]) =>
                typeof key === 'string' &&
                key.startsWith('customfield') &&
                typeof value === 'string',
            ),
          ) as Record<string, string>
        }
      } catch (parseError) {
        this.fastify.log.error(
          `Failed to parse LLM response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        )
        throw new Error('解析LLM响应失败，返回的不是有效的JSON格式')
      }

      for (const field of requiredCustomFields) {
        if (!(field.fieldId in result)) {
          result[field.fieldId] = ''
        }
      }

      return result
    } catch (error) {
      this.fastify.log.error(
        `Error in genCustomInfo: ${error instanceof Error ? error.message : String(error)}`,
      )
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, '']),
      )
    }
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
