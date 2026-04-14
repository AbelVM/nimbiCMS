/**
 * Memoized text metrics utilities.
 *
 * Provides a small in-memory cache for expensive text metric computations
 * (e.g. `reading-time`) to avoid repeated work for identical content.
 *
 * @module utils/textMetrics
 */
/**
 * @typedef {Object} ReadingTimeResult
 * @property {string} text - Human readable reading time string (e.g. '2 min read').
 * @property {number} minutes - Estimated minutes (float).
 * @property {number} time - Estimated time in milliseconds.
 * @property {number} words - Word count estimate.
 */
/**
 * @typedef {Object} TextMetrics
 * @property {ReadingTimeResult} readingTime - Result returned from `reading-time`.
 * @property {number} wordCount - Exact or best-effort word count.
 */
import readingTime from 'reading-time/lib/reading-time'

const CACHE = new Map()
const MAX_ENTRIES = 200

/**
 * Normalize input text into a stable cache key.
 * @param {string} text
 * @returns {string}
 * @private
 */
function makeKey(text) {
  return String(text ?? '')
}

/**
 * Store an entry in the internal cache and perform a simple FIFO eviction
 * once `MAX_ENTRIES` is exceeded.
 * @param {string} key
 * @param {TextMetrics} entry
 * @private
 */
function setCacheEntry(key, entry) {
  CACHE.set(key, entry)
  if (CACHE.size > MAX_ENTRIES) {
    const firstKey = CACHE.keys().next().value
    if (firstKey) CACHE.delete(firstKey)
  }
}

/**
 * Compute a simple whitespace-based word count for fallback cases.
 * This is intentionally conservative and fast.
 * @param {string} text
 * @returns {number}
 * @private
 */
function computeWordCount(text) {
  if (!text) return 0
  return String(text).trim().split(/\s+/).filter(Boolean).length
}

/**
 * Get the raw `reading-time` result for the supplied text, using the internal cache.
 *
 * The returned object mirrors the `reading-time` package result and includes
 * `text`, `minutes`, `time` and (when available) `words`.
 *
 * @param {string} text - Input text (markdown/HTML). May be empty.
 * @returns {ReadingTimeResult} Estimated reading time metadata.
 */
export function getReadingTime(text) {
  const key = makeKey(text)
  const cached = CACHE.get(key)
  if (cached && cached.readingTime) return cached.readingTime
  const rt = readingTime(text || '')
  const entry = { readingTime: rt, wordCount: typeof rt.words === 'number' ? rt.words : computeWordCount(text) }
  setCacheEntry(key, entry)
  return rt
}

/**
 * Get consolidated text metrics for the provided text.
 *
 * Returns an object with:
 * - `readingTime`: the `reading-time` result,
 * - `wordCount`: integer word count (falls back to a simple whitespace split
 *    if `reading-time` doesn't provide `words`).
 *
 * The result is returned from an in-memory cache when available.
 *
 * @param {string} text - Input text to analyze.
 * @returns {TextMetrics} Object containing `readingTime` and `wordCount`.
 */
export function getTextMetrics(text) {
  const key = makeKey(text)
  const cached = CACHE.get(key)
  if (cached) return Object.assign({}, cached)
  const rt = readingTime(text || '')
  const words = typeof rt.words === 'number' ? rt.words : computeWordCount(text)
  const entry = { readingTime: rt, wordCount: words }
  setCacheEntry(key, entry)
  return Object.assign({}, entry)
}

/**
 * Clear the internal in-memory text metrics cache.
 * Useful in tests or when content memory should be released.
 * @returns {void}
 */
export function clearTextMetricsCache() {
  CACHE.clear()
}
