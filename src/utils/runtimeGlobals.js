/**
 * Generation-guarded access to the `window.__nimbi*` debug globals.
 *
 * Several modules publish runtime state on `window` so host pages and
 * debugging tools can inspect it. The problem is lifetime: a promise that
 * resolves *after* `destroy()` will happily repopulate those globals, so a
 * torn-down runtime leaves stale state behind and the next runtime inherits
 * it. That is indistinguishable from a leak when profiling.
 *
 * This module centralizes the writes behind a generation check. Each runtime
 * claims a monotonically increasing id at init; a write is dropped unless it
 * belongs to the generation that is still current.
 *
 * ## Choosing a variant
 *
 * There are two guards, and picking the wrong one is a real hazard:
 *
 * | Use | When | Behaviour on `null` generation |
 * |---|---|---|
 * | `setIfCurrent` / `isCurrentGeneration` | Code driven by `initCMS`, where a generation always exists | **Rejects** |
 * | `setIfLive` / `isGenerationLive` | Public API that hosts and tests call directly, with no runtime | **Allows** |
 *
 * The distinction matters because a large part of this library's surface
 * (`handleSitemapRequest`, `generateSitemapJson`, `setSearchIndex`,
 * `renderByQuery`) is invoked directly by host pages and by the test suite
 * without ever calling `initCMS`. Using the strict variant there silently
 * disables the feature; using the permissive variant on an init-owned path
 * lets a stale write through after teardown.
 *
 * Rule of thumb: if the function is reachable from the public API without
 * `initCMS`, use the permissive variant. Otherwise use the strict one.
 *
 * @module utils/runtimeGlobals
 */

/** @type {number|null} */
let currentGeneration = null;

/** @type {number} */
let sequence = 0;

/**
 * Claim a new generation. Called once per `initCMS()`.
 *
 * @returns {number} The newly claimed generation id.
 */
export function claimGeneration() {
  sequence += 1;
  currentGeneration = sequence;
  return currentGeneration;
}

/**
 * Release the current generation. Called from `destroy()`.
 *
 * After this, every guarded write is dropped until a new generation is
 * claimed, which is what prevents late promises from repopulating globals.
 *
 * @returns {void}
 */
export function releaseGeneration() {
  currentGeneration = null;
}

/**
 * The generation that is currently allowed to write, or `null` when no
 * runtime is live.
 *
 * @returns {number|null}
 */
export function activeGeneration() {
  return currentGeneration;
}

/**
 * Whether `generation` is still the live one.
 *
 * @param {number|null} generation
 * @returns {boolean}
 */
export function isCurrentGeneration(generation) {
  return (
    generation != null &&
    currentGeneration != null &&
    generation === currentGeneration
  );
}

/**
 * Whether `generation` is still allowed to act.
 *
 * Stricter than {@link isCurrentGeneration}: a `null` generation means the
 * caller never claimed one (host-driven sitemap/feed requests, tests, and
 * other runtimes invoking the generators directly), and those must keep
 * working. Only a *superseded* generation is blocked.
 *
 * @param {number|null} generation
 * @returns {boolean}
 */
export function isGenerationLive(generation) {
  // No generation claimed by the caller: nothing to invalidate against, so
  // host-driven paths (sitemap/feed generators, tests) keep working.
  if (generation == null) return true;
  // The caller claimed a generation but no runtime is live: it was torn
  // down, so the write is stale and must be dropped.
  if (currentGeneration == null) return false;
  return generation === currentGeneration;
}

/**
 * Write `value` to `window[key]` unless `generation` has been superseded.
 *
 * The permissive counterpart to {@link setIfCurrent}, for code paths that are
 * also driven by hosts and tests without a live `initCMS` runtime.
 *
 * @param {number|null} generation - Generation captured when the work started.
 * @param {string} key - Global property name.
 * @param {*} value - Value to publish.
 * @returns {boolean} `true` when the write happened.
 */
export function setIfLive(generation, key, value) {
  if (!isGenerationLive(generation)) return false;
  try {
    if (typeof window === "undefined") return false;
    window[key] = value;
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Write `value` to `window[key]` only if `generation` is the live one.
 *
 * The strict counterpart to {@link setIfLive}: a `null` generation is
 * rejected, so callers must have claimed one.
 *
 * @param {number|null} generation - Generation captured when the work started.
 * @param {string} key - Global property name (without the `window.` prefix).
 * @param {*} value - Value to publish.
 * @returns {boolean} `true` when the write happened.
 */
export function setIfCurrent(generation, key, value) {
  if (!isCurrentGeneration(generation)) return false;
  try {
    if (typeof window === "undefined") return false;
    window[key] = value;
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Read a `window.__nimbi*` global, returning `fallback` when absent.
 *
 * @param {string} key - Global property name.
 * @param {*} [fallback=null]
 * @returns {*}
 */
export function getGlobal(key, fallback = null) {
  try {
    if (typeof window === "undefined") return fallback;
    const value = window[key];
    return value === undefined ? fallback : value;
  } catch (_) {
    return fallback;
  }
}

/**
 * Clear a `window.__nimbi*` global. Safe to call when no runtime is live.
 *
 * @param {string} key - Global property name.
 * @returns {void}
 */
export function clearGlobal(key) {
  try {
    if (typeof window === "undefined") return;
    window[key] = null;
  } catch (_) {}
}

/**
 * Every debug global the runtime publishes, in teardown order.
 *
 * `destroy()` clears all of them so a torn-down runtime leaves nothing behind.
 * @type {readonly string[]}
 */
export const MANAGED_GLOBALS = Object.freeze([
  "__nimbiUI",
  "__nimbiRenderingErrors__",
  "__nimbiRenderTimings",
  "__nimbiRuntimeId",
  "__nimbiRuntimeManifest",
  "__nimbiRecoveryState",
  "__nimbiSearchIndex",
  "__nimbiLiveSearchIndex",
  "__nimbiResolvedIndex",
  "__nimbiIndexReady",
  "__nimbiSitemapJson",
  "__nimbiSitemapFinal",
  "__nimbiSitemapRenderedAt",
  "__nimbiSitemapPendingWrite",
  "__nimbiSitemapWriteTimer",
  "__nimbiSitemapUnloadListenerAttached",
  "__nimbiColdRouteResolved",
  "__nimbiExposeSitemap",
  "__nimbiAutoAttachSitemapUI",
  "__nimbiNotFoundRedirect",
  "__nimbiPerformanceDiagnostics",
  "__nimbiPerformanceDiagnosticsSummary",
]);

/**
 * Clear every managed global. Called from `destroy()`.
 *
 * @returns {void}
 */
export function clearAllGlobals() {
  for (const key of MANAGED_GLOBALS) clearGlobal(key);
}
