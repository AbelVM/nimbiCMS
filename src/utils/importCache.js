/**
 * Shared import cache with negative-caching/backoff and single-flight
 * promise deduplication, backed by PowerCache from performance-helpers.
 * @module utils/importCache
 */
import { PowerCache } from "performance-helpers/powerCache";
import { PowerTTLMap } from "performance-helpers/powerTTLMap";

const __importCache = new PowerCache({ maxEntries: 500 });
const __negativeCache = new PowerTTLMap(0);
let __IMPORT_NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000;

/** Clear the shared import cache. */
export function clearImportCache() {
  __importCache.clear();
  __negativeCache.clear();
}

/** Adjust negative-cache TTL for shared import cache. */
export function setImportNegativeCacheTTL(ms) {
  __IMPORT_NEGATIVE_CACHE_TTL_MS = Number(ms) || 0;
}

/**
 * Run a loader function with single-flight dedupe and negative-caching.
 * @param {string} key
 * @param {() => Promise<any>} loader
 * @returns {Promise<any|null>}
 */
export async function runImportWithCache(key, loader) {
  try {
    if (!key) return null;

    if (__IMPORT_NEGATIVE_CACHE_TTL_MS > 0 && __negativeCache.has(key)) {
      return null;
    }

    try {
      const mod = await __importCache.getOrSetAsync(key, async () => {
        const loaded = await loader();
        if (loaded == null)
          throw new Error("importCache: loader returned null");
        return loaded;
      });
      __negativeCache.delete(key);
      return mod;
    } catch (err) {
      if (__IMPORT_NEGATIVE_CACHE_TTL_MS > 0) {
        __negativeCache.set(key, 1, __IMPORT_NEGATIVE_CACHE_TTL_MS);
      } else {
        __negativeCache.delete(key);
      }
      return null;
    }
  } catch (err) {
    return null;
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
      return await import(url);
    } catch (err) {
      return null;
    }
  });
}
