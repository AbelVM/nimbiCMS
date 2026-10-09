/**
 * Targeted micro-benchmark for the slug-resolution and index-build paths
 * optimized in this audit.
 *
 * `benchmarks/benchmark-content.js` measures end-to-end sitemap generation
 * with an in-memory fetch mock, which is too fast to surface the
 * O(n²) → O(n) changes. This script drives the specific hot paths directly
 * so the algorithmic improvement is measurable.
 *
 * Usage: node benchmarks/benchmark-slug-resolution.mjs
 */
import { performance } from "node:perf_hooks";

const SIZES = [100, 1000, 5000];

/**
 * Build a synthetic slug map of `n` entries.
 * @param {number} n
 * @returns {{slugToMd: Map<string,string>, mdToSlug: Map<string,string>}}
 */
function buildMaps(n) {
  const slugToMd = new Map();
  const mdToSlug = new Map();
  for (let i = 0; i < n; i++) {
    const slug = `page-${i}`;
    const path = `docs/section-${i % 20}/page-${i}.md`;
    slugToMd.set(slug, path);
    mdToSlug.set(path, slug);
  }
  return { slugToMd, mdToSlug };
}

/**
 * The pre-optimization algorithm: scan every mapping per lookup.
 * @param {Map<string,string>} slugToMd
 * @param {Map<string,string>} mdToSlug
 * @param {string} rel
 * @returns {string|null}
 */
function resolveByScan(slugToMd, mdToSlug, rel) {
  if (mdToSlug.has(rel)) return mdToSlug.get(rel);
  const baseName = rel.replace(/^.*\//, "");
  if (mdToSlug.has(baseName)) return mdToSlug.get(baseName);
  const relSuffix = rel.split("/").slice(-2).join("/");
  for (const [slug, mapped] of slugToMd) {
    if (mapped === rel || mapped === baseName) return slug;
    if (mapped.endsWith(`/${relSuffix}`)) return slug;
  }
  return null;
}

/**
 * The optimized algorithm: build a suffix index once, then O(1) lookups.
 * @param {Map<string,string>} slugToMd
 * @returns {Map<string,string>}
 */
function buildSuffixIndex(slugToMd) {
  const map = new Map();
  for (const [slug, mapped] of slugToMd) {
    for (const depth of [1, 2]) {
      const parts = mapped.split("/");
      const suffix = parts.slice(-depth).join("/");
      if (suffix && !map.has(suffix)) map.set(suffix, slug);
    }
  }
  return map;
}

/**
 * @param {Map<string,string>} index
 * @param {string} rel
 * @returns {string|null}
 */
function resolveByIndex(index, rel) {
  const twoSeg = rel.split("/").slice(-2).join("/");
  if (index.has(twoSeg)) return index.get(twoSeg);
  const baseName = rel.replace(/^.*\//, "");
  if (index.has(baseName)) return index.get(baseName);
  return null;
}

// Real usage resolves many anchors per page render, so the index is built
// once and reused across many lookups. Model that with a reuse factor.
const REUSE = 20;

console.log(
  `slug resolution: scan vs index, index built once and reused ${REUSE}x\n`,
);
console.log(
  "size".padStart(7),
  "lookups".padStart(9),
  "scan_ms".padStart(10),
  "index_ms".padStart(10),
  "speedup".padStart(9),
);

for (const n of SIZES) {
  const { slugToMd, mdToSlug } = buildMaps(n);
  const base = Array.from({ length: n }, (_, i) =>
    `docs/section-${i % 20}/page-${i}.md`,
  );
  // Each path resolved REUSE times, as happens when a page links to many
  // anchors or the user navigates repeatedly.
  const lookups = [];
  for (let r = 0; r < REUSE; r++) lookups.push(...base);

  let t0 = performance.now();
  for (const rel of lookups) resolveByScan(slugToMd, mdToSlug, rel);
  const scanMs = performance.now() - t0;

  t0 = performance.now();
  const index = buildSuffixIndex(slugToMd);
  const buildMs = performance.now() - t0;

  t0 = performance.now();
  for (const rel of lookups) resolveByIndex(index, rel);
  const indexMs = performance.now() - t0;

  const total = buildMs + indexMs;
  const speedup = scanMs / total;
  console.log(
    String(n).padStart(7),
    String(lookups.length).padStart(9),
    scanMs.toFixed(1).padStart(10),
    total.toFixed(1).padStart(10),
    `${speedup.toFixed(1)}x`.padStart(9),
  );
}

console.log("\nindex build cost is included in index_ms (built once per run).");
