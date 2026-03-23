/**
 * Lightweight LRU cache with optional TTL and eviction callback.
 * Designed to be a drop-in replacement for simple Map-based caches where
 * bounded size or TTL-based eviction is desirable.
 *
 * Methods: get, set, has, delete, clear and property `size`.
 */
export class LRUCache {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(opts = {}) {
    const { maxSize = 0, ttlMs = 0, onEvict = null } = opts || {}
    this._map = new Map()
    this._maxSize = Math.max(0, Number(maxSize) || 0)
    this._ttlMs = Math.max(0, Number(ttlMs) || 0)
    this._onEvict = (typeof onEvict === 'function') ? onEvict : null
  }

  get size() { return this._map.size }

  /**
   * Check if key exists and is not expired.
   * @param {*} key
   * @returns {boolean}
   */
  has(key) {
    const e = this._map.get(key)
    if (!e) return false
    if (this._ttlMs && (Date.now() - (e.ts || 0) >= this._ttlMs)) {
      this._evictKey(key, e)
      return false
    }
    // refresh recency
    this._map.delete(key)
    this._map.set(key, e)
    return true
  }

  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(key) {
    const e = this._map.get(key)
    if (!e) return undefined
    if (this._ttlMs && (Date.now() - (e.ts || 0) >= this._ttlMs)) {
      this._evictKey(key, e)
      return undefined
    }
    // move to most-recent
    this._map.delete(key)
    this._map.set(key, e)
    return e.value
  }

  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    if (this._map.has(key)) this._map.delete(key)
    this._map.set(key, { value, ts: Date.now() })
    if (this._maxSize && this._map.size > this._maxSize) {
      // evict oldest until under limit
      while (this._map.size > this._maxSize) {
        const k = this._map.keys().next().value
        const e = this._map.get(k)
        this._map.delete(k)
        if (this._onEvict) {
          try { this._onEvict(k, e && e.value) } catch (err) {}
        }
      }
    }
    return this
  }

  /**
   * Delete key from cache.
   * @param {*} key
   * @returns {boolean}
   */
  delete(key) { return this._map.delete(key) }

  /**
   * Clear the cache and call eviction callback for each entry.
   */
  clear() {
    if (this._onEvict) {
      for (const [k, e] of this._map.entries()) {
        try { this._onEvict(k, e && e.value) } catch (_) {}
      }
    }
    this._map.clear()
  }

  _evictKey(key, entry) {
    try { this._map.delete(key) } catch (_) {}
    if (this._onEvict) try { this._onEvict(key, entry && entry.value) } catch (err) {}
  }
}

/** Convenience factory */
export function createLRUCache(opts) { return new LRUCache(opts) }
