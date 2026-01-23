import { JiraMeta } from '@/schema/jira/meta.js'
import { FastifyInstance } from 'fastify'
import { request } from 'undici'
import { fastifyCache } from '@/utils/cache.js'
import {
  getJiraConfig,
  getLLMConfig,
  getCacheConfig,
} from '@/utils/config-helpers.js'
import {
  dayjs,
  parseVersionDate,
  selectFixVersion,
  findAvailableDate,
} from './utils.js'
import type {
  IssueData,
  JiraCreateResponse,
  JiraProject,
  JiraIssueType,
  JiraVersion,
  JiraTransition,
  JiraSearchResult,
  ProjectIssueTypeMatch,
  JiraComponent,
} from './types.js'

export class JiraRestService {
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private llmConfig: ReturnType<typeof getLLMConfig>
  private cacheConfig: ReturnType<typeof getCacheConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
    this.llmConfig = getLLMConfig(fastify)
    this.cacheConfig = getCacheConfig(fastify)

    // 移除敏感信息日志记录，只记录用户名
    this.fastify.log.info(
      `Jira service initialized for user: ${this.jiraConfig.auth.username}`,
    )
  }

  /**
   * 获取用户有权限的所有项目列表
   */
  async getProjects(cookies: string): Promise<JiraProject[]> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-projects`
    const cached = fastifyCache.get(cacheKey) as JiraProject[] | undefined
    if (cached) {
      return cached
    }

    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/project`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取项目列表失败: HTTP ${response.statusCode}`)
    }

    const projects = (await response.body.json()) as JiraProject[]
    fastifyCache.set(cacheKey, projects)

    return projects
  }

  /**
   * 获取指定项目的问题类型列表
   */
  async getIssueTypes(
    projectKey: string,
    cookies: string,
  ): Promise<{ issueTypes: JiraIssueType[]; components: JiraComponent[] }> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-issuetypes-${projectKey}`
    const cached = fastifyCache.get(cacheKey) as
      | { issueTypes: JiraIssueType[]; components: JiraComponent[] }
      | undefined
    if (cached) {
      return cached
    }

    // Jira Server API v2: 通过 project 接口获取 issueTypes
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/project/${projectKey}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取问题类型失败: HTTP ${response.statusCode}`)
    }

    const projectData = (await response.body.json()) as {
      issueTypes: JiraIssueType[]
      components: JiraComponent[]
    }
    const issueTypes = projectData.issueTypes || []
    const components = projectData.components || []
    fastifyCache.set(cacheKey, { issueTypes, components })
    return { issueTypes, components }
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
    // 如果没有 LLM API Key，返回默认值
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

    this.fastify.log.info({ projects, count: projects.length }) // 順便帶其他資訊

    const projectsInfo = projects.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      description: p.description || '',
    }))

    const issueTypesInfo = issueTypes
      .filter((t) => !t.subtask) // 排除子任务类型
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
      // 验证返回的 projectKey 和 issueTypeId 是否有效
      const validProject = projects.find((p) => p.key === parsed.projectKey)
      const validIssueType = issueTypes.find((t) => t.id === parsed.issueTypeId)

      // 重新获取匹配到的项目信息
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
          componentId:
            matchedComponents[0]?.id || this.jiraConfig.defaultComponent,
        }
      }

      // 如果匹配无效，降级到默认值
      this.fastify.log.warn(
        'LLM returned invalid project/issueType, using defaults',
      )
    } catch (error) {
      this.fastify.log.error('LLM matching failed:', error)
    }

    // 降级：返回默认值
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

  async createIssue(
    restData: { [key: string]: any },
    cookies: string,
    options?: {
      projectKey?: string
      issueTypeId?: string
      componentId?: string
    },
  ) {
    const projectKey =
      options?.projectKey ||
      restData.projectKey ||
      this.jiraConfig.defaultProject
    const issueTypeId =
      options?.issueTypeId ||
      restData.issueTypeId ||
      this.jiraConfig.defaultIssueType
    const componentId = options?.componentId || this.jiraConfig.defaultComponent

    const issueData: IssueData = {
      fields: {
        project: { key: projectKey },
        summary: restData.title,
        issuetype: { id: issueTypeId },
        components: [{ id: componentId }],
        customfield_10000: { id: '13163' }, // 使用对象格式提供 ID
        customfield_12600: {
          id: '15862', // This is the ID for the parent option
          child: {
            id: '15863', // This is the ID for the child option
          },
        },
        customfield_10041: dayjs().format('YYYY-MM-DD'),
        priority: { id: this.jiraConfig.defaultPriority },
        description: restData.description || restData.title,
        assignee: restData.assignee ? { name: restData.assignee } : null,
        ...restData.customAutoFields,
      },
    }

    // 创建 Jira 工单
    const createTicketResponse = await request(
      this.jiraConfig.endpoints.createIssue,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.jiraConfig.auth.proxyAuthToken, // 使用 Nginx 代理认证
          'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
          Cookie: cookies,
        },
        body: JSON.stringify(issueData),
      },
    )

    const responseBody =
      (await createTicketResponse.body.json()) as JiraCreateResponse

    // 检查是否有错误信息
    if (createTicketResponse.statusCode >= 400 || responseBody?.errors) {
      const errorMsg = responseBody.errors
        ? Object.entries(responseBody.errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        : `HTTP ${createTicketResponse.statusCode}`
      throw new Error(`创建 Jira 工单失败: ${errorMsg}`)
    }

    return responseBody
  }

  async createMeta(
    projectKey: string,
    issueTypeId: string,
    cookies: string,
    maxResults: number,
    startAt: number,
  ) {
    const metaInfo = fastifyCache.get(this.cacheConfig.metaPrefix)
    if (metaInfo) {
      return metaInfo
    }
    // 获取创建工单的元数据
    const requestCreateMeta = await request(
      `${this.jiraConfig.endpoints.createMeta}/${projectKey}/issuetypes/${issueTypeId}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
        },
        query: {
          maxResults,
          startAt,
        },
      },
    )

    if (requestCreateMeta.statusCode !== 200) {
      throw new Error(`HTTP ${requestCreateMeta.statusCode}`)
    }

    const responseBody = (await requestCreateMeta.body.json()) as {
      maxResults: number
      startAt: number
      total: number
      isLast: boolean
      values: JiraMeta[]
    }

    const result = {
      maxResults,
      startAt,
      total: responseBody.total,
      isLast: responseBody.isLast,
      values: responseBody.values,
    }

    fastifyCache.set(this.cacheConfig.metaPrefix, result)

    return result
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
    const nameList = ['客户名称', '客户信息']

    const customInfo = values.filter((item) => nameList.includes(item.name))

    const dynamicCustomField: {
      [key: string]: any
    } = {}

    customInfo.forEach((item) => {
      const valueInfo = item.allowedValues.find((obj) =>
        obj.value?.includes(cusstomName),
      )

      if (valueInfo) {
        dynamicCustomField[item.fieldId] = {
          id: valueInfo.id,
        }
      }

      if (valueInfo && valueInfo.children) {
        dynamicCustomField[item.fieldId] = {
          id: valueInfo.id,
          child: {
            id: valueInfo.children[0].id,
          },
        }
      }
    })

    return {
      ...dynamicCustomField,
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
          temperature: 0.1, // 降低随机性，提高确定性
          top_p: 0.5, // 限制候选词范围，提高一致性
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

  /**
   * 获取项目版本列表
   */
  async getProjectVersions(
    projectKey: string,
    cookies: string,
    status?: 'released' | 'unreleased' | 'archived',
  ): Promise<JiraVersion[]> {
    const cacheKey = `${this.cacheConfig.metaPrefix}-versions-${projectKey}-${status || 'all'}`
    const cached = fastifyCache.get(cacheKey) as JiraVersion[] | undefined
    if (cached) {
      return cached
    }

    let url = `${this.jiraConfig.baseUrl}/rest/api/2/project/${projectKey}/versions`
    if (status) {
      url += `?status=${status}`
    }

    const response = await request(url, {
      method: 'GET',
      headers: {
        Cookie: cookies,
        Authorization: this.jiraConfig.auth.proxyAuthToken,
        'Content-Type': 'application/json',
      },
    })

    if (response.statusCode !== 200) {
      throw new Error(`获取项目版本列表失败: HTTP ${response.statusCode}`)
    }

    const versions = (await response.body.json()) as JiraVersion[]
    fastifyCache.set(cacheKey, versions)

    return versions
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
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/search`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql,
          fields,
          maxResults,
        }),
      },
    )

    if (response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `JQL 搜索失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }

    return (await response.body.json()) as JiraSearchResult
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
      this.fastify.log.warn(`Failed to fetch holidays for ${year}:`, error)
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
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueKey}/transitions`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        query: {
          expand: 'transitions.fields',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取工作流转换失败: HTTP ${response.statusCode}`)
    }

    const data = (await response.body.json()) as {
      transitions: JiraTransition[]
    }
    return data.transitions || []
  }

  /**
   * 获取工单详情
   */
  async getIssueDetail<T = Record<string, any>>(
    issueIdOrKey: string,
    cookies: string,
    fields?: string[],
  ): Promise<T> {
    let url = `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueIdOrKey}`
    if (fields?.length) {
      url += `?fields=${fields.join(',')}`
    }

    const response = await request(url, {
      method: 'GET',
      headers: {
        Cookie: cookies,
        Authorization: this.jiraConfig.auth.proxyAuthToken,
        'Content-Type': 'application/json',
      },
    })

    if (response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `获取工单详情失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }

    return (await response.body.json()) as T
  }

  async doTransition(
    issueKey: string,
    cookies: string,
    transitionId: string,
    fields?: Record<string, any>,
    comment?: string,
  ): Promise<void> {
    const body: any = {
      transition: { id: transitionId },
    }

    if (fields && Object.keys(fields).length > 0) {
      body.fields = fields
    }

    if (comment) {
      body.update = {
        comment: [
          {
            add: {
              body: comment,
            },
          },
        ],
      }
    }

    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueKey}/transitions`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check',
        },
        body: JSON.stringify(body),
      },
    )

    if (response.statusCode !== 204 && response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `执行工作流转换失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }
  }

  /**
   * 解析版本名称中的日期
   * 委托给 utils.ts 中的工具函数
   */
  parseVersionDate(versionName: string): Date | null {
    return parseVersionDate(versionName)
  }

  /**
   * 选择合适的修复版本
   * 委托给 utils.ts 中的工具函数
   */
  selectFixVersion(versions: JiraVersion[]): JiraVersion | null {
    return selectFixVersion(versions)
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
      this.fastify.log.warn('Failed to query existing issues:', error)
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
  ): Promise<Record<string, string>> {
    // 1. 筛选出必填的自定义字段 - 当前只处理字符串类型
    const requiredCustomFields = values.filter((field) => {
      const isCustomField = field.fieldId?.startsWith('customfield')
      const isRequired = field.required
      const isStringType = field.schema?.type === 'string'
      return isCustomField && isRequired && isStringType && field.name
    })

    if (requiredCustomFields.length === 0) {
      return {}
    }

    // 如果没有提供 API Key，直接返回字段名作为值
    if (!this.llmConfig.apiKey) {
      this.fastify.log.warn(
        'DASHSCOPE_API_KEY not provided, using field names as values',
      )
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, field.name]),
      )
    }

    try {
      // 2. 构建提示词
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

      // 3. 调用LLM
      const response = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ])

      // 4. 解析响应
      let result: Record<string, string> = {}
      try {
        const parsed = JSON.parse(response)
        // 验证响应格式
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
        this.fastify.log.error('Failed to parse LLM response:', parseError)
        throw new Error('解析LLM响应失败，返回的不是有效的JSON格式')
      }

      // 5. 确保所有必填字段都有值
      for (const field of requiredCustomFields) {
        if (!(field.fieldId in result)) {
          result[field.fieldId] = ''
        }
      }

      return result
    } catch (error) {
      this.fastify.log.error('Error in genCustomInfo:', error)
      // 出错时返回包含所有必填字段的空对象
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, '']),
      )
    }
  }
}
