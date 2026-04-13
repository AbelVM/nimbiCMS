/**
 * Centralized debug helper for nimbi-cms. Backed by PowerLogger from
 * performance-helpers for level management and counter instrumentation.
 *
 * Debug levels:
 *  - 0: disabled
 *  - 1: errors only
 *  - 2: errors and warnings
 *  - 3: all messages (info/log)
 *
 * @module utils/debug
 * @see ./init.js
 */
import { PowerLogger } from 'performance-helpers/powerLogger'

/** Shared logger instance (starts disabled at level 0). */
export const _logger = new PowerLogger(0)

/** @param {number} level */
export function setDebugLevel(level) { _logger.setDebugLevel(level) }

/** @returns {number} */
export function getDebugLevel() { return _logger.getDebugLevel() }

/**
 * @param {number} [level=1]
 * @returns {boolean}
 */
export function isDebugLevel(level = 1) { return _logger.isDebugLevel(level) }

/** @returns {boolean} */
export function isDebug() { return _logger.isDebug() }

/** @param {...any} args */
export function debugError(...args) {
  try {
    if (!_logger.isDebugLevel(1)) return
    const resolved = args.map(a => (typeof a === 'function') ? a() : a)
    _logger.error(...resolved)
  } catch (e) {}
}

/** @param {...any} args */
export function debugWarn(...args) {
  try {
    if (!_logger.isDebugLevel(2)) return
    const resolved = args.map(a => (typeof a === 'function') ? a() : a)
    _logger.warn(...resolved)
  } catch (e) {}
}

/** @param {...any} args */
export function debugInfo(...args) {
  try {
    if (!_logger.isDebugLevel(3)) return
    const resolved = args.map(a => (typeof a === 'function') ? a() : a)
    _logger.info(...resolved)
  } catch (e) {}
}

/** @param {...any} args */
export function debugLog(...args) {
  try {
    if (!_logger.isDebugLevel(3)) return
    const resolved = args.map(a => (typeof a === 'function') ? a() : a)
    _logger.log(...resolved)
  } catch (e) {}
}

/** @param {string} name */
export function incrementCounter(name) { _logger.incrementCounter(name) }

/**
 * Compatibility helper: sync a counter into the legacy `__nimbiCMSDebug` global
 * when present.
 * @param {string} name
 */
export function syncLegacyCounter(name) {
  try {
    if (typeof globalThis === 'undefined' || !globalThis.__nimbiCMSDebug) return
    const k = String(name || '')
    if (!k) return
    try { globalThis.__nimbiCMSDebug[k] = (globalThis.__nimbiCMSDebug[k] || 0) + 1 } catch (e) {}
  } catch (e) {}
}

/**
 * Return whether a legacy `__nimbiCMSDebug` global is present.
 * @returns {boolean}
 */
export function hasLegacyDebug() {
  try { return (typeof globalThis !== 'undefined' && Boolean(globalThis.__nimbiCMSDebug)) }
  catch (e) { return false }
}

/** @returns {Record<string,number>} */
export function getDebugCounters() { return _logger.getDebugCounters() }

/** Reset all counters. */
export function resetDebugCounters() { _logger.resetDebugCounters() }

export default {
  setDebugLevel, getDebugLevel, isDebugLevel, isDebug,
  debugError, debugWarn, debugInfo, debugLog,
  incrementCounter, getDebugCounters, resetDebugCounters
}
