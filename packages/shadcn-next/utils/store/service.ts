import { LRUCache } from 'lru-cache'

export const serviceCache = new LRUCache({
  max: 100, // Maximum number of items in cache
  ttl: 60 * 60 * 1000, // 1 hour
})
