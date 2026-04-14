/**
 * Worker utilities.
 *
 * @module worker-manager
 */

import { debugWarn } from './utils/debug.js'
import { PowerCache } from 'performance-helpers/powerCache'

/**
 * Convenience helper that builds a `Blob` URL from a raw worker source string
 * and returns a newly constructed `Worker`. If the environment does not
 * support `Blob`/`URL.createObjectURL` this returns `null`.
 *
 * @param {string} code - JavaScript source code for the worker as a string.
 * @returns {(Worker|null)} A Worker instance configured with `type: 'module'`, or `null` if creation failed.
 */
export function createWorkerFromRaw(code) {
  if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && code) {
    try {
      if (!createWorkerFromRaw._blobUrlCache) {
        createWorkerFromRaw._blobUrlCache = new PowerCache({ maxEntries: 200, onEvict: (k, v) => {
          try { if (typeof URL !== 'undefined' && v) URL.revokeObjectURL(v) } catch (e) {}
        } })
      }
      const cache = createWorkerFromRaw._blobUrlCache
      let workerUrl = cache.get(code)
      if (!workerUrl) {
        const blob = new Blob([code], { type: 'application/javascript' })
        workerUrl = URL.createObjectURL(blob)
        cache.set(code, workerUrl)
      }
      return new Worker(workerUrl, { type: 'module' })
    } catch (err) {
      try { debugWarn('[worker-manager] createWorkerFromRaw failed', err) } catch (e) {}
    }
  }
  return null
}

