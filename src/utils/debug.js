/**
 * Centralized debug helper for nimbi-cms.
 *
 * Provides a runtime gate for console messages and an internal
 * counter store useful for lightweight instrumentation in tests.
 * Call `setDebugLevel(level)` during initialization to control verbosity.
 *
 * Debug levels:
 *  - 0: disabled
 *  - 1: errors only
 *  - 2: errors and warnings
 *  - 3: all messages (info/log)
 *
 * Usage example:
 * ```js
 * import { setDebugLevel, debugWarn } from './utils/debug.js'
 * setDebugLevel(2)
 * debugWarn('something notable')
 * ```
 *
 * @module utils/debug
 * @see ./init.js
 */
let _debugLevel = 0 // default: disabled

/**
 * Internal counters map used for lightweight instrumentation.
 * @type {Object<string,number>}
 */
const _counters = Object.create(null)

/**
 * Set the global debug level.
 * @param {number} level - 0..3
 */
export function setDebugLevel(level) {
  try {
    const n = Number(level)
    _debugLevel = (Number.isFinite(n) && n >= 0) ? Math.max(0, Math.min(3, Math.floor(n))) : 0
  } catch (e) {
    _debugLevel = 0
  }
}

/**
 * Get the current debug level.
 * @returns {number}
 */
export function getDebugLevel() {
  return _debugLevel
}

/**
 * Returns true when the configured debug level is >= `level`.
 * @param {number} [level=1]
 */
export function isDebugLevel(level = 1) {
  try { return Number(_debugLevel) >= Number(level || 1) } catch (e) { return false }
}

/**
 * Convenience: whether any debug is enabled (level > 0).
 */
export function isDebug() { return isDebugLevel(1) }

/**
 * Log an error-level message when debug level is >= 1.
 * @param {...any} args - Arguments forwarded to console.error
 * @returns {void}
 */
export function debugError(...args) {
  try { if (isDebugLevel(1) && console && typeof console.error === 'function') console.error(...args) } catch (e) {}
}

/**
 * Log a warning-level message when debug level is >= 2.
 * @param {...any} args - Arguments forwarded to console.warn
 * @returns {void}
 */
export function debugWarn(...args) {
  try { if (isDebugLevel(2) && console && typeof console.warn === 'function') console.warn(...args) } catch (e) {}
}

/**
 * Log an info-level message when debug level is >= 3.
 * @param {...any} args - Arguments forwarded to console.info
 * @returns {void}
 */
export function debugInfo(...args) {
  try { if (isDebugLevel(3) && console && typeof console.info === 'function') console.info(...args) } catch (e) {}
}

/**
 * Log a verbose message when debug level is >= 3.
 * @param {...any} args - Arguments forwarded to console.log
 * @returns {void}
 */
export function debugLog(...args) {
  try { if (isDebugLevel(3) && console && typeof console.log === 'function') console.log(...args) } catch (e) {}
}

/**
 * Increment a named debug counter (useful for tests). No-op when debug
 * level is 0 to avoid unnecessary work.
 * @param {string} name
 */
export function incrementCounter(name) {
  try {
    if (!isDebug()) return
    const k = String(name || '')
    if (!k) return
    _counters[k] = (_counters[k] || 0) + 1
  } catch (e) {}
}

/**
 * Compatibility helper: increment legacy global counters on `globalThis.__nimbiCMSDebug`
 * when present. This centralizes the remaining legacy-global touchpoints so
 * callers don't need to reference `__nimbiCMSDebug` directly.
 * @param {string} name
 */
export function syncLegacyCounter(name) {
  try {
    if (typeof globalThis === 'undefined') return
    if (!globalThis.__nimbiCMSDebug) return
    const k = String(name || '')
    if (!k) return
    try { globalThis.__nimbiCMSDebug[k] = (globalThis.__nimbiCMSDebug[k] || 0) + 1 } catch (e) {}
  } catch (e) {}
}

/**
 * Return whether a legacy `__nimbiCMSDebug` global is present. Used by
 * initialization to preserve backward compatibility during migration.
 * @returns {boolean}
 */
export function hasLegacyDebug() {
  try { return (typeof globalThis !== 'undefined' && Boolean(globalThis.__nimbiCMSDebug)) }
  catch (e) { return false }
}

/**
 * Read counters as a plain object snapshot.
 * @returns {Object<string,number>}
 */
export function getDebugCounters() {
  try { return Object.assign({}, _counters) } catch (e) { return {} }
}

/**
 * Reset counters (test helper).
 */
export function resetDebugCounters() {
  try {
    Object.keys(_counters).forEach(k => { delete _counters[k] })
  } catch (e) {}
}

export default {
  setDebugLevel,
  getDebugLevel,
  isDebugLevel,
  isDebug,
  debugError,
  debugWarn,
  debugInfo,
  debugLog,
  incrementCounter,
  getDebugCounters,
  resetDebugCounters
}
