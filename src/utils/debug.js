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
export function debugError(...args) { _logger.error(...args) }

/** @param {...any} args */
export function debugWarn(...args) { _logger.warn(...args) }

/** @param {...any} args */
export function debugInfo(...args) { _logger.info(...args) }

/** @param {...any} args */
export function debugLog(...args) { _logger.log(...args) }

/** @param {string} name */
export function incrementCounter(name) { _logger.incrementCounter(name) }

/** @returns {Record<string,number>} */
export function getDebugCounters() { return _logger.getDebugCounters() }

/** Reset all counters. */
export function resetDebugCounters() { _logger.resetDebugCounters() }

export default {
  setDebugLevel, getDebugLevel, isDebugLevel, isDebug,
  debugError, debugWarn, debugInfo, debugLog,
  incrementCounter, getDebugCounters, resetDebugCounters
}
