import { FastifyInstance } from 'fastify'

export interface JiraEndpoints {
  session: string
  createIssue: string
  updateIssue: string
  createMeta: string
}

export interface JiraConfig {
  baseUrl: string
  auth: {
    username: string
    password: string
    proxyAuthToken: string
  }
  defaultProject: string
  defaultIssueType: string
  defaultComponent: string
  defaultPriority: string
  endpoints: JiraEndpoints
}

export interface LLMConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export interface AuthConfig {
  bearerToken: string
}

export interface CacheConfig {
  sessionPrefix: string
  metaPrefix: string
}

/**
 * 生成 Jira 端点配置
 */
export function generateJiraEndpoints(baseUrl: string): JiraEndpoints {
  return {
    session: `${baseUrl}/rest/auth/1/session`,
    createIssue: `${baseUrl}/rest/api/2/issue`,
    updateIssue: `${baseUrl}/rest/api/2/issue`,
    createMeta: `${baseUrl}/rest/api/2/issue/createmeta`
  }
}

/**
 * 从 fastify?.config 获取 Jira 配置
 */
export function getJiraConfig(fastify: FastifyInstance): JiraConfig {
  const config = fastify.config as any

  const username = config.JIRA_USERNAME
  const password = config.JIRA_PASSWORD
  const baseUrl = config.JIRA_BASE_URL || 'http://bug.new-see.com:8088'
  const proxyAuthToken = config.JIRA_PROXY_AUTH || 'Basic bmV3c2VlOm5ld3NlZQ=='

  return {
    baseUrl,
    auth: {
      username,
      password,
      proxyAuthToken
    },
    defaultProject: config.JIRA_DEFAULT_PROJECT || 'NDE',
    defaultIssueType: config.JIRA_DEFAULT_ISSUE_TYPE || '4',
    defaultComponent: config.JIRA_DEFAULT_COMPONENT || '15775',
    defaultPriority: config.JIRA_DEFAULT_PRIORITY || '3',
    endpoints: generateJiraEndpoints(baseUrl)
  }
}

/**
 * 从 fastify?.config 获取 LLM 配置
 */
export function getLLMConfig(fastify: FastifyInstance): LLMConfig {
  const config = fastify?.config as any

  return {
    apiKey: config.DASHSCOPE_API_KEY || '',
    baseUrl: config.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: config.LLM_MODEL || 'qwen-flash'
  }
}

/**
 * 从 fastify?.config 获取认证配置
 */
export function getAuthConfig(fastify: FastifyInstance): AuthConfig {
  const config = fastify?.config as any

  return {
    bearerToken: config.BEARER_TOKEN
  }
}

/**
 * 从 fastify?.config 获取缓存配置
 */
export function getCacheConfig(fastify: FastifyInstance): CacheConfig {
  return {
    sessionPrefix: 'jira-session',
    metaPrefix: 'jira-meta'
  }
}
