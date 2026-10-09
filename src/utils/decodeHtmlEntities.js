/**
 * HTML entity decoding, memoized.
 *
 * Shared by the main thread and the renderer worker so heading text used for
 * slug generation decodes identically in both contexts.
 *
 * @module utils/decodeHtmlEntities
 */
import { PowerMemoizer } from "performance-helpers/powerCache";

/** @type {Record<string,string>} */
const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/**
 * Decode without consulting the memo cache.
 * @private
 * @param {string} s
 * @returns {string}
 */
function compute(s) {
  try {
    if (!s && s !== 0) return "";
    const str = String(s);
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
      if (!g) return m;
      if (g[0] === "#") {
        try {
          const code = parseInt(
            g[1] === "x" || g[1] === "X" ? g.slice(2) : g.slice(1),
            g[0] === "#" && (g[1] === "x" || g[1] === "X") ? 16 : 10,
          );
          if (!Number.isFinite(code) || code < 0 || code > 0x10ffff)
            return m;
          // `String.fromCharCode` cannot represent astral code points
          // (it returns a lone surrogate), so use fromCodePoint.
          return String.fromCodePoint(code);
        } catch (_) {
          return m;
        }
      }
      return NAMED[g] !== undefined ? NAMED[g] : m;
    });
  } catch (_) {
    return String(s ?? "");
  }
}

const memo = new PowerMemoizer(compute, {
  keyResolver: (s) => (s === undefined ? "__undefined__" : String(s)),
  cacheOptions: { maxEntries: 2000 },
});

/**
 * Decode HTML character references (named and numeric) in `s`.
 *
 * @param {string} s - Text possibly containing HTML entities.
 * @returns {string} Decoded text.
 */
export function decodeHtmlEntities(s) {
  return memo.run(s);
}

