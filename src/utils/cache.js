/**
 * LRU cache backed by performance-helpers PowerCache.
 * Kept as a compatibility shim while worker-manager.js still references LRUCache.
 * @module utils/cache
 */
import { PowerCache } from 'performance-helpers/powerCache'

/**
 * LRU cache with optional TTL and eviction callback, backed by PowerCache.
 * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
 */
export class LRUCache {
  constructor(opts = {}) {
    const { maxSize = 0, ttlMs = 0, onEvict = null } = opts || {}
    const cacheOpts = {
      maxEntries: maxSize || 0,
      ...(ttlMs > 0 ? { defaultTTL: ttlMs } : {}),
      ...(typeof onEvict === 'function'
        ? { onEvict: (key, val) => { try { onEvict(key, val) } catch (_) {} } }
        : {})
    }
    this._cache = new PowerCache(cacheOpts)
  }

  get size() { return this._cache.size }
  get(key) { return this._cache.get(key) }
  set(key, value) { this._cache.set(key, value); return this }
  has(key) { return this._cache.has(key) }
  delete(key) { return this._cache.delete(key) }
  clear() { this._cache.clear() }
}

/** Convenience factory */
export function createLRUCache(opts) { return new LRUCache(opts) }
