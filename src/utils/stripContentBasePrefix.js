/**
 * Strip a content-base prefix from a relative path.
 *
 * Shared by the main thread and the anchor worker so both resolve the same
 * relative path to the same content-relative path. Divergence here produces
 * anchors that point at the wrong file.
 *
 * @module utils/stripContentBasePrefix
 */

/**
 * Remove leading slash(es) and any repeated content-base segments from `rel`.
 *
 * @param {string} rel - Relative path, possibly prefixed with the content base.
 * @param {string} contentBasePath - Content base path (e.g. `/content/`).
 * @returns {string} The path relative to the content base, or `""` when the
 *   path is exactly the content base.
 */
export function stripContentBasePrefix(rel, contentBasePath) {
  try {
    if (!rel) return rel;
    if (!contentBasePath) return String(rel ?? "");
    const baseTrim = String(contentBasePath ?? "").replace(/^\/+|\/+$/g, "");
    if (!baseTrim) return String(rel ?? "");
    let out = String(rel ?? "");
    out = out.replace(/^\/+/, "");
    // Collapse any repeated leading base segments: 'base/base/...' -> '...'
    const prefix = baseTrim + "/";
    while (out.startsWith(prefix)) out = out.slice(prefix.length);
    return out === baseTrim ? "" : out;
  } catch (_) {
    return String(rel ?? "");
  }
}

