
import { slugToMd, mdToSlug, allMarkdownPaths } from './slugManager.js';

/**
 * Internal set tracking all indexed markdown paths and slug mappings.
 * Used by refreshIndexPaths and map-tracking helpers.
 * @type {Set<string>}
 */
export const indexSet = new Set();

/**
 * Refresh the internal index set from `allMarkdownPaths` and current slug maps.
 * Useful when the content base or path list changes at runtime (tests/plugins).
 *
 * @param {string} contentBase - The base path for content (not used directly, but for API symmetry)
 * @returns {void}
 */
export function refreshIndexPaths(contentBase) {
  _ensureMapsTracked();
  indexSet.clear();
  for (const v of allMarkdownPaths) {
    if (v) indexSet.add(v);
  }
  _augmentIndexWithMap(slugToMd);
  _augmentIndexWithMap(mdToSlug);
  refreshIndexPaths._refreshed = true;
}

/**
 * Add every value from a Map-like object to the internal `indexSet`.
 * Used by refreshIndexPaths and map-tracking helpers.
 *
 * @param {{values:()=>Iterable}} map - object providing a `values()` iterator.
 * @returns {void}
 */
function _augmentIndexWithMap(map) {
  if (!map || typeof map.values !== 'function') return;
  for (const v of map.values()) {
    if (v) indexSet.add(v);
  }
}

/**
 * Instrument a map so that any value inserted also populates the index set.
 * @param {{set:function}} map - a Map-like object whose `set` method will be wrapped.
 * @returns {void}
 */
function _trackMap(map) {
  if (!map || typeof map.set !== 'function') return;
  const orig = map.set;
  map.set = function(k, v) {
    if (v) indexSet.add(v);
    return orig.call(this, k, v);
  };
}

/**
 * Lazily install tracking wrappers on the slug maps; idempotent.
 * @returns {void}
 */
let _mapsTracked = false;
function _ensureMapsTracked() {
  if (_mapsTracked) return;
  _trackMap(slugToMd);
  _trackMap(mdToSlug);
  _mapsTracked = true;
}
