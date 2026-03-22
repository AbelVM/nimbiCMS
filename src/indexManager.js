
/**
 * Index management helpers for content paths.
 *
 * Maintain a runtime set of known markdown paths and provide utilities to
 * refresh and augment the index used by other modules.
 *
 * @module indexManager
 */
import { slugToMd, mdToSlug, allMarkdownPaths } from './slugManager.js';

/**
 * Runtime set of known markdown paths collected from the index and slug maps.
 * Other modules read this set to enumerate available pages.
 * @type {Set<string>}
 */
export const indexSet = new Set();
/**
 * Refresh the internal index set from available markdown paths and slug maps.
 * Useful when the content base or path list changes at runtime (tests/plugins).
 * @param {string} contentBase - Base path for content used by the indexer.
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

function _augmentIndexWithMap(map) {
  if (!map || typeof map.values !== 'function') return;
  for (const v of map.values()) {
    if (v) indexSet.add(v);
  }
}

/**
 * Instrument a map so that any value inserted also populates the index set.
 * @param {{set:function}} map - A Map-like object whose `set` method will be wrapped.
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
