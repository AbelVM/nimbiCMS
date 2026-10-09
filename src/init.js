/**
 * Initialization API.
 *
 * Exports `initCMS` and helpers to initialize the CMS runtime.
 *
 * @module init
 */

import {
  fetchMarkdown,
  clearFetchCache,
  clearListCaches,
  clearCrawlCache,
  setContentBase,
  setNotFoundPage,
  setLanguages,
  setHomePage,
  watchForColdHashRoute,
  setSkipRootReadme,
  setDefaultCrawlMaxQueue,
  setFetchConcurrency,
  setFetchNegativeCacheTTL,
   _setAllMd,
   slugify,
   uniqueSlug,
   _storeSlugMapping,
   slugToMd,
   mdToSlug,
   allMarkdownPaths,
   allMarkdownPathsSet,
 } from "./slugManager.js";
import * as router from "./router.js";
import * as markdown from "./markdown.js";
import { teardownRendererWorkerPool } from "./markdown.js";
import { teardownSlugWorkerPool } from "./slugManager.js";
import { teardownAnchorWorkerPool } from "./htmlBuilder.js";
import { disposeWorkerBlobUrlCache } from "./worker-manager.js";
import { refreshIndexPaths } from "./indexManager.js";
import { buildNav } from "./nav.js";
import * as runtimeSitemap from "./runtimeSitemap.js";
import * as codeblocksManager from "./codeblocksManager.js";
import * as imagePreview from "./imagePreview.js";
import * as bulmaManager from "./bulmaManager.js";
import {
  awaitSearchIndex as awaitSearchIndexRuntime,
  clearSearchIndexCache,
} from "./slugSearchRuntime.js";
import { createUI } from "./ui.js";
import { parseHrefToRoute, toCanonicalHref } from "./utils/urlHelper.js";
import {
  claimGeneration,
  releaseGeneration,
  clearAllGlobals,
  setIfCurrent,
  activeGeneration,
  isCurrentGeneration,
} from "./utils/runtimeGlobals.js";
import {
  normalizePath,
  addResourceHints,
  addPreloadHints,
  setCspNonce,
} from "./utils/helpers.js";
import { getSharedParser } from "./utils/sharedDomParser.js";
import { injectSeoForPage, setSeoMap, ensureDocumentMeta } from "./seoManager.js";
import { runHooks } from "./hookManager.js";
import { t, loadL10nFile, setLang, currentLang } from "./l10nManager.js";
import {
  ensureBulma,
  setStyle,
  registerThemedElement,
} from "./bulmaManager.js";
import { setDebugLevel, debugWarn, debugInfo } from "./utils/debug.js";
import { startPerformanceDiagnostics } from "./utils/performanceDiagnostics.js";
import { createRuntimeManifest } from "./utils/runtimeManifest.js";

/**
 * Parse URL query string into a normalized `initCMS` options object.
 * Conservative, descriptive helper used by `initCMS` and tests.
 *
 * The `InitOptions` and `ParsedInitOptions` typedefs are declared in this same
 * block on purpose: the declaration generator associates a function with the
 * doc comment immediately preceding it, and splitting the typedefs into their
 * own blocks makes it fall back to `any` for the parameters.
 *
 * @typedef {Object} ParsedInitOptions
 * @property {string|Element} [el]
 * @property {string} [contentPath]
 * @property {number} [crawlMaxQueue]
 * @property {boolean} [searchIndex]
 * @property {'eager'|'lazy'} [searchIndexMode]
 * @property {'light'|'dark'|'system'} [defaultStyle]
 * @property {string} [bulmaCustomize]
 * @property {string} [lang]
 * @property {string|null} [l10nFile]
 * @property {number} [cacheTtlMinutes]
 * @property {number} [cacheMaxEntries]
 * @property {Array<Record<string,unknown>>} [markdownExtensions]
 * @property {string[]} [availableLanguages]
 * @property {string} [homePage]
 * @property {string|null} [notFoundPage]
 * @property {boolean} [skipRootReadme]
 * @property {boolean} [allowUrlPathOverrides]
 * @property {boolean} [allowEmbeddedScripts]
 * @property {string[]} [embeddedScriptOrigins]
 * @property {Object} [seoMap]
 * @property {Object} [manifest]
 * @property {boolean} [exposeSitemap]
 * @property {boolean} [performanceDiagnostics]
 * @property {(record:Object) => void} [onRuntimeError]
 *
 * @typedef {Object} InitOptions
 * @property {string|Element} el
 * @property {string} [contentPath]
 * @property {number} [crawlMaxQueue]
 * @property {boolean} [searchIndex]
 * @property {'eager'|'lazy'} [searchIndexMode]
 * @property {'light'|'dark'|'system'} [defaultStyle]
 * @property {string} [bulmaCustomize]
 * @property {string} [lang]
 * @property {string|null} [l10nFile]
 * @property {number} [cacheTtlMinutes]
 * @property {number} [cacheMaxEntries]
 * @property {Array<Record<string,unknown>>} [markdownExtensions]
 * @property {string[]} [availableLanguages]
 * @property {string} [homePage]
 * @property {string|null} [notFoundPage]
 * @property {boolean} [skipRootReadme]
 * @property {boolean} [allowUrlPathOverrides]
 * @property {boolean} [allowEmbeddedScripts]
 * @property {string[]} [embeddedScriptOrigins]
 * @property {Object} [seoMap]
 * @property {Object} [manifest]
 * @property {boolean} [exposeSitemap]
 * @property {boolean} [performanceDiagnostics]
 * @property {(record:Object) => void} [onRuntimeError]
 *
 * @param {string} [queryString] optional query string (for tests); defaults to window.location.search
 * @returns {ParsedInitOptions} - Parsed options object containing any recognized and parsed query parameters.
 */
export function parseInitOptionsFromQuery(queryString) {
  try {
    let qs =
      typeof queryString === "string"
        ? queryString
        : typeof window !== "undefined" && window.location
          ? window.location.search
          : "";

    if (!qs && typeof window !== "undefined" && window.location) {
      try {
        const parsed = parseHrefToRoute(window.location.href);
        if (parsed && parsed.params)
          qs = parsed.params.startsWith("?")
            ? parsed.params
            : "?" + parsed.params;
      } catch (e) {
        // Unparseable query string: fall back to no params rather than
        // aborting initialization.
        qs = "";
      }
    }

    if (!qs) return {};

    const params = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
    const out = {};

    const parseBool = (v) => {
      if (v == null) return undefined;
      const s = String(v).toLowerCase();
      if (s === "1" || s === "true" || s === "yes") return true;
      if (s === "0" || s === "false" || s === "no") return false;
      return undefined;
    };

    if (params.has("contentPath")) out.contentPath = params.get("contentPath");
    if (params.has("searchIndex")) {
      const b = parseBool(params.get("searchIndex"));
      if (typeof b === "boolean") out.searchIndex = b;
    }
    if (params.has("searchIndexMode")) {
      const v = params.get("searchIndexMode");
      if (v === "eager" || v === "lazy") out.searchIndexMode = v;
    }
    if (params.has("defaultStyle")) {
      const v = params.get("defaultStyle");
      if (v === "light" || v === "dark" || v === "system") out.defaultStyle = v;
    }
    if (params.has("bulmaCustomize")) {
      out.bulmaCustomize = params.get("bulmaCustomize");
    }
    if (params.has("lang")) out.lang = params.get("lang");
    if (params.has("l10nFile")) {
      const v = params.get("l10nFile");
      out.l10nFile = v === "null" ? null : v;
    }
    if (params.has("cacheTtlMinutes")) {
      const n = Number(params.get("cacheTtlMinutes"));
      if (Number.isFinite(n) && n >= 0) out.cacheTtlMinutes = n;
    }
    if (params.has("cacheMaxEntries")) {
      const n = Number(params.get("cacheMaxEntries"));
      if (Number.isInteger(n) && n >= 0) out.cacheMaxEntries = n;
    }
    if (params.has("homePage")) out.homePage = params.get("homePage");
    if (params.has("navigationPage"))
      out.navigationPage = params.get("navigationPage");
    if (params.has("notFoundPage")) {
      const v = params.get("notFoundPage");
      out.notFoundPage = v === "null" ? null : v;
    }
    if (params.has("availableLanguages")) {
      out.availableLanguages = params
        .get("availableLanguages")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (params.has("fetchConcurrency")) {
      const n = Number(params.get("fetchConcurrency"));
      if (Number.isInteger(n) && n >= 1) out.fetchConcurrency = n;
    }
    if (params.has("negativeFetchCacheTTL")) {
      const n = Number(params.get("negativeFetchCacheTTL"));
      if (Number.isFinite(n) && n >= 0) out.negativeFetchCacheTTL = n;
    }
    if (params.has("indexDepth")) {
      const n = Number(params.get("indexDepth"));
      if (Number.isInteger(n) && (n === 1 || n === 2 || n === 3))
        out.indexDepth = n;
    }
    if (params.has("noIndexing")) {
      const v = params.get("noIndexing") || "";
      const arr = v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) out.noIndexing = arr;
    }

    return out;
  } catch (e) {
    return {};
  }
}

/**
 * Validates a page path for `homePage` / `notFoundPage`.
 * Rules:
 *  - must be a string
 *  - must not contain ".." segments
 *  - must not be an absolute URL (protocol://) or start with //
 *  - must not start with a leading slash (we normalize to relative)
 *  - path segments may include A-Za-z0-9._- and may contain single-level
 *    subpaths (e.g. "assets/brochure.md").
 * @param {string} name - candidate page path
 * @returns {boolean} true when `name` matches allowed page path rules
 */
function isSafePagePath(name) {
  if (typeof name !== "string") return false;
  const s = name.trim();
  if (!s) return false;
  if (s.includes("..")) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return false; // protocol://
  if (s.startsWith("//")) return false;
  if (s.startsWith("/") || /^[A-Za-z]:\\/.test(s)) return false;
  const normalized = s.replace(/^\.\//, "");
  if (!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(normalized))
    return false;
  return true;
}

/**
 * Validate a `contentPath` override supplied via URL.
 * Accepts relative paths like `./content/` or `content/` but rejects
 * protocol absolute, leading-slash absolute, Windows absolute, or
 * parent-directory references ("..").
 * @param {string} p
 * @returns {boolean}
 */
function isSafeContentPath(p) {
  if (typeof p !== "string") return false;
  const s = p.trim();
  if (!s) return false;
  // Allow '.' or './' as explicit page-relative indicators (same as empty)
  if (s === "." || s === "./") return true;
  if (s.includes("..")) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return false;
  if (s.startsWith("//")) return false;
  if (s.startsWith("/") || /^[A-Za-z]:\\/.test(s)) return false;
  const normalized = s.replace(/^\.\//, "");
  if (!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(normalized))
    return false;
  return true;
}

/**
 * Currently selected highlight theme name. Mutable export for runtime
 * customization; changes affect subsequent codeblock rendering.
 * @type {string}
 */
export let currentHighlightTheme = "monokai";
/**
 * Document title at initialization time. Useful for restoring title on navigation.
 * @type {string}
 */
export let initialDocumentTitle = "";

/**
 * Module-level AbortController for cleanup on destroy/teardown.
 * All UI and navigation event listeners are wired to this signal
 * so that a single `abort()` call removes them all.
 * @type {AbortController|null}
 */
let cmsAbortController = null;
let destroyPromise = null;
let cmsMountEl = null;
let runtimeInstanceSequence = 0;
let currentRuntimeId = null;
let disposePerformanceDiagnostics = () => {};
const runtimeTimeouts = new Set();

function scheduleRuntimeTimeout(fn, delay, signal = cmsAbortController?.signal) {
  const id = setTimeout(() => {
    runtimeTimeouts.delete(id);
    if (signal?.aborted) return;
    fn();
  }, delay);
  runtimeTimeouts.add(id);
  return id;
}

function clearRuntimeTimeouts() {
  for (const id of runtimeTimeouts) clearTimeout(id);
  runtimeTimeouts.clear();
}

function setRecoveryState(state, error = null) {
  setIfCurrent(currentRuntimeId, "__nimbiRecoveryState", {
    state,
    generation: currentRuntimeId,
    error: error ? String(error?.message || error).slice(0, 2000) : null,
  });
}

/**
 * Initialize the Nimbi CMS runtime on the host page.
 * Conservative wrapper used by consumers to mount UI and start routing.
 * @param {InitOptions} [options]
 * @returns {Promise<void>}
 */
export async function initCMS(options = {}) {
  if (!options || typeof options !== "object") {
    throw new TypeError("initCMS(options): options must be an object");
  }
  setRecoveryState("loading");
  if (destroyPromise) {
    await destroyPromise;
    destroyPromise = null;
  }

  // Create the AbortController before anything else registers a listener.
  // Every runtime-scoped listener (error reporting, UI, navigation, timers)
  // is wired to this signal so a single `abort()` releases them all. This
  // must happen before the first `await` and before any `addEventListener`
  // call, otherwise those calls observe `null` and throw.
  cmsAbortController =
    typeof window !== "undefined"
      ? new AbortController()
      : { signal: { abort: () => {} } };

  try {
    clearFetchCache();
    clearListCaches();
    clearCrawlCache();
    clearSearchIndexCache();
  } catch (_) {}

  const queryOpts = parseInitOptionsFromQuery();
  if (
    queryOpts &&
    (queryOpts.contentPath ||
      queryOpts.homePage ||
      queryOpts.notFoundPage ||
      queryOpts.navigationPage)
  ) {
    if (options && options.allowUrlPathOverrides === true) {
      try {
        debugWarn(
          "[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage",
        );
      } catch (e) {}
    } else {
      try {
        debugWarn(
          "[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage",
        );
      } catch (e) {}
      delete queryOpts.contentPath;
      delete queryOpts.homePage;
      delete queryOpts.notFoundPage;
      delete queryOpts.navigationPage;
    }
  }
  const finalOptions = Object.assign({}, queryOpts, options);
  if (
    finalOptions.manifest != null &&
    (typeof finalOptions.manifest !== "object" ||
      Array.isArray(finalOptions.manifest))
  ) {
    throw new TypeError("initCMS(options): manifest must be a plain object");
  }
  if (
    finalOptions.onRuntimeError != null &&
    typeof finalOptions.onRuntimeError !== "function"
  ) {
    throw new TypeError("initCMS(options): onRuntimeError must be a function");
  }
  try {
    if (Object.prototype.hasOwnProperty.call(finalOptions, "debugLevel")) {
      setDebugLevel(finalOptions.debugLevel);
    }
  } catch (e) {}
  try {
    debugInfo("[nimbi-cms] initCMS called", () => ({ options: finalOptions }));
  } catch (e) {}
  if (
    queryOpts &&
    typeof queryOpts.bulmaCustomize === "string" &&
    queryOpts.bulmaCustomize.trim()
  ) {
    finalOptions.bulmaCustomize = queryOpts.bulmaCustomize;
  }

  let {
    el,
    contentPath = "/content",
    crawlMaxQueue = 1000,
    searchIndex: searchEnabled = true,
    searchIndexMode = "eager",
    indexDepth = 1,
    noIndexing = undefined,
    defaultStyle = "light",
    bulmaCustomize = "none",
    lang = undefined,
    l10nFile = null,
    cacheTtlMinutes = 5,
    cacheMaxEntries,
    markdownExtensions,
    availableLanguages,
    homePage = null,
    notFoundPage = null,
    navigationPage = "_navigation.md",
    allowEmbeddedScripts = false,
    embeddedScriptOrigins = [],
    exposeSitemap = true,
    cspNonce = null,
  } = finalOptions;

  try {
    if (typeof homePage === "string" && homePage.startsWith("./"))
      homePage = homePage.replace(/^\.\//, "");
  } catch (_e) {}
  try {
    if (typeof notFoundPage === "string" && notFoundPage.startsWith("./"))
      notFoundPage = notFoundPage.replace(/^\.\//, "");
  } catch (_e) {}
  try {
    if (typeof navigationPage === "string" && navigationPage.startsWith("./"))
      navigationPage = navigationPage.replace(/^[.]\//, "");
  } catch (_e) {}

  const { navbarLogo = "favicon" } = finalOptions;

  const { skipRootReadme = false } = finalOptions;

  const renderInitError = (err) => {
    try {
      const mount = document.querySelector(el);
      if (mount && mount instanceof Element) {
        try {
          const buildErrorContainer = () => {
            const container = document.createElement("div");
            container.className = "nimbi-init-error";
            const strong = document.createElement("strong");
            strong.textContent = "NimbiCMS failed to initialize:";
            container.appendChild(strong);
            try {
              container.appendChild(document.createElement("br"));
            } catch (_) {}
            const pre = document.createElement("pre");
            pre.textContent = String(err);
            container.appendChild(pre);
            return container;
          };
          const container = buildErrorContainer();
          try {
            if (typeof mount.replaceChildren === "function")
              mount.replaceChildren(container);
            else {
              while (mount.firstChild) mount.removeChild(mount.firstChild);
              mount.appendChild(container);
            }
          } catch (e) {
            try {
              while (mount.firstChild) mount.removeChild(mount.firstChild);
              mount.appendChild(buildErrorContainer());
            } catch (_) {}
          }
        } catch (err) {}
      }
    } catch (_e) {}
  };

  if (finalOptions.contentPath != null) {
    if (!isSafeContentPath(finalOptions.contentPath)) {
      throw new TypeError(
        'initCMS(options): "contentPath" contains unsafe characters or patterns',
      );
    }
  }
  if (homePage != null) {
    if (!isSafePagePath(homePage)) {
      throw new TypeError(
        'initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html',
      );
    }
  }
  if (notFoundPage != null) {
    if (!isSafePagePath(notFoundPage)) {
      throw new TypeError(
        'initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html',
      );
    }
  }
  if (navigationPage != null) {
    if (!isSafePagePath(navigationPage)) {
      throw new TypeError(
        'initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html',
      );
    }
  }

  if (!el) {
    throw new Error("el is required");
  }

  let mountEl = el;
  if (typeof el === "string") {
    mountEl = document.querySelector(el);
    if (!mountEl)
      throw new Error(`el selector "${el}" did not match any element`);
  } else if (!(el instanceof Element)) {
    throw new TypeError("el must be a CSS selector string or a DOM element");
  }

  // Idempotence guard: prevent double initialization on the same mount element.
  try {
    if (mountEl && mountEl._nimbiCmsInitialized) {
      throw new Error("initCMS already called on this element");
    }
  } catch (e) {
    // Only the duplicate-init sentinel is rethrown; any other failure means
    // the guard itself could not run, so initialization continues.
    if (e instanceof Error && /already called/.test(e.message)) throw e;
  }
  if (cmsMountEl && cmsMountEl !== mountEl && cmsMountEl.isConnected) {
    await destroy();
    destroyPromise = null;
    // `destroy()` releases the previous controller; mint a fresh one so the
    // rest of this initialization has a live signal to bind listeners to.
    cmsAbortController =
      typeof window !== "undefined"
        ? new AbortController()
        : { signal: { abort: () => {} } };
  }
  if (typeof contentPath !== "string" || !contentPath.trim()) {
    throw new TypeError(
      'initCMS(options): "contentPath" must be a non-empty string when provided',
    );
  }

  if (typeof searchEnabled !== "boolean") {
    throw new TypeError(
      'initCMS(options): "searchIndex" must be a boolean when provided',
    );
  }

  if (
    searchIndexMode != null &&
    searchIndexMode !== "eager" &&
    searchIndexMode !== "lazy"
  ) {
    throw new TypeError(
      'initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided',
    );
  }

  if (
    indexDepth != null &&
    indexDepth !== 1 &&
    indexDepth !== 2 &&
    indexDepth !== 3
  ) {
    throw new TypeError(
      'initCMS(options): "indexDepth" must be 1, 2, or 3 when provided',
    );
  }

  if (
    defaultStyle !== "light" &&
    defaultStyle !== "dark" &&
    defaultStyle !== "system"
  ) {
    throw new TypeError(
      'initCMS(options): "defaultStyle" must be "light", "dark" or "system"',
    );
  }

  if (bulmaCustomize != null && typeof bulmaCustomize !== "string") {
    throw new TypeError(
      'initCMS(options): "bulmaCustomize" must be a string when provided',
    );
  }

  if (lang != null && typeof lang !== "string") {
    throw new TypeError(
      'initCMS(options): "lang" must be a string when provided',
    );
  }

  if (l10nFile != null && typeof l10nFile !== "string") {
    throw new TypeError(
      'initCMS(options): "l10nFile" must be a string or null when provided',
    );
  }

  if (
    cacheTtlMinutes != null &&
    (typeof cacheTtlMinutes !== "number" ||
      !Number.isFinite(cacheTtlMinutes) ||
      cacheTtlMinutes < 0)
  ) {
    throw new TypeError(
      'initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided',
    );
  }

  if (
    cacheMaxEntries != null &&
    (typeof cacheMaxEntries !== "number" ||
      !Number.isInteger(cacheMaxEntries) ||
      cacheMaxEntries < 0)
  ) {
    throw new TypeError(
      'initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided',
    );
  }

  if (
    markdownExtensions != null &&
    (!Array.isArray(markdownExtensions) ||
      markdownExtensions.some((ext) => !ext || typeof ext !== "object"))
  ) {
    throw new TypeError(
      'initCMS(options): "markdownExtensions" must be an array of extension objects when provided',
    );
  }

  if (
    availableLanguages != null &&
    (!Array.isArray(availableLanguages) ||
      availableLanguages.some((l) => typeof l !== "string" || !l.trim()))
  ) {
    throw new TypeError(
      'initCMS(options): "availableLanguages" must be an array of non-empty strings when provided',
    );
  }
  if (
    noIndexing != null &&
    (!Array.isArray(noIndexing) ||
      noIndexing.some((p) => typeof p !== "string" || !p.trim()))
  ) {
    throw new TypeError(
      'initCMS(options): "noIndexing" must be an array of non-empty strings when provided',
    );
  }

  noIndexing = Array.isArray(noIndexing)
    ? Array.from(
        new Set(
          noIndexing
            .map((p) => {
              try {
                return normalizePath(String(p ?? ""));
              } catch (_) {
                return "";
              }
            })
            .filter(Boolean),
        ),
      )
    : undefined;

  if (skipRootReadme != null && typeof skipRootReadme !== "boolean") {
    throw new TypeError(
      'initCMS(options): "skipRootReadme" must be a boolean when provided',
    );
  }

  if (
    allowEmbeddedScripts != null &&
    typeof allowEmbeddedScripts !== "boolean"
  ) {
    throw new TypeError(
      'initCMS(options): "allowEmbeddedScripts" must be a boolean when provided',
    );
  }

  if (
    !Array.isArray(embeddedScriptOrigins) ||
    embeddedScriptOrigins.some((origin) => {
      if (typeof origin !== "string" || !origin.trim()) return true;
      try {
        const parsed = new URL(origin);
        return (
          !/^https?:$/.test(parsed.protocol) ||
          parsed.username !== "" ||
          parsed.password !== "" ||
          parsed.pathname !== "/" ||
          parsed.search !== "" ||
          parsed.hash !== ""
        );
      } catch (_) {
        return true;
      }
    })
  ) {
    throw new TypeError(
      'initCMS(options): "embeddedScriptOrigins" must contain only absolute http(s) origins',
    );
  }

  if (
    finalOptions.fetchConcurrency != null &&
    (typeof finalOptions.fetchConcurrency !== "number" ||
      !Number.isInteger(finalOptions.fetchConcurrency) ||
      finalOptions.fetchConcurrency < 1)
  ) {
    throw new TypeError(
      'initCMS(options): "fetchConcurrency" must be a positive integer when provided',
    );
  }

  if (
    finalOptions.negativeFetchCacheTTL != null &&
    (typeof finalOptions.negativeFetchCacheTTL !== "number" ||
      !Number.isFinite(finalOptions.negativeFetchCacheTTL) ||
      finalOptions.negativeFetchCacheTTL < 0)
  ) {
    throw new TypeError(
      'initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided',
    );
  }

  if (
    homePage != null &&
    (typeof homePage !== "string" ||
      !homePage.trim() ||
      !/\.(md|html)$/.test(homePage))
  ) {
    throw new TypeError(
      'initCMS(options): "homePage" must be a non-empty string ending with .md or .html',
    );
  }

  if (
    notFoundPage != null &&
    (typeof notFoundPage !== "string" ||
      !notFoundPage.trim() ||
      !/\.(md|html)$/.test(notFoundPage))
  ) {
    throw new TypeError(
      'initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html',
    );
  }

  const effectiveSearchEnabled = !!searchEnabled;

  try {
    setSkipRootReadme(!!skipRootReadme);
  } catch (e) {
    debugWarn("[nimbi-cms] setSkipRootReadme failed", e);
  }

  try {
    // Configure SEO map and inject minimal SEO metadata early (library-level injection)
    try {
      if (finalOptions?.seoMap && typeof finalOptions.seoMap === "object")
        setSeoMap(finalOptions.seoMap);
    } catch (e) {}
    try {
      addResourceHints();
    } catch (e) {}
    try {
      setCspNonce(cspNonce || null);
    } catch (e) {}
    // Preload critical external resources (highlight.js theme CSS)
    try {
      const hljsVersion =
        typeof __HIGHLIGHT_JS_VERSION__ !== "undefined"
          ? String(__HIGHLIGHT_JS_VERSION__)
          : null;
      if (hljsVersion) {
        const theme = currentHighlightTheme || "monokai";
        addPreloadHints(hljsVersion, theme);
      }
    } catch (e) {}
    // Attach a lightweight runtime error/rejection logger for debugging render issues.
    try {
      if (typeof window !== "undefined") {
        if (!window.__nimbiRenderingErrors__)
          window.__nimbiRenderingErrors__ = [];
        const runtimeId = currentRuntimeId;
        // Captured so a late error report cannot repopulate the array after
        // this runtime has been torn down.
        const generation = activeGeneration();
        const redactDiagnosticValue = (value) =>
          String(value)
            .replace(/([?&](?:token|key|secret|password|auth)[^=]*=)[^&]*/gi, "$1[redacted]")
            .replace(/([?&][^#\s=]+)=([^&#\s]*)/g, "$1=[redacted]")
            .replace(/#.*$/, "#");
        const recordRuntimeError = (record) => {
          const boundedRecord = { ...record, runtimeId };
          for (const key of ["message", "reason", "filename", "stack"]) {
            if (boundedRecord[key] != null)
              boundedRecord[key] = redactDiagnosticValue(boundedRecord[key]).slice(0, 2000);
          }
          if (!isCurrentGeneration(generation)) return;
          window.__nimbiRenderingErrors__.push(boundedRecord);
          if (window.__nimbiRenderingErrors__.length > 50)
            window.__nimbiRenderingErrors__.splice(0, window.__nimbiRenderingErrors__.length - 50);
          try {
            finalOptions.onRuntimeError?.({ ...boundedRecord });
          } catch (_) {}
        };
        window.addEventListener("error", function (ev) {
          try {
            const rec = {
              type: "error",
              message: ev?.message ? String(ev.message) : "",
              filename: ev?.filename ? String(ev.filename) : "",
              lineno: ev?.lineno ? ev.lineno : null,
              colno: ev?.colno ? ev.colno : null,
              stack: ev?.error?.stack ? ev.error.stack : null,
              time: Date.now(),
            };
            try {
              debugWarn("[nimbi-cms] runtime error", rec.message);
            } catch (_) {}
            recordRuntimeError(rec);
          } catch (_) {}
        }, { signal: cmsAbortController.signal });
        window.addEventListener("unhandledrejection", function (ev) {
          try {
            const rec = {
              type: "unhandledrejection",
              reason: ev?.reason ? String(ev.reason) : "",
              time: Date.now(),
            };
            try {
              debugWarn("[nimbi-cms] unhandledrejection", rec.reason);
            } catch (_) {}
            recordRuntimeError(rec);
          } catch (_) {}
        }, { signal: cmsAbortController.signal });
      }
    } catch (e) {}
    try {
      const parsedForSeo = parseHrefToRoute(
        typeof window !== "undefined" ? window.location.href : "",
      );
      const pageForSeo = parsedForSeo?.page
        ? parsedForSeo.page
        : homePage || undefined;
      try {
        ensureDocumentMeta();
      } catch (e) {}
      try {
        if (pageForSeo)
          injectSeoForPage(pageForSeo, initialDocumentTitle || "");
      } catch (e) {}
    } catch (e) {}

    await (async () => {
      try {
        mountEl.classList.add("nimbi-mount");
      } catch (e) {
        debugWarn("[nimbi-cms] mount element setup failed", e);
      }

      const sectionEl = document.createElement("section");
      sectionEl.className = "section";

      const container = document.createElement("div");
      container.className = "container nimbi-cms";
      container.tabIndex = 0;
      // Container styling is applied via CSS classes only; no inline style
      // setup is required here. The block was previously an empty try/catch
      // left over from removed code.

      const cols = document.createElement("div");
      cols.className = "columns";

      const navCol = document.createElement("div");
      navCol.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap";
      navCol.setAttribute("role", "navigation");
      try {
        const label = typeof t === "function" ? t("navigation") : null;
        if (label) navCol.setAttribute("aria-label", label);
      } catch (e) {
        debugWarn("[nimbi-cms] set nav aria-label failed", e);
      }
      cols.appendChild(navCol);

      const contentCol = document.createElement("main");
      contentCol.className = "column nimbi-content";
      contentCol.setAttribute("role", "main");
      cols.appendChild(contentCol);

      container.appendChild(cols);

      sectionEl.appendChild(container);

      const navWrap = navCol;
      const contentWrap = contentCol;

      mountEl.appendChild(sectionEl);

      let mountOverlay = null;
      try {
        mountOverlay = mountEl.querySelector(".nimbi-overlay");
        if (!mountOverlay) {
          mountOverlay = document.createElement("div");
          mountOverlay.className = "nimbi-overlay";
          mountEl.appendChild(mountOverlay);
        }
      } catch (e) {
        mountOverlay = null;
        debugWarn("[nimbi-cms] mount overlay setup failed", e);
      }

      const pagePath = location.pathname || "/";
      // Normalize pageDir: if the path ends with '/' it's a directory already.
      // If it doesn't end with '/' and doesn't look like a file (no dot in last segment),
      // treat it as a directory (convert '/example' -> '/example/'). Otherwise
      // treat it as a file path and take its directory portion.
      let pageDir;
      if (pagePath.endsWith("/")) {
        pageDir = pagePath;
      } else {
        const lastSeg = pagePath.substring(pagePath.lastIndexOf("/") + 1);
        if (lastSeg && !lastSeg.includes(".")) {
          pageDir = pagePath + "/";
        } else {
          pageDir = pagePath.substring(0, pagePath.lastIndexOf("/") + 1);
        }
      }
      try {
        initialDocumentTitle = document.title || "";
      } catch (e) {
        initialDocumentTitle = "";
        debugWarn("[nimbi-cms] read initial document title failed", e);
      }
      let cp = contentPath;
      const contentPathWasProvided = Object.prototype.hasOwnProperty.call(
        finalOptions,
        "contentPath",
      );
      const origin =
        typeof location !== "undefined" && location?.origin
          ? location.origin
          : "http://localhost";
      // pageRoot is the site-rooted folder for this page (origin + pageDir)
      const pageRoot = new URL(pageDir, origin).toString();      try {
        const currentHref = typeof window !== "undefined" ? window.location.href : "";
        const canon = toCanonicalHref(currentHref);
        if (typeof window !== "undefined" && canon && typeof history !== "undefined" && history.replaceState) {
          try {
            const basePath = window.location.origin + window.location.pathname;
            const curFull = basePath + window.location.search + window.location.hash;
            const wantFull = basePath + (canon.startsWith("?") || canon.startsWith("#") ? canon : "");
            if (wantFull && wantFull !== curFull) {
              history.replaceState(history.state || {}, "", canon);
            }
          } catch (_) {}
        }
      } catch (_) {}


      // '.' and './' are page-relative (same as empty)
      if (cp === "." || cp === "./") cp = "";

      // Normalize cp into a page-relative segment without leading slash,
      // always ensuring a trailing slash when non-empty.
      try {
        cp = String(cp ?? "").replace(/\\/g, "/");
      } catch (_e) {
        // Backslash normalization is best-effort; keep the raw value.
        cp = String(cp ?? "");
      }
      if (cp.startsWith("/")) cp = cp.replace(/^\/+/, "");
      if (cp && !cp.endsWith("/")) cp = cp + "/";

      // If the configured contentPath already includes the pageDir (common when
      // authors provide a site-rooted path like '/example/content'), remove the
      // leading pageDir segment so we don't duplicate it when building
      // `${origin}${pageDir}${cp}` below.
      try {
        if (cp && pageDir && pageDir !== "/") {
          const pd = pageDir.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          if (pd && cp.startsWith(pd)) {
            cp = cp.slice(pd.length);
          }
        }
      } catch (_e) {
        /* ignore normalization errors */
      }

      // Compute contentBase as origin + pageDir + cp (always preserve pageDir/site subpath).
      // This yields: `${location.origin}${location.pathname}${contentPath}` when cp non-empty,
      // or `${location.origin}${location.pathname}` when cp is empty.
      // `let` rather than `var`: the previous `var` declarations inside the
      // try blocks leaked to function scope, so a later assignment anywhere
      // in initCMS could silently change the content base.
      let contentBase;
      try {
        contentBase = cp
          ? new URL(
              cp,
              pageRoot.endsWith("/") ? pageRoot : pageRoot + "/",
            ).toString()
          : pageRoot;
      } catch (e) {
        // Fallback: origin + '/' + cp
        try {
          contentBase = cp
            ? new URL("/" + cp, origin).toString()
            : new URL(pageDir, origin).toString();
        } catch (_e) {
          // Malformed contentPath: fall back to the bare origin.
          contentBase = origin;
        }
      }
      // Defer setting the slugManager home page until after we attempt to
      // derive a sensible default from the navigation page when the caller
      // did not explicitly provide `homePage` in options. This avoids
      // forcing `_home.md` when the site's nav points elsewhere.
      if (l10nFile) await loadL10nFile(l10nFile, pageDir);
      if (availableLanguages && Array.isArray(availableLanguages)) {
        setLanguages(availableLanguages);
      }
      if (lang) setLang(lang);
      try {
      if (typeof document !== "undefined" && document.documentElement) {
        const pageLang =
          typeof lang === "string" && lang.trim()
            ? lang.trim().split("-")[0]
            : currentLang;
        try {
          document.documentElement.setAttribute("lang", pageLang);
        } catch (_) {}
        // Set dir="rtl" for RTL locales
        try {
          const loc = new Intl.Locale(pageLang || "en");
          const isRtl =
            (loc.textInfo && loc.textInfo.direction === "rtl") ||
            ["ar", "he", "fa", "ur", "ps", "sd", "ug", "ku", "dv", "yi"].includes(
              String(pageLang || "").split("-")[0].toLowerCase(),
            );
          document.documentElement.setAttribute(
            "dir",
            isRtl ? "rtl" : "ltr",
          );
        } catch (_) {}
      }
      } catch (_) {}

      if (typeof cacheTtlMinutes === "number" && cacheTtlMinutes >= 0) {
        if (typeof router.setResolutionCacheTtl === "function") {
          router.setResolutionCacheTtl(cacheTtlMinutes * 60 * 1000);
        }
      }
      if (typeof cacheMaxEntries === "number" && cacheMaxEntries >= 0) {
        if (typeof router.setResolutionCacheMax === "function") {
          router.setResolutionCacheMax(cacheMaxEntries);
        }
      }
      if (
        markdownExtensions &&
        Array.isArray(markdownExtensions) &&
        markdownExtensions.length
      ) {
        try {
          markdownExtensions.forEach((ext) => {
            if (
              typeof ext === "object" &&
              markdown &&
              typeof markdown.addMarkdownExtension === "function"
            ) {
              markdown.addMarkdownExtension(ext);
            }
          });
        } catch (err) {
          debugWarn("[nimbi-cms] applying markdownExtensions failed", err);
        }
      }

      try {
        if (typeof crawlMaxQueue === "number") {
          try {
            setDefaultCrawlMaxQueue(crawlMaxQueue);
          } catch (_) {
            debugWarn("[nimbi-cms] setDefaultCrawlMaxQueue failed", _);
          }
        }
        if (typeof finalOptions.fetchConcurrency === "number") {
          try {
            setFetchConcurrency(finalOptions.fetchConcurrency);
          } catch (e) {
            debugWarn("[nimbi-cms] setFetchConcurrency failed", e);
          }
        }
        if (typeof finalOptions.negativeFetchCacheTTL === "number") {
          try {
            setFetchNegativeCacheTTL(finalOptions.negativeFetchCacheTTL);
          } catch (e) {
            debugWarn("[nimbi-cms] setFetchNegativeCacheTTL failed", e);
          }
        }
      } catch (err) {
        debugWarn("[nimbi-cms] setDefaultCrawlMaxQueue failed", err);
      }

      try {
        // If an authoritative content manifest was provided by the caller
        // (or injected on the global), apply it to the slug manager before
        // calling `setContentBase`. This ensures `allMarkdownPaths` and
        // slug maps are populated deterministically so direct URL loads
        // (hard refreshes) can resolve pages that are not present in the
        // navigation file.
        try {
          const manifest = finalOptions?.manifest
            ? finalOptions.manifest
            : typeof globalThis !== "undefined" &&
                globalThis.__NIMBI_CMS_MANIFEST__
              ? globalThis.__NIMBI_CMS_MANIFEST__
              : typeof window !== "undefined" && window.__NIMBI_CMS_MANIFEST__
                ? window.__NIMBI_CMS_MANIFEST__
                : null;
          if (manifest && typeof manifest === "object") {
            try {
              _setAllMd(manifest);
              debugInfo?.(
                "[nimbi-cms diagnostic] applied content manifest",
                () => ({ manifestKeys: Object.keys(manifest).length }),
              );
            } catch (e) {
              debugWarn?.("[nimbi-cms] applying content manifest failed", e);
            }
          }

          try {
            // If the page was loaded directly with a cosmetic hash route
            // (e.g. site/#/slug#anchor?params) register a watcher so we can
            // log to the console the moment the requested slug is added to
            // the runtime slug->md map. This helps diagnose cold-load
            // resolution for direct hash requests.
            try {
              const parsedCurrent = parseHrefToRoute(
                typeof window !== "undefined" ? window.location.href : "",
              );
              if (parsedCurrent) {
                try {
                  if (parsedCurrent.type === "cosmetic") {
                    try {
                      watchForColdHashRoute(parsedCurrent);
                    } catch (_) {}
                  } else if (parsedCurrent.type === "canonical") {
                    try {
                      watchForColdHashRoute(parsedCurrent);
                    } catch (_) {}
                  } else if (parsedCurrent.type === "path") {
                    try {
                      const locPath =
                        typeof location !== "undefined" && location?.pathname
                          ? String(location.pathname)
                          : "/";
                      const normalizedLoc = locPath.replace(/\/\/+$/, "");
                      const normalizedPageDir = (pageDir || "").replace(
                        /\/\/+$/,
                        "",
                      );
                      let cbPath = "";
                      try {
                        cbPath = new URL(contentBase).pathname.replace(
                          /\/\/+$/,
                          "",
                        );
                      } catch (_) {
                        // Unparseable contentBase: no base path to compare.
                        cbPath = "";
                      }
                      if (
                        normalizedLoc === normalizedPageDir ||
                        normalizedLoc === cbPath ||
                        normalizedLoc === ""
                      ) {
                        try {
                          watchForColdHashRoute({
                            type: "path",
                            page: null,
                            anchor: parsedCurrent.anchor || null,
                            params: parsedCurrent.params || "",
                          });
                        } catch (_) {}
                      }
                    } catch (_) {}
                  }
                } catch (_) {}
              }
            } catch (_) {}

            setContentBase(contentBase);
          } catch (err) {
            debugWarn("[nimbi-cms] setContentBase failed", err);
          }

          try {
            // Log current slug/index sizes after applying manifest + setContentBase
            try {
              debugInfo(
                "[nimbi-cms diagnostic] after setContentBase",
                () => ({
                  manifestKeys: Object.keys(manifest ?? {}).length ?? 0,
                  slugToMdSize: slugToMd?.size ?? undefined,
                  allMarkdownPathsLength:
                    allMarkdownPaths?.length ?? undefined,
                  allMarkdownPathsSetSize:
                    allMarkdownPathsSet?.size ?? undefined,
                  searchIndexLength: searchIndex?.length ?? undefined,
                }),
              );
            } catch (e) {}
          } catch (e) {}
        } catch (e) {}
      } catch (err) {
        debugWarn("[nimbi-cms] setContentBase failed", err);
      }
      try {
        setNotFoundPage(notFoundPage);
      } catch (err) {
        debugWarn("[nimbi-cms] setNotFoundPage failed", err);
      }
      try {
        // Optional: attach a small sitemap download UI when a host enables it
        if (
          typeof window !== "undefined" &&
          window.__nimbiAutoAttachSitemapUI
        ) {
          try {
            if (
              runtimeSitemap &&
              typeof runtimeSitemap.attachSitemapDownloadUI === "function"
            ) {
              runtimeSitemap.attachSitemapDownloadUI(document.body, {
                filename: "sitemap.json",
              });
            }
          } catch (_) {}
        }
      } catch (e) {}
      // Attempt to derive `homePage` from the first link in the navigation
      // page when the user did not explicitly provide `homePage`.
      let _earlyParsedNav = null;
      let _earlyNavMd = null;
      try {
        const homeWasProvided = Object.prototype.hasOwnProperty.call(
          finalOptions,
          "homePage",
        );
        if (!homeWasProvided && navigationPage) {
          // Try to fetch the configured navigation page. If it fails, attempt
          // a few common alternate locations (no leading underscore, plain
          // "navigation.md", or under `assets/`) so sites that moved/renamed
          // their nav file still derive a sensible home page.
          try {
            const tried = [];
            const candidates = [];
            try {
              if (navigationPage) candidates.push(String(navigationPage));
            } catch (_) {}
            try {
              const stripped = String(navigationPage ?? "").replace(/^_/, "");
              if (stripped && stripped !== String(navigationPage))
                candidates.push(stripped);
            } catch (_) {}
            try {
              candidates.push("navigation.md");
            } catch (_) {}
            try {
              candidates.push("assets/navigation.md");
            } catch (_) {}
            // Deduplicate while preserving order
            const uniq = [];
            for (const c of candidates) {
              try {
                if (!c) continue;
                const s = String(c);
                if (!uniq.includes(s)) uniq.push(s);
              } catch (_) {}
            }

            for (const np of uniq) {
              tried.push(np);
              try {
                _earlyNavMd = await fetchMarkdown(np, contentBase, {
                  force: true,
                });
                if (_earlyNavMd && _earlyNavMd.raw) {
                  // Use repo-relative content path so gh-pages serves files from the
                  // repository subpath (avoids requests to root `/`)
                  // Remember which navigation file actually worked so we
                  // reuse it later when building the nav (avoid a second
                  // failing round-trip to the original configured path).
                  try {
                    navigationPage = np;
                  } catch (_) {}
                  try {
                    debugWarn(
                      "[nimbi-cms] fetched navigation candidate",
                      np,
                      "contentBase=",
                      contentBase,
                    );
                  } catch (_) {}
                  _earlyParsedNav = await markdown.parseMarkdownToHtml(
                    _earlyNavMd.raw || "",
                  );
                  try {
                    const parser = getSharedParser();
                    if (parser && _earlyParsedNav && _earlyParsedNav.html) {
                      const doc = parser.parseFromString(
                        _earlyParsedNav.html,
                        "text/html",
                      );
                      const a = doc.querySelector("a");
                      if (a) {
                        try {
                          const href = a?.getAttribute?.("href") || "";
                          const r = parseHrefToRoute(href);
                          try {
                            debugWarn(
                              "[nimbi-cms] parsed nav first-link href",
                              href,
                              "->",
                              r,
                            );
                          } catch (_) {}
                          if (r?.page) {
                            // Only accept candidate home pages that look like a
                            // fetchable path (contain an extension or a directory).
                            // Reject cosmetic slug or site-root paths like
                            // "/nimbiCMS_pre" which are not content pages.
                            if (
                              (r.type === "path" || r.type === "canonical") &&
                              (r.page.includes(".") || r.page.includes("/"))
                            ) {
                              homePage = r.page;
                              try {
                                debugWarn(
                                  "[nimbi-cms] derived homePage from navigation",
                                  homePage,
                                );
                              } catch (_) {}
                              break;
                            }
                          }
                        } catch (e) {
                          /* swallow parsing errors for this candidate */
                        }
                      }
                    }
                  } catch (e) {
                    /* swallow parse errors for this candidate */
                  }
                }
              } catch (_) {
                // try next candidate
              }
            }
          } catch (e) {
            // ignore navigation fetch/parse failures — we'll fall back below
          }
        }

        try {
          debugWarn(
            "[nimbi-cms] final homePage before slugManager setHomePage",
            homePage,
          );
        } catch (_) {}
        // Inform slugManager of the (possibly updated) homePage value.
        try {
          setHomePage(homePage);
        } catch (e) {
          debugWarn("[nimbi-cms] setHomePage failed", e);
        }

        // Only fetch the configured `homePage` when it is necessary. When the
        // runtime is starting from a cosmetic hash route (e.g. "#/slug") and
        // the host has intentionally left `notFoundPage` unset (inline 404),
        // avoid probing the home page to reduce noisy network requests.
        let _shouldFetchHome = true;
        try {
          const parsedCurrent = parseHrefToRoute(
            typeof location !== "undefined" ? location.href : "",
          );
          if (
            parsedCurrent &&
            parsedCurrent.type === "cosmetic" &&
            (typeof notFoundPage === "undefined" || notFoundPage == null)
          ) {
            _shouldFetchHome = false;
          }
        } catch (_e) {}

        if (_shouldFetchHome && homePage) {
          try {
            await fetchMarkdown(homePage, contentBase, { force: true });
          } catch (e) {
            throw new Error(
              `Required ${homePage} not found at ${contentBase}${homePage}: ${e && e.message ? e.message : String(e)}`,
            );
          }
        }
      } catch (e) {
        // rethrow the error so init fails as before
        throw e;
      }
setStyle(defaultStyle);
  await ensureBulma(bulmaCustomize, pageDir);

  // The AbortController is created at the top of `initCMS` (before any
  // listener registration); only the runtime identity is minted here.
  currentRuntimeId = claimGeneration();
  setRecoveryState("loading");
  const runtimeManifest = createRuntimeManifest({
    generation: currentRuntimeId,
    contentBase,
    language: currentLang,
    source: finalOptions.manifest ?? null,
  });
  disposePerformanceDiagnostics = finalOptions.performanceDiagnostics === true
    ? startPerformanceDiagnostics(cmsAbortController.signal)
    : () => {};

  const ui = createUI({
    contentWrap,
    navWrap,
    container,
    mountOverlay,
    t,
    contentBase,
    homePage,
    initialDocumentTitle,
    runHooks,
    allowEmbeddedScripts,
    embeddedScriptOrigins,
    signal: cmsAbortController.signal,
  });
      try {
        if (typeof window !== "undefined") {
          try {
            // Strict variant (`setIfCurrent`): these run synchronously
            // inside initCMS, so `currentRuntimeId` is always a live
            // generation. Use the strict form for runtime-owned writes so a
            // future refactor that moves them off the init path fails loudly
            // rather than silently writing after teardown.
            setIfCurrent(currentRuntimeId, "__nimbiUI", ui);
            setIfCurrent(currentRuntimeId, "__nimbiRuntimeId", currentRuntimeId);
            setIfCurrent(
              currentRuntimeId,
              "__nimbiRuntimeManifest",
              runtimeManifest,
            );
            // Initialize render timing collection
            if (!window.__nimbiRenderTimings) {
              window.__nimbiRenderTimings = [];
            }
          } catch (_) {}
          window.addEventListener(
            "nimbi.coldRouteResolved",
            function () {
              ui?.renderByQuery?.().catch((e) => {
                debugWarn?.(
                  "[nimbi-cms] renderByQuery failed for cold-route event",
                  e,
                );
              });
            },
            { signal: cmsAbortController.signal },
          );
          const q = Array.isArray(window.__nimbiColdRouteResolved)
            ? window.__nimbiColdRouteResolved.slice()
            : null;
          if (q?.length) {
            ui?.renderByQuery?.().catch(() => {});
            window.__nimbiColdRouteResolved = [];
          }
        }
      } catch (_) {}

      try {
        const navbarWrap = document.createElement("header");
        navbarWrap.className = "nimbi-site-navbar";
        mountEl.insertBefore(navbarWrap, sectionEl);
        // Reuse the navigation page parsed earlier when available to avoid a
        // second network round-trip; otherwise load it now.
        let navMd = _earlyNavMd;
        let parsedNav = _earlyParsedNav;
        if (!parsedNav) {
          navMd = await fetchMarkdown(navigationPage, contentBase, {
            force: true,
          });
          parsedNav = await markdown.parseMarkdownToHtml(navMd.raw || "");
        }
        const { navbar, linkEls } = await buildNav(
          navbarWrap,
          container,
          parsedNav.html || "",
          contentBase,
          homePage,
          t,
          ui.renderByQuery,
          effectiveSearchEnabled,
          searchIndexMode,
          indexDepth,
          noIndexing,
          navbarLogo,
          cmsAbortController.signal,
        );
        try {
          await runHooks("onNavBuild", {
            navWrap,
            navbar,
            linkEls,
            contentBase,
          });
        } catch (e) {
          debugWarn("[nimbi-cms] onNavBuild hooks failed", e);
        }
        try {
          // Ensure nav link slugs are present in slugManager for mocked environments
          try {
            if (linkEls && linkEls.length) {
              for (const a of Array.from(linkEls || [])) {
                try {
                  const href = a?.getAttribute?.("href") || "";
                  if (!href) continue;
                  let path = String(href ?? "").split(/::|#/, 1)[0];
                  path = String(path ?? "").split("?")[0];
                  if (!path) continue;
                  if (!/\.(?:md|html?)$/.test(path)) path = path + ".html";
                  // Normalize path to a content-base relative canonical form
                  let rel = null;
                  try {
                    rel = normalizePath(String(path ?? ""));
                  } catch (_) {
                    // normalizePath is best-effort; keep the raw path.
                    rel = String(path ?? "");
                  }
                  const baseName = String(rel ?? "")
                    .replace(/^.*\//, "")
                    .replace(/\?.*$/, "");
                  if (!baseName) continue;
                  try {
                    // Prefer using slugManager.slugify when available to produce
                    // consistent slugs; avoid clobbering existing slug keys by
                    // generating a unique candidate when collisions would occur.
                    let candidate = null;
                    try {
                      candidate = slugify(
                        baseName.replace(/\.(?:md|html?)$/i, ""),
                      );
                    } catch (_) {
                      // slugify unavailable: fall back to a naive slug.
                      candidate = String(baseName ?? "")
                        .replace(/\s+/g, "-")
                        .toLowerCase();
                    }
                    if (!candidate) continue;
                    let slugKeyFinal = candidate;
                    try {
                      if (
                        slugToMd &&
                        typeof slugToMd.has === "function" &&
                        slugToMd.has(candidate)
                      ) {
                        // If the existing mapping belongs to the same path, keep it.
                        const existing = slugToMd.get(candidate);
                        let belongs = false;
                        try {
                          if (typeof existing === "string") {
                            if (existing === path) belongs = true;
                          } else if (existing && typeof existing === "object") {
                            if (existing.default === path) belongs = true;
                            for (const k of Object.keys(existing.langs || {})) {
                              if (existing.langs[k] === path) {
                                belongs = true;
                                break;
                              }
                            }
                          }
                        } catch (_) {}
                        if (!belongs) {
                          try {
                            slugKeyFinal = uniqueSlug(
                              candidate,
                              new Set(slugToMd.keys()),
                            );
                          } catch (_) {
                            // Dedupe lookup failed; accept the candidate.
                            slugKeyFinal = candidate;
                          }
                        }
                      }
                    } catch (_) {}

                    try {
                      try {
                        _storeSlugMapping(slugKeyFinal, rel);
                      } catch (_) {}
                      try {
                        mdToSlug?.set?.(rel, slugKeyFinal);
                      } catch (_) {}
                      try {
                        if (!allMarkdownPathsSet?.has?.(rel)) {
                          try {
                            allMarkdownPathsSet?.add?.(rel);
                            if (Array.isArray(allMarkdownPaths))
                              allMarkdownPaths.push(rel);
                          } catch (_) {}
                        }
                      } catch (_) {}
                    } catch (_) {}
                  } catch (_) {}
                } catch (_) {}
              }
              try {
                refreshIndexPaths(contentBase);
              } catch (_) {}
            }
          } catch (e) {}
        } catch (e) {}

        try {
          // If the current URL is requesting a sitemap/rss/atom, run the
          // sitemap handler regardless of `exposeSitemap`. This ensures
          // requests like `/?rss` or `/sitemap.xml` are handled by the
          // runtime generator even when the host hasn't explicitly enabled
          // the `exposeSitemap` flag.
          let shouldTrySitemap = false;
          try {
            const sp = new URLSearchParams(location.search || "");
            if (sp.has("sitemap") || sp.has("rss") || sp.has("atom"))
              shouldTrySitemap = true;
          } catch (_) {}
          try {
            const pathname = (location.pathname || "/").replace(/\/\/+/g, "/");
            const name = pathname.split("/").filter(Boolean).pop() || "";
            if (
              name &&
              /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(name)
            )
              shouldTrySitemap = true;
          } catch (_) {}

          if (shouldTrySitemap) {
            try {
              // Ensure the authoritative index is built before handling
              // sitemap/rss/atom requests. This will deterministically wait
              // for the runtime index (worker-first) and avoid race
              // conditions where consumers observe a partial array.
              try {
                const seeds = [];
                if (homePage) seeds.push(homePage);
                if (navigationPage) seeds.push(navigationPage);
                try {
                  await awaitSearchIndexRuntime({
                    contentBase,
                    indexDepth: Math.max(indexDepth || 1, 3),
                    noIndexing,
                    seedPaths: seeds.length ? seeds : undefined,
                    startBuild: true,
                    timeoutMs: Infinity,
                  });
                } catch (_) {
                  /* don't fail init if index build errors */
                }
              } catch (_) {}

              try {
                if (
                  runtimeSitemap &&
                  typeof runtimeSitemap.handleSitemapRequest === "function"
                ) {
                  const handled = await runtimeSitemap.handleSitemapRequest({
                    includeAllMarkdown: true,
                    homePage,
                    navigationPage,
                    notFoundPage,
                    contentBase,
                    indexDepth,
                    noIndexing,
                    // The browser `/?sitemap` endpoint is the only caller
                    // allowed to replace the document, and only while
                    // `exposeSitemap` remains enabled. Every other caller
                    // receives the generated body instead.
                    writeToDocument: exposeSitemap !== false,
                  });
                  if (handled) return;
                }
              } catch (e) {
                /* ignore runtime sitemap handler errors */
              }
            } catch (e) {
              /* ignore dynamic import errors */
            }
          } else if (
            exposeSitemap === true ||
            (typeof window !== "undefined" && window.__nimbiExposeSitemap)
          ) {
            try {
              if (
                runtimeSitemap &&
                typeof runtimeSitemap.exposeSitemapGlobals === "function"
              ) {
                try {
                  runtimeSitemap
                    .exposeSitemapGlobals({
                      includeAllMarkdown: true,
                      homePage,
                      navigationPage,
                      notFoundPage,
                      contentBase,
                      indexDepth,
                      noIndexing,
                    })
                    .catch(() => {});
                } catch (_) {}
              }
            } catch (_) {}
          }

        } catch (e) {}

        try {
          // Refresh the runtime index set from any slug mappings created
          // during nav build so initial direct page loads can probe
          // candidates (crawl/index lookups) even when no build-time
          // manifest was provided.
           try {
             if (typeof refreshIndexPaths === "function") {
               try {
                 refreshIndexPaths(contentBase);
                 try {
                   // Diagnostic: log slug/index sizes after index refresh
                   try {
                    debugInfo(
                      "[nimbi-cms diagnostic] after refreshIndexPaths",
                      () => ({
                        slugToMdSize:
                          typeof slugToMd?.size === "number"
                            ? slugToMd?.size
                            : undefined,
                        allMarkdownPathsLength: Array.isArray(
                          allMarkdownPaths,
                        )
                          ? allMarkdownPaths.length
                          : undefined,
                        allMarkdownPathsSetSize:
                          typeof allMarkdownPathsSet?.size === "number"
                            ? allMarkdownPathsSet?.size
                            : undefined,
                      }),
                    );
                  } catch (e) {}
                } catch (e) {}
                // If no build-time manifest and slug maps are sparse, try using
                // the runtime sitemap / search index exposed on `window` to
                // populate slug->md mappings so direct URL loads can resolve.
                try {
                  const currentSize =
                    typeof slugToMd?.size === "number"
                      ? slugToMd?.size
                      : 0;
                  // Decide whether to seed: prefer targeted seeding when the
                  // currently requested slug/path is missing, otherwise seed
                  // when maps appear sparse. This avoids noisy work on large
                  // sites while fixing direct-load cases.
                  let shouldSeed = false;
                  try {
                    if (!manifest) {
                      if (currentSize < 30) shouldSeed = true;
                      try {
                        const parsedCurrent = parseHrefToRoute(
                          typeof location !== "undefined" ? location.href : "",
                        );
                        if (parsedCurrent) {
                          if (
                            parsedCurrent.type === "cosmetic" &&
                            parsedCurrent.page
                          ) {
                            try {
                              if (!slugToMd.has(parsedCurrent.page))
                                shouldSeed = true;
                            } catch (_) {}
                          } else if (
                            (parsedCurrent.type === "path" ||
                              parsedCurrent.type === "canonical") &&
                            parsedCurrent.page
                          ) {
                            try {
                              const rp = normalizePath(parsedCurrent.page);
                              if (
                                !mdToSlug?.has?.(rp) &&
                                !allMarkdownPathsSet?.has?.(rp)
                              )
                                shouldSeed = true;
                            } catch (_) {}
                          }
                        }
                      } catch (_) {}
                    }
                  } catch (_) {}

                  if (shouldSeed) {
                    let resolvedIndex = null;
                    try {
                      resolvedIndex =
                        (typeof window !== "undefined" &&
                          (window.__nimbiSitemapFinal ||
                            window.__nimbiResolvedIndex ||
                            window.__nimbiSearchIndex ||
                            window.__nimbiLiveSearchIndex ||
                            window.__nimbiSearchIndex)) ||
                        null;
                    } catch (_) {
                      // Search index globals unreadable; treat as absent.
                      resolvedIndex = null;
                    }
                    if (Array.isArray(resolvedIndex) && resolvedIndex.length) {
                      let added = 0;
                      for (const it of resolvedIndex) {
                        try {
                          if (!it || !it.slug) continue;
                          const baseSlug = String(it.slug).split("::")[0];
                          if (slugToMd.has(baseSlug)) continue;
                          let rawPath = it.sourcePath || it.path || null;
                          if (!rawPath && Array.isArray(resolvedIndex)) {
                            const found = (resolvedIndex || []).find(
                              (si) => si && si.slug === it.slug,
                            );
                            if (found && found.path) rawPath = found.path;
                          }
                          if (!rawPath) continue;
                          try {
                            rawPath = String(rawPath);
                          } catch (_) {
                            // Unstringifiable path; skip this entry.
                            continue;
                          }

                          // Normalize to a content-base relative path similar to
                          // how `buildSearchIndex` and `slugManager` represent
                          // paths. Attempt URL resolution when possible so
                          // absolute URLs or root-prefixed paths are handled.
                          let rel = null;
                          try {
                            const baseForResolve =
                              contentBase && typeof contentBase === "string"
                                ? contentBase
                                : typeof location !== "undefined" &&
                                    location.origin
                                  ? location.origin + "/"
                                  : "";
                            try {
                              const u = new URL(rawPath, baseForResolve);
                              const baseUrl = new URL(baseForResolve);
                              if (u.origin === baseUrl.origin) {
                                const basePath = baseUrl.pathname || "/";
                                let p = u.pathname || "";
                                if (p.startsWith(basePath))
                                  p = p.slice(basePath.length);
                                if (p.startsWith("/")) p = p.slice(1);
                                rel = normalizePath(p);
                              } else {
                                rel = normalizePath(u.pathname || "");
                              }
                            } catch (e) {
                              // URL parse failed; fall back to the raw path.
                              rel = normalizePath(rawPath);
                            }
                          } catch (e) {
                              // URL parse failed; fall back to the raw path.
                              rel = normalizePath(rawPath);
                          }

                          if (!rel) continue;
                          rel = String(rel).split(/[?#]/)[0];
                          rel = normalizePath(rel);

                          try {
                            _storeSlugMapping(baseSlug, rel);
                          } catch (_) {}
                          added++;
                        } catch (_) {}
                      }
                      if (added) {
                        try {
                          debugInfo(
                            "[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",
                            () => ({
                              added,
                              total:
                                typeof slugToMd?.size === "number"
                                  ? slugToMd?.size
                                  : undefined,
                            }),
                          );
                        } catch (_) {}
                        try {
                          refreshIndexPaths(contentBase);
                        } catch (_) {}
                        try {
                          if (
                            typeof window !== "undefined" &&
                            window.__nimbiUI &&
                            typeof window.__nimbiUI.renderByQuery === "function"
                          ) {
                            window.__nimbiUI.renderByQuery().catch(() => {})
                          }
                        } catch (_) {}
                      }
                    }
                  }
                } catch (_) {}
              } catch (e) {
                debugWarn(
                  "[nimbi-cms] refreshIndexPaths after nav build failed",
                  e,
                );
              }
            }
          } catch (e) {}

          const computeAndSet = () => {
            const navHeight =
              (navbarWrap?.getBoundingClientRect &&
                Math.round(navbarWrap.getBoundingClientRect().height)) ||
              navbarWrap?.offsetHeight ||
              0;
            if (navHeight > 0) {
              try {
                mountEl.style.setProperty(
                  "--nimbi-site-navbar-height",
                  `${navHeight}px`,
                );
              } catch (err) {
                debugWarn("[nimbi-cms] set CSS var failed", err);
              }
              try {
                container.style.paddingTop = "";
              } catch (err) {
                debugWarn("[nimbi-cms] set container paddingTop failed", err);
              }
              try {
                const mountH =
                  (mountEl?.getBoundingClientRect &&
                    Math.round(mountEl.getBoundingClientRect().height)) ||
                  mountEl?.clientHeight ||
                  0;
                if (mountH > 0) {
                  const explicit = Math.max(0, mountH - navHeight);
                  try {
                    container.style.setProperty(
                      "--nimbi-cms-height",
                      `${explicit}px`,
                    );
                  } catch (err) {
                    debugWarn("[nimbi-cms] set --nimbi-cms-height failed", err);
                  }
                } else {
                  try {
                    container.style.setProperty(
                      "--nimbi-cms-height",
                      "calc(100vh - var(--nimbi-site-navbar-height))",
                    );
                  } catch (err) {
                    debugWarn("[nimbi-cms] set --nimbi-cms-height failed", err);
                  }
                }
              } catch (err) {
                debugWarn("[nimbi-cms] compute container height failed", err);
              }
              try {
                navbarWrap.style.setProperty(
                  "--nimbi-site-navbar-height",
                  `${navHeight}px`,
                );
              } catch (err) {
                debugWarn("[nimbi-cms] set navbar CSS var failed", err);
              }
            }
          };
          computeAndSet();
          try {
            if (typeof ResizeObserver !== "undefined") {
              const ro = new ResizeObserver(() => computeAndSet());
              try {
                ro.observe(navbarWrap);
              } catch (err) {
                debugWarn("[nimbi-cms] ResizeObserver.observe failed", err);
              }
            }
          } catch (err) {
            debugWarn("[nimbi-cms] ResizeObserver setup failed", err);
          }
        } catch (err) {
          debugWarn("[nimbi-cms] compute navbar height failed", err);
        }
      } catch (e) {
        debugWarn("[nimbi-cms] build navigation failed", e);
      }

      try {
        const v =
          typeof __NIMBI_CMS_VERSION__ !== "undefined"
            ? String(__NIMBI_CMS_VERSION__ || "0.0.0")
            : "0.0.0";
        const finishWithAnchor = (href) => {
          const a = document.createElement("a");
          a.className = "nimbi-version-label tag is-small";
          a.textContent = `nimbiCMS v. ${v}`;
          a.href = href || "#";
          a.target = "_blank";
          a.rel = "noopener noreferrer nofollow";
          a.setAttribute("aria-label", `nimbiCMS version ${v}`);
          // Keep the badge out of LCP candidate selection during initial paint.
          a.classList.add("is-hidden");
          try {
            registerThemedElement(a);
          } catch (e) {
            /* ignore */
          }
          try {
            mountEl.appendChild(a);
            const reveal = () => {
              try {
                a.classList.remove("is-hidden");
              } catch (e) {
                /* ignore */
              }
            };
            try {
              scheduleRuntimeTimeout(reveal, 3000);
            } catch (e) {
              // Scheduler unavailable; reveal immediately.
              reveal();
            }
          } catch (err) {
            debugWarn("[nimbi-cms] append version label failed", err);
          }
        };

        const injectedHomepage =
          typeof __NIMBI_CMS_HOMEPAGE__ !== "undefined"
            ? __NIMBI_CMS_HOMEPAGE__
            : null;
        const safeLink = (() => {
          try {
            if (injectedHomepage && typeof injectedHomepage === "string") {
              return new URL(injectedHomepage).toString();
            }
          } catch (e) {}
          return "#";
        })();

        const appendVersionLabelDeferred = () => {
          try {
            finishWithAnchor(safeLink);
          } catch (err) {
            debugWarn("[nimbi-cms] building version label failed", err);
          }
        };

        try {
          let shown = false;
          const showOnce = () => {
            if (shown) return;
            shown = true;
            appendVersionLabelDeferred();
          };
          const addOnce = (type) => {
            try {
              window.addEventListener(type, showOnce, {
                once: true,
                passive: true,
                signal: cmsAbortController?.signal,
              });
            } catch (e) {
              try {
                window.addEventListener(type, showOnce, { once: true });
              } catch (_) {}
            }
          };
          addOnce("pointerdown");
          addOnce("keydown");
          addOnce("touchstart");
          addOnce("wheel");
        } catch (err) {
          debugWarn("[nimbi-cms] version label defer failed", err);
          appendVersionLabelDeferred();
        }
      } catch (err) {
        debugWarn("[nimbi-cms] version label setup failed", err);
      }
    })();
  } catch (err) {
    setRecoveryState("failed", err);
    renderInitError(err);
    throw err;
  }
  mountEl._nimbiCmsInitialized = true;
  cmsMountEl = mountEl;
  setRecoveryState("ready");
}

/**
 * Tear down the CMS runtime: abort pending fetches, terminate worker pools,
 * remove event listeners, and clear DOM elements created during `initCMS`.
 *
 * Safe to call multiple times; subsequent calls are no-ops.
 *
 * @returns {Promise<void>}
 */
export function destroy() {
  if (destroyPromise) return destroyPromise;
  destroyPromise = (async () => {
    if (typeof router.disposeResolutionCachePurge === "function") {
      router.disposeResolutionCachePurge();
    }
    // Release module singletons that hold DOM references. The code-block
    // observer keeps detached nodes alive for any block that was never
    // scrolled into view; the image-preview modal can stay open after its
    // mount element is removed.
    try {
      if (typeof codeblocksManager.disposeCodeblocksObserver === "function") {
        codeblocksManager.disposeCodeblocksObserver();
      }
    } catch (_) {}
    try {
      if (typeof imagePreview.disposeImagePreview === "function") {
        imagePreview.disposeImagePreview();
      }
    } catch (_) {}
    // Bulmaswatch theme observers watch `document.head` for the lifetime of
    // the page and retain the stylesheet link they were moving.
    try {
      if (typeof bulmaManager.disconnectBulmaObservers === "function") {
        bulmaManager.disconnectBulmaObservers();
      }
    } catch (_) {}
    // Release the generation FIRST. Doing this before `clearAllGlobals()`
    // closes the window where the globals are already null but the generation
    // is still live, which would let an in-flight async write repopulate them
    // after teardown — the exact failure mode the generation guard exists to
    // prevent.
    try {
      currentRuntimeId = null;
      releaseGeneration();
    } catch (_) {}

    try {
      if (typeof window !== "undefined") {
        // Clear every managed debug global, not just the handful listed here
        // previously, so a torn-down runtime leaves nothing for the next one
        // to inherit. `__nimbiRecoveryState` is cleared here too; writing an
        // "idle" state afterwards would repopulate a global we just cleared.
        clearAllGlobals();
      }
    } catch (_) {}

    try {
      if (cmsAbortController) cmsAbortController.abort();
      cmsAbortController = null;
    } catch (_) {}
    clearRuntimeTimeouts();
    try {
      if (typeof runtimeSitemap.clearSitemapWriteTimer === "function") {
        runtimeSitemap.clearSitemapWriteTimer();
      }
    } catch (_) {}
    try {
      disposePerformanceDiagnostics();
      disposePerformanceDiagnostics = () => {};
    } catch (_) {}

    await Promise.all([
      teardownRendererWorkerPool(),
      teardownSlugWorkerPool(),
      teardownAnchorWorkerPool(),
    ]);
    disposeWorkerBlobUrlCache();

    try {
      if (typeof router._clearIndexCache === "function") router._clearIndexCache();
    } catch (_) {}

    try {
      if (typeof document !== "undefined") {
        document.querySelector(".nimbi-skip-link")?.remove();
        document.querySelector(".nimbi-scroll-top")?.remove();
        document.querySelector(".nimbi-mount > section")?.remove();
      }
    } catch (_) {}

    // Second sweep. The first `clearAllGlobals()` runs before the async
    // worker teardown above, so an in-flight sitemap or index write that
    // resolves during that window repopulates a global we already cleared.
    // The generation guard blocks writes from a *claimed* generation, but the
    // permissive variant deliberately allows host-driven calls that never
    // claimed one — so a late call with no generation still gets through.
    // Clearing again after the awaits closes that window.
    try {
      if (typeof window !== "undefined") clearAllGlobals();
    } catch (_) {}

    try {
      // `currentRuntimeId`/generation were already released at the top of
      // teardown; only the mount bookkeeping remains here.
      if (cmsMountEl) cmsMountEl._nimbiCmsInitialized = false;
      cmsMountEl = null;
    } catch (_) {}
  })();
  return destroyPromise;
}
