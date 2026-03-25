/**
 * Jira 服务类型定义
 * 统一管理所有 Jira 相关的接口和类型
 */

// ============================================
// 基础类型
// ============================================

export interface JiraProject {
  id: string
  key: string
  name: string
  description?: string
  projectTypeKey?: string
}

export interface JiraIssueType {
  id: string
  name: string
  description?: string
  subtask: boolean
  iconUrl?: string
}

export interface JiraComponent {
  self: string
  id: string
  name: string
  isAssigneeTypeValid?: string
}

export interface JiraVersion {
  id: string
  name: string
  description?: string
  released: boolean
  archived: boolean
  releaseDate?: string
  startDate?: string
  projectId: number
}

export interface JiraTransition {
  id: string
  name: string
  to: {
    id: string
    name: string
    statusCategory?: {
      id: number
      key: string
      name: string
    }
  }
  hasScreen: boolean
  isGlobal: boolean
  isInitial: boolean
  isConditional: boolean
  fields?: Record<string, any>
}

// ============================================
// 搜索相关
// ============================================

export interface JiraSearchResult {
  startAt: number
  maxResults: number
  total: number
  issues: Array<{
    id: string
    key: string
    fields: Record<string, any>
  }>
}

// ============================================
// LLM 智能匹配相关
// ============================================

export interface ProjectIssueTypeMatch {
  componentId: string
  projectKey: string
  projectName: string
  issueTypeId: string
  issueTypeName: string
  confidence: 'high' | 'medium' | 'low'
}

export interface CustomerCandidate {
  id: string
  label: string
}

export interface CustomerCandidateScore extends CustomerCandidate {
  score: number
  normalizedLabel: string
  matchedPrimaryTokens: string[]
  matchedWeakTokens: string[]
  originalIndex: number
}

export interface CustomerMatchResult {
  bestMatch?: CustomerCandidateScore
  score: number
  rankedCandidates: CustomerCandidateScore[]
}

// ============================================
// 工单创建相关
// ============================================

export interface JiraLoginCredentials {
  jiraUser: string
  jiraPassword: string
}

export interface JiraSession {
  cookies: string
  atlToken: string
}

export interface JiraCreateTicketData {
  title: string
  description: string
  assignee?: string
  customerName?: string
  customAutoFields?: Record<string, any>
  projectKey?: string
  issueTypeId?: string
  smartMatch?: boolean
  matchPrompt?: string
}

export interface JiraUpdateTicketData {
  issueIdOrKey: string
  fields: Record<string, any>
}

export type JiraAttachmentSourceType = 'multipart' | 'local_path' | 'remote_url'

export interface JiraUploadAttachmentData {
  issueIdOrKey: string
  sourceType: JiraAttachmentSourceType
  fileName: string
  mimeType: string
  content: Buffer
  size: number
}

export interface JiraAttachmentResponseItem {
  id: string
  filename: string
  size?: number
  mimeType?: string
  content?: string
  thumbnail?: string
}

export interface JiraUploadAttachmentResponse {
  issueIdOrKey: string
  sourceType: JiraAttachmentSourceType
  fileName: string
  mimeType: string
  size: number
  attachment: JiraAttachmentResponseItem
  message: string
}

export interface JiraCreateTicketResponse {
  issueId: string
  issueKey: string
  issueUrl: string
  updateMsg: string
  matchInfo?: ProjectIssueTypeMatch
}

// ============================================
// 开发回复相关
// ============================================

export interface DevReplyData {
  issueKey: string
  projectKey: string
  assignee: string
  transitionId?: string
  fixVersionId?: string
  devCompleteDate?: string
  comment?: string
  additionalFields?: Record<string, any>
}

export type DevReplyStepName =
  | 'queryUsedDates'
  | 'selectFixVersion'
  | 'allocateDevCompleteDate'
  | 'updateFields'
  | 'getTransitions'
  | 'doTransition'

export interface DevReplyStepResult {
  step: DevReplyStepName
  success: boolean
  message: string
  data?: Record<string, any>
}

export interface DevReplyResponse {
  success: boolean
  status?: 'success' | 'partial_success' | 'failure'
  issueKey: string
  fixVersionName?: string
  devCompleteDate?: string
  transitionName?: string
  message: string
  fieldUpdateSuccess?: boolean
  transitionSuccess?: boolean
  steps?: DevReplyStepResult[]
  successfulSteps?: DevReplyStepName[]
  failedSteps?: DevReplyStepName[]
}

export interface DevReplyOptions {
  transitionId?: string
  fixVersionId?: string
  devCompleteDate?: string
  comment?: string
  additionalFields?: Record<string, any>
}

export interface DevReplyBatchData {
  issueKeys: string[]
  projectKey: string
  assignee: string
  transitionId?: string
  fixVersionId?: string
  devCompleteDate?: string
  comment?: string
  additionalFields?: Record<string, any>
}

export interface DevReplyBatchResponse {
  total: number
  successCount: number
  failureCount: number
  successfulIssueKeys: string[]
  failedIssueKeys: string[]
  results: DevReplyResponse[]
}

// ============================================
// REST API 相关
// ============================================

export interface JiraCreateResponse {
  errors?: Record<string, string>
  id?: string
  key?: string
}

export type IssueData = {
  fields: {
    project: { key: string }
    summary: string
    issuetype: { id: string }
    components: Array<{ id: string }>
    customfield_10000: { id: string }
    customfield_12600: {
      id: string
      child: {
        id: string
      }
    }
    customfield_10041: string
    priority: { id: string }
    description: string
    assignee: { name: string } | null
    [key: string]: any
  }
}
