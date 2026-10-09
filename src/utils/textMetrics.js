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
import readingTime from "reading-time/lib/reading-time";

const CACHE = new Map();
const MAX_ENTRIES = 200;

/**
 * Normalize input text into a stable, bounded cache key.
 * Uses a small non-cryptographic hash plus the text length to keep keys
 * short while reducing collision risk.
 * @param {string} text
 * @returns {string}
 * @private
 */
function makeKey(text) {
  const str = String(text ?? "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `${str.length}:${hash}`;
}

/**
 * Store an entry in the internal cache and perform a simple FIFO eviction
 * once `MAX_ENTRIES` is exceeded. Values are held via `WeakRef` so the
 * garbage collector may reclaim them under memory pressure even before the
 * FIFO limit is reached.
 * @param {string} key
 * @param {TextMetrics} entry
 * @private
 */
function setCacheEntry(key, entry) {
  CACHE.set(key, new WeakRef(entry));
  if (CACHE.size > MAX_ENTRIES) {
    const firstKey = CACHE.keys().next().value;
    if (firstKey) CACHE.delete(firstKey);
  }
}

/**
 * Dereference a cached `WeakRef`, returning the cached value if it is still
 * alive, or `undefined` if it has been garbage collected.
 * @param {WeakRef<TextMetrics>} ref
 * @returns {TextMetrics | undefined}
 * @private
 */
function derefCacheEntry(ref) {
  try {
    return ref.deref();
  } catch {
    return undefined;
  }
}

/**
 * Word segmenter, created once and reused.
 *
 * `Intl.Segmenter` with `granularity: 'word'` understands scripts that do not
 * separate words with spaces. Splitting on `/\s+/` counts an entire CJK
 * sentence as a single "word", which makes reading-time estimates badly wrong
 * for those languages — the same class of bug as the slugification collapse
 * fixed in G-002.
 * @type {Intl.Segmenter|null}
 */
let _wordSegmenter = null;
try {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    _wordSegmenter = new Intl.Segmenter(undefined, { granularity: "word" });
  }
} catch (_) {
  // Segmenter unavailable or unsupported for the default locale.
  _wordSegmenter = null;
}

/**
 * Compute a word count.
 *
 * Uses `Intl.Segmenter` when available so that scripts without word spacing
 * (CJK, Thai, Lao, Khmer) are counted per word rather than per run of
 * non-space characters. Falls back to a whitespace split otherwise.
 * @param {string} text
 * @returns {number}
 * @private
 */
function computeWordCount(text) {
  if (!text) return 0;
  const str = String(text);
  if (_wordSegmenter) {
    try {
      let count = 0;
      for (const segment of _wordSegmenter.segment(str)) {
        // `isWordLike` excludes whitespace and punctuation segments.
        if (segment.isWordLike) count += 1;
      }
      return count;
    } catch (_) {
      // Fall through to the whitespace split.
    }
  }
  return str.trim().split(/\s+/).filter(Boolean).length;
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
  const key = makeKey(text);
  const cached = derefCacheEntry(CACHE.get(key));
  if (cached?.readingTime) return cached.readingTime;
  const rt = readingTime(text || "");
  const entry = {
    readingTime: rt,
    wordCount: typeof rt.words === "number" ? rt.words : computeWordCount(text),
  };
  setCacheEntry(key, entry);
  return rt;
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
  const key = makeKey(text);
  const cached = derefCacheEntry(CACHE.get(key));
  if (cached) return Object.assign({}, cached);
  const rt = readingTime(text || "");
  const words =
    typeof rt.words === "number" ? rt.words : computeWordCount(text);
  const entry = { readingTime: rt, wordCount: words };
  setCacheEntry(key, entry);
  return Object.assign({}, entry);
}

/**
 * Clear the internal in-memory text metrics cache.
 * Useful in tests or when content memory should be released.
 * @returns {void}
 */
export function clearTextMetricsCache() {
  CACHE.clear();
}
