import { FastifyInstance } from 'fastify'
import { request } from 'undici'
import { createHash } from 'crypto'
import { fastifyCache } from '@/utils/cache.js'
import { getCacheConfig, getJiraConfig } from '@/utils/config-helpers.js'
import { JiraLoginError, ValidationError } from '@/utils/errors.js'
import type { JiraLoginCredentials, JiraSession } from './types.js'

export class JiraSessionService {
  private jiraConfig: ReturnType<typeof getJiraConfig>
  private cacheConfig: ReturnType<typeof getCacheConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
    this.cacheConfig = getCacheConfig(fastify)
  }

  private getSessionKey(jiraUser: string, jiraPassword: string): string {
    return `${this.cacheConfig.sessionPrefix}-${createHash('md5').update(`${jiraUser}:${jiraPassword}`).digest('hex')}`
  }

  private static readonly SESSION_EXPIRED_PATTERN = /HTTP (401|403)\b/

  /** 判断错误是否像"Jira 会话已失效"（下游调用被 401/403 拒绝） */
  isSessionExpiredError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error)
    return JiraSessionService.SESSION_EXPIRED_PATTERN.test(message)
  }

  /** 剔除指定凭据的缓存会话，下次获取将强制重新登录 */
  invalidate(credentials: JiraLoginCredentials): void {
    fastifyCache.delete(
      this.getSessionKey(credentials.jiraUser, credentials.jiraPassword),
    )
  }

  /**
   * 会话失效自愈执行器：取会话执行业务调用，若调用报 401/403 视为会话过期，
   * 剔除缓存重新登录并重试一次。登录本身失败不重试（凭据问题原样抛出）。
   */
  async withSession<T>(
    credentials: JiraLoginCredentials,
    fn: (session: JiraSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.getSession(credentials)
    try {
      return await fn(session)
    } catch (error) {
      if (!this.isSessionExpiredError(error)) throw error
      this.invalidate(credentials)
      const fresh = await this.login(credentials)
      return await fn(fresh)
    }
  }

  resolveCredentials(
    credentials?: Partial<JiraLoginCredentials>,
  ): JiraLoginCredentials {
    const config = (this.fastify as any).config || {}
    const jiraUser = credentials?.jiraUser || config.JIRA_USERNAME
    const jiraPassword = credentials?.jiraPassword || config.JIRA_PASSWORD

    if (!jiraUser || !jiraPassword) {
      throw new ValidationError('缺少 Jira 登录凭据: jiraUser 和 jiraPassword')
    }

    return {
      jiraUser,
      jiraPassword,
    }
  }

  async login(credentials: JiraLoginCredentials): Promise<JiraSession> {
    if (!credentials.jiraUser || !credentials.jiraPassword) {
      throw new ValidationError('缺少 Jira 登录凭据: jiraUser 和 jiraPassword')
    }

    const sessionKey = this.getSessionKey(credentials.jiraUser, credentials.jiraPassword)
    const session = fastifyCache.get(sessionKey) || {}
    if (session.cookies && session.atlToken) {
      return { cookies: session.cookies, atlToken: session.atlToken }
    }

    const jiraUrl = this.jiraConfig.endpoints.session

    try {
      const loginResponse = await request(jiraUrl, {
        method: 'POST',
        headers: {
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.jiraUser,
          password: credentials.jiraPassword,
        }),
      })

      if (loginResponse.statusCode !== 200) {
        const deniedReason = loginResponse.headers['x-authentication-denied-reason']
        await loginResponse.body.dump()
        const errorMessages: Record<number, string> = {
          401: '用户名或密码错误',
          403: '账户被锁定或无权限访问',
          404: 'Jira 服务地址不正确',
          500: 'Jira 服务器内部错误',
        }
        const friendlyMsg = deniedReason
          ? `Jira 拒绝登录（${deniedReason}），请到 Jira 页面人工登录一次解除限制`
          : errorMessages[loginResponse.statusCode] || '未知错误'
        throw new JiraLoginError(
          `登录失败: ${friendlyMsg} (HTTP ${loginResponse.statusCode})`,
        )
      }

      const setCookieHeader = loginResponse.headers['set-cookie'] ?? []
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
            .map((cookie: string) => cookie.split(';')[0])
            .join(';')
        : setCookieHeader.split(';')[0]

      let atlToken = ''
      if (Array.isArray(setCookieHeader)) {
        const xsrfCookie = setCookieHeader.find((cookie) =>
          cookie.startsWith('atlassian.xsrf.token='),
        )
        if (xsrfCookie) {
          atlToken = xsrfCookie.split(';')[0].split('=')[1]
        }
      }

      const sessionData: JiraSession = { cookies, atlToken }
      fastifyCache.set(sessionKey, sessionData)

      return sessionData
    } catch (error) {
      this.fastify.log.error(`Jira login error: ${error instanceof Error ? error.message : String(error)}`)
      if (error instanceof JiraLoginError) {
        throw error
      }
      throw new JiraLoginError(`Jira 登录失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getSession(credentials: JiraLoginCredentials): Promise<JiraSession> {
    const sessionKey = this.getSessionKey(credentials.jiraUser, credentials.jiraPassword)
    const session = fastifyCache.get(sessionKey)
    if (session?.cookies && session?.atlToken) {
      return session
    }
    return this.login(credentials)
  }
}
