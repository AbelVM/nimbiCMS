/**
 * Shared slug/markdown mapping state.
 *
 * Extracted into a separate module to break the circular dependency between
 * slugManager and indexManager. Both modules import from here; neither imports
 * from the other for these state objects.
 *
 * @module slugState
 */

/**
 * Mapping from slug to markdown path (or localized SlugEntry).
 * @type {Map<string, string|import('./slugManager.js').SlugEntry>}
 */
export const slugToMd = new Map();

/**
 * Reverse mapping of slugToMd (markdown path -> slug).
 * @type {Map<string,string>}
 */
export const mdToSlug = new Map();

/**
 * Array of discovered markdown/html paths (relative to content base).
 * @type {string[]}
 */
export let allMarkdownPaths = [];

/**
 * Derived Set for fast membership checks against allMarkdownPaths.
 * @type {Set<string>}
 */
export const allMarkdownPathsSet = new Set();

/**
 * Replace allMarkdownPaths (the let binding lives here so slugManager can
 * reset it via this setter rather than reassigning an imported binding).
 * @param {string[]} arr
 */
export function setAllMarkdownPaths(arr) {
  allMarkdownPaths = arr;
}
