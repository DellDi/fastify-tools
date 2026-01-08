import fp from 'fastify-plugin'
import { FastifyError, FastifyInstance, FastifyRequest } from 'fastify'
import {
  AppError,
  createErrorResponse,
  isOperationalError,
  ValidationError
} from '@/utils/errors.js'

/**
 * 全局错误处理插件
 */
export default fp(async (fastify: FastifyInstance) => {

  /**
   * 设置全局错误处理器
   */
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply) => {
    const requestPath = request.url

    // 记录错误日志
    fastify.log.error({
      error: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      path: requestPath,
      method: request.method,
      timestamp: new Date().toISOString(),
    }, 'Request error occurred')

    // 处理验证错误（Fastify 的 schema 验证错误）
    if (error.validation) {
      const validationError = new ValidationError('请求参数验证失败', error.validation)

      const errorResponse = createErrorResponse(validationError, requestPath)
      return reply.status(400).send(errorResponse)
    }

    // 处理自定义应用错误
    if (error instanceof AppError) {
      const errorResponse = createErrorResponse(error, requestPath)
      return reply.status(error.statusCode).send(errorResponse)
    }

    // 处理其他 Fastify 错误
    if (error.statusCode) {
      const errorResponse = {
        error: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
        path: requestPath,
      }
      return reply.status(error.statusCode).send(errorResponse)
    }

    // 处理未知错误
    const internalError = new AppError('服务器内部错误', 500, false)
    const errorResponse = createErrorResponse(internalError, requestPath)

    // 在开发环境下包含堆栈信息
    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).stack
      (errorResponse as any).originalError = error.message
    }

    reply.status(500).send(errorResponse)
  })

  /**
   * 添加错误处理装饰器
   */
  fastify.decorate('handleError', function(error: Error, request?: FastifyRequest) {
    const path = request?.url || 'unknown'
    const errorResponse = createErrorResponse(error, path)

    // 记录错误但不发送响应（由调用者处理）
    fastify.log.error(errorResponse, 'Handled error')

    return errorResponse
  })

  /**
   * 添加错误类型检查装饰器
   */
  fastify.decorate('isOperationalError', isOperationalError)
})

// 类型声明
declare module 'fastify' {
  interface FastifyInstance {
    handleError(error: Error, request?: FastifyRequest): any
    isOperationalError(error: Error): boolean
  }
}
