/**
 * Shared import cache with negative-caching/backoff and single-flight
 * promise deduplication. Useful for dynamic import sites that want to avoid
 * repeated CDN retries on transient failures.
 */
import { LRUCache } from './cache.js'

const __importCache = new LRUCache({ maxSize: 500 })
let __IMPORT_NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000

/** Clear the shared import cache. */
export function clearImportCache() { __importCache.clear() }

/** Adjust negative-cache TTL for shared import cache. */
export function setImportNegativeCacheTTL(ms) { __IMPORT_NEGATIVE_CACHE_TTL_MS = Number(ms) || 0 }

/**
 * Run a loader function with single-flight dedupe and negative-caching.
 * @param {string} key - Cache key identifying the resource.
 * @param {() => Promise<any>} loader - Async loader returning the module or null.
 * @returns {Promise<any|null>} The loaded module or null on failure.
 */
export async function runImportWithCache(key, loader) {
  try {
    if (!key) return null
    const now = Date.now()
    let cached = __importCache.get(key)
    if (cached) {
      if (cached.ok === false && (now - (cached.ts || 0) >= __IMPORT_NEGATIVE_CACHE_TTL_MS)) {
        __importCache.delete(key)
        cached = undefined
      }
    }
    if (cached) {
      if (cached.module) return cached.module
      if (cached.promise) {
        try { return await cached.promise } catch (err) { return null }
      }
    }

    const entry = { promise: null, module: null, ok: null, ts: Date.now() }
    __importCache.set(key, entry)
    entry.promise = (async () => {
      try {
        return await loader()
      } catch (err) {
        return null
      }
    })()

    try {
      const mod = await entry.promise
      entry.module = mod
      entry.ok = !!mod
      entry.ts = Date.now()
      return mod
    } catch (err) {
      entry.module = null
      entry.ok = false
      entry.ts = Date.now()
      return null
    }
  } catch (err) {
    return null
  }
}

/**
 * Convenience helper to import a remote/local URL with the shared cache.
 * @param {string} url
 * @returns {Promise<any|null>}
 */
export async function importUrlWithCache(url) {
  return await runImportWithCache(url, async () => {
    try {
      return await import(url)
    } catch (err) {
      return null
    }
  })
}
