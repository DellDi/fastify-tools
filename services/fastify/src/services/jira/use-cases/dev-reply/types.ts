import type {
  DevReplyStepName,
  JiraLoginCredentials,
  JiraUpdateTicketData,
} from '../../types.js'

export type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

export type PushStep = (
  step: DevReplyStepName,
  success: boolean,
  message: string,
  data?: Record<string, any>,
) => void

/** 经办人工作负载排期上下文：全部未完成单的日期占用 + 版本分布 */
export type WorkloadSchedule = {
  assignee: string
  usedDates: Set<string>
  versionCounts: Map<string, { name: string; count: number }>
}

/**
 * 批次共享上下文：批内已分配的日期占用 + 首个工单建好的工作负载上下文。
 * 一次 JQL 建好批内复用，不再每单重查。
 */
export type DevReplyBatchContext = {
  reservedDates: Set<string>
  schedule?: WorkloadSchedule
}

export type StepResult = {
  success: boolean
  message: string
  data?: Record<string, any>
}
