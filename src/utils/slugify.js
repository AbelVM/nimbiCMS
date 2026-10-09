/**
 * Canonical slug generation shared by the main thread and all workers.
 *
 * Every slug producer in the runtime (page slugs, heading anchors, search
 * index keys, anchor rewriting) must agree on the exact same output for the
 * same input, otherwise links generated in a worker will not resolve against
 * maps built on the main thread. This module is the single source of truth.
 *
 * The implementation is memoized because slug generation is called in hot
 * loops (once per heading, once per anchor, once per index entry) and the
 * same titles repeat constantly across a site.
 *
 * @module utils/slugify
 */
import { PowerMemoizer } from "performance-helpers/powerCache";

/**
 * Maximum slug length. Keeps URLs and DOM ids bounded for pathological
 * headings without truncating realistic titles.
 * @type {number}
 */
export const MAX_SLUG_LENGTH = 80;

/**
 * Strip a trailing `.md` / `.html` extension (with optional separator) from
 * an already-lowercased slug.
 *
 * This is unconditional by design: `slugify` is the canonical slug contract
 * for the whole runtime, and `slugify("readme-md") === "readme"` is asserted
 * directly in `tests/filesManager.test.js`. Callers that must preserve a
 * trailing word (for example a heading literally titled "Learn HTML") should
 * not route free text through this function.
 * @private
 * @param {string} slug
 * @returns {string}
 */
function stripDocumentExtension(slug) {
  return slug.replace(/(?:-?)(?:md|html)$/, "");
}

/**
 * Transliteration table for Cyrillic, the most common non-Latin script with a
 * well-established Latin mapping. Greek, CJK, and Arabic have no comparably
 * compact table, so those fall through to the hash fallback below.
 * @private
 * @type {Record<string,string>}
 */
const CYRILLIC_TO_LATIN = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "",
  ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/**
 * FNV-1a hash, base36-encoded. Used only as a last-resort fallback when a
 * title contains no characters that survive slugification at all (CJK,
 * Arabic, Greek, emoji-only titles), so that every page still gets a stable,
 * non-empty, collision-resistant slug instead of collapsing to `""`.
 * @private
 * @param {string} s
 * @returns {string}
 */
function fnv1aBase36(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    // h * 1677761 with 32-bit wraparound
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/**
 * Fold a string toward ASCII before the character-class filter runs.
 *
 * Three steps, in order:
 *   1. NFKD decomposition, so precomposed accents split into base + mark
 *   2. combining-mark removal, which turns "Über" into "Uber"
 *   3. Cyrillic transliteration, the one non-Latin script with a compact
 *      and unambiguous Latin mapping
 *
 * Everything else (CJK, Arabic, Greek, emoji) is left for the hash fallback.
 * @private
 * @param {string} s
 * @returns {string}
 */
function foldToAscii(s) {
  let out = s;
  try {
    out = out.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  } catch (_) {
    // `normalize` is unavailable in very old engines; the raw string still
    // slugifies, just without diacritic folding.
  }
  // Transliterate Cyrillic. Done after NFKD so uppercase forms are already
  // lowercased by the caller.
  out = out.replace(/[\u0400-\u04ff]/g, (ch) => CYRILLIC_TO_LATIN[ch] ?? "");
  return out;
}

/**
 * Compute a slug without consulting the memo cache.
 * @private
 * @param {string} s
 * @returns {string}
 */
function computeSlug(s) {
  const raw = String(s ?? "");
  // Lowercase BEFORE folding: the transliteration table is keyed on lowercase
  // Cyrillic, so folding first would drop every uppercase letter.
  let slug = foldToAscii(raw.toLowerCase())
    .replace(/[^a-z0-9\- ]/g, "")
    .replace(/ /g, "-");
  slug = stripDocumentExtension(slug);
  slug = slug.replace(/-+/g, "-");
  slug = slug.replace(/^-|-$/g, "");
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "");
  }
  // Last resort: a title containing letters or digits that none of the
  // folding steps could represent (CJK, Arabic, Greek, emoji-only titles).
  // Without this every such page on a site collapses to the same empty slug
  // and navigation, search, and deep links all break.
  //
  // Punctuation-only input ("!!!", "---") deliberately does NOT get a hash:
  // it carries no identity, and hashing it would turn noise into a stable
  // slug that looks meaningful.
  if (!slug && /[\p{L}\p{N}]/u.test(raw)) {
    return fnv1aBase36(raw.trim());
  }
  return slug;
}

/**
 * Memoized slug generator. Keys are the raw input strings; `undefined` is
 * mapped to a sentinel so it does not collide with the literal string.
 * @private
 */
const slugMemo = new PowerMemoizer(computeSlug, {
  keyResolver: (s) => (s === undefined ? "__undefined__" : String(s)),
  cacheOptions: { maxEntries: 2000 },
});

/**
 * Generate a URL-friendly slug from arbitrary text.
 *
 * Normalization rules, in order:
 * 1. lowercase
 * 2. drop every character outside `[a-z0-9\- ]`
 * 3. spaces become `-`
 * 4. a trailing `.md` / `.html` extension is removed
 * 5. runs of `-` collapse to one
 * 6. leading/trailing `-` are trimmed
 * 7. the result is capped at {@link MAX_SLUG_LENGTH} characters
 *
 * @param {string} s - Text to slugify.
 * @returns {string} The slug, possibly an empty string.
 */
export function slugify(s) {
  return slugMemo.run(s);
}

/**
 * Slugify a heading for use as a DOM id / anchor target.
 *
 * Historically the worker used a laxer variant that skipped extension
 * stripping and length capping, which produced ids that did not match the
 * slugs the main thread derived from the same heading text. This now
 * delegates to {@link slugify} so both sides agree.
 *
 * @param {string} s - Heading text.
 * @returns {string} The slug, or `"heading"` when the input yields nothing.
 */
export function slugifyHeading(s) {
  try {
    return slugify(s) || "heading";
  } catch (_) {
    return "heading";
  }
}

/**
 * Slugify a page title for use as a page slug.
 *
 * @param {string} s - Title text.
 * @returns {string} The slug, possibly an empty string.
 */
export function slugifyTitle(s) {
  return slugify(s);
}

/**
 * Clear the memo cache. Intended for tests and for releasing memory when a
 * large content generation is discarded.
 * @returns {void}
 */
export function clearSlugifyCache() {
  try {
    slugMemo.clear?.();
  } catch (_) {}
}

export default slugify;
