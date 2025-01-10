import { MySQLPromiseConnection } from 'fastify-mysql'

// 类型定义
interface EmailService {
  setEmailTemplate(name: string, subject: string, body: string): Promise<void>

  sendTemplateEmail(templateName: string, to: string, variables: Record<string, any>): Promise<void>

  createMagicLink(email: string, purpose: string): Promise<string>

  verifyMagicLink(token: string): Promise<{
    status: 'error' | 'invalid' | 'used' | 'expired' | 'valid';
    // status: string;
    purpose: string | null;
  }>

  subscribe(email: string, preferences?: Record<string, any>): Promise<void>

  unsubscribe(email: string): Promise<void>
}


declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromiseConnection;
    mysqlRegistered: boolean;
    isConnectedPg: boolean
    emailService: EmailService
  }
}
