import { LRUCache } from 'lru-cache'

export const serviceCache = new LRUCache({
  max: 1000,
  maxSize: 5000,
  ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
})
