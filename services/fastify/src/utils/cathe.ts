import { LRUCache } from 'lru-cache'

/**
 * 缓存配置选项
 */
type CacheOptions = {
  /** 缓存最大条目数，达到此数量后会淘汰最久未使用的条目，默认 1000 */
  maxSize?: number
  /** 默认的缓存过期时间（毫秒），默认 5 分钟 */
  ttl?: number
}

/**
 * 缓存条目类型
 */
type CacheEntry<T> = {
  /** 存储的值 */
  value: T
  /** 过期时间戳（毫秒） */
  expiresAt: number
}

/**
 * 基于内存的缓存工具类，支持 TTL 和 LRU 淘汰策略
 * @template T 缓存值的类型
 */
export class Cache<T = any> {
  /** LRU 缓存实例 */
  private cache: LRUCache<string, CacheEntry<T>>
  /** 默认的缓存过期时间（毫秒） */
  private defaultTTL: number

  /**
   * 创建缓存实例
   * @param options 缓存配置选项
   */
  constructor(options: CacheOptions = {}) {
    const { maxSize = 1000, ttl = 5 * 60 * 1000 } = options
    
    this.defaultTTL = ttl
    this.cache = new LRUCache({
      max: maxSize, // 最大缓存条目数
      ttl: ttl, // 默认 TTL（毫秒）
      ttlAutopurge: true, // 自动清理过期条目
      updateAgeOnGet: false, // 获取时不刷新 TTL
      updateAgeOnHas: false, // 检查存在性时不刷新 TTL
      ttlResolution: 1000, // TTL 检查精度（毫秒）
    })
  }


  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 要缓存的值
   * @param ttl 可选，自定义过期时间（毫秒），覆盖默认值
   */
  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL)
    this.cache.set(key, { value, expiresAt }, { ttl: ttl ?? this.defaultTTL })
  }

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 如果存在且未过期则返回值，否则返回 undefined
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    // 检查是否已过期
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * 检查缓存中是否存在指定键且未过期
   * @param key 缓存键
   * @returns 如果存在且未过期返回 true，否则返回 false
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * 从缓存中删除指定键
   * @param key 要删除的缓存键
   * @returns 如果键存在并已删除则返回 true，否则返回 false
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取所有缓存键
   * @returns 缓存键数组
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取所有缓存值
   * @returns 缓存值数组
   */
  values(): T[] {
    return Array.from(this.cache.values()).map((entry: CacheEntry<T>) => entry.value)
  }

  /**
   * 获取当前缓存中的条目数量
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * 获取指定键的剩余生存时间
   * @param key 缓存键
   * @returns 剩余生存时间（毫秒），如果键不存在或已过期则返回 undefined
   */
  getRemainingTTL(key: string): number | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    const remaining = entry.expiresAt - Date.now()
    return remaining > 0 ? remaining : undefined
  }
}

// 导出一个默认的缓存实例，方便直接使用
export const cache = new Cache()

// 导出类型定义
export type { CacheOptions }