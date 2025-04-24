import { LRUCache } from 'lru-cache'

/**
 * 服务缓存
 * - max: 最大缓存项数量
 * - ttl: 缓存项生存时间（毫秒）
 * - sizeCalculation: 计算缓存项大小的函数
 */
export const serviceCache = new LRUCache({
  max: 1000,
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  // 计算缓存项大小的函数，对于字符串使用其长度，对于其他类型使用 1
  sizeCalculation: (value) => {
    if (typeof value === 'string') {
      return value.length
    }
    return 1
  },
  maxSize: 50000 // 最大缓存大小（基于 sizeCalculation 计算）
})
