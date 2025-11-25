/**
 * 自定义错误类基类
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly timestamp: string

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()

    // 确保错误堆栈正确显示
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 验证错误 - 400
 */
export class ValidationError extends AppError {
  public details?: any

  constructor(message: string = '请求参数验证失败', details?: any) {
    super(message, 400)
    this.details = details
  }
}

/**
 * 认证错误 - 401
 */
export class AuthenticationError extends AppError {
  constructor(message: string = '认证失败') {
    super(message, 401)
  }
}

/**
 * 授权错误 - 403
 */
export class AuthorizationError extends AppError {
  constructor(message: string = '权限不足') {
    super(message, 403)
  }
}

/**
 * 资源未找到错误 - 404
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源未找到') {
    super(message, 404)
  }
}

/**
 * 业务逻辑错误 - 422
 */
export class BusinessError extends AppError {
  constructor(message: string = '业务逻辑错误') {
    super(message, 422)
  }
}

/**
 * Jira 相关错误
 */
export class JiraError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(`Jira 操作失败: ${message}`, statusCode)
  }
}

/**
 * Jira 登录错误
 */
export class JiraLoginError extends JiraError {
  constructor(message: string = 'Jira 登录失败') {
    super(message, 401)
  }
}

/**
 * Jira 创建工单错误
 */
export class JiraCreateError extends JiraError {
  constructor(message: string = '创建 Jira 工单失败') {
    super(message, 422)
  }
}

/**
 * Jira 更新工单错误
 */
export class JiraUpdateError extends JiraError {
  constructor(message: string = '更新 Jira 工单失败') {
    super(message, 422)
  }
}

/**
 * LLM 调用错误
 */
export class LLMError extends AppError {
  constructor(message: string = 'LLM 调用失败') {
    super(`LLM 错误: ${message}`, 500)
  }
}

/**
 * 外部服务错误 - 502
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = '外部服务调用失败') {
    super(`${service} 服务错误: ${message}`, 502)
  }
}

/**
 * 服务器内部错误 - 500
 */
export class InternalServerError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(message, 500)
  }
}

/**
 * 错误响应格式接口
 */
export interface ErrorResponse {
  error: string
  statusCode: number
  timestamp: string
  path?: string
  details?: any
}

/**
 * 检查是否为操作错误（可预期的业务错误）
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * 创建标准错误响应
 */
export function createErrorResponse(
  error: Error,
  path?: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      path,
      details: error instanceof ValidationError ? error.details : undefined,
    }
  }

  // 未知错误的默认处理
  return {
    error: '服务器内部错误',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    path,
  }
}
