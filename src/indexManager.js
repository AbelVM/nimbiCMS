/**
 * Index management helpers for content paths.
 *
 * Maintain a runtime set of known markdown paths and provide utilities to
 * refresh and augment the index used by other modules.
 *
 * @module indexManager
 */
import {
  slugToMd,
  mdToSlug,
  allMarkdownPaths,
  allMarkdownPathsSet,
} from "./slugState.js";

/**
 * A Map-like interface used by index augmentation helpers.
 * @typedef {Object} MapLike
 * @property {function(string, *): *} set
 * @property {function(): Iterable<*>} values
 */

/**
 * Runtime set of known markdown paths collected from the index and slug maps.
 * Values are normalized, content-base-relative paths (strings) suitable for
 * consumption by other runtime modules (slug lookups, indexing, sitemaps).
 * Populated by `refreshIndexPaths()` and by the tracking wrappers installed
 * via `_ensureMapsTracked()` when slug maps are mutated.
 * Other modules read this set to enumerate available pages.
 * @type {Set<string>}
 */
export const indexSet = new Set();
let _refreshed = false;

/**
 * Return whether index paths have been refreshed at least once.
 * @returns {boolean}
 */
export function isIndexPathsRefreshed() {
  return _refreshed;
}

/**
 * Set the internal refresh flag for index paths.
 * @param {boolean} value
 * @returns {void}
 */
export function setIndexPathsRefreshed(value) {
  _refreshed = !!value;
}
/**
 * Refresh the internal `indexSet` from available markdown paths and slug maps.
 * Useful when the content base or path list changes at runtime (tests/plugins).
 * This clears and repopulates `indexSet` and augments it with values
 * discovered in slug maps.
 * @param {string|URL} contentBase - Base path or URL for content used by the indexer.
 * @returns {void}
 */
export function refreshIndexPaths(contentBase) {
  _ensureMapsTracked();
  indexSet.clear();
  // Prefer the authoritative array when present (tests may mutate it directly).
  if (Array.isArray(allMarkdownPaths) && allMarkdownPaths.length) {
    for (const v of allMarkdownPaths) {
      if (v) indexSet.add(v);
    }
  } else {
    for (const v of allMarkdownPathsSet) {
      if (v) indexSet.add(v);
    }
  }
  _augmentIndexWithMap(slugToMd);
  _augmentIndexWithMap(mdToSlug);
  _refreshed = true;
}

try {
  Object.defineProperty(refreshIndexPaths, "_refreshed", {
    get() {
      return _refreshed;
    },
    set(v) {
      _refreshed = !!v;
    },
    configurable: true,
  });
} catch (_) {}

/**
 * Add all values from a Map-like object into the runtime `indexSet`.
 * Accepts Map or Map-like objects that expose a `values()` iterator.
 * @param {MapLike|Map<any, any>} map
 * @returns {void}
 */
function _augmentIndexWithMap(map) {
  if (!map || typeof map.values !== "function") return;
  for (const v of map.values()) {
    if (v) indexSet.add(v);
  }
}

/**
 * Instrument a map so that any value inserted also populates the index set.
 * @param {MapLike|Map<any, any>} map - A Map-like object whose `set` method will be wrapped.
 * @returns {void}
 */
function _trackMap(map) {
  if (!map || typeof map.set !== "function") return;
  const orig = map.set;
  map.set = function (k, v) {
    if (v && typeof v === "string") indexSet.add(v);
    else if (v?.default) indexSet.add(v.default);
    return orig.call(this, k, v);
  };
}

/** Lazily install tracking wrappers on the slug maps; idempotent. @returns {void} */
let _mapsTracked = false;
function _ensureMapsTracked() {
  if (_mapsTracked) return;
  _trackMap(slugToMd);
  _trackMap(mdToSlug);
  _mapsTracked = true;
}
