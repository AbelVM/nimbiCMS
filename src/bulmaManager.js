/**
 * Bulma and theming helpers.
 *
 * Manage Bulma and theme variants, inject theme overrides, and provide
 * helpers for loading remote or local Bulma themes.
 *
 * @module bulmaManager
 */

/** @type {'light'|'dark'|'system'} */
let currentStyle = "light";

/**
 * Every MutationObserver created to keep a Bulmaswatch theme stylesheet last
 * in `<head>`. Tracked here so `destroy()` can disconnect them all; previously
 * they were only reachable through a broken attribute lookup and survived
 * teardown, observing `document.head` for the lifetime of the page.
 * @type {Set<MutationObserver>}
 */
const _bulmaHeadObservers = new Set();

/**
 * Disconnect one head observer and drop it from the registry.
 * @param {MutationObserver|null} observer
 * @returns {void}
 */
function _disconnectObserver(observer) {
  try {
    if (observer && typeof observer.disconnect === "function") {
      observer.disconnect();
    }
  } catch (_) {}
  _bulmaHeadObservers.delete(observer);
}

/**
 * Disconnect every Bulmaswatch head observer.
 *
 * Called from `destroy()`. Without this, each observer keeps watching
 * `document.head` for the lifetime of the page and retains a reference to the
 * stylesheet link it was moving.
 * @returns {void}
 */
export function disconnectBulmaObservers() {
  for (const observer of Array.from(_bulmaHeadObservers)) {
    _disconnectObserver(observer);
  }
  _bulmaHeadObservers.clear();
}

import { debugLog, debugWarn } from "./utils/debug.js";
import { applyCspNonce } from "./utils/helpers.js";

/**
 * @typedef {Record<string,string>} ThemeVars
 */

/**
 * Insert a stylesheet link into the document head if not already present.
 * @param {string} href - stylesheet URL to insert
 * @param {Record<string,string>} [attrs] - Optional attributes to set on the link element.
 * @returns {void}
 */
// Exported for tests: the Bulmaswatch observer lifecycle is only reachable
// through this helper, and there is no public API that injects a themed link.
export function injectLink(href, attrs = {}) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v));
  document.head.appendChild(l);

  if (attrs["data-bulmaswatch-theme"]) {
    try {
      if (l.getAttribute("data-bulmaswatch-observer")) return;
      let moveCount = Number(
        l.getAttribute("data-bulmaswatch-move-count") || 0,
      );
      let moving = false;
      // The previous implementation tried to reuse an existing observer by
      // looking one up through a `data-bulmaswatch-observer` attribute, but it
      // stored the literal string "1" and then queried for an element carrying
      // that value — which resolved to the link itself, not an observer. Every
      // call therefore created a fresh observer. Observers are now tracked in
      // `_bulmaHeadObservers` instead, which is what makes teardown possible.
      let observer = null;
      const observerCallback = () => {
        try {
          if (moving) return;
          const parent = l.parentNode;
          if (!parent) {
            // The stylesheet was removed (teardown or theme change). Stop
            // observing rather than running for the rest of the page lifetime.
            _disconnectObserver(observer);
            return;
          }
          const last = parent.lastElementChild;
          if (last === l) return;
          const currentMoveCount = Number(
            l.getAttribute("data-bulmaswatch-move-count") || 0,
          );
          if (currentMoveCount >= 1000) {
            l.setAttribute("data-bulmaswatch-move-stopped", "1");
            _disconnectObserver(observer);
            return;
          }
          moving = true;
          try {
            parent.appendChild(l);
          } catch (e) {
            /* ignore */
          }
          const newMoveCount = currentMoveCount + 1;
          l.setAttribute("data-bulmaswatch-move-count", String(newMoveCount));
          moving = false;
        } catch (e) {
          /* ignore */
        }
      };
      if (!observer) {
        observer = new MutationObserver(observerCallback);
        _bulmaHeadObservers.add(observer);
      }
      try {
        observer.observe(document.head, { childList: true });
        l.setAttribute("data-bulmaswatch-observer", "1");
        l.setAttribute("data-bulmaswatch-move-count", String(moveCount));
      } catch (e) {
        /* ignore */
      }
      const parent = document.head;
      if (parent?.lastElementChild !== l) parent?.appendChild(l);
    } catch (e) {
      /* ignore */
    }
  }
}

function removeThemeAndOverrides() {
  try {
    const scope =
      typeof document !== "undefined" && document?.head
        ? document.head
        : document;
    const themeLinks = Array.from(
      scope.querySelectorAll("link[data-bulmaswatch-theme]"),
    );
    for (const tl of themeLinks) tl?.parentNode?.removeChild(tl);
  } catch (e) {
    /* ignore */
  }
  try {
    const scope2 =
      typeof document !== "undefined" && document?.head
        ? document.head
        : document;
    const overrides = Array.from(
      scope2.querySelectorAll("style[data-bulma-override]"),
    );
    for (const s of overrides) s?.parentNode?.removeChild(s);
  } catch (e) {
    /* ignore */
  }
}

/**
 * Ensure that Bulma or a Bulmaswatch theme is loaded.  Supports local
 * overrides or named themes fetched from unpkg.
 *
 * @param {string} bulmaCustomize - 'none' | 'local' | theme name to load from unpkg.
 * @param {string} pageDir - Directory to probe for a local `bulma.css` when using 'local'.
 * @returns {Promise<void>} - Resolves when theme loading completes.
 */
export async function ensureBulma(bulmaCustomize = "none", pageDir = "/") {
  try {
    debugLog("[bulmaManager] ensureBulma called", { bulmaCustomize, pageDir });
  } catch (_) {}

  if (!bulmaCustomize) return;

  if (bulmaCustomize === "none") {
    // 'none' means use the bundled CSS (dist/nimbi-cms.css) — do not inject a
    // separate Bulma CDN stylesheet. Remove any previously-applied Bulmaswatch
    // theme links or overrides and return.
    try {
      removeThemeAndOverrides();
    } catch (_) {}
    return;
  }

  const rawLocalCandidates = [pageDir + "bulma.css", "/bulma.css"];
  const localCandidates = Array.from(new Set(rawLocalCandidates));

  if (bulmaCustomize === "local") {
    removeThemeAndOverrides();
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const p of localCandidates) {
      try {
        const res = await fetch(p, { method: "GET" });
        if (res.ok) {
          const css = await res.text();
          const s = document.createElement("style");
          s.setAttribute("data-bulma-override", p);
          applyCspNonce(s);
          s.appendChild(
            document.createTextNode(`\n/* bulma override: ${p} */\n` + css),
          );
          document.head.appendChild(s);
          return;
        }
      } catch (_) {
        debugWarn("[bulmaManager] fetch local bulma candidate failed", _);
      }
    }
    return;
  }

  try {
    const theme = String(bulmaCustomize).trim();
    if (!theme) return;
    removeThemeAndOverrides();
    const href = `https://unpkg.com/bulmaswatch/${encodeURIComponent(theme)}/bulmaswatch.min.css`;
    injectLink(href, { "data-bulmaswatch-theme": theme });
  } catch (_) {
    debugWarn("[bulmaManager] ensureBulma failed", _);
  }
}

/**
 * Toggle theme styling by setting `data-theme` on each `.nimbi-mount`
 * container. There are three recognized theme values:
 * - `light`: explicitly apply light theme (sets `data-theme="light").
 * - `dark`: explicitly apply dark theme (sets `data-theme="dark").
 * - `system`: follow the system/OS preference; implementation removes any
 *   explicit `data-theme` attribute so user agent or CSS using
 *   `prefers-color-scheme` can take effect.
 *
 * When no `.nimbi-mount` elements are present the same attribute is
 * applied to `document.documentElement` to support global/UMD usage.
 *
 * @param {'light'|'dark'|'system'} style - chosen theme mode.
 * @returns {void}
 */
export function setStyle(style) {
  currentStyle =
    style === "dark" ? "dark" : style === "system" ? "system" : "light";
  try {
    const mounts = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (mounts.length > 0) {
      for (const m of mounts) {
        if (currentStyle === "dark") m.setAttribute("data-theme", "dark");
        else if (currentStyle === "light")
          m.setAttribute("data-theme", "light");
        else m.removeAttribute("data-theme");
      }
    } else {
      const root = document.documentElement;
      if (currentStyle === "dark") root.setAttribute("data-theme", "dark");
      else if (currentStyle === "light")
        root.setAttribute("data-theme", "light");
      else root.removeAttribute("data-theme");
    }
  } catch (e) {
    /* ignore */
  }
}

/**
 * Apply an object of CSS custom properties to the document root. This makes
 * it easy for consumers to theme colors/fonts/etc. without touching Bulma
 * directly. Property names should be provided without the leading `--`.
 *
 * @param {Record<string,string>} vars - Map of CSS variable names (without `--`) to values.
 * @returns {void}
 */
export function setThemeVars(vars) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars || {})) {
    try {
      root.style.setProperty(`--${k}`, v);
    } catch (_) {
      debugWarn("[bulmaManager] setThemeVars failed for", k, _);
    }
  }
}

/**
 * Register an element so it follows the current Bulma light/dark/system theme.
 * Returns an unregister function to stop observing theme changes.
 * @param {HTMLElement} el
 * @returns {() => void}
 */
export function registerThemedElement(el) {
  if (!el || !(el instanceof HTMLElement)) return () => {};
  const mount = el.closest?.(".nimbi-mount") || null;
  try {
    if (mount) {
      if (currentStyle === "dark") mount.setAttribute("data-theme", "dark");
      else if (currentStyle === "light")
        mount.setAttribute("data-theme", "light");
      else mount.removeAttribute("data-theme");
    }
  } catch (_) {
    /* ignore */
  }
  return () => {};
}
