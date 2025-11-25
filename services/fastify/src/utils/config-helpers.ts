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
    basicToken: string
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
 * 生成 Basic Token
 */
export function generateBasicToken(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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
 * 从 fastify.config 获取 Jira 配置
 */
export function getJiraConfig(fastify: FastifyInstance): JiraConfig {
  const config = fastify.config as any
  
  const username = config.JIRA_USERNAME
  const password = config.JIRA_PASSWORD
  const baseUrl = config.JIRA_BASE_URL || 'http://bug.new-see.com:8088'
  
  return {
    baseUrl,
    auth: {
      username,
      password,
      basicToken: generateBasicToken(username, password)
    },
    defaultProject: config.JIRA_DEFAULT_PROJECT || 'V10',
    defaultIssueType: config.JIRA_DEFAULT_ISSUE_TYPE || '4',
    defaultComponent: config.JIRA_DEFAULT_COMPONENT || '13676',
    defaultPriority: config.JIRA_DEFAULT_PRIORITY || '3',
    endpoints: generateJiraEndpoints(baseUrl)
  }
}

/**
 * 从 fastify.config 获取 LLM 配置
 */
export function getLLMConfig(fastify: FastifyInstance): LLMConfig {
  const config = fastify.config as any
  
  return {
    apiKey: config.DASHSCOPE_API_KEY || '',
    baseUrl: config.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: config.LLM_MODEL || 'qwen3-flash'
  }
}

/**
 * 从 fastify.config 获取认证配置
 */
export function getAuthConfig(fastify: FastifyInstance): AuthConfig {
  const config = fastify.config as any
  
  return {
    bearerToken: config.BEARER_TOKEN
  }
}

/**
 * 从 fastify.config 获取缓存配置
 */
export function getCacheConfig(fastify: FastifyInstance): CacheConfig {
  return {
    sessionPrefix: 'jira-session',
    metaPrefix: 'jira-meta'
  }
}
