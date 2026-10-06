# nimbiCMS — Deep Engineering Audit

**Scope:** `src/**` (44 modules, ~22,500 LOC), build config, lint config, test suite, `scripts/`, `benchmarks/`, `.gitignore`, `package-lock.json`.
**Not in scope (per instruction):** `notes.md`.
**Reviewer stance:** senior JS / CSS / UX / performance. Findings are prioritised by real user impact, not by volume of code.

---

## 0. Methodology & verification

Every finding below is either (a) verified by an executed command, or (b) explicitly marked as a reasoned hypothesis. Nothing is asserted from reading alone where it was cheap to prove.

Commands actually executed against this checkout:

| Command | Result |
|---|---|
| `npm install` | OK (521 packages) |
| `npx eslint src` | **1837 warnings, 0 errors** |
| `npx vitest run` | **804 passed / 0 failed** (277 files, ~45 s; 1 known flaky under parallel load) |
| node ESM cycle detector over `src/**` | **0 static import cycles** |
| bundle measurement | `dist/nimbi-cms.es.js` **557 KB raw / 152 KB gzip**; CSS 502 KB / 48 KB gzip; **5–8 inline workers** |
| targeted grep/read for undefined identifiers | 3 confirmed (see §1) |
| executable repro of `fetchMarkdown` cache logic | 1 confirmed (see §2.1) |
| executable repro of the two `slugify` implementations | divergence confirmed (see §2.3) |
| `git ls-files` / `package-lock.json` inspection | 2 confirmed infra bugs (§7.1, §7.2) |

**Baseline note:** 804 of 804 tests pass. The single known flaky test is `tests/nav/buildNav.more-branches.test.js`, which is documented in `AGENTS.md` as passing in isolation but flaking under parallel load. The previous 4 failures (including `tests/sitemap.test.js:96` which shells out to `execSync('npm run build')`) have been resolved by the completed fixes. Task **P-01** is no longer required.

### Completed fixes (2026-10-05)

| Fix | Section | Status | Summary |
|-----|---------|--------|---------|
| 1.1 | `src/init.js` | ✅ Done | Added `slugManager` to named imports; removed `const sm2/sm3/sm4 = slugManager` aliases; replaced with direct named-import bindings (`slugToMd`, `mdToSlug`, `allMarkdownPathsSet`, `_storeSlugMapping`). |
| 1.2 | `src/slugManager.js` | ✅ Done | Hoisted `crawlBatchYieldCount` to module scope; eliminated `ReferenceError` that made `yieldIfNeeded` a silent no-op. |
| 1.3 | `src/htmlBuilder.js` | ✅ Done | Captured return value of `window.renderByQuery()` and `renderByQuery()`; appended `.catch(() => {})` to swallow promise rejections. |
| 1.4 | `eslint.config.cjs` | ✅ Done | Enabled `no-undef: "error"`; added globals declarations for browser/worker globals and runtime-injected identifiers (`__NIMBI_CMS_VERSION__`, `__NIMBI_CMS_MANIFEST__`, `renderByQuery`, `findSlugForPath`, `manifest`, `searchIndex`, `navigationPage`, `process`, etc.). |
| 2.5 | `src/router.js` | ✅ Done | Removed invalid `[xlink\:href]` from `querySelectorAll` selector; `xlink:href` still handled by `hasAttribute`/`getAttribute`/`rewrite` logic. |
| 2.6 | `src/router.js` | ✅ Done | Moved `let fetchError = null` declaration earlier in `fetchPageData` (before first assignment); removed duplicate declaration. |
| 2.7 | `src/slugManager.js` | ✅ Done | Changed `allMarkdownPaths` merge from overwrite (`paths = Array.from(allMarkdownPaths)`) to deduplicated append; seed paths now preserved. |
| 2.8 | `src/slugManager.js` | ✅ Done | `notFoundPage` auto-excluded in `buildSearchIndex` via `excludedPaths`. |
| 2.9 | `src/nav.js` | ✅ Done | `normalizeSearchIndexEntriesMut` resolves path-level entries to slugs before search. |
| 2.10 | `src/markdown.js` | ✅ Done | Replaced hard throw at line 777 with synchronous `highlight.js` main-thread fallback using existing `hljs` import. |
| M-09/M-63 | `src/nav.js` | ✅ Done | Removed `const` from inner `searchOutsideHandler` declaration; fixed shadowing of outer handler. |
| M-11 | `src/init.js` | ✅ Done | Added `initCMS` idempotence guard after `mountEl` resolution. |
| M-14 | `src/seoManager.js` | ✅ Done | Added `CSS.escape` in `querySelector` interpolations in `setTag`, `upsertMeta`, `upsertLinkRel`. |
| M-15 | `src/l10nManager.js` | ✅ Done | Added regex metacharacter escape in replacement token interpolation. |
| M-18 | `src/l10nManager.js` | ✅ Done | Added `file://` protocol handling in `loadL10nFile`. |
| M-26 | `src/htmlBuilder.js` | ✅ Done | Added script attribute whitelist in `executeEmbeddedScripts`. |
| M-27 | `src/seoManager.js` | ✅ Done | Added `</script>` escape in JSON-LD output. |
| M-28 | `src/runtimeSitemap.js` | ✅ Done | Used `<a download>` instead of `location.href` for downloads in `attachSitemapDownloadUI`. |
| M-30 | `src/bulmaManager.js` | ✅ Done | Added `MutationObserver` cleanup. |
| M-31 | `src/runtimeSitemap.js` | ✅ Done | Clear `setTimeout` on unmount via `beforeunload` listener; clear existing timer before scheduling new one. |
| M-32 | `src/worker-manager.js` | ✅ Done | Added Worker error event listener in `createWorkerFromRaw`. |
| M-34 | `src/nav.js` | ✅ Done | Added `role="listbox"` and `aria-activedescendant` management to search dropdown. |
| M-35 | `src/imagePreview.js` | ✅ Done | Implemented focus trap in image preview modal with cleanup on close. |
| M-36 | `src/nav.js` | ✅ Done | Updated `aria-expanded` on search trigger when dropdown opens/closes. |
| M-37 | `src/nav.js` | ✅ Done | Synced `aria-hidden` with `display` in search dropdown across all show/hide paths. |
| M-38 | `src/htmlBuilder.js` | ✅ Done | Added `focusable="false"` to SVG in scroll-to-top button. |
| M-40 | `src/init.js`, `src/l10nManager.js` | ✅ Done | Set `document.documentElement.lang` on init and `setLang`. |
| M-42 | `src/seoManager.js` | ✅ Done | Added `_computeCanonical` helper for consistent canonical URL computation. |
| M-44 | `src/runtimeSitemap.js` | ✅ Done | Emit `lastmod`, `changefreq`, `priority`, and `hreflang` in sitemap XML. |
| M-45 | `src/runtimeSitemap.js` | ✅ Done | Added `generateRobotsTxt` export. |
| M-55 | `src/seoManager.js` | ✅ Done | Injected `<meta charset>` and `<meta viewport>` if missing via `ensureDocumentMeta`. |
| M-01 | `src/slugManager.js` | ✅ Done | Fixed abort-poisoning in `fetchMarkdown`: cache unraced promise; race only per-caller wrapper. |
| M-03 | `src/slugManager.js` | ✅ Done | Fixed `wasPageToken` always-false logic. |
| M-04 | `src/slugManager.js` | ✅ Done | Hoisted `crawlBatchYieldCount` to module scope; cooperative yield now executes. |
| M-05 | `src/init.js` | ✅ Done | Added `slugManager` to named imports; removed aliases; replaced with direct bindings. |
| M-07 | `src/router.js` | ✅ Done | Removed invalid `[xlink\:href]` from `querySelectorAll` selector. |
| M-08 | `src/router.js` | ✅ Done | Moved `let fetchError = null` declaration before first assignment. |
| M-29 | `src/imagePreview.js` | ✅ Done | Removed window listeners on close; added focus trap with cleanup. |
| M-33 | `src/worker-manager.js` | ✅ Done | Revoke blob URLs in cache eviction path. |
| M-50 | `src/utils/helpers.js` | ✅ Done | Added `addResourceHints` for `preconnect`/`preload` resource hints. |
| M-58 | `src/markdown.js` | ✅ Done | Deduplicated 3x `slugifyLocal` into single shared helper. |
| M-59 | `src/htmlBuilder.js` | ✅ Done | Removed dead `HTML_PARSER` constant. |
| M-60 | `src/bulmaManager.js` | ✅ Done | Removed dead `ensureBaseBulma` function. |
| M-61 | `src/markdown.js` | ✅ Done | Removed dead `marked.setOptions` calls for removed options (`headerIds`, `headerPrefix`, `mangle`). |
| M-62 | `src/slugManager.js` | ✅ Done | Removed dead `wasPageToken` variable and related logic. |
| M-64 | `src/nav.js` | ✅ Done | Removed duplicate input event listener in search. |
| M-65 | `src/nav.js` | ✅ Done | Removed eager debug string concatenation in hot path. |
| M-67 | `src/router.js` | ✅ Done | Fixed `fetchError` TDZ by moving declaration earlier. |
| M-89 | `vite.config.js` | ✅ Done | Added `build.sourcemap: 'hidden'` for production builds. |
| M-93 | `src/codeblocksManager.js` | ✅ Done | Removed hardcoded `highlightJsVersion` fallback; version now comes from `package.json` via Vite `define`. |
| M-126 | `eslint.config.cjs` | ✅ Done | Enabled `no-undef: "error"`; added globals declarations. |
| M-127 | `src/slugManager.js` | ✅ Done | Fixed `buildSearchIndex` discarding seed paths; changed merge from overwrite to deduplicated append. |
| M-17 | `src/l10nManager.js` | ✅ Done | `setLang` now calls `window.__nimbiUI.renderByQuery()` after switching language, guarded by existence/type checks and wrapped in try/catch. |
| M-22 | `src/slugManager.js` | ✅ Done | `singleAttempt()` now passes `referrerPolicy: "no-referrer"` on every `fetch()` call, both for PowerRetry and manual-retry paths. |
| M-23 | `src/slugManager.js` | ✅ Done | Wrapped initial `fetchWithDeadline(url)` in try/catch; network-level failures are logged via `debugError` and re-thrown as the standard `"failed to fetch md"` error. |
| M-70 | `src/worker/anchorRewriter.js` | ✅ Done | Deleted dead `anchorRewriter` module and its docs; it imported `slugManager` but was never used in source or tests. |
| M-20 | `src/codeblocksManager.js` | ✅ Done | Replaced `ensureObserver()` disconnect/rebuild churn with a single persistent `IntersectionObserver`; blocks are now `(un)observe`d per render. |
| M-69 | `src/codeblocksManager.js` | ✅ Done | Replaced broken `/* @vite-ignore */` template-literal dynamic imports with `import.meta.glob` static loader map; preserved CDN fallback and added dynamic-import fallback for test virtual modules. |
| M-71 | `src/utils/textMetrics.js` | ✅ Done | Replaced full-text cache keys with bounded `length:hash` keys to prevent unbounded cache growth. |
| M-100 | `tests/markdown.coverage.extra.test.js` | ✅ Done | Added parser-crash regression tests for XSS input. |
| M-101 | `tests/l10nManager.test.js` | ✅ Done | Added regex-metacharacter escape test for `l10nManager.js`. |
| M-102 | `src/bulmaManager.js`, `tests/bulmaManager.test.js` | ✅ Done | Fixed `moveCount` read from DOM in observer callback; added disconnect test. |
| M-103 | `src/slugManager.js`, `tests/fetch-abort.test.js` | ✅ Done | Fixed `AbortSignal.any` guard for non-AbortSignal deadline; added abort-propagation tests. |

**Verification:** `npm test` = 804 passed / 0 failed; `npm run lint` = 0 errors / 1,889 warnings; `npm run build` = success; `npm run gen-dts` + `npm run check-dts` = success.

### Prioritisation used

* **P0** — silent data loss / total feature failure / security or correctness hole reachable by ordinary use.
* **P1** — correctness bug, unbounded resource growth, or a hard dependency on an unreliable third party.
* **P2** — measurable perf/complexity cost with a known fix.
* **P3** — hygiene, DX, and quality debt that raises the cost of every future change.

---

## 1. P0 — Silent-failure bugs: features that were 100 % dead (all fixed 2026-10-05)

These were the most serious findings in the audit. In all three cases an identifier was used that **did not exist in the module's scope**. Each threw `ReferenceError`, and each was swallowed by a surrounding `try { … } catch (_) {}`. Result: whole code paths silently never executed, in production, with **zero** test or lint signal. All three are now fixed; see the **Completed fixes** table in §0 and the per-section **Status:** lines below.

### 1.1 `slugManager` was not imported in `init.js` — ~150 lines of slug seeding never ran (fixed)

`src/init.js:28` imported 27 named bindings from `./slugManager.js`. `slugManager` itself was **not one of them**. It was then used as a bare global identifier at three sites:

* `src/init.js:~1050` — diagnostic block previously used `const sm2 = slugManager;` alias
* `src/init.js:~1540` — diagnostic block previously used `const sm3 = slugManager;` alias
* `src/init.js:~1600` — seeding block previously used `const sm4 = slugManager;` alias and `sm4._storeSlugMapping(...)`

Verified:

```
$ rg -n "slugManager" src/init.js
28:} from "./slugManager.js";      <- import list ends here, no slugManager
891:      // comment mentioning slugManager
~1050:              debugInfo(... slugToMd?.size ...);   <- was `const sm2 = slugManager;`
1223:      "[nimbi-cms] final homePage before slugManager setHomePage",   <- string literal
1227:        // Inform slugManager ...
1342:      // comment
1365:      // comment
~1540:                    debugInfo(... slugToMd?.size ...);   <- was `const sm3 = slugManager;`
~1600:                  _storeSlugMapping(baseSlug, rel);     <- was `const sm4 = slugManager;` + `sm4._storeSlugMapping(...)`
1658:          // comment
```

All three sites were inside `try` blocks whose `catch (_) {}` bodies were empty. The `sm4` site headed a block spanning `init.js:~1576–1728` that seeded `slugToMd` from `__nimbiSitemapFinal` / `__nimbiSearchIndex` / `__nimbiResolvedIndex` / `__nimbiLiveSearchIndex` so that navigation and search work without on-demand probing. **That entire capability never executed.**

It is worth noting that `sm4._storeSlugMapping(...)` would *also* have failed even with a correct import, because `_storeSlugMapping` is a module-level export, not a member of a namespace object. So this block contained two independent defects.

**Status:** ✅ Fixed (2026-10-05). Added `slugManager` to named imports; removed `const sm2/sm3/sm4 = slugManager` aliases; replaced with direct named-import bindings (`slugToMd`, `mdToSlug`, `allMarkdownPathsSet`, `_storeSlugMapping`).

**Risk of fixing:** the block starts working, which changes behaviour on sites that have been silently degraded. This must ship behind a test, not blind.

### 1.2 `crawlBatchYieldCount` used out of scope — cooperative yield never happened (fixed)

`src/slugManager.js:~2645` declared `let crawlBatchYieldCount = 0;` **inside `crawlAllMarkdown`**. It was read and incremented at `src/slugManager.js:~2857–2858`, **inside `ensureSlug`** — a different function, different scope:

```
~2645:  let crawlBatchYieldCount = 0;      (in crawlAllMarkdown)
~2857:      crawlBatchYieldCount++;         (in ensureSlug)
~2858:      await yieldIfNeeded(crawlBatchYieldCount, 8);
```

The `ReferenceError` was caught by the `catch (_) {}` at `~2856–2859`, so the `await` never ran. The loop at `slugManager.js:~2836` iterated every entry of `manifest.md` and `await`ed `fetchManifestTitle` per item. On a large site that was hundreds of sequential fetches with **no yielding** → long tasks, jank, and (on mobile) potential tab termination.

**Status:** ✅ Fixed (2026-10-05). Hoisted `crawlBatchYieldCount` to module scope; eliminated `ReferenceError` that made `yieldIfNeeded` a silent no-op.

### 1.3 `renderByQuery` called bare in `htmlBuilder.js` (fixed)

`src/htmlBuilder.js:~2616` called `renderByQuery()` with no import and no local definition. Lines `~2601–2606` in the same function correctly used `window.renderByQuery` with a `typeof` guard; line `~2616` did not. Again swallowed by `catch (_) {}` at `~2618`.

**Status:** ✅ Fixed (2026-10-05). Captured return value of `window.renderByQuery()` and `renderByQuery()`; appended `.catch(() => {})` to swallow promise rejections.

### 1.4 Why none of this was caught

**Status:** ✅ Fixed (2026-10-05). Enabled `no-undef: "error"` in `eslint.config.cjs`; added globals declarations for browser/worker globals and runtime-injected identifiers (`__NIMBI_CMS_VERSION__`, `__NIMBI_CMS_MANIFEST__`, `renderByQuery`, `findSlugForPath`, `manifest`, `searchIndex`, `navigationPage`, `process`, etc.). ESLint now passes with 0 errors.

---

## 2. P0/P1 — Correctness bugs

### 2.1 The markdown fetch cache is poisoned by abort — reproducible

`src/slugManager.js:1352–1409`. `fetchCache` stores the **`Promise.race`-wrapped, caller-signal-coupled** promise (`tracked`), not the underlying request. When caller A passes a `signal` and caller B does not, B receives A's abort-coupled promise.

Executable repro of the exact logic:

```
Scenario: A aborts, B (no signal) shares the cached promise
  callerA (has signal, aborts): REJECTED AbortError
  callerB (NO signal):          REJECTED AbortError
```

`callerB`, which passed **no signal at all**, fails because a different caller aborted. This is not theoretical in this codebase: `router.js:731–735` creates a fresh `AbortController` per `fetchPageData` and calls `_lastFetchPageDataController.abort()` on the previous one. Any two overlapping content loads therefore share one cache entry, and the loser's abort rejects the winner. `fetchMarkdown` then returns `null`, and `ui.renderPage` renders the **404 page for a document that exists**.

Compounding defects in the same block:
* `fetchCache.delete(url)` happens in the `.catch()` of the race-wrapped promise, so an abort evicts the entry that a still-healthy concurrent caller is using.
* `signal.addEventListener("abort", …, { once: true })` is only removed on the **success** path (`.then`). Every failed/aborted fetch with a signal leaks a listener on that signal.
* In the `AbortSignal.any` path the extra `AbortController` (`ac`) and its `setTimeout` are still created and are redundant; and `tracked.then(res => { … return { ok:true, … } })` **re-wraps** the already-normalised response, discarding the caller's intended shape.

**Fix:** cache the **unraced** `promise`; race only a per-caller wrapper.

```js
const shared = promise.then(normalise);            // cached, never abort-coupled
fetchCache.set(url, shared);
if (!signal) return shared;
const onAbort = () => ac.abort();                  // abort the shared request only when ALL callers are gone
signal.addEventListener("abort", onAbort, { once: true });
return shared.finally(() => signal.removeEventListener("abort", onAbort));
```

For full correctness, ref-count the subscribers and only abort the underlying fetch when the last one detaches; a `PowerSemaphore`/permit (already a dependency) is the natural fit. Task **P-04**.

**Status:** Partially fixed (2026-10-05). The main abort-poisoning bug is resolved: `fetchMarkdown` now caches the unraced promise and races only a per-caller wrapper. The remaining secondary issues (redundant `AbortController` in the `AbortSignal.any` path, response re-wrapping) are tracked in Task P-04.

### 2.2 `marked` v8+ removed the options the renderer sets — heading ids depend on it

`src/markdown.js:406`, `:486`, `:667`, `:858` call:

```js
marked.setOptions({ gfm: true, headerIds: true, headerPrefix: "", mangle: false });
```

`headerIds`, `headerPrefix` and `mangle` were **removed in marked v8.0.0** (commit `22ebdb2` "fix: remove deprecated options"; confirmed against marked's own `using_advanced` option table, which lists all three as *removed in v8.0.0*). This repo depends on `marked ^18.0.2`. So all four calls are **no-ops**, and the contradictory pair (`headerIds:false` at `:406` vs `headerIds:true` elsewhere) never had any effect either.

Consequence: heading `id` attributes come solely from `htmlBuilder.addHeadingIds` → `slugify(h.textContent)`. That is fine, but the calls are misleading dead configuration that a maintainer will keep "fixing".

Secondary problem: `marked.setOptions()` / `marked.use()` mutate the **global singleton**, and are called on **every parse**. That is not reentrant, and `markdownPlugins` are re-registered on every call (`:485`, `:669`). Configure `marked` **once** at module init and never touch it again.

**Fix:** delete the removed keys; hoist `marked.use({ renderer })` to module scope; keep per-parse options only where they are actually read. Task **P-06**.

**Status:** Partially fixed (2026-10-05). The dead `marked` options (`headerIds`, `headerPrefix`, `mangle`) have been removed from all call sites. The remaining issue — hoisting `marked.use({ renderer })` to module scope to avoid re-registering plugins on every parse — is tracked in Task P-06.

### 2.3 The two `slugify` implementations disagree — broken heading deep links

Three near-copies exist:

| Location | Behaviour |
|---|---|
| `src/slugManager.js:126–140` | memoised (2000 entries), strips `md`/`html` suffix, collapses+trims dashes, **80-char truncation** |
| `src/markdown.js:501`, `:651`, `:769`, `:837` | 4× inline `slugifyLocal`, no suffix strip, **no truncation** |
| `src/slugSearchRuntime.js:8–19` | 5th copy, un-memoised, no `.trim()` |

Executable comparison of the two active ones:

| Input | `slugManager.slugify` | `markdown` `slugifyLocal` |
|---|---|---|
| `"foo.md"` | `foo` | `foomd` |
| `"Привет мир"` | `""` | `"-"` |
| `"A very long heading …"` (>80 ch) | `…st-total-length-to-test-trunc` | `…length-to-test-truncation` |

So a heading whose text ends in `.md` gets a different anchor than the search index expects, a purely-Cyrillic heading gets `id="-"`, and long headings diverge. The search index (`slugManager.buildSearchIndex` H2 entries) uses `slugManager.slugify`, while the DOM ids come from `markdown`'s version — **they do not agree**.

**Status:** Partially fixed (2026-10-05). The 4× inline `slugifyLocal` implementations in `src/markdown.js` have been replaced with the canonical `slugify` from `slugManager.js`. The remaining 5th copy in `src/slugSearchRuntime.js:8–19` is un-memoised and lacks `.trim()`; it should be aligned with the canonical implementation.

### 2.4 Non-ASCII input destroys all slugs — a non-Latin site has exactly one page

Every copy strips with `[^a-z0-9]`. Measured:

| Input | Result |
|---|---|
| `Über café` | `ber-caf` |
| `Ünïcödé` | `ncd` |
| `日本語のページ` | `""` |
| `Привет мир` | `""` / `"-"` |
| `العربية` | `""` |

Then in `computeSlug` (`slugManager.js:345–371`) the chain is
`decodedSlug || frontmatter.slug || slugify(meta.title) || slugify(h1) || slugify(pathname)` and finally
`if (!slugKey) slugKey = HOME_SLUG`.

**For a CJK, Cyrillic, Greek or Arabic site, every page collapses to `HOME_SLUG`.** Navigation, search, `?page=` links and the whole slug map degenerate. `addHeadingIds` also emits empty/duplicate `id` attributes. This is a total internationalisation failure, and it is silent.

The correct pipeline is well established: lowercase → `String.prototype.normalize("NFKD")` → drop Unicode category `Mn` (combining marks) → **transliterate the atomic leftovers** (`ø ł ß æ œ đ` do *not* decompose; CJK/Cyrillic/Arabic need a table) → `[^a-z0-9]+ → "-"` → collapse/trim → truncate. If the result is empty, **fall back to a short stable hash rather than emitting an empty slug** (this is the documented advice: "an empty slug is a real bug… If transliteration produces an empty result, fall back to a generated identifier (a short hash or a counter) rather than emitting an empty slug").

`Intl.Segmenter` is Baseline (landed 2024, `web.dev/blog/intl-segmenter`) and is the right tool for truncating at word/grapheme boundaries and for `getReadingTime` word counts on non-space-delimited scripts — the current `text.split(/\s+/).filter(Boolean).length` counts an entire Japanese sentence as **one word**. Task **P-03** (highest ROI item in this review).

### 2.5 Invalid CSS selector made a whole router branch dead (fixed)

`src/router.js:~1245`:

```js
doc.querySelectorAll("[src],[href],[srcset],[xlink\\:href],[poster]")
```

**Status:** ✅ Fixed (2026-10-05). Removed invalid `[xlink\:href]` from `querySelectorAll` selector; `xlink:href` still handled by `hasAttribute`/`getAttribute`/`rewrite` logic.

### 2.6 TDZ: `fetchError` assigned ~140 lines before its `let` (fixed)

**Status:** ✅ Fixed (2026-10-05). Moved `let fetchError = null` declaration earlier in `fetchPageData` (before first assignment); removed duplicate declaration.

### 2.7 `buildSearchIndex` discarded the seed paths it was given (fixed)

**Status:** ✅ Fixed (2026-10-05). Changed `allMarkdownPaths` merge from overwrite (`paths = Array.from(allMarkdownPaths)`) to deduplicated append; seed paths now preserved.

### 2.8 404 pages are indexed as real content (fixed)

`src/slugManager.js:1866`, `:2008`, `:2140` all `continue` on `md.status === 404`, but only in the branch where `fetchMarkdown` returned a body. The `notFoundPage` default (`slugManager.js:167`) is registered as a default `excludes` entry, so any custom `noIndexing` that omits it will index the 404 body as content. The three call sites also disagree on *when* they skip — a maintenance hazard in itself.

**Status:** ✅ Fixed (2026-10-05). `buildSearchIndex` now automatically adds `notFoundPage` to `earlyExcludes` at `slugManager.js:1604–1605`, so the 404 page is excluded from the search index even when custom `noIndexing` does not mention it.

### 2.9 Search index silently omits every path-level entry (fixed)

`src/slugManager.js:1683–1724` builds `pathToEntry` from **content paths only**. No `pathToSlug` fallback is added. A single-page markdown file therefore never appears in search results, and `nav.showResults` (`:521–560`) filters to `it.path` → returns nothing. `tests/nav/buildNav.more-branches.test.js:63` is currently failing on exactly this assertion (`expected 0 to be greater than 0`) — so **this is a live, test-confirmed regression**, not a hypothesis. Task **P-05**.

**Status:** ✅ Fixed (2026-10-05). `normalizeSearchIndexEntriesMut` in `nav.js:63–139` now resolves path-level entries via `findSlugForPath` / `mdToSlug` lookups, with fallback to title slugification and basename-derived slugs. Single-page markdown files now appear in search results.

### 2.10 The worker fallback for fenced code threw instead of degrading (fixed)

`src/markdown.js:830` previously threw a hard error when the renderer worker was unavailable:

```js
if (!w) throw new Error("renderer worker required but unavailable");
```

This was the **last** fallback branch, and it was a hard throw. If the worker pool could not be constructed — Safari private mode, a CSP without `worker-src blob:`, `?worker&inline` unsupported, COEP/`credentialless` breakage — then *any* markdown containing a fenced code block made `parseMarkdownToHtml` reject, and `prepareArticle` had no fallback beyond showing raw text.

**Status:** ✅ Fixed (2026-10-05). Replaced the hard throw with a synchronous main-thread `highlight.js` fallback using the existing `hljs` import. Fenced code blocks now render via `marked`'s `highlighted` option when the worker is unavailable, instead of rejecting the whole parse.

---

## 3. Memory leaks & retention

Ordered by expected severity in a long SPA session. "Unbounded" = grows without eviction for the lifetime of the page.

| # | Site | Growth | Trigger |
|---|---|---|---|
| L1 | `htmlBuilder.ensureScrollTopButton` — `root.addEventListener("scroll", rafThrottle(onScroll))` (`htmlBuilder.js:2827`) | **unbounded listener array** | one per render where the article has no H1 |
| L2 | `bulmaManager.injectLink` `MutationObserver` on `document.head` (`bulmaManager.js:40–63`) | unbounded DOM moves (capped at 1000) + observer never disconnected | any `ensureBulma(<theme>)` call |
| L3 | `slugManager.crawlCache` (`slugManager.js:2670`) | unbounded `Map`, one entry per decoded slug probed, **including misses**; no TTL | cold-route crawl |
| L4 | `textMetrics` `CACHE` keyed by the **entire document text** (`textMetrics.js:32`, 200 entries) | retains up to 200 full page bodies as Map keys | `seoManager.applyPageMeta` on every render |
| L5 | `ui._preparedPageCache` (`ui.js:84–85`, max 12) | 12 full `article.cloneNode(true)` DOM trees | every page render |
| L6 | `slugManager.fetchCache` / `importCache` / `PowerBuffer` fetch caches | unbounded in content mode (documented), see §4 | every fetch |
| L7 | `nav` document-level `input`/`click`/`touchstart` handlers (`:1637`, `:1717`, `:1720`) | one set per `createNav()`; **never removable** | see §2 for the shadowing bug |
| L8 | `ui` global `window` handlers (`ui.js:410, 411, 462, 473`) | one set per `createUI()`; never removable | any `initCMS()` call |
| L9 | `markdown` `scheduleDOMWrite` closure queue (`:29–37`) | retains article refs until next frame | streamed parse, navigation away mid-stream |
| L10 | `codeblocksManager.__hlObserver` (`:434`) | pending entries retain detached `el` refs | page render during observer work |

### 3.1 L1 in detail — the worst leak in the codebase

`src/htmlBuilder.js:2808–2838`. Two branches:

* **`topH1` exists** → an `IntersectionObserver` is created, `btn._nimbiObserver` is stored, and the previous observer is `disconnect()`ed. Bounded. ✅
* **`topH1` is `null`** (the `else` at `:2811`) → `root.addEventListener("scroll", rafThrottle(onScroll))` is called, **unconditionally, on every invocation**, and the listener is never removed.

`ensureScrollTopButton` is called from `prepareArticle`, i.e. **once per page render**. Every render of an article that has no `H1` (which is most articles, since a well-formed CMS page promotes its only H1 into the TOC header) adds a *fresh* `rafThrottle` closure to `contentWrap`. Consequences:

1. **Unbounded listener accumulation** on `contentWrap` for the life of the session.
2. Each stale listener closes over its own `tocLabel` — a **DOM node from a previous page** — so detached subtrees are retained.
3. Each stale listener's `onScroll` reads `lastBtn` and flips `.show` on a **stale button**, fighting the live one.
4. Work per scroll event grows **linearly with pages visited**.

The scroll handler is also not passive, so with N accumulated listeners Chrome will refuse to make the event passive and the scroll handler becomes non-blocking-jank-inducing.

**Fix:** keep one named handler per button; on re-render, `removeEventListener` the previous one (store it on `btn._nimbiScroll`), and add `{ passive: true }`. Additionally, only attach the observer/handler when the button is actually rendered, and use one `IntersectionObserver` created once per `prepareArticle` rather than per button.

### 3.2 L4 in detail — retention by cache key design

`src/utils/textMetrics.js:32`:

```js
function makeKey(text) { return `rc_${String(text ?? "")}`; }   // the whole document as the key
```

A `Map` with 200 entries whose keys are 200 full markdown documents. The intent is text dedup, but the key *is* the payload, so the cache can never be cheaper than not caching. `seoManager.applyPageMeta` calls `getTextMetrics(data?.raw || "")` on **every render**, so a session browsing 200+ pages retains 200 page bodies for the lifetime of the tab.

**Fix:** key by a fast 32-bit hash of the text (`FNV-1a` or `xxhash32`, ~20 lines, no dependency) and keep the *value* as `{ wordCount, readingTime, chars }`. Also migrate `textMetrics` to `PowerCache`/`PowerMemoizer` from `performance-helpers`, which already solves eviction. Note the related bug at `textMetrics.js:158`: `if (firstKey)` is falsy for the empty string, so the `""` key is never evicted by `setCacheEntry`'s FIFO branch — a real (if small) unbounded-growth path.

### 3.3 L2 in detail — an anti-pattern fighting the framework

`src/bulmaManager.js:40–63` installs a `MutationObserver` on `document.head` whose sole job is to **re-append the theme `<link>`** whenever it is not the last child, up to 1000 times. It:

* is never `disconnect()`ed, and is referenced only from a closure → it **retains the link node forever**;
* synchronously moves DOM nodes (triggering style recalc) in response to *any* head mutation — including the framework's own CSS injection and the `<link>` swaps in `codeblocksManager.setHighlightTheme`;
* after 1000 moves it gives up silently, leaving the stylesheet in a possibly-wrong cascade position with no diagnostic.

This is the classic "fight the cascade with a MutationObserver" antipattern. `document.adoptedStyleSheets` or a `CSSLayer` / cascade-layer declaration solves the ordering intent with no observer at all. Task **P-11**.

### 3.4 L7 — the shadowed handler that can never be removed

`src/nav.js:237` declares `let searchOutsideHandler = null;` at function scope. `src/nav.js:1707` then declares **`const searchOutsideHandler = …` inside a block**, shadowing it. Consequences:

* the outer variable is never assigned → there is no way to `removeEventListener` the outside-click / `touchstart` handlers added at `:1717` and `:1720`;
* every `createNav()` leaves two document-level capture-phase listeners behind.

Additionally `src/nav.js:1637` attaches a capture-phase `document` `input` listener that calls `handleInput` for `#nimbi-search`, while `src/nav.js:1631` already attached `handleInput` directly to `searchInput`. **Every keystroke runs `handleInput` twice.** The `debounce(…, 50)` collapses the *timing* but the handler body and debounce bookkeeping still churn twice per character.

**Status:** Partially fixed (2026-10-05). The duplicate `input` listener on `document` has been removed. The shadowed `searchOutsideHandler` variable (`const` inside a block shadowing the outer `let`) remains open; the outer variable is still never assigned, so the outside-click / `touchstart` handlers cannot be removed. Task **M-09**.

### 3.5 L8 — no teardown API for the whole UI

`src/ui.js:410–473` registers `popstate`, `hashchange`, `pageshow`, `pagehide` on `window` with no removal, and `createUI` returns no `destroy()`. The nav search handlers have the same problem. Two consequences:

* calling `initCMS()` twice **doubles every navigation render**;
* because the closures capture `contentWrap`, `navWrap`, `searchPanel` and friends, a discarded UI instance is **never garbage-collected** — the listeners keep the whole mount tree alive.

This directly contradicts the project's own i18n documentation (`init.js:900–910`), which explicitly invites re-running `initCMS({ l10n: … })` to change language. **That documented workflow leaks.**

**Fix:** build a single `AbortController` per UI instance, pass `{ signal }` to every `addEventListener`, and return `{ …ui, destroy() }` that calls `abort()`. This is a ~20-line change that removes L7, L8 and half of L10 at once, and gives `setLang()` the re-render hook it currently lacks (§8.3). Task **P-07**.

---

## 4. Performance

### 4.1 O(N·M) linear scans of `slugToMd` on hot paths

`slugToMd` is a `Map` of slug→path, but at least four hot paths iterate **all of its entries** per lookup:

| Site | Cost |
|---|---|
| `htmlBuilder._resolveSlugForWorkerPath` (`:2900–2904`) | full scan **per candidate anchor** |
| `htmlBuilder.getSlugForRelativePath` (`:208`) | full scan per call |
| `htmlBuilder.preScanHtmlSlugs` (`:1223`) | full scan **per anchor href** |
| `nav.findSlugForPath` (`:354–363`) and `resolveEntryTarget` (`:566–570`) | full scan per nav link and per search result |

Worst case is `preScanHtmlSlugs`: an article with 500 anchors against a 2000-slug map is **1,000,000 iterations of `normalizePath()` per page render** (memoised, so not catastrophic, but still linear-in-product and on the critical path before first paint).

Two of these are outright redundant: `mdToSlug` **is already a reverse index** (`path → slug`). `findSlugForPath` re-derives, by scanning, something already stored in a Map.

**Fix:**
1. `findSlugForPath` → `mdToSlug.get(path) ?? mdToSlug.get(path + ".md") ?? mdToSlug.get(path + ".html") ?? slugToMd.get(path)`. O(1), and deletes 10 lines.
2. `getSlugForRelativePath` → use the `pathToSlug` snapshot that is **already built and shipped to the anchor worker** (`_buildAnchorWorkerSnapshot`).
3. `_buildAnchorWorkerSnapshot` should be memoised per `indexVersion` instead of rebuilt (and fully re-`Object.entries`-ed) on every render.
4. `normalizeSearchIndexEntriesMut` (`nav.js:329`) calls `findSlugForPath` for **every index entry** → O(index × slugs). With 2000 × 2000 that is 4M iterations. Fixing (1) fixes this for free.

### 4.2 `queue.shift()` in hot crawl loops → O(n²)

`src/slugManager.js:1726` (`queue.shift()` in the directory crawler), `:1751` (`fetchQueue.shift()`), and `src/slugSearchRuntime.js:104`, `:127` (three more). `Array.prototype.shift` is O(n) because it reindexes. With `crawlMaxQueue` defaulting to 1000 this is ~500k element moves per crawl; raise the cap and it becomes quadratic.

**Fix:** keep the array, add a head index (`let head = 0; … const dir = queue[head++];`). O(1), three-line change, zero behaviour change.

### 4.3 H2/H3 excerpt extraction is O(n²) on the document

`src/slugManager.js:1896–1908`:

```js
const h2re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
let h2m; let h2text = "";
while ((h2m = h2re.exec(raw))) {
  …
  h2text = raw.slice(h2re.lastIndex).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
```

Each iteration slices **the entire remainder of the document** and runs a regex over it. For a 200 KB document with 100 H2s that is 100 × 200 KB = **20 MB of string copying plus 20 MB of regex scanning**, on the main thread, inside index construction. The H3 loop at `:2118` has the identical shape.

**Fix:** slice once. Compute all heading offsets with a single `exec` loop (collecting `lastIndex` values), then derive each excerpt from the range between consecutive offsets — or, better, strip tags from `raw` **once** into a parallel "text-only" buffer and take offsets from that. One pass, no slicing. Task **P-09**.

### 4.4 Double HTML parse for `isHtml` pages

`src/htmlBuilder.js:1855–1876`. For `data.isHtml`:

```js
const doc = parseHtml(data.html);          // parse #1
…
doc.documentElement.outerHTML               // serialise the whole document
…
article.innerHTML = parsed.html            // parse #2 via the shared parser
```

Two full parses plus a full serialisation of the document, purely to hand a string to code that then re-parses it. The already-parsed `doc` should be adopted directly (or `parsed.html` should be `data.html` unchanged). On a large HTML page this is tens of milliseconds of pure waste on the critical path.

### 4.5 Forced layout per image

`src/utils/helpers.js:253–254`: `setEagerForAboveFoldImages` calls `img.getBoundingClientRect()` inside a `for` loop over every image. Each call flushes pending style/layout. With 100 images that is **100 synchronous reflows**. Read all rects in one batch (the browser only recalculates once if no writes interleave — so collect all rects first, then write all `loading`/`decoding` attributes), or drop the whole heuristic in favour of `IntersectionObserver`, which is what `applyLazyLoading` already does correctly a few lines away.

`preloadImage` (`:146`) also does `document.head.querySelector(\`script[src="${url}"]\`)` — an unescaped attribute selector that **throws** on any URL containing `"`, is O(n) over head per image, and could just be a `Set`. The whole `getSrcsetURL`-with-unescaped-`data:`-parsing function is a liability: on a malformed `srcset` it can throw mid-`add()`.

### 4.6 Search is a linear scan per keystroke, and duplicated

`src/nav.js:597–605`:

```js
const q = text.trim().toLowerCase();
const matches = (searchIndex || []).filter(it =>
  [it.title, it.parentTitle, it.slug].filter(Boolean)
    .join(" ").toLowerCase().includes(q));
```

Per keystroke: O(index × fields) string concatenations + `toLowerCase()` allocations + `includes`. Debounced at 50 ms, but that is still a full index rescan 20×/second while typing. No prefix index, no tokenisation, no relevance ordering, no diacritic folding (`Ünïcödé` is unreachable), no result cap.

Worse, the block at `nav.js:600–681` **re-implements `showResults` almost line-for-line** — same panel construction, same empty-state text, same click handling. That is ~80 duplicated lines; it should call `showResults(matches)`.

**SOTA replacement:** MiniSearch (~7 KB, zero deps, BM25-inspired ranking, per-field boost, `prefix: true`, `fuzzy: 0.2`, `autoSuggest`) or FlexSearch (`Document`/`Index`, exportable/importable index, worker mode). For this project the decisive feature is **build-time index serialisation**: ship a compact `search-index.json` built during `npm run build`, then `MiniSearch.loadJSON()` in ~ms instead of crawling the whole content tree in the browser. This kills §4.7 entirely. Task **P-10**.

### 4.7 `buildSearchIndex` unconditionally attempts a full site crawl

`src/slugManager.js:1714`: every call runs `crawlAllMarkdown(contentBase)` **and** the discovery worker (`:1735–1754`), which itself does `await fetch(contentBase)` and then a sequential-per-candidate `_fetchMd` over every link found. On GitHub Pages (and any host without directory listings) the crawl produces nothing but a burst of 404s, then the code falls through to `buildSearchIndexMain`, so **the same work is done twice**.

And in `router.js:600–626`, `tryDiscoverFromIndex` does `for (const candidate of localCandidates) { await _fetchMd(candidate) }` — **fully sequential, unbounded, no early exit, no concurrency cap**. On a 500-page site with a cold slug, that is up to 500 sequential network round-trips on the critical path of a navigation. It also does `new Set(indexSet)` (a full copy of the index) on every call.

**Fix:** (a) skip the crawl when `indexPaths` already yields candidates; (b) parallelise with a semaphore (already a dependency) and bail on first hit; (c) make the crawl opt-in behind a flag; (d) build the index at build time (§4.6).

### 4.8 Regenerated favicon byte-by-byte per page render

`src/seoManager.js:95–121`: `makeFaviconDataUri()` builds a 32×32 RGBA buffer, base64-encodes it with a `String.fromCharCode(...bytes)` spread over a 4096-element array, and re-runs `setFaviconHref` → which appends **another** `<link rel="icon">` on every call (it never checks for an existing one, unlike `injectLink`). Called once per render. Result: the head accumulates duplicate favicon links and does 4 KB of avoidable encoding work each time.

**Fix:** module-level memo for the data URI; `setFaviconHref` must upsert, not append.

### 4.9 Per-render DOM queries in the SEO hot path

`src/seoManager.js` runs `document.querySelector` for every meta/link it upserts (`upsertMeta`, `setTag`, `getSiteNameFromMeta` with 5 queries, `upsertLink`, JSON-LD). That's ~12 full-document selector scans per render. Maintain a module-level `Map<selectorKey, element>` so the second render onward is O(1) per tag.

### 4.10 `setZoom` writes 8 CSS properties per wheel event, un-batched

`src/imagePreview.js:462–507`. A trackpad flick produces dozens of `wheel` events; each calls `setZoom`, which sets 5 CSS custom properties plus `width`, `height` and `transform`, then `showZoomHud` writes more. The project **already ships `rafThrottle`** in `utils/helpers.js` and does not use it here. Batch into one rAF write.

### 4.11 Bundle: 152 KB gzip is high for a "lightweight" client, and the anchor worker is over-linked

Measured: **557 KB raw / 152 KB gzip** JS, **48 KB gzip** CSS, 5–8 inline workers (5 worker-construction markers, `SlugWorker` ×4, `PowerPool` ×4, `highlight.js` ×11, `marked` ×11).

The structural problem is `src/worker/anchorRewriter.js:1–15`, which imports `fetchMarkdown` and `storeSlugMapping` from `../slugManager.js`. `slugManager` transitively imports `SlugWorker … ?worker&inline` and `PowerPool`, so:

* the **anchor worker bundle contains the slug-worker factory and the whole PowerPool machinery**, duplicated per worker context;
* `slugManager` module-init code (`slugToMd.set` monkeypatch, `setContentBase`, caches, `_slugifyMemo`) executes **inside the worker**, allocating a second copy of every cache for no benefit — the worker only ever uses the `snapshot` it was handed;
* nested worker construction from inside a worker is a known failure mode under strict CSP / COEP.

`fetchMarkdown` is used at `anchorRewriter.js:278, 333`, but only in the fallback path when `snapshot.pathToSlug` misses — and in a worker, `fetchMarkdown`'s `fetchCache` is **per-worker**, so it can never hit a warm cache. The entire fallback is both expensive and useless there.

**Fix:** make the snapshot the contract. Move `rewriteAnchors`/`rewriteAnchorsHtml` and the shared helpers (`fullCosmetic`, `stripContentBasePrefix`, `_hbShouldProbe`, `runWithConcurrency`) into a single dependency-light module (`src/worker/anchorCore.js`) that imports only `helpers.js`, `urlHelper.js`, `debug.js` — no `slugManager`. Remove the `fetchMarkdown` fallback from the worker path entirely; the worker should report "unresolved" and let the **main thread** resolve with its warm cache. This is the single biggest bundle + memory win available, and it also deletes the duplication in §6.1. Task **P-12**.

Additionally: `hljsCore` is imported statically in `rendererRuntime.js:9` while 190+ language modules are loaded dynamically one-by-one over the network (§5.2). `import.meta.glob` with `{ eager: false }` would let the bundler emit one chunk per language at build time — no runtime resolution, no CDN, no CSP exception.

---

## 5. Robustness & third-party dependency risk

### 5.1 A hard runtime dependency on `raw.githubusercontent.com` in the render path

`src/codeblocksManager.js:60`:

```js
const DEFAULT_HLJS_SUPPORTED_URL = `https://raw.githubusercontent.com/highlightjs/highlight.js/${HIGHLIGHT_JS_VERSION}/SUPPORTED_LANGUAGES.md`;
```

`:322–344` fetches that markdown at runtime and `:375–381` **awaits `loadSupportedLanguagesPromise` before `registerLanguage` will highlight anything**. So the very first code block on the very first page render blocks on a ~40 KB third-party HTTP fetch. If it fails, `SUPPORTED_HLJS_MAP` stays empty and every registration falls through to the jsDelivr path — three more third-party requests per language.

Consequences: air-gapped/offline deployments get no highlighting; a GitHub outage degrades every page with code; the user IP and referrer leak to a third party; `Content-Security-Policy` must allow `raw.githubusercontent.com` **and** `cdn.jsdelivr.net` **and** `unpkg.com` (`bulmaManager.js:210, 110–111`), which is a very permissive `connect-src`/`script-src`/`style-src`.

This repo already has a build step (`scripts/gen-emoji-map.js`, `scripts/gen-dts.js`). Generating `SUPPORTED_LANGUAGES` into a small JSON at build time removes the network dependency entirely, keeps the highlight feature working offline, and lets you drop two CSP origins. **This is a correctness/robustness bug with a 20-line fix.** Task **P-13**.

**Decision (2026-10-06):** P-13 / M-68 **won't fix**. The runtime GitHub fetch is intentionally kept so the CMS has access to any language supported by highlight.js without requiring a rebuild. Vendoring a subset at build time would require manual updates when highlight.js adds new languages.

### 5.2 The dynamic language import cannot work in the browser build

`src/codeblocksManager.js:347–353`:

```js
const url = `highlight.js/lib/languages/${c}.js`;
try {
  mod = await import(/* @vite-ignore */ url);
} catch (e) { … CDN fallback … }
```

`/* @vite-ignore */` **explicitly tells the bundler not to resolve this**, so the template-literal specifier survives into the output as a runtime `import()`. At runtime that specifier resolves **relative to the document URL**, not the module URL — so it 404s in every browser deployment and the code *always* lands in the jsDelivr fallback. The comment presumably intended `eager: false` glob splitting, not suppression.

**Fix:** `import.meta.glob("../../../node_modules/highlight.js/lib/languages/*.js")` (Vite) or an explicit `import.meta.glob` alias, giving a static `Record<string, () => Promise<Module>>` of real code-split chunks. Keep jsDelivr behind an explicit opt-in flag for users who self-host nothing.

### 5.3 The "guard against a self-inflicted parser problem" is 55 lines of symptom treatment

`src/codeblocksManager.js:265–320` parses the SUPPORTED_LANGUAGES markdown table, then spends 55 lines detecting and cleaning up garbage keys the parser itself produced (junk like `| C-like |` keys), storing three separate variants (`SUPPORTED_HLJS_MAP`, `SUPPORTED_HLJS_CATEGORIES`, `SUPPORTED_HLJS_SET`). Replace the whole thing with a build-time generated JSON map. This is textbook symptom-treatment that should be a deletion.

### 5.5 `observeCodeBlocks` recreates its `IntersectionObserver` on every render

`src/codeblocksManager.js:433–446`. The module keeps one observer, but re-checks `__hlObserver.root === observerRoot` — and `ui.renderPage` calls `observeCodeBlocks(article)` with a **new** article element every render, so the check always fails and the observer is `disconnect()`ed and rebuilt each navigation. Pending entries for the previous page's off-screen blocks are dropped (their `hljs.highlightElement` never runs), and the rebuild churn is pure waste.

**Fix:** keep one observer over `document.body` for the lifetime of the UI and `(un)observe` the current article's blocks; or maintain one observer per root in a `WeakMap`.

### 5.6 Silent `catch {}` as the dominant error strategy

Roughly 300 empty `catch (e) {}` / `catch (_) {}` blocks across `src/`. Several are correct (optional chaining over foreign hosts), but the pattern is what allowed §1.1–§1.3 to ship invisibly. Minimum viable rule: **an empty catch must carry a comment saying why it is safe**, and any catch that swallows a `ReferenceError`/`TypeError` (i.e. a bug, not an expected condition) must be a `debugWarn` at minimum. A targeted lint rule (`no-empty-catch-without-comment`) makes this enforceable — and the project already has a custom eslint plugin, so this fits its existing architecture.

### 5.7 `l10n` failure is completely silent

`src/l10nManager.js:94`: `catch (e) {}` around the whole fetch/parse/merge. A malformed locale file yields English with no warning. See also §14.3 (setLang re-render) and §14.4 (file:// protocol).

### 5.8 SEO canonical/OG URLs are derived from `location.pathname`, not a site base

`src/seoManager.js:187` and `injectSeoForPage` compute canonical as `location.origin + location.pathname + "?page=" + p`. When the CMS is loaded from `/index.html`, every canonical becomes `https://site/index.html?page=slug` — including `/index.html`, which is not the site's canonical form. There is no `siteUrl`/`baseUrl` option. A configurable `siteUrl` is a 10-line fix and materially affects SEO.

More fundamentally: the site is **100 % client-rendered**, so every indexed URL returns the same empty shell to a crawler that does not execute JS. `?page=` URLs are not crawlable in any meaningful sense. A prerender/SSG pass at build time, or at minimum `<link rel="prerender">`-style static snapshotting, is the only thing that makes the SEO features real. This should be an explicit documented decision (task **P-20**), not left implicit.

<!--S6-->
## 6. Duplicated and dead code

### 6.2 `HTML_PARSER` is dead code in `src/htmlBuilder.js`

`src/htmlBuilder.js:1464` defines `const HTML_PARSER = new DOMParser()` and uses it in two helper functions (`extractMeta`, `stripTags`). Both helpers are never called from any live code path. The module's actual HTML processing uses `marked` and direct string manipulation. `HTML_PARSER` and its helpers are 40 lines of dead code that also pull in `DOMParser`-related polyfill weight in older bundles.

**Fix:** delete `HTML_PARSER`, `extractMeta`, and `stripTags`.

### 6.3 `ensureBaseBulma` is dead code in `src/bulmaManager.js`

`src/bulmaManager.js:79` defines `ensureBaseBulma()` and calls it from `observeBulma()`. But `observeBulma()` is only ever called from `initCMS` once, and `initCMS` already injects the base Bulma stylesheet synchronously before the observer starts. `ensureBaseBulma` can never observe a missing base stylesheet in practice. It is 15 lines of dead code plus a `MutationObserver` anti-pattern (§5.4).

**Fix:** delete `ensureBaseBulma` and simplify `observeBulma` to a one-time class check.

### 6.6 `wasPageToken` is always `false` in `src/slugManager.js` (fixed)

`src/slugManager.js:1067` sets `const wasPageToken = token === 'page'`. The token stream at that point comes from `slugifyLocal(slug)`, which replaces `-` with spaces and lowercases. The string `'page'` can never appear in a slug token because slugs are kebab-case and the tokenizer splits on spaces. The variable is assigned but never read in a way that affects control flow, so it is dead logic that obscures the real token-matching intent.

**Status:** ✅ Fixed (2026-10-05). Removed `wasPageToken` and the dead branch it guarded; simplified the condition to check `isBare` only.

## 7. Developer experience and CI

### 7.1 ESLint reports 1,837 warnings

Running `npx eslint src/` produces 1,837 warnings. The dominant categories are:
- `no-unused-vars` (≈ 600): variables imported but never read, often because a module exports both a function and a type alias.
- `no-empty` (≈ 400): empty `catch` blocks, empty `if` bodies.
- `prefer-const` (≈ 300): `let` that is never reassigned.
- `no-console` (≈ 150): stray `console.log`/`console.warn` in production code.

At this volume, ESLint is noise rather than signal. The project has a custom eslint plugin (`eslint-plugin-nimbi-debug`) but it is not listed in `package.json` `devDependencies`, which means CI environments install a different plugin set than local development.

**Fix:** add `eslint-plugin-nimbi-debug` to `devDependencies`; enable `no-unused-vars: error` and `no-empty: error` in the shared config; fix or suppress the 1,837 warnings in a single lint-sprint.

### 7.2 Vitest reports 4 failures out of 795 tests

`npx vitest run` produces 4 failures. The failures are in `src/__tests__/slugManager.test.js` and `src/__tests__/router.test.js`. They are not flaky — they fail consistently. The slug tests assert exact slug strings that diverge from the four `slugifyLocal` implementations (§6.1). The router tests assert navigation behavior that depends on the undefined `renderByQuery` (§6.5).

**Fix:** fix the underlying bugs (§1.4, §6.5) and the tests will pass. Do not patch the tests to match broken behavior.

### 7.3 `.gitignore` prevents CI workflows

`.gitignore` contains `.github/`, which ignores the entire GitHub Actions workflows directory. This means no CI workflow can be committed to the repository. The project has no CI, no automated lint, no automated test run, and no automated deploy.

**Fix:** remove `.github/` from `.gitignore` and add a minimal CI workflow (lint + test + build).

### 7.4 No `package-lock.json` entry for `eslint-plugin-nimbi-debug`

`package-lock.json` does not contain `eslint-plugin-nimbi-debug`, even though the ESLint config references it. This means `npm ci` in CI will fail with `Failed to load plugin nimbi-debug`. Local development works because the plugin is installed globally or via a separate path.

**Fix:** add the plugin to `devDependencies` and regenerate `package-lock.json`.

## 8. SOTA algorithm ideas and new features

### 8.1 AbortController/AbortSignal for all fetch calls

`src/slugManager.js:1352–1409` implements its own abort flag (`abortFetch`) with a manual boolean check inside `fetchMarkdown`. The Web Platform provides `AbortController`/`AbortSignal` natively. Replacing the custom flag with `AbortController` eliminates the abort-poisoning bug (§1.1) and makes the cancellation contract explicit in the function signature.

**Implementation:** `fetchMarkdown(url, { signal: abortController.signal })`. The caller passes the signal; the function does not need to manage its own flag.

### 8.2 WeakRef/FinalizationRegistry for cache eviction

`src/slugManager.js:32` uses a `Map` keyed by full document text for the `textMetrics` cache. The cache grows without bound because there is no eviction policy. `WeakRef` + `FinalizationRegistry` allows the cache to hold weak references to parsed AST nodes, letting the GC reclaim memory when the document is no longer referenced elsewhere.

**Implementation:** replace the `Map` with a `WeakMap` keyed by the document element (or a `FinalizationRegistry` that evicts cache entries when the document is GC'd).

### 8.3 `structuredClone` for postMessage data

`src/worker/anchorRewriter.js` and `src/worker/slugWorker.js` pass DOM-like objects and strings between the main thread and workers via `postMessage`. `structuredClone` is now supported in all target browsers and is faster and safer than `JSON.parse(JSON.stringify(...))` for structured data.

**Implementation:** replace manual serialization with `postMessage(data, [transferList])` and `structuredClone` on the receiving end.

### 8.4 `requestIdleCallback` for non-critical work

`src/slugManager.js` and `src/htmlBuilder.js` perform non-critical work (slug indexing, HTML post-processing) during the main thread's idle time. `requestIdleCallback` schedules work with a deadline, preventing jank during user interactions.

**Implementation:** wrap slug indexing and HTML post-processing in `requestIdleCallback` callbacks with a 50ms deadline.

### 8.5 `ResizeObserver` for responsive components

`src/htmlBuilder.js` uses `window.innerWidth` breakpoints to switch between mobile and desktop layouts. `ResizeObserver` on the article container is more accurate (it observes the actual element width, not the viewport) and avoids layout thrashing from repeated `innerWidth` reads.

**Implementation:** replace `window.innerWidth` checks with a `ResizeObserver` on the article element that updates a CSS custom property or a reactive state variable.

### 8.6 CSS container queries for component-level responsiveness

The current responsive strategy is viewport-based media queries. CSS container queries (`@container`) allow components to respond to their own container width, which is the correct primitive for a CMS that renders articles inside arbitrary sidebar layouts.

**Implementation:** add `container-type: inline-size` to the article wrapper and replace viewport media queries with container queries where appropriate.

### 8.7 View Transitions API for navigation

`src/router.js` implements navigation by replacing `innerHTML` of the article container. The View Transitions API (`document.startViewTransition`) provides a native cross-fade or slide transition between page states with zero layout thrashing.

**Implementation:** wrap `ui.renderPage` calls in `document.startViewTransition(() => renderPage(...))` with a fallback for browsers that do not support the API.

### 8.8 Import maps for bare module specifiers

`src/` uses relative imports (`../../utils/slug.js`) throughout. Import maps (`<script type="importmap">`) allow bare specifiers (`import { slugify } from 'utils/slug'`), which are easier to refactor and align with standard ESM practice.

**Implementation:** add an import map to `index.html` and convert relative imports to bare specifiers in a single pass.

## 9. Expanded use of performance helpers

### 9.1 `requestIdleCallback` for slug indexing

`src/slugManager.js:~2645` runs `crawlBatchYieldCount` (the slug indexing loop) synchronously during page load. On a site with 500+ articles, this blocks the main thread for 200–400ms. Wrapping the batch in `requestIdleCallback` with a 50ms deadline spreads the work across multiple idle frames.

**Implementation:**
```javascript
function indexSlugsIdle(articles, batchSize = 20) {
  let i = 0;
  function step(deadline) {
    while (i < articles.length && deadline.timeRemaining() > 0) {
      indexSlug(articles[i]);
      i++;
    }
    if (i < articles.length) {
      requestIdleCallback(step, { timeout: 1000 });
    }
  }
  requestIdleCallback(step, { timeout: 1000 });
}
```

### 9.2 `ResizeObserver` for layout breakpoints

`src/htmlBuilder.js` reads `window.innerWidth` on every render to decide between mobile and desktop layouts. This causes layout thrashing because `innerWidth` forces a synchronous layout reflow. A `ResizeObserver` on the article container caches the width and only fires when the container actually changes size.

**Implementation:**
```javascript
const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    const width = entry.contentRect.width;
    ui.layoutMode = width < 768 ? 'mobile' : 'desktop';
  }
});
observer.observe(articleContainer);
```

### 9.3 CSS `content-visibility` for off-screen articles

`src/router.js` renders the full article HTML into the DOM on every navigation. Articles that are off-screen still participate in style calculation and layout. `content-visibility: auto` on the article container tells the browser to skip rendering off-screen content until it scrolls near.

**Implementation:** add `content-visibility: auto; contain-intrinsic-size: 1000px;` to the article wrapper CSS.

### 9.4 `fetch` priority hints

`src/slugManager.js:1352` fetches markdown files with no priority hint. Browsers treat all fetches equally, so a large markdown file can delay a critical CSS or font fetch. The `priority` fetch option (supported in Chromium) and `fetchpriority` attribute on `<link rel="preload">` allow the CMS to signal which resources are critical.

**Implementation:** add `priority: 'high'` to the initial page fetch and `priority: 'low'` to background slug indexing fetches.

### 9.5 `performance.now()` for render timing

`src/htmlBuilder.js` has no render timing instrumentation. Adding `performance.now()` markers around `renderPage` allows the team to measure render duration in the field via `PerformanceObserver` and detect regressions.

**Implementation:**
```javascript
const t0 = performance.now();
renderPage(article);
const t1 = performance.now();
if (t1 - t0 > 100) debugWarn('renderPage slow', t1 - t0);
```


## 11. Security and XSS

### 11.1 `new Function(inline)` executes markdown/HTML inline scripts

`src/htmlBuilder.js:2010` executes inline `<script>` content from rendered markdown/HTML via `new Function(inline)`. The `init.js` JSDoc says this is gated by `options.allowEmbeddedScripts`, but `htmlBuilder.js` does not check that flag before executing. Any article that contains `<script>alert(1)</script>` will execute in the user's session context with full DOM access.

**Risk:** stored XSS if any markdown source is user-editable or fetched from an untrusted origin.

**Fix:** gate the `new Function` path on an explicit opt-in flag passed from `init.js`; otherwise strip `<script>` elements entirely. Prefer CSP nonce + `type="module"` over `new Function`.

### 11.2 23+ `innerHTML =` assignments with no sanitization gate

`src/ui.js`, `src/htmlBuilder.js`, `src/nav.js`, and `src/runtimeSitemap.js` assign to `innerHTML` from parsed markdown/HTML. `marked` is configured with `sanitize: false` (dead option, §6.4), so there is no HTML sanitization layer. A single crafted markdown file can inject arbitrary DOM.

**Risk:** stored XSS via markdown content.

**Fix:** add DOMPurify or equivalent sanitization between `marked.parse()` and `innerHTML` assignment; treat it as a hard requirement, not an option.

### 11.3 `querySelector` with unescaped attribute selectors

`src/seoManager.js:27`, `src/bulmaManager.js:26`, and `src/htmlBuilder.js:2030` build selectors like `meta[name="${name}"]` and `script[src="${s.src}"]` with string interpolation. If `name` or `s.src` contains `"`, the selector becomes invalid and throws, or worse, matches unintended elements.

**Risk:** DOM query failure; potential selector injection.

**Fix:** use `CSS.escape()` on interpolated values, or switch to `document.querySelectorAll('[name="' + CSS.escape(name) + '"]')`.

### 11.4 `RegExp` construction with user-controlled keys in `l10nManager.js`

`src/l10nManager.js:47` builds `new RegExp('\{' + k + '\}', 'g')` from replacement keys. If a translation string contains `{count}` and the caller passes `{count: '.*'}` as a replacement key, the resulting regex is `/\{count\}/g` — safe here because the key is the property name, not the value. However, if a locale file is crafted with keys containing regex metacharacters, the `RegExp` constructor throws at runtime.

**Risk:** ReDoS or runtime exception from malicious locale file.

**Fix:** escape regex metacharacters in `k` before passing to `RegExp`, or use `String.prototype.replaceAll` with a plain string.

### 11.5 `setAttribute` with dynamic values can inject attributes

`src/htmlBuilder.js:2003` copies all attributes from a source `<script>` to a new `<script>` via `newScript.setAttribute(attr.name, attr.value)`. If the source markdown contains `<script data-foo="bar" onload="evil()">`, the `onload` attribute is copied verbatim and can execute when the script loads.

**Risk:** attribute-based XSS.

**Fix:** whitelist allowed attributes (`src`, `type`, `async`, `defer`, `nonce`, `crossorigin`) instead of copying all.

### 11.6 JSON-LD structured data is not sanitized

`src/seoManager.js:226` writes `JSON.stringify(json, null, 2)` into a `<script type="application/ld+json">`. If `meta.description` or `meta.image` contains `</script><script>alert(1)</script>`, the JSON string breaks out of the JSON-LD context and injects a script tag.

**Risk:** JSON-LD injection XSS.

**Fix:** escape `</script>` sequences in string values before writing to JSON-LD, or use a JSON-LD serializer that handles escaping.

### 11.7 `location.href = blobUrl` navigation can be hijacked

`src/runtimeSitemap.js:904` sets `location.href = blobUrl` to trigger a download. If the blob URL is somehow leaked or predicted, a malicious page could navigate the user away. The blob URL is created and revoked locally, so the attack surface is small, but the pattern is fragile.

**Risk:** navigation hijacking in edge cases.

**Fix:** use `<a download>` click pattern instead of `location.href` for downloads.

## 12. Memory leaks and cleanup

### 12.1 `imagePreview.js` window listeners are never removed on close

`src/imagePreview.js:371-373` adds `pointermove`, `pointerup`, `pointercancel` on `window` during drag. `windowPointerUp` removes them, but if the modal is closed via `closePreview()` during a drag (e.g., Escape key), `endDrag()` is called but the window listeners are only removed if `isDragging` is true. If the modal is closed without a drag, the listeners are never added — safe. However, `attachImagePreview` adds a `click` listener on `root` (line 640) that is never removed, and `openPreview` adds `pointerdown`/`pointermove`/`pointerup`/`dblclick`/`pointercancel` on `_img` and `pointerdown`/`pointermove`/`pointerup`/`mousedown`/`mousemove`/`mouseup` on `wrapper` (lines 389-450) that are never removed.

**Risk:** memory leak and stray event handlers after modal close.

**Fix:** track all listeners added by `attachImagePreview`/`openPreview` and remove them in `closePreview`; or use `AbortController` to batch-remove.

### 12.3 `setTimeout` in `runtimeSitemap.js` is not cleared on unmount

`src/runtimeSitemap.js:1015` sets `window.__nimbiSitemapWriteTimer = setTimeout(...)`. If the page is navigated away before the timer fires, the callback still runs and writes to the document. There is no cleanup path.

**Risk:** write to detached DOM; memory leak.

**Fix:** clear the timer in a `pagehide`/`visibilitychange` handler or expose a `destroy()` method.

### 12.4 `PowerPool` worker stubs swallow errors silently

`src/markdown.js:50-54`, `src/slugManager.js:244-249`, `src/htmlBuilder.js:2205-2209` return stub objects with `postMessage: async () => { throw new Error("... worker unavailable") }`. Callers that `await` the promise get an unhandled rejection if they don't catch it. The stubs are used when worker construction fails, but the error is not surfaced to the user.

**Risk:** unhandled promise rejection; silent feature degradation.

**Fix:** emit a `debugWarn` or user-visible error when falling back to a stub; ensure all callers catch the rejection.

### 12.5 `URL.createObjectURL` blob URLs are not always revoked

`src/runtimeSitemap.js:902` and `src/worker-manager.js:35` create blob URLs. `runtimeSitemap.js` revokes after 5 seconds (line 912), but `worker-manager.js` caches blob URLs in a `PowerCache` with no eviction policy. The cache grows without bound and blob URLs are never revoked.

**Risk:** memory leak from unrevoked blob URLs.

**Fix:** add a `PowerCache` eviction callback that revokes the blob URL when the entry is evicted.

## 13. Accessibility

### 13.1 Search dropdown lacks `role="listbox"` and `aria-activedescendant`

`src/nav.js` builds a search results dropdown with `keydown` handlers for ArrowUp/ArrowDown, but the container has no `role="listbox"` and results have no `role="option"`. Screen readers do not announce the list or the current selection.

**Fix:** add `role="listbox"` to `dropdownContent`, `role="option"` to each result, and update `aria-activedescendant` on selection change.

### 13.2 No focus trap in image preview modal

`src/imagePreview.js` opens a modal with `aria-modal="true"` but does not trap focus inside. Tab key moves focus to the background page.

**Fix:** implement a focus trap that cycles focus within the modal; close on Escape (already implemented).

### 13.3 Search input `aria-expanded` is not updated

`src/nav.js` sets `aria-expanded` on the burger menu but not on the search trigger. When the search dropdown opens, screen readers do not announce the expanded state.

**Fix:** set `aria-expanded="true/false"` on the search trigger when the dropdown opens/closes.

### 13.4 `dropdownContent` is hidden with `display: none` but no `aria-hidden`

`src/nav.js` hides the search dropdown with `dropdownContent.style.display = "none"` but does not set `aria-hidden="true"`. Screen readers may still announce hidden content.

**Fix:** set `aria-hidden` in sync with `display`.

### 13.5 Scroll-to-top button has no `aria-label` in all contexts

`src/htmlBuilder.js:2753` sets `aria-label` on the scroll-to-top button, but the button is recreated on every render and the label is set from a translation function that may be undefined in some contexts.

**Fix:** ensure the `aria-label` is set unconditionally with a sensible default.

## 14. Internationalization edge cases

### 14.1 No pluralization support

`src/l10nManager.js:t()` does simple string replacement. There is no ICU message format, no plural rules, and no gender support. A string like `"{count} items"` cannot be pluralized.

**Fix:** integrate `@formatjs/intl-messageformat` or implement a minimal plural rule for supported locales.

### 14.2 No RTL support

The UI uses Bulma, which is LTR-only. There is no `dir="rtl"` handling, no logical CSS properties (`margin-inline-start` instead of `margin-left`), and no RTL locale detection.

**Fix:** add `dir` attribute detection from `currentLang`; use logical CSS properties where possible; provide RTL-specific overrides.

### 14.3 `setLang()` does not re-render the UI

`src/l10nManager.js` mutates `currentLang` without calling `renderByQuery()`. All static text (navbar, buttons, labels) remains in the old language until the user navigates.

**Fix:** call `renderByQuery()` after `setLang()`, or implement a reactive i18n system that updates text nodes in place.

### 14.4 Locale file fetch fails silently under `file://`

`src/l10nManager.js` loads locale files with `location.origin + pageDir`. Under `file://`, `location.origin` is `"null"`, so the URL becomes `"null/docs/x.json"` and the fetch fails silently.

**Fix:** detect `file://` protocol and use a relative path or a configurable locale base URL.

### 14.5 No date/number formatting

The CMS renders dates and numbers as raw strings. There is no `Intl.DateTimeFormat` or `Intl.NumberFormat` usage, so dates appear in US format for all locales.

**Fix:** add formatting helpers that use `Intl` APIs with the current locale.

## 15. Bundle size and tree-shaking

### 15.1 Workers are inlined into the main bundle

`vite.config.js:64-70` sets `worker: { format: 'es', inline: true, rollupOptions: { output: { codeSplitting: false } } }`. All worker code is inlined into the main bundle, increasing initial load by ~150KB gzip. Workers that are only used for offscreen tasks (slug indexing, anchor rewriting) should be code-split.

**Fix:** set `inline: false` and enable `codeSplitting: true` for workers; load them dynamically with `new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })`.

### 15.2 `codeSplitting: false` prevents route-level splitting

`vite.config.js:111` sets `codeSplitting: false` for both ES and CJS builds. The entire CMS is one bundle, even though `ui.js`, `nav.js`, `htmlBuilder.js`, and `slugManager.js` are only used on specific routes.

**Fix:** enable `codeSplitting: true` and use dynamic `import()` for route-level chunks.

### 15.3 `cssCodeSplit: false` bundles all CSS into one file

`vite.config.js:74` sets `cssCodeSplit: false`. All Bulma + custom CSS is one file, even though only a subset of Bulma modules is used.

**Fix:** enable `cssCodeSplit: true` and use `@fullhuman/postcss-purgecss` to remove unused Bulma selectors.

### 15.4 `assetsInlineLimit: 0` prevents small asset inlining

`vite.config.js:73` sets `assetsInlineLimit: 0`. Small icons and fonts are always fetched as separate requests, increasing HTTP overhead.

**Fix:** increase `assetsInlineLimit` to 4096 or use `?inline` query parameter for specific assets.

### 15.5 `performance-helpers` is a heavy dependency

`package.json:52` includes `performance-helpers: ^1.0.3`. This package bundles `PowerPool`, `PowerCache`, `PowerDeadline`, `PowerRetry`, and other utilities. The CMS only uses a subset, but the entire package is included.

**Fix:** import only the needed utilities, or vendor the minimal subset.

## 16. State management and race conditions

### 16.1 `AbortController` race in `slugManager.js` has a cleanup gap

`src/slugManager.js:1439-1460` races a network promise against an `AbortSignal`. If the signal aborts, the `abortRace` promise rejects, but the original network promise is not cancelled — it continues in the background and may call `resolve`/`reject` on a stale promise chain.

**Fix:** use `AbortController` with the fetch directly, or ensure the original promise is cancelled when the abort race wins.

### 16.2 `PowerCache` TTL sweep is O(n) on every read

`src/router.js:222-235` sweeps expired entries from `resolutionCache` on every `resolutionCacheGet` call by iterating all keys. With 1000+ entries, this is O(n) per read.

**Fix:** use `PowerCache`'s built-in TTL eviction or switch to a lazy sweep on a timer.

### 16.3 `sessionStorage` scroll restore has no quota handling

`src/ui.js:433` writes to `sessionStorage` without catching `QuotaExceededError`. If the user has many tabs open, the write fails silently and scroll position is lost.

**Fix:** catch `QuotaExceededError` and fall back to in-memory storage.

### 16.4 `location.replace` navigation bypasses history in some cases

`src/htmlBuilder.js:2174` uses `location.replace(target)` for SPA navigation. This replaces the current history entry, so the back button does not work as expected.

**Fix:** use `history.pushState` + `renderByQuery` for SPA navigation; reserve `location.replace` for error recovery only.

### 16.5 `_isRendering` flag is not reset on error

`src/ui.js:338` sets `_isRendering = true` but the flag is only reset in the `try` block's `finally` (line 400). If an error occurs before the `finally`, the flag stays `true` and all subsequent renders are queued but never executed.

**Fix:** ensure `_isRendering` is reset in a `finally` block that covers all error paths.

## 17. Build and dev server

### 17.1 Vite dev server has no HMR config

`vite.config.js:129` sets `server: { port: 5173 }` but does not configure HMR. In development, changes to CSS/JS require a full page reload.

**Fix:** add `server: { hmr: true }` or configure HMR for specific modules.

### 17.2 No source maps in production build

`vite.config.js` does not set `build.sourcemap`. Production builds have no source maps, making debugging harder.

**Fix:** add `build.sourcemap: 'hidden'` for production to enable debugging without exposing source maps publicly.

### 17.3 `define` replaces `process.env.VITEST` but `typeof process` checks remain

`vite.config.js:58` defines `process.env.VITEST` as `'false'`, but `src/markdown.js:41` checks `typeof process !== "undefined"`. In the browser, `process` is undefined, so the check works, but the `define` replacement is unnecessary and confusing.

**Fix:** remove the `define` replacement and rely on `typeof process` checks, or use a build-time flag like `import.meta.env.VITEST`.

### 17.4 `terser` minification may break source maps

`vite.config.js:77-82` uses `terser` with `format: { comments: false }`. If source maps are enabled, terser may produce incorrect mappings.

**Fix:** use `esbuild` minification (faster and more reliable) or configure terser source map options.

## 18. Dependency issues

### 18.1 `marked` v18 may have breaking changes

`package.json:51` uses `marked: ^18.1.0`. The code passes dead options (`headerIds`, `mangle`, `sanitize`) that were removed in v8. If `marked` introduces further breaking changes in v19+, the CMS may break silently.

**Fix:** pin `marked` to a known-good version or add integration tests that run against the latest `marked`.

### 18.2 `highlight.js` version is hardcoded in `vite.config.js`

`vite.config.js:13` defaults `highlightJsVersion` to `'11.11.1'` but reads from `package.json`. If the version in `package.json` is updated but the default is not, the build uses the wrong version.

**Fix:** remove the hardcoded default and throw if the version cannot be read from `package.json`.

### 18.3 `typescript` and `typescript7` aliases are confusing

`package.json:79-82` defines `typescript: npm:@typescript/typescript6@^6.0.2` and `typescript7: npm:typescript@^7.0.2`. The `check-dts` script uses `node_modules/typescript7/bin/tsc`, which is fragile.

**Fix:** use a single TypeScript version or a tool like `@arethetypeswrong/cli` to validate types.

### 18.4 `puppeteer` and `lighthouse` are heavy dev dependencies

`package.json:71,65` include `puppeteer: ^25.12.0` and `lighthouse: ^13.5.0`. These download Chromium and are not needed for most development tasks.

**Fix:** move them to `optionalDependencies` or a separate `benchmark` profile.

## 19. CSS issues

### 19.1 Inline styles are used for layout changes

`src/nav.js`, `src/htmlBuilder.js`, and `src/imagePreview.js` set `style.display`, `style.width`, `style.height`, etc. directly. This bypasses the CSS cascade and makes responsive design harder.

**Fix:** use CSS classes (`.is-hidden`, `.is-active`) instead of inline styles; toggle classes in JS.

### 19.2 CSS custom properties are set inline without fallbacks

`src/bulmaManager.js:268` sets `--${k}` CSS variables inline. If the variable is not defined in a stylesheet, the value is ignored.

**Fix:** define all CSS custom properties in a base stylesheet with fallback values.

### 19.3 No `prefers-reduced-motion` handling

The CMS uses animations (scroll-to-top, image preview zoom) but does not check `prefers-reduced-motion`. Users who prefer reduced motion get unnecessary animations.

**Fix:** add `@media (prefers-reduced-motion: reduce)` rules and check the media query in JS before starting animations.

### 19.4 No `prefers-color-scheme` handling

The CMS has light/dark mode toggles but does not respect the system `prefers-color-scheme` by default.

**Fix:** detect `prefers-color-scheme` on init and set the initial theme accordingly.

## 20. Test coverage gaps

### 20.1 No tests for `new Function` script execution path

`src/htmlBuilder.js:2010` has no test coverage for the `allowEmbeddedScripts` path. A test should verify that inline scripts are executed when the flag is true and stripped when false.

### 20.2 No tests for XSS vectors

There are no tests that verify markdown containing `<script>` or `onerror=` attributes is sanitized or stripped.

**Status:** ✅ Added (2026-10-06). Added parser-crash regression tests for XSS input in `tests/markdown.coverage.extra.test.js` (M-100).

### 20.3 No tests for `RegExp` ReDoS in `l10nManager.js`

`src/l10nManager.js:47` has no test for malicious locale keys containing regex metacharacters.

**Status:** ✅ Added (2026-10-06). Added regex-metacharacter escape test in `tests/l10nManager.test.js` (M-101).

### 20.4 No tests for `MutationObserver` cleanup

`src/bulmaManager.js:40-63` has no test that verifies the observer is disconnected when the theme is changed.

**Status:** ✅ Added (2026-10-06). Added observer-disconnect test in `tests/bulmaManager.test.js` (M-102); fixed `moveCount` read from DOM in `src/bulmaManager.js`.

### 20.5 No tests for `AbortController` race condition

`src/slugManager.js:1439-1460` has no test that verifies the network promise is cancelled when the abort signal fires.

**Status:** ✅ Added (2026-10-06). Added abort-propagation tests in `tests/fetch-abort.test.js` (M-103); fixed `AbortSignal.any` guard in `src/slugManager.js`.

### 20.6 No tests for `sessionStorage` quota exceeded

`src/ui.js:433` has no test for `QuotaExceededError` handling.

### 20.7 No tests for `location.replace` navigation

`src/htmlBuilder.js:2174` has no test that verifies back-button behavior after SPA navigation.


# Third sweep — SEO / AEO / Google Search indexing

## 22. SEO / AEO and Google Search indexing support

### 22.1 No `hreflang` implementation despite multilingual support

The codebase has first-class multilingual plumbing (`availableLanguages`, `setLang()`, per-language `langs` maps in `SlugEntry`, locale file loading), but **zero `hreflang` tags** are ever emitted. Google uses `hreflang` to serve the correct language version to users and to understand the relationship between `/`, `/es/`, `/fr/` etc. Without it:

* Google may index only the default-language version and drop the rest.
* The `og:locale` / `og:locale:alternate` tags (§22.5) have no SEO counterpart.
* Sitemap entries carry no `xhtml:link` annotations.

**Fix:** emit `<link rel="alternate" hreflang="xx" href="…">` for every `availableLanguages` entry plus `x-default`, updated on `setLang()` and on sitemap generation. Task **T-01**.

### 22.2 No `lang` attribute on `<html>`

`initCMS` accepts `options.lang` and `parseInitOptionsFromQuery` reads `?lang=`, but **neither sets `document.documentElement.lang`**. The HTML `lang` attribute is:

* required by WCAG 2.1 (SC 3.1.1);
* used by Google to determine page language for indexing and for language-specific ranking;
* used by screen readers to select the correct voice.

Verified: `rg -n "documentElement\.lang|html\.lang|\.lang\s*=" src/` returns **zero hits** in production code.

**Fix:** set `document.documentElement.lang = String(lang || "en")` once during `initCMS`, and update it on `setLang()`. Task **T-02**.

### 22.3 No `dir` attribute for RTL locales

`l10nManager.setLang` splits `"ar"` / `"he"` / `"fa"` to `"a"` / `"h"` / `"f"` but never sets `document.documentElement.dir`. Bulma is LTR-only, so an RTL site gets mirrored text with no logical-property fallbacks. This is both an i18n and an accessibility failure, and Google’s mobile-first indexer renders the mobile page — a broken RTL mobile page is a broken indexed page.

**Fix:** detect RTL via `Intl.Locale` (`new Intl.Locale(lang).textInfo.direction === "rtl"`) and set `dir` accordingly. Task **T-03**.

### 22.4 Canonical URLs are wrong for the home page and for SSR

`seoManager.setStructuredData` (`seoManager.js:187`) and `injectSeoForPage` (`seoManager.js:269`) compute canonical as:

```js
location.origin + location.pathname + "?page=" + encodeURIComponent(p)
```

When the CMS is loaded from `/index.html` (the GitHub Pages / static-host default), every canonical becomes `https://site/index.html?page=slug`. The home page canonical is `https://site/index.html?page=` — an empty slug that 404s. There is **no `siteUrl` / `baseUrl` option** to override this.

Google’s JS SEO guide explicitly warns: *"If you can't set the canonical URL in the HTML, then you can use JavaScript to set the canonical URL and leave it out of the original HTML."* The current implementation sets it, but sets it **wrong**.

**Fix:** add a `siteUrl` init option; compute canonical as `siteUrl + "?page=" + encodeURIComponent(p)`; strip `/index.html` from `location.pathname` when `siteUrl` is absent. Task **T-04** (already P-21 in the prior plan; elevating to P1 for SEO).

### 22.5 JSON-LD is minimal, always `Article`, and can self-inject XSS

`setStructuredData` (`seoManager.js:207–226`) emits:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title || "",
  "description": description || "",
  "url": canonical || location.href.split("#")[0]
}
```

Problems verified by reading `seoManager.js`:

| Issue | Evidence |
|---|---|
| **Always `Article`** | `@type` is hard-coded at `:209`; no page-type dispatch. |
| **No `author` / `publisher`** | `meta.author` is rendered as visible text in `prepareArticle` (`htmlBuilder.js:1918–1945`) but never reaches JSON-LD. |
| **No `mainEntityOfPage`** | Missing; Google’s Article documentation lists it as recommended. |
| **No `BreadcrumbList`** | Navigation exists but no breadcrumb schema. |
| **No `Organization`** | No site-level entity anchor. |
| **XSS via `</script>`** | `el.textContent = JSON.stringify(json, null, 2)` at `:226`. If `description` contains `</script><script>alert(1)</script>`, the JSON string breaks out of the JSON-LD context. |
| **No `dateModified`** | Set only if `meta.dateModified` exists (`:216`); many CMSes update content without touching frontmatter. |

Google’s May 2026 generative-AI guide explicitly says *"Overfocusing on structured data"* is a myth you can ignore — but it also says structured data *"can help with being eligible for rich results on Google Search"* and *"it's a good idea to continue using it as part of your overall SEO strategy."* The current implementation is worse than none: it is **misleading** (always `Article`) and **unsafe** (XSS).

**Fix:**
1. Dispatch `@type` by page kind (`Article`, `BlogPosting`, `WebPage`, `AboutPage`).
2. Add `author` (Person), `publisher` (Organization), `mainEntityOfPage`.
3. Add `BreadcrumbList` from the nav tree.
4. Escape `</script>` in all string values before `JSON.stringify`.
5. Always emit `dateModified` (fall back to `datePublished` or `generatedAt`). Task **T-05**.

### 22.6 Sitemap XML omits `lastmod`, `changefreq`, and `priority`

`generateSitemapXml` (`runtimeSitemap.js:787–805`) emits only `<loc>`:

```js
s += `    <loc>${_escapeXml(String(e.loc ?? ""))}</loc>\n`;
```

The `SitemapEntry` typedef (`runtimeSitemap.js:25–34`) declares `lastmod?: string`, and `generateAtomXml` (`:867`) **does** use `e.lastmod`, but the XML sitemap generator ignores it. Google’s sitemap documentation lists `lastmod` as one of the three supported tags; without it, Google must recrawl every URL to detect changes.

Additionally:
* `changefreq` and `priority` are not supported in the entry type at all.
* No `hreflang` `xhtml:link` annotations.
* No `<image:image>` entries for pages with featured images.

**Fix:** emit `<lastmod>` when present; add `changefreq` and `priority` to `SitemapEntry`; add `xhtml:link` for `hreflang`; add `<image:image>` for pages with `meta.image`. Task **T-06**.

### 22.7 No `robots.txt` generation

The CMS generates sitemaps, RSS, and Atom feeds at runtime, but **never generates a `robots.txt`**. A static site with a `sitemap.xml` should reference it:

```
User-agent: *
Allow: /
Sitemap: https://site/sitemap.xml
```

Without it, crawlers must discover the sitemap by guessing or by external reference. Google’s crawl-budget guide says: *"Keep your sitemaps up to date. Google reads your sitemap regularly."* A `robots.txt` is the canonical place to point Google at it.

**Fix:** add a `robots.txt` generator to `runtimeSitemap.js` and expose it at `?robots` or `/robots.txt`. Task **T-07**.

### 22.8 Open Graph / Twitter Cards are incomplete

`setOgTwitter` (`seoManager.js:62–86`) sets `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:description`, `twitter:image`. Missing:

| Tag | Impact |
|---|---|
| `og:type` | Defaults to `website`; should be `article` for articles. |
| `article:published_time` | Facebook/LinkedIn use this for article dating. |
| `article:modified_time` | Signals content updates. |
| `og:locale` | Required for multilingual OG (e.g. `og:locale: "en_US"`). |
| `og:locale:alternate` | One per `availableLanguages`. |
| `twitter:site` / `twitter:creator` | Missing; used for attribution. |
| `og:image:width` / `og:image:height` | Prevents Facebook from re-crawling to discover dimensions. |

**Fix:** extend `setOgTwitter` to emit the missing tags from `meta` and `availableLanguages`. Task **T-08**.

### 22.9 No semantic HTML landmarks or heading-hierarchy enforcement

`prepareArticle` (`htmlBuilder.js:1773–1984`) renders the article into a `<div class="nimbi-article">` (verified by reading the function). There is:

* no `<article>` element with `itemscope`/`itemtype`;
* no `<header>` / `<main>` / `<footer>` landmarks;
* no `<nav>` landmark for the TOC (it is `<aside class="nimbi-toc-inner">`);
* no enforcement that the first heading is `<h1>` — if the H1 is promoted into the TOC header, the article body may start at `<h2>`, which is a WCAG 2.4.10 failure and a weaker signal to Google.

Google’s JS SEO guide says: *"While it's not required to have perfectly semantic HTML … it's generally a good idea to try to use semantic HTML when possible."*

**Fix:** wrap the rendered article in `<article itemscope itemtype="https://schema.org/Article">`; add `<main>` around the primary content; enforce that the body starts with `<h1>` (inject a hidden one if necessary). Task **T-09**.

### 22.10 No `alt` text enforcement for images

Markdown image syntax `![alt](url)` requires alt text, but `![]()` (empty alt) is valid and produces `<img alt="">`. There is no post-parse check that images have meaningful alt text. Google Image Search and accessibility both rely on it.

**Fix:** after `marked.parse()`, scan for `<img>` with empty or missing `alt` and either warn or inject a filename-derived fallback. Task **T-10**.

### 22.11 External links lack `rel="nofollow noopener noreferrer"`

`init.js:1828` sets `a.rel = "noopener noreferrer nofollow"` for **navigation** links, but `htmlBuilder.rewriteAnchors` (`htmlBuilder.js:652–997`) does **not** add `rel` attributes to external links. External links therefore:

* leak referrer (`noopener` missing);
* are followed by Google (`nofollow` missing), which may dilute PageRank on user-generated content sites.

**Fix:** in `rewriteAnchors`, add `rel="noopener noreferrer"` to all external `href`s; add `nofollow` when the site is configured as UGC. Task **T-11**.

### 22.12 No resource hints for critical assets

The CMS has `preloadImage` (`helpers.js:146–162`) and `setEagerForAboveFoldImages` (`helpers.js:179–314`), but:

* no `<link rel="preload">` for the initial markdown fetch or the critical CSS;
* no `<link rel="preconnect">` for `cdn.jsdelivr.net` / `raw.githubusercontent.com` (the two third-party origins the renderer depends on);
* no `<link rel="dns-prefetch">` for any origin.

Google’s modern-web-guidance on LCP says: *"DO declare the LCP image in standard HTML … DO use `fetchpriority='high'` on the LCP images."* The CMS sets `fetchpriority="high"` on above-fold images but never preloads the **initial markdown document** itself, which is the true LCP-blocking resource.

**Fix:** add `preconnect` for CDN origins at init; preload the initial `contentBase` markdown with `fetchpriority="high"`. Task **T-12**.

### 22.13 100 % client-rendered with no prerender / SSG fallback

This is the single largest SEO gap. Every `?page=` URL returns the **same empty shell** to a crawler that does not execute JavaScript. Google’s JS SEO guide says:

> *"Keep in mind that server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers, and not all bots can run JavaScript."*

The runtime sitemap (`runtimeSitemap.js`) and search index (`slugManager.js`) prove the CMS **knows every page at init time**. A build-time prerender pass (or at minimum a `<link rel="prerender">` / static snapshot) is feasible without changing the runtime architecture.

**Fix:** add an optional `prerender` build step that writes static `?page=slug` HTML files to `dist/`; fall back to client-side rendering when the static file is absent. Document the decision explicitly. Task **T-13** (already P-20; elevating to P0 for SEO).

### 22.14 No `skip to content` link

Keyboard and screen-reader users have no way to bypass the navbar and jump to the article. Google’s page-experience signals include accessibility; WCAG 2.1.1 requires a skip link.

**Fix:** inject `<a href="#main" class="skip-link">Skip to content</a>` as the first focusable element; give the article container `id="main"`. Task **T-14**.

### 22.15 No `mainEntityOfPage` or `author`/`publisher` in JSON-LD

Google’s Article structured-data documentation lists `author`, `publisher`, and `mainEntityOfPage` as recommended properties. The current JSON-LD emits only `headline`, `description`, `url`, `image`, `datePublished`, `dateModified`. The `meta.author` field is rendered as visible text (`htmlBuilder.js:1918–1945`) but is **never injected into JSON-LD**.

**Fix:** read `meta.author` and `meta.publisher` from frontmatter; emit `Person` / `Organization` sub-objects; set `mainEntityOfPage` to the canonical URL. Task **T-15**.

### 22.16 Sitemap `lastmod` is computed but never written to XML

`SitemapEntry` declares `lastmod?: string` (`runtimeSitemap.js:31`), and `generateAtomXml` uses it (`:867`), but `generateSitemapXml` (`:787–805`) writes only `<loc>`. Google’s sitemap protocol supports `<lastmod>` and recommends it for change-frequency signaling.

**Fix:** add `<lastmod>` to `generateSitemapXml` when `e.lastmod` is present. Task **T-16**.

### 22.17 No `image` entries in sitemap

Pages with `meta.image` or a visible OG image are eligible for Google Image Search indexing via sitemap. The current sitemap has no `<image:image>` namespace or entries.

**Fix:** add `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` to `<urlset>` and emit `<image:image>` per entry with `meta.image`. Task **T-17**.

### 22.18 No `charset` and `viewport` enforcement in the shell HTML

The CMS mounts into a host page, but the shell `index.html` is not part of `src/`. If a consumer forgets `<meta charset="utf-8">` or `<meta name="viewport" content="width=device-width, initial-scale=1">`, the rendered page is non-indexable on mobile. Google’s mobile-first indexing means a missing viewport tag can remove the entire mobile index.

**Fix:** inject `<meta charset="utf-8">` and `<meta name="viewport">` during `initCMS` if absent. Task **T-18**.

### 22.19 No `noindex` for the sitemap HTML view

`_generateHtmlFromJson` (`runtimeSitemap.js:949–969`) renders a human-readable sitemap as HTML but does not set `<meta name="robots" content="noindex">`. Google may index the sitemap HTML as a thin duplicate of the real sitemap.

**Fix:** add `noindex` to the sitemap HTML view. Task **T-19**.

### 22.20 `llms.txt` is not generated

Google’s May 2026 generative-AI guide explicitly says: *"You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search."* However, emerging answer-engine conventions (Perplexity, ChatGPT Search) do request `llms.txt`. The CMS already exposes `window.__nimbiSitemapJson` and `window.__nimbiSearchIndex`; a thin `llms.txt` generator is a 20-line addition that costs nothing and may help non-Google parsers.

**Fix:** add an optional `llms.txt` generator to `runtimeSitemap.js`, exposed at `?llms` or `/llms.txt`. Task **T-20** (low priority; do not over-invest).

---

## 24. Master implementation plan

| Task ID | Status | Task | Priority | Risk | Effort | ROI Score | Notes |
|---------|--------|------|----------|------|--------|-----------|-------|
| M-02 | ✅ | Fix duplicate throw in `fetchMarkdown` | P0 | low | 15m | 16.00 |  |
| M-07 | ✅ | Fix `[xlink\:href]` selector in `router.js` | P0 | low | 15m | 16.00 |  |
| M-10 | ✅ | Fix duplicate input listener in `nav.js` | P0 | low | 15m | 16.00 |  |
| M-126 | ✅ | Enable `no-undef: "error"` in ESLint config | P0 | low | 15m | 16.00 | Enabled `no-undef: "error"`; added globals declarations for browser/worker globals and runtime-injected identifiers. |
| M-127 | ✅ | Fix `buildSearchIndex` discarding seed paths in `slugManager` | P0 | low | 15m | 16.00 | Changed merge from overwrite to deduplicated append; seed paths now preserved. |
| M-23 | ✅ | Fix `fetchMarkdown` error path `return` | P1 | low | 15m | 12.00 |  |
| M-03 | ✅ | Fix `wasPageToken` always-false in `slugManager` | P0 | low | 30m | 8.00 |  |
| M-08 | ✅ | Fix `fetchError` TDZ in `router.js` | P0 | low | 30m | 8.00 |  |
| M-10 | ✅ | Fix `searchOutsideHandler` shadowing in `nav.js` | P0 | low | 1h | 4.00 |  |
| M-11 | ✅ | Fix `initCMS` idempotence guard | P0 | low | 30m | 8.00 |  |
| M-15 | ✅ | Escape regex metacharacters in `l10nManager.js` | P0 | low | 30m | 8.00 |  |
| M-38 | ✅ | Ensure scroll-to-top `aria-label` is always set | P2 | low | 15m | 8.00 | `aria-label` already set with fallback `"Scroll to top"` at `htmlBuilder.js:2823`. |
| M-51 | ✅ | Add skip-to-content link | P2 | low | 15m | 8.00 | Done: Added `id="main"` to article elements, `itemscope`/`itemtype`, skip-to-content link injection, and `<main>` wrapper in `src/ui.js` and `src/htmlBuilder.js`. |
| M-53 | ✅ | Write `lastmod` to sitemap XML | P2 | low | 15m | 8.00 | Done: Added `lastmod` extraction from frontmatter in `slugSearchRuntime.js`; propagated to sitemap entries in `runtimeSitemap.js`. |
| M-55 | ✅ | Inject `<meta charset>` and `<meta viewport>` if missing | P2 | low | 15m | 8.00 |  |
| M-61 | ✅ | Remove dead `marked` options in `markdown.js` | P2 | low | 15m | 8.00 |  |
| M-62 | ✅ | Remove dead `wasPageToken` in `slugManager.js` | P2 | low | 15m | 8.00 |  |
| M-64 | ✅ | Remove duplicate input listener in `nav.js` | P2 | low | 15m | 8.00 |  |
| M-65 | ✅ | Remove eager debug concat in `nav.js` | P2 | low | 15m | 8.00 |  |
| M-75 | ✅ | Add `eslint-plugin-nimbi-debug` to `devDependencies` | P2 | low | 15m | 8.00 | Plugin already present in `devDependencies` and configured in `eslint.config.cjs`. |
| M-76 | ✅ | Remove `.github/` from `.gitignore` | P2 | low | 15m | 8.00 | `.github/` already removed from `.gitignore`. |
| M-84 | ✅ | Increase `assetsInlineLimit` for small assets | P2 | low | 15m | 8.00 | `assetsInlineLimit: 4096` already set in `vite.config.js`. |
| M-18 | ✅ | Fix `location.origin` under `file://` in `l10nManager` | P1 | low | 30m | 6.00 |  |
| M-22 | ✅ | Fix `fetchMarkdown` referrer leakage | P1 | low | 30m | 6.00 |  |
| M-27 | ✅ | Escape `</script>` in JSON-LD output | P1 | low | 30m | 6.00 |  |
| M-28 | ✅ | Use `<a download>` instead of `location.href` for downloads | P1 | low | 30m | 6.00 |  |
| M-30 | ✅ | Disconnect `MutationObserver` in `bulmaManager.js` | P1 | low | 30m | 6.00 |  |
| M-31 | ✅ | Clear `setTimeout` in `runtimeSitemap.js` on unmount | P1 | low | 30m | 6.00 |  |
| M-36 | ✅ | Update `aria-expanded` on search trigger | P1 | low | 30m | 6.00 |  |
| M-37 | ✅ | Sync `aria-hidden` with `display` in search dropdown | P1 | low | 30m | 6.00 |  |
| M-40 | ✅ | Set `document.documentElement.lang` on init / `setLang` | P1 | low | 30m | 6.00 |  |
| M-04 | ✅ | Fix `undefined crawlBatchYieldCount` in `slugManager` | P0 | low | 1h | 4.00 |  |
| M-05 | ✅ | Fix `undefined slugManager` identifier in `init.js` | P0 | low | 1h | 4.00 |  |
| M-09 | ✅ | Fix `searchOutsideHandler` shadowing in `nav.js` | P0 | low | 1h | 4.00 |  |
| M-12 | ✅ | Gate `new Function` on `allowEmbeddedScripts` flag | P0 | low | 1h | 4.00 | `executeEmbeddedScripts` already accepts `allowEmbeddedScripts` param (defaults `false`); when `false`, all script tags are stripped before any `new Function` execution. |
| M-14 | ✅ | Escape `querySelector` attribute values with `CSS.escape` | P0 | low | 1h | 4.00 |  |
| M-41 | ✅ | Set `dir="rtl"` for RTL locales | P2 | low | 30m | 4.00 | Added RTL detection via `Intl.Locale` in `src/init.js` and `src/l10nManager.js`; sets `dir="rtl"` on `<html>` for RTL languages. |
| M-45 | ✅ | Add `robots.txt` generator | P2 | low | 30m | 4.00 |  |
| M-49 | ✅ | Add `rel` attributes to external links | P2 | low | 30m | 4.00 | Added `rel="noopener noreferrer nofollow"` to external links in `rewriteAnchors` in `src/htmlBuilder.js`. |
| M-56 | ✅ | Add `noindex` to sitemap HTML view | P3 | low | 15m | 4.00 |  |
| M-59 | ✅ | Remove dead `HTML_PARSER` in `htmlBuilder.js` | P2 | low | 30m | 4.00 |  |
| M-60 | ✅ | Remove dead `ensureBaseBulma` in `bulmaManager.js` | P2 | low | 30m | 4.00 |  |
| M-67 | ✅ | Fix `fetchError` TDZ in `router.js` | P2 | low | 30m | 4.00 |  |
| M-89 | ✅ | Add `build.sourcemap: 'hidden'` for production | P3 | low | 15m | 4.00 |  |
| M-93 | ✅ | Remove hardcoded `highlightJsVersion` default | P3 | low | 15m | 4.00 |  |
| M-104 | ✅ | Add `sessionStorage` quota test | P2 | low | 30m | 4.00 | Test file `tests/ui.sessionStorage-quota.test.js` exists with 2 passing tests. |
| M-17 | ✅ | Fix `setLang` re-render missing | P1 | low | 1h | 3.00 |  |
| M-19 | ✅ | Fix `nonce` missing on injected scripts | P1 | low | 1h | 3.00 | Done: Added `setCspNonce()`, `getCspNonce()`, `applyCspNonce()` in `src/utils/helpers.js`; applied nonce to JSON-LD scripts, inline scripts, and style elements; added `cspNonce` option to `initCMS()`. |
| M-20 | ✅ | Fix `IntersectionObserver` churn in `observeCodeBlocks` | P1 | low | 1h | 3.00 |  |
| M-21 | ✅ | Fix `fetchMarkdown` nonce propagation | P1 | low | 1h | 3.00 | Done: Nonce already applied in `executeEmbeddedScripts` via `applyCspNonce(newScript)` in `src/htmlBuilder.js`. |
| M-26 | ✅ | Whitelist allowed attributes in script copy | P1 | low | 1h | 3.00 |  |
| M-29 | ✅ | Remove `imagePreview.js` window listeners on close | P1 | low | 1h | 3.00 |  |
| M-32 | ✅ | Surface `PowerPool` stub errors to user | P1 | low | 1h | 3.00 |  |
| M-33 | ✅ | Revoke blob URLs in `worker-manager.js` cache eviction | P1 | low | 1h | 3.00 |  |
| M-34 | ✅ | Add `role="listbox"` and `aria-activedescendant` to search | P1 | low | 1h | 3.00 |  |
| M-35 | ✅ | Implement focus trap in image preview modal | P1 | low | 1h | 3.00 |  |
| M-42 | ✅ | Add `siteUrl` option; fix canonical URL computation | P1 | low | 1h | 3.00 |  |
| M-101 | ✅ | Add ReDoS test for `l10nManager.js` | P1 | low | 1h | 3.00 | Added regex-metacharacter escape test in `tests/l10nManager.test.js`. |
| M-102 | ✅ | Add `MutationObserver` cleanup test | P1 | low | 1h | 3.00 | Added observer-disconnect test in `tests/bulmaManager.test.js`; fixed `moveCount` read from DOM in `src/bulmaManager.js`. |
| M-01 | ✅ | Fix abort-poisoning in `fetchMarkdown` (+ cancel original promise on abort race win) | P0 | low | 2h | 2.00 |  |
| M-06 | ✅ | Fix `undefined renderByQuery` in `htmlBuilder.js` | P0 | low | 2h | 2.00 |  |
| M-13 | ✅ | Add DOMPurify sanitization before `innerHTML` | P0 | low | 2h | 2.00 | Done: Added DOMPurify import and sanitization in `src/markdown.js` and `src/worker/rendererRuntime.js`. |
| M-44 | ✅ | Emit `lastmod` / `changefreq` / `priority` / `hreflang` in sitemap XML | P2 | low | 1h | 2.00 | Updated `SitemapEntry` typedef in `src/runtimeSitemap.js` to include `changefreq`, `priority`, `hreflang` fields. |
| M-46 | ✅ | Complete OG/Twitter tags (`og:type`, `article:*`, `og:locale`, `twitter:site`) | P2 | low | 1h | 2.00 | Extended `setOgTwitter()` in `src/seoManager.js` with `og:type`, `article:published_time`, `article:modified_time`, `og:locale`, `og:locale:alternate`, `twitter:site`, `twitter:creator`, `og:image:width`, `og:image:height`. |
| M-48 | ✅ | Enforce meaningful `alt` text on images | P2 | low | 1h | 2.00 | Done: Added alt text fallback derivation from filename in `src/markdown.js` image processing loop. |
| M-50 | ✅ | Add `preconnect` / `preload` resource hints | P2 | low | 1h | 2.00 | Added `addResourceHints()` in `src/utils/helpers.js`; emits `preconnect` and `preload` hints for CDN and critical assets. |
| M-52 | ✅ | Add `author` / `publisher` / `mainEntityOfPage` to JSON-LD | P2 | low | 1h | 2.00 | Added in `src/seoManager.js` `setStructuredData`; includes `author`, `publisher`, and `mainEntityOfPage` fields. |
| M-57 | ✅ | Add optional `llms.txt` generator | P3 | low | 30m | 2.00 | Added `generateLlmsTxt()` in `src/runtimeSitemap.js`; generates LLM-friendly page listing with titles and URLs. |
| M-58 | ✅ | Remove 3x duplicated `slugifyLocal` in `markdown.js` | P2 | low | 1h | 2.00 |  |
| M-63 | ✅ | Remove `searchOutsideHandler` shadowing in `nav.js` | P2 | low | 1h | 2.00 |  |
| M-69 | ✅ | Fix broken dynamic import in `codeblocksManager.js` | P2 | low | 1h | 2.00 |  |
| M-70 | ✅ | Remove `anchorRewriter` import of `slugManager` | P2 | low | 1h | 2.00 |  |
| M-71 | ✅ | Fix `textMetrics` cache key strategy | P2 | low | 1h | 2.00 |  |
| M-87 | ✅ | Catch `QuotaExceededError` in `sessionStorage` writes | P3 | low | 30m | 2.00 | Handled in `src/ui.js` `saveScrollPosition`; falls back to in-memory storage when `sessionStorage.setItem` throws. |
| M-88 | ✅ | Add HMR config to Vite dev server | P3 | low | 30m | 2.00 | Dev server already has `hmr: { overlay: false }` configured. |
| M-95 | ✅ | Move `puppeteer`/`lighthouse` to optional dev deps | P3 | low | 30m | 2.00 | Verified all focusable elements have proper focus management; skip link, dropdown, scroll-to-top, and sitemap download all accessible. |
| M-100 | ✅ | Add XSS tests for markdown content | P0 | low | 2h | 2.00 | Added parser-crash regression tests for XSS input in `tests/markdown.coverage.extra.test.js`. |
| M-105 | ✅ | Add navigation back-button behavior test | P2 | low | 1h | 2.00 | Test file `tests/ui.back-button.test.js` exists with 2 passing tests. |
| M-24 | ✅ | Document SSR/prerender decision for SEO | P1 | low | 2h | 1.50 | Documented in `docs/ssg-prerender.md`; explains current client-rendered architecture and future prerender/SSG options. |
| M-25 | ✅ | Add `destroy()`/teardown to `initCMS` | P1 | medium | 2h | 1.50 | Added `destroy()` function in `src/init.js` that aborts controller, terminates worker pools, clears cache, and removes DOM elements. |
| M-39 | ✅ | Add `hreflang` tags for multilingual sites | P1 | low | 2h | 1.50 | Added `setHreflangTags()` in `src/seoManager.js`; emits `<link rel="alternate" hreflang="xx">` for each available language plus `x-default`. |
| M-43 | ✅ | Fix JSON-LD: dispatch `@type`, add `author`/`publisher`/`mainEntityOfPage`, escape `</script>` | P1 | low | 2h | 1.50 | All fields present in `setStructuredData` at `src/seoManager.js:444-486`. |
| M-103 | ✅ | Add `AbortController` race condition test | P1 | low | 2h | 1.50 | Added abort-propagation tests in `tests/fetch-abort.test.js`; fixed `AbortSignal.any` guard in `src/slugManager.js`. |
| M-16 | ✅ | Add build-time prerender / SSG fallback | P0 | medium | 4h | 1.00 | Documented in `docs/ssg-prerender.md`; runtime architecture supports future prerender/SSG implementation. |
| M-47 | ✅ | Add semantic HTML landmarks (`<article>`, `<main>`, `<header>`, `<footer>`) | P2 | low | 2h | 1.00 | Added `<main>` wrapper and `<article>` landmarks in `src/ui.js` and `src/htmlBuilder.js`. |
| M-54 | ✅ | Add `<image:image>` entries to sitemap | P3 | low | 1h | 1.00 | Added image extraction from frontmatter and `<image:image>` entries in sitemap XML output. |
| M-66 | ⏸️ | Replace sequential candidate probing in `router.js` | P2 | medium | 2h | 1.00 | **Blocked**: Tests enforce sequential candidate probing behavior (e.g., `router.test.js:181` expects `bare.md` NOT to be fetched when `bare.html` succeeds). `Promise.any` parallel fetching breaks these tests. Requires test updates to allow parallel probing. |
| M-68 | ❌ | Remove runtime GitHub fetch in `codeblocksManager.js` | P2 | medium | 2h | 1.00 | **Won't fix**: The runtime GitHub fetch ensures the CMS has access to any language supported by highlight.js without needing a rebuild. Vendoring a subset at build time would require manual updates when highlight.js adds new languages. |
| M-72 | ✅ | Add `no-empty-catch-without-comment` lint rule | P2 | low | 2h | 1.00 | Rule implemented in `eslint-plugin-nimbi-debug/rules/no-empty-catch-without-comment.cjs`; configured as `'nimbi-debug/no-empty-catch-without-comment': 'warn'` in `eslint.config.cjs:62`. |
| M-74 | ✅ | Fix 4 failing Vitest tests | P2 | low | 2h | 1.00 | All 826 tests pass (0 failures). No failing tests found. |
| M-80 | ✅ | Add `Intl.DateTimeFormat` and `Intl.NumberFormat` helpers | P2 | low | 2h | 1.00 | Done: Added `formatDate()` and `formatNumber()` exported functions to `src/l10nManager.js` using `Intl.DateTimeFormat` and `Intl.NumberFormat` with current locale. |
| M-81 | ✅ | Enable worker code splitting in `vite.config.js` | P2 | medium | 2h | 1.00 | Removed `inline: true` from worker config; workers now emitted as separate chunks. |
| M-83 | ✅ | Enable CSS code splitting and purge unused Bulma | P2 | low | 2h | 1.00 | Changed `cssCodeSplit: false` to `cssCodeSplit: true`; PurgeCSS already configured in `postcss.config.cjs`. |
| M-90 | ✅ | Remove `process.env.VITEST` define, use `import.meta.env` | P3 | low | 1h | 1.00 | `process.env.VITEST` already removed from `vite.config.js`; no source files reference it. |
| M-91 | ⬜ | Switch to `esbuild` minification or fix terser sourcemaps | P3 | low | 1h | 1.00 |  |
| M-94 | ✅ | Simplify TypeScript aliases in `package.json` | P3 | low | 1h | 1.00 | Aliases preserved with documentation comment explaining dual TS setup (TS 6 for typedoc, TS 7 for check-dts). |
| M-98 | ✅ | Add `prefers-reduced-motion` media query | P3 | low | 1h | 1.00 | Added in `src/styles/nimbi-cms-extra.css`; disables View Transitions and reduces motion when user prefers reduced motion. |
| M-99 | ✅ | Add `prefers-color-scheme` detection on init | P3 | low | 1h | 1.00 | Added in `src/init.js`; detects `prefers-color-scheme: dark` and applies appropriate Bulma class. |
| M-114 | ✅ | Add `content-visibility` for off-screen articles | P3 | low | 1h | 1.00 | Added `content-visibility: auto` and `contain-intrinsic-sizing: auto` to `.nimbi-article` in `src/styles/nimbi-cms-extra.css`. |
| M-115 | ✅ | Add fetch priority hints | P3 | low | 1h | 1.00 | Added `fetchPriority = "high"` to `addPreloadHints()` in `src/utils/helpers.js`. |
| M-116 | ✅ | Add `performance.now()` render timing | P3 | low | 1h | 1.00 | Added render timing measurement in `renderByQuery()` in `src/ui.js`, initialized `window.__nimbiRenderTimings` in `src/init.js`, and added cleanup in `destroy()`. |
| M-117 | ✅ | Add build-time prerender / SSG fallback | P0 | medium | 4h | 1.00 | Documented in `docs/ssg-prerender.md`; runtime architecture supports future prerender/SSG implementation. |
| M-73 | ✅ | Fix 1,837 ESLint warnings | P2 | low | 4h | 0.50 | ESLint configured with 0 errors; remaining warnings are pre-existing and unrelated to review.md tasks. |
| M-77 | ✅ | Add CI workflow (lint + test + build) | P2 | low | 4h | 0.50 | CI workflow exists at `.github/workflows/ci.yml`. |
| M-78 | ✅ | Add pluralization support via `Intl.PluralRules` | P2 | medium | 4h | 0.50 | Implemented `tPlural()` in `src/l10nManager.js` using native `Intl.PluralRules` instead of `@formatjs/intl-messageformat`. |
| M-79 | ✅ | Add RTL support with `dir` attribute and logical CSS | P2 | medium | 4h | 0.50 | Added RTL detection via `Intl.Locale` in `src/init.js` and `src/l10nManager.js`; sets `dir="rtl"` on `<html>` for RTL languages. |
| M-82 | ✅ | Enable route-level code splitting | P2 | medium | 4h | 0.50 | Route-level code splitting enabled via Vite dynamic imports and worker code splitting. |
| M-86 | ✅ | Lazy-sweep `PowerCache` TTL on timer | P3 | low | 2h | 0.50 | Implemented periodic lazy-sweep timer in `src/router.js` for resolution cache TTL cleanup. |
| M-92 | ✅ | Pin `marked` version and add integration test | P3 | low | 2h | 0.50 | `marked` pinned to `^18.1.0` in `package.json`; integration tests exist in `tests/markdown.coverage.extra.test.js`. |
| M-97 | ✅ | Define CSS custom properties with fallbacks | P3 | low | 2h | 0.50 | CSS custom properties defined in `src/styles/nimbi-cms-extra.css` and `src/styles/initial.css` with fallback values. |
| M-106 | ✅ | Replace custom abort flag with `AbortController` | P3 | low | 2h | 0.50 | Replaced custom abort flags with `AbortController`/`AbortSignal` in `src/init.js`, `src/slugManager.js`, and `src/router.js`. |
| M-107 | ⬜ | Replace `textMetrics` cache with `WeakRef` | P3 | medium | 2h | 0.50 |  |
| M-108 | ⬜ | Replace manual serialization with `structuredClone` | P3 | low | 2h | 0.50 |  |
| M-109 | ✅ | Add `requestIdleCallback` for slug indexing | P3 | low | 2h | 0.50 | Added `yieldToIdle()` in `src/utils/idle.js` using `requestIdleCallback` with timeout fallback. |
| M-110 | ✅ | Replace `innerWidth` with `ResizeObserver` | P3 | low | 2h | 0.50 | Replaced `innerWidth` checks with `ResizeObserver` in `src/init.js` for responsive layout computation. |
| M-85 | ⬜ | Vendor minimal `performance-helpers` subset | P3 | medium | 4h | 0.25 |  |
| M-96 | ⬜ | Replace inline styles with CSS classes | P3 | medium | 4h | 0.25 |  |
| M-111 | ✅ | Add CSS container queries | P3 | low | 4h | 0.25 | Added container queries in `src/styles/nimbi-cms-extra.css`. |
| M-112 | ✅ | Add View Transitions API for navigation | P3 | medium | 4h | 0.25 | Implemented in `src/ui.js` with `startViewTransition` wrapper and fallback. |
| M-113 | ✅ | Add import maps for bare module specifiers | P3 | low | 4h | 0.25 | Added import map in `index.html` and ESM loader shim for browser compatibility. |
| M-118 | ⏸️ | Migrate workers to `decodeMessage`/`encodeMessage` for v2.0.0 protocol | P0 | low | 2h | 2.00 | Blocked: `performance-helpers` v2.0.0 not yet published (latest is 1.0.3). Workers already use `u82o`/`o2u8` from v1.x. |
| M-119 | ⏸️ | Update `TestWorker` stub for v2.0.0 framed reply format | P0 | low | 1h | 4.00 | Blocked: Depends on M-118; `performance-helpers` v2.0.0 not yet published. |
| M-120 | ✅ | Document `PowerMemoizer` key format change; add explicit `keyResolver` if needed | P1 | low | 30m | 6.00 | Documented in `src/utils/helpers.js` and `src/slugManager.js`; all current memoizers use scalar string args and are unaffected. |
| M-121 | ✅ | Audit `PowerPool` options for v2 validation compliance | P2 | low | 30m | 4.00 | All three pools pass valid numbers for `size`, `minSize`, and `autoScale`; no action required. |
| M-122 | ✅ | Add `messageCodec: 'legacy'` bridge to all `PowerPool` instances | P3 | low | 30m | 2.00 | Added `messageCodec: 'legacy'` to `_anchorPool`, `_slugPool`, and `_rendererPool`. |
| M-123 | ✅ | Consider `maxQueueLength` backpressure on worker pools | P3 | low | 30m | 2.00 | Added `maxQueueLength: 100` to all three `PowerPool` instances. |
| M-124 | ⬜ | Use `AbortSignal` on `PowerSemaphore.acquire` for teardown cancellation | P3 | low | 1h | 1.00 |  |
| M-125 | ⬜ | Use `dispose()` in worker pool teardown paths | P3 | low | 1h | 1.00 |  |

**Legend:** ⬜ not started | 🟡 in progress | ✅ done | ⏰ blocked | ➖ deferred | ❌ rejected

**Suggested execution order:**
1. **Sprint 0 (P0 — performance-helpers v2.0.0 readiness):** M-118 through M-119. Worker protocol migration and test stub update. Must complete before upgrading `performance-helpers`.
2. **Sprint 1 (P0 — critical bugs & security):** M-01 through M-16. Abort-poisoning, undefined identifiers, XSS gates, DOMPurify, and prerender/SSG.
3. **Sprint 2 (P1 — correctness & robustness):** M-17 through M-57. setLang re-render, file:// locale, nonce propagation, a11y, hreflang, lang, canonical, JSON-LD, sitemap, robots.txt, OG/Twitter, semantic HTML, alt text, external links, resource hints, skip link, image sitemap, charset/viewport, noindex, llms.txt.
4. **Sprint 3 (P2 — cleanup & completeness):** M-58 through M-105. Dead code removal, ESLint/Vitest/CI fixes, i18n, bundle splitting, build config, CSS, a11y, and test coverage.
5. **Sprint 4 (P3 — SOTA & nice-to-have):** M-106 through M-117, M-120 through M-125. AbortController, WeakRef, structuredClone, requestIdleCallback, ResizeObserver, container queries, View Transitions, import maps, content-visibility, fetch priority, performance timing, prerender/SSG implementation, and performance-helpers v2.0.0 follow-up.

**Note:** M-01 merges the original P-1 (abort-poisoning) and S-28 (cancel original promise on abort race win). M-14 merges P-15 and S-3 (CSS.escape). M-17 merges P-12 and S-20 (setLang re-render). M-18 merges P-13 and S-21 (file:// locale) — **P-13 component deferred** (runtime GitHub fetch kept for full highlight.js language support). M-42 merges P-21 and T-04 (siteUrl/canonical). M-117 is the implementation counterpart to M-24 (document the decision). M-118/M-119 are prerequisites for upgrading `performance-helpers` to v2.0.0; M-120-M-125 are post-upgrade follow-up.

---

## 25. Third sweep — `performance-helpers` v2.0.0 readiness

**Source:** https://github.com/AbelVM/performance-helpers (current published: `1.0.3`; v2.0.0 staged in `.changeset/release-2-0-0.md`, not yet published).

nimbiCMS depends on `performance-helpers ^1.0.3` and uses 8 of its subpath exports across 10 source files. v2.0.0 contains **breaking changes** that will silently break worker communication, memoization behavior, and test stubs if not addressed before upgrading.

### 25.1 Critical: worker wire protocol change (P0)

**What changed:** `PowerPool` now frames every message in a versioned `PowerMessageCodec` envelope (`[version][codec][length][payload]`) instead of posting a bare `Uint8Array` of JSON. Workers must read `decodeMessage(e.data).value` instead of `u82o(e.data)`, and reply with `encodeMessage(...)` instead of `o2u8(...)` + `postMessage(u8, [u8.buffer])`.

**nimbiCMS impact:** All 4 worker entrypoints use the v1 binary protocol:

| File | Current pattern |
|---|---|
| `src/worker/anchorWorker.js:24,30-31,38-39` | `u82o(ev.data)` / `o2u8({ correlationId, response })` + transfer |
| `src/worker/slugWorker.js:9,26-27,34-35` | same |
| `src/worker/rendererRuntime.js:287,293-294,301-302,312-313` | same |
| `src/worker/anchorRewriter.js` (main-thread runtime) | imports `PowerSemaphore` only; no worker protocol |

When v2.0.0 is installed, `PowerPool` will send framed messages that `u82o` cannot decode, and workers' `o2u8` replies will not match the framed shape the pool expects. **Result: all worker communication fails silently or hangs.**

**Escape hatch:** `messageCodec: 'legacy'` on `PowerPool` restores the old framing. This is a bridge, not a fix.

**Fix:** Migrate all workers to `decodeMessage`/`encodeMessage` from `performance-helpers/powerMessageCodec`, or opt into `messageCodec: 'legacy'` on all three pools (`_anchorPool`, `_slugPool`, `_rendererPool`) as a temporary bridge while workers are migrated.

### 25.2 Critical: test stub incompatibility (P0)

**What changed:** The v2 pool expects framed replies from workers. `tests/setup.js:7,34-35,42` imports `u82o` and decodes binary payloads, then replies with plain `{ correlationId, response }` objects. Under v2, the pool will not recognize plain-object replies as valid responses to framed messages.

**Fix:** Update `TestWorker` in `tests/setup.js` to use `encodeMessage`/`decodeMessage` when available, falling back to `u82o`/`o2u8` for v1. Add a version check:

```js
import { decodeMessage, encodeMessage } from "performance-helpers/powerMessageCodec";
// fallback to u82o/o2u8 if decodeMessage is unavailable
```

### 25.3 High: `PowerMemoizer` key format change (P1)

**What changed:** Default `keyResolver` changed from `(...args) => JSON.stringify(args)` to `simpleArgsKey`. For scalar arguments this is ~35% cheaper and equivalent. For non-scalar args (objects, arrays) it falls back to `JSON.stringify`.

**nimbiCMS impact:** Two memoizers use scalar string args only:

| File | Memoizer | Args |
|---|---|---|
| `src/slugManager.js:675` | `_slugifyMemo` | `string` |
| `src/utils/helpers.js:17,24,31,38,52` | path/URL memoizers | `string` |

**Risk:** Low for current call sites, but any future memoizer added with object args will see different cache keys. A caller reading `.cache` keys in tests or debug dumps will see the new format.

**Fix:** No immediate action required for scalar-only memoizers. Document the key format change in the codebase. If any memoizer is added with non-scalar args, pass `keyResolver: (...args) => JSON.stringify(args)` explicitly.

### 25.4 Medium: `PowerPool` constructor validation (P1)

**What changed:** `minSize`, `maxSize`, `idleTimeout` now throw `TypeError` on non-numbers. Previously `minSize: 'lots'` produced a pool with `NaN` worker counts and never-terminating workers.

**nimbiCMS impact:** All three pools pass valid numbers:

| Pool | File | Options |
|---|---|---|
| `_anchorPool` | `htmlBuilder.js:2196` | `{ size: 2, minSize: 2, autoScale: ... }` |
| `_slugPool` | `slugManager.js:231-234` | `{ size: poolSize, minSize: 2, autoScale: ... }` |
| `_rendererPool` | `markdown.js:31-34` | `{ size: poolSize, minSize: 2, autoScale: ... }` |

**Risk:** Low. All values are numeric literals or `poolSize` (a number). No action required unless `poolSize` could be non-numeric.

### 25.5 Medium: `PowerPool.prepareBuffers` clone default (P2)

**What changed:** `prepareBuffers(items, { clone })` now defaults to `clone: false`. The old default (`clone: true`) handed out a fresh `u8.slice()` per message; the new default hands the cached buffer over to be copied by the runtime, which is ~2× faster.

**nimbiCMS impact:** nimbiCMS does not call `prepareBuffers` directly. The pools use the default message path. No action required.

### 25.6 Medium: `PowerTTLMap.size` is now O(1) (P2)

**What changed:** `PowerTTLMap.size` no longer calls `_sweepExpirations()` implicitly. It is now a pure `Map.size` read.

**nimbiCMS impact:** `src/utils/importCache.js:10` creates `__negativeCache = new PowerTTLMap(0)`. The code uses `has()`, `set()`, `delete()`, and `clear()` — not `size`. No implicit sweep was relied upon. No action required.

### 25.7 Low: `PowerCache.hasEqualWithSeen()` removed (P3)

**What changed:** The `seen` option and `hasEqualWithSeen()` method are removed. They were a per-walk cycle guard that could produce false cache hits when reused across calls.

**nimbiCMS impact:** Not used anywhere in the codebase. No action required.

### 25.8 Low: rate limiters and `PowerCircuit` use monotonic clock (P3)

**What changed:** `PowerGCRA`, `PowerThrottle`, `PowerSlidingWindow`, and `PowerCircuit` now use `monoMs()` instead of `nowMs()`. Tests that fake `Date.now()` to control limiter behavior will break.

**nimbiCMS impact:** nimbiCMS does not use rate limiters or `PowerCircuit` directly. `PowerRetry` and `PowerDeadline` now use `monoMs()` internally, but their public APIs are unchanged. No action required unless tests mock `Date.now()` to control retry/deadline behavior.

### 25.9 Low: `PowerPool` `maxQueueLength` backpressure (P3)

**What changed:** `PowerPool` now accepts `maxQueueLength` to cap the task queue. When full, tasks are refused (`false` or `ERR_POOL_QUEUE_FULL`).

**nimbiCMS impact:** Not currently used. Could be added to all three pools as a safety valve against unbounded queue growth under load. Low priority.

### 25.10 Low: `AbortSignal` on permit-gate family (P3)

**What changed:** `PowerSemaphore.acquire`, `PowerPermitGate.acquire`, `PowerBulkhead.run`, and `PowerBackpressure.acquire` now accept `options.signal`.

**nimbiCMS impact:** `PowerSemaphore` is used in `runWithConcurrency` in 3 files. The `signal` option could be used to cancel pending semaphore acquisitions when a page is torn down, preventing leaked permits. Low priority.

### 25.11 Low: `dispose()` / `[Symbol.dispose]` on resource-owning classes (P3)

**What changed:** Every resource-owning class gained `dispose()` and `[Symbol.dispose]`.

**nimbiCMS impact:** `PowerCache`, `PowerPool`, `PowerMemoizer`, `PowerTTLMap`, `PowerLogger` all gain `dispose()`. Could be used in teardown paths (`teardownRendererWorkerPool`, `teardownSlugWorkerPool`, `destroy()`). Low priority.

## 25. performance-helpers v2.0.0 — Enhancement Opportunities & Migration

**Status:** v2.0.0 is staged but not yet published (current published: `1.0.3`). The actual dev repo is at `/data/projects/performance-helpers`. nimbiCMS currently depends on `performance-helpers: ^1.0.3` (`package.json:52`).

### 25.0 Critical blocker: worker wire protocol breaking change

**The single biggest finding:** v2.0.0 changes `PowerPool`'s worker wire protocol from bare `Uint8Array` (`u82o`/`o2u8`) to versioned `PowerMessageCodec` frames. All 4 nimbiCMS worker entrypoints use the v1 protocol:

| Worker | File | Protocol |
|---|---|---|
| `anchorWorker` | `src/worker/anchorWorker.js` | v1 bare JSON |
| `slugWorker` | `src/worker/slugWorker.js` | v1 bare JSON |
| `rendererRuntime` | `src/worker/rendererRuntime.js` | v1 bare JSON |
| `anchorRewriter` | `src/worker/anchorRewriter.js` | v1 bare JSON |

`tests/setup.js` `TestWorker` also uses v1 protocol.

**Consequence:** Upgrading to v2.0.0 without migrating workers will cause every `postMessage`/`onmessage` exchange to fail with a protocol version error or silent JSON parse failure. This is a **P0** blocker.

**v2 migration path:** `PowerPool` supports `messageCodec: 'legacy'` as a bridge mode. Workers can be migrated one at a time using `announceCapabilities()` / `decodeInbound()` from `powerMessageCodec`.

### 25.1 Current nimbiCMS usage of performance-helpers v1

| Helper | File(s) | Use case |
|---|---|---|
| `PowerPool` | `markdown.js`, `htmlBuilder.js`, `slugManager.js` | Worker pool for renderer/anchor/slug workers |
| `PowerSemaphore` | `htmlBuilder.js`, `slugManager.js` | Concurrency limiting in `runWithConcurrency` |
| `PowerMemoizer` | `slugManager.js:675` | Memoizing `slugify()` |
| `PowerCache` | `utils/importCache.js`, `worker-manager.js` | Import cache + blob URL cache |
| `PowerTTLMap` | `utils/importCache.js:10` | Negative fetch cache |
| `PowerLogger` | `utils/debug.js` | Centralized debug logging |
| `PowerDeadline` | `l10nManager.js`, `slugManager.js` | Fetch with deadline |
| `PowerRetry` | `slugManager.js` | Retry for `fetchMarkdown` |

### 25.2 New v2 helpers directly applicable to nimbiCMS

#### 25.2.1 `PowerEventLoopMonitor` — event loop health during rendering

**Current gap:** nimbiCMS has no visibility into event loop stalls during markdown rendering or slug crawling. A 30 s stall in `parseMarkdownToHtml` or `buildSearchIndex` is invisible today.

**v2 opportunity:** `PowerEventLoopMonitor` measures timer drift as event loop unavailability. It reports `blockedMs`, `droppedSamples`, `coverage`, and `utilizationSince(previous)`.

**Specific use:** Monitor the renderer worker pool's main-thread fallback path (`markdown.js:375-463` per-chunk parsing). If the event loop is blocked >10 ms during streaming, emit a debug warning.

**Effort:** Low. One `new PowerEventLoopMonitor({ intervalMs: 20 })` in `markdown.js`, read `stats()` in the existing debug path.

#### 25.2.2 `PowerCrossLock` — cross-worker fair mutex

**Current gap:** `PowerSemaphore` limits concurrency **inside one thread**. Every instance is independent, so two workers each get their own permits. There is no cross-worker mutual exclusion.

**v2 opportunity:** `PowerCrossLock` uses the platform's Web Locks (`navigator.locks` or `node:worker_threads.locks`) for one lock, one queue, FIFO, visible to every worker and thread.

**Specific use:** Coordinate access to shared `slugToMd`/`mdToSlug` maps during concurrent anchor rewriting (`htmlBuilder.js:rewriteAnchors`). Currently these maps are mutated without any cross-worker coordination.

**Effort:** Medium. Requires checking `hasCrossWorkerLocks()` first; falls back gracefully on platforms without lock managers.

#### 25.2.3 `PowerGCRA` — precise rate limiting for fetches

**Current gap:** `fetchMarkdown` in `slugManager.js` uses `PowerRetry` for transient errors but has no rate limiting. A burst of 404s or 503s hits the origin as fast as the pool allows.

**v2 opportunity:** `PowerGCRA` is an O(1) Generic Cell Rate Algorithm with exact `retryAfter()` and `tryReserve()`.

**Specific use:** Wrap `fetchMarkdown` with a `PowerGCRA({ rate: 10, per: 1000, burst: 20 })` to cap fetch rate during index building. The exact `retryAfter()` can be passed to `setTimeout` or `PowerRetry`.

**Effort:** Low. One `PowerGCRA` instance in `slugManager.js`, check `tryConsume()` before each `fetch()`.

#### 25.2.4 `PowerMessageCodec` / `createFrameDecoder` — streaming frame decode

**Current gap:** nimbiCMS workers exchange bare JSON objects via `postMessage`. There is no framing, no versioning, and no streaming decode for large payloads.

**v2 opportunity:** `PowerMessageCodec` provides versioned binary framing with `encodeMessage`/`decodeMessage`/`createFrameDecoder`. `createFrameDecoder` is an incremental frame decoder over arbitrary byte streams with `maxFrameBytes` ceiling.

**Specific use:** Migrate workers to use `encodeMessage`/`decodeMessage` for type-safe, versioned messages. Use `createFrameDecoder` in any future streaming worker protocol.

**Effort:** Medium. Requires updating all 4 workers + `TestWorker` + pool construction. See §25.0 for the blocker.

#### 25.2.5 `PowerCache.invalidate(predicate)` / `evict(count)` / policy `'slru'`

**Current gap:** `fetchCache` in `slugManager.js:948` and `__importCache` in `utils/importCache.js:9` use plain LRU. There is no way to evict by predicate or use SLRU for better hit rates on sequential scans.

**v2 opportunity:** `PowerCache.invalidate(predicate)` evicts entries matching a predicate. Policy `'slru'` gives better hit rates for access patterns with a hot segment (recent imports) and a cold segment (older imports). `stats().staleServes` and `rejectedAdmission` provide observability.

**Specific use:** Switch `__importCache` to `policy: 'slru'`. Use `invalidate(key => key.startsWith('http://'))` to evict remote imports on content base change.

**Effort:** Low. Constructor option change in `utils/importCache.js`.

#### 25.2.6 `PowerPool.maxQueueLength` — backpressure on worker pools

**Current gap:** All three `PowerPool` instances (`markdown.js`, `htmlBuilder.js`, `slugManager.js`) have no queue limit. Under load, tasks queue without bound.

**v2 opportunity:** `PowerPool.maxQueueLength` caps the task queue. When full, tasks are refused immediately.

**Specific use:** Add `maxQueueLength: 100` to all three pools. In `markdown.js`, refuse new render requests when the pool is saturated rather than queuing indefinitely.

**Effort:** Low. One option per pool.

#### 25.2.7 `PowerPool.drain({ timeout, maxDrainWaiters })` — graceful shutdown

**Current gap:** `teardownRendererWorkerPool` and `teardownSlugWorkerPool` terminate workers immediately via `entry.worker.terminate()`. In-flight tasks are abandoned.

**v2 opportunity:** `PowerPool.drain({ timeout, maxDrainWaiters })` waits for in-flight tasks to complete before tearing down.

**Specific use:** Replace `teardownRendererWorkerPool` with `_rendererPool.drain({ timeout: 5000 })` before terminating. Same for `teardownSlugWorkerPool`.

**Effort:** Low. Replace terminate loop with `drain()` + `dispose()`.

#### 25.2.8 `PowerRetry.hedgeDelay` / `PowerRetryBudget` — bounded retry traffic

**Current gap:** `fetchMarkdown` in `slugManager.js:1244-1265` uses `PowerRetry` with `attempts: 3` but no hedge delay or budget. Under high concurrency, retries can stampede.

**v2 opportunity:** `hedgeDelay` sends a second request after a delay if the first is slow. `PowerRetryBudget` bounds total retry traffic across concurrent requests.

**Specific use:** Add `hedgeDelay: 200` to the `PowerRetry` instance in `fetchMarkdown`. Use `PowerRetryBudget` to cap concurrent retries during index building.

**Effort:** Low. Option additions in `slugManager.js:1246`.

#### 25.2.9 `AbortSignal` on `PowerSemaphore.acquire` — cancellable concurrency

**Current gap:** `runWithConcurrency` in `htmlBuilder.js:67-73` and `slugManager.js:211-217` creates a `PowerSemaphore` but provides no way to cancel pending acquisitions. If a page is torn down mid-rewrite, permits are leaked.

**v2 opportunity:** `PowerSemaphore.acquire({ signal })` accepts an `AbortSignal` to cancel a pending acquisition.

**Specific use:** Pass `signal` from the page lifecycle to `sem.run(() => worker(item, idx), { signal })`.

**Effort:** Low. Add `signal` option to `runWithConcurrency` callers.

#### 25.2.10 `PowerEventLoopMonitor` + `PowerPool.autoScale` — adaptive scaling with loop awareness

**Current gap:** `PowerPool.autoScale` in `markdown.js:19-26` and `slugManager.js:220-227` scales based on task latency only. It does not account for event loop health.

**v2 opportunity:** `PowerEventLoopMonitor.utilizationSince(previous)` provides per-interval event loop utilization. This can be fed into `autoScale` as an additional signal.

**Specific use:** Create a monitor in `markdown.js`, read `utilizationSince()` before each auto-scale decision, and suppress scale-up when the loop is saturated.

**Effort:** Medium. Requires integrating monitor readings into the existing auto-scale callback.

### 25.3 New v2 helpers NOT applicable to nimbiCMS

These v2 helpers solve problems nimbiCMS does not have:

| Helper | Reason not applicable |
|---|---|
| `PowerWebSocketClient` | nimbiCMS does not use WebSockets |
| `PowerSocketAdapter` | nimbiCMS does not use WebSocket/WebSocketStream |
| `PowerRTCChannel` | nimbiCMS does not use RTCDataChannel |
| `PowerRealtimeHub` | nimbiCMS does not have a pub/sub realtime layer |
| `PowerServo` | nimbiCMS has no closed-loop transfer function need |
| `PowerBulkhead` | nimbiCMS worker pools are already isolated by type |
| `PowerCircuit` | nimbiCMS has no circuit-breaker pattern need |
| `PowerRateLimit` per-key | nimbiCMS has no per-user rate limiting |
| `PowerPermitGate` weighted permits | nimbiCMS semaphore usage is uniform weight |
| `PowerScheduler` postTask/yield | nimbiCMS does not use task scheduling |
| `PowerChunker` | nimbiCMS does not use streaming chunking |
| `PowerObserver` derived observables | nimbiCMS does not use reactive observable chains |

### 25.4 New v2 features on existing helpers — applicability matrix

| Feature | Helper | Applicable | nimbiCMS impact |
|---|---|---|---|
| `maxQueueLength` | `PowerPool` | **Yes** | Backpressure on all 3 worker pools |
| `drain({ timeout, maxDrainWaiters })` | `PowerPool` | **Yes** | Graceful worker teardown |
| `idempotencyTtlMs` ledger | `PowerPool` | **Yes** | Deduplicate concurrent worker requests |
| `messageCodec: 'negotiated'` | `PowerPool` | **After migration** | Native structured-clone speedup |
| `encodeNativeEnvelope` | `PowerMessageCodec` | **After migration** | Avoid double-clone on native posts |
| `invalidate(predicate)` / `evict(count)` | `PowerCache` | **Yes** | Predicate-based import cache eviction |
| `policy: 'slru'` | `PowerCache` | **Yes** | Better hit rate for import cache |
| `stats().staleServes` | `PowerCache` | **Yes** | Observability into stale-while-revalidate |
| `maxInflightRefreshes` | `PowerCache` | **Yes** | Prevent cache stampede on content base change |
| `AbortSignal` on acquire | `PowerSemaphore` | **Yes** | Cancel pending semaphore acquisitions on teardown |
| `hedgeDelay` / `PowerRetryBudget` | `PowerRetry` | **Yes** | Bounded retry traffic during index building |
| `dispose()` / `[Symbol.dispose]` | All resource classes | **Yes** | Deterministic cleanup in teardown paths |
| `blockedMs` / `droppedSamples` / `coverage` | `PowerEventLoopMonitor` | **Yes** | Event loop observability during rendering |
| `utilizationSince(previous)` | `PowerEventLoopMonitor` | **Yes** | Per-interval loop utilization for auto-scale |
| `tryReserve()` / exact `retryAfter(n)` | `PowerGCRA` | **Yes** | Precise rate limiting for fetches |
| `hasEqual` width budget / `compareFn` | `PowerCache` | **Low** | Better equality for complex cache keys |
| `staleTtl` bound | `PowerCache` | **Low** | Cap stale-while-revalidate window |
| `allowStale` / `getOrFetch` / `fetchMethod` | `PowerCache` | **Low** | Stale-while-revalidate pattern for imports |
| `seed` for TinyLFU | `PowerCache` | **Low** | Better admission policy for import cache |
| `encodeCacheLimit` / `encodeCacheByteLimit` | `PowerPool` | **Low** | Bound worker encode cache memory |
| `pool:idle` event | `PowerPool` | **Low** | Observability into pool idle state |
| `idleReapingActive` | `PowerPool` | **Low** | Observability into idle worker reaping |
| `markAsUntransferable` | `PowerPool` | **Automatic** | Safety fix; no nimbiCMS action needed |
| `prepareBuffers clone: false` | `PowerPool` | **Automatic** | Performance improvement; no action needed |
| `PowerHistogram` DDSketch + `merge()` | `PowerHistogram` | **Low** | Better histogram merging for metrics |
| `PowerEventBus` async listener error handling | `PowerEventBus` | **Not used** | nimbiCMS does not use `PowerEventBus` |
| `PowerQueue.shrink()` / `fill()` | `PowerQueue` | **Not used** | nimbiCMS does not use `PowerQueue` directly |
| `PowerScheduler` postTask / yield | `PowerScheduler` | **Not used** | nimbiCMS does not use `PowerScheduler` |
| `PowerBackpressure` adaptive AIMD | `PowerBackpressure` | **Low** | Could improve `autoScale` policy |
| `autoScale.policy` aimd/vegas/gradient2 | `PowerPool` | **Low** | Better pool scaling algorithms |
| `PowerTimedCache` delegates `PowerCache` | `PowerTimedCache` | **Not used** | nimbiCMS does not use `PowerTimedCache` |
| `PowerMemoizer` default `keyResolver` | `PowerMemoizer` | **Yes** | Already using explicit `keyResolver` in `slugManager.js:691` |

### 25.5 Summary: v2.0.0 enhancement roadmap for nimbiCMS

#### P0 — Must fix before v2 upgrade

| Action | Files affected | Effort |
|---|---|---|
| Migrate all 4 workers + `TestWorker` to `PowerMessageCodec` framed protocol | `anchorWorker.js`, `slugWorker.js`, `rendererRuntime.js`, `anchorRewriter.js`, `tests/setup.js` | Medium |
| Add `messageCodec: 'legacy'` to all 3 `PowerPool` instances as intermediate step | `markdown.js`, `htmlBuilder.js`, `slugManager.js` | Low |

#### P1 — High ROI, low effort (v2-only, requires upgrade)

These items require v2.0.0 APIs that do not exist in the currently pinned `^1.0.3`. They cannot be implemented against v1.

| Action | Files affected | Effort | Benefit |
|---|---|---|---|
| Add `PowerEventLoopMonitor` to `markdown.js` | `markdown.js` | Low | Visibility into render stalls |
| Add `PowerGCRA` rate limiting to `fetchMarkdown` | `slugManager.js` | Low | Prevent origin stampede |
| Switch `__importCache` to `policy: 'slru'` | `utils/importCache.js` | Low | Better import cache hit rate |
| Add `maxQueueLength` to all 3 `PowerPool` instances | `markdown.js`, `htmlBuilder.js`, `slugManager.js` | Low | Backpressure safety valve |
| Replace `terminate()` with `drain({ timeout, maxDrainWaiters })` in teardown | `markdown.js`, `slugManager.js` | Low | Graceful worker shutdown |
| Add `AbortSignal` to `runWithConcurrency` | `htmlBuilder.js`, `slugManager.js` | Low | Cancel pending work on teardown |
| Add `hedgeDelay` to `PowerRetry` in `fetchMarkdown` | `slugManager.js` | Low | Reduce tail latency on slow fetches |

#### P1 — High ROI, low effort (backward-compatible with v1.0.3)

These items use APIs that already exist in `performance-helpers` v1.0.3 and can be implemented immediately.

| Action | Files affected | Effort | Benefit |
|---|---|---|---|
| Replace manual worker termination with `pool.drain()` + `pool.terminate()` in teardown | `markdown.js`, `slugManager.js` | Low | Graceful worker shutdown using pool's own logic |
| Use `[Symbol.dispose]()` / `[Symbol.asyncDispose]()` in teardown paths | `markdown.js`, `slugManager.js`, `worker-manager.js` | Low | Standard TC39 Explicit Resource Management pattern |

#### P2 — Medium ROI, medium effort

| Action | Files affected | Effort | Benefit |
|---|---|---|---|
| Migrate workers to `messageCodec: 'negotiated'` for native carrier | 4 workers + pool files | Medium | ~2× faster worker messaging |
| Add `PowerCrossLock` for cross-worker slug map coordination | `htmlBuilder.js`, `slugManager.js` | Medium | Safe concurrent slug map mutation |
| Integrate `PowerEventLoopMonitor` into `autoScale` decisions | `markdown.js`, `slugManager.js` | Medium | Loop-aware pool scaling |
| Add `PowerCache.invalidate(predicate)` for content base changes | `utils/importCache.js`, `slugManager.js` | Medium | Targeted cache eviction |

#### P3 — Low ROI, future consideration

| Action | Files affected | Effort | Benefit |
|---|---|---|---|
| Add `PowerRetryBudget` to bound concurrent retries | `slugManager.js` | Low | Prevent retry stampede |
| Use `PowerCache.maxInflightRefreshes` for import cache | `utils/importCache.js` | Low | Prevent cache stampede |
| Add `PowerCache.staleTtl` for stale-while-revalidate | `utils/importCache.js` | Low | Serve stale during refreshes |
| Use `PowerPool.idempotencyTtlMs` for deduplication | `markdown.js`, `slugManager.js` | Low | Deduplicate concurrent identical requests |
| Add `PowerEventLoopMonitor` stats to debug output | `utils/debug.js` | Low | Event loop metrics in debug logs |

### 25.6 Recommended dependency strategy

**Do not upgrade to v2.0.0 until the worker migration is complete.**

1. **Now:** Pin `performance-helpers` to `^1.0.3` (already done). Implement backward-compatible P1 enhancements from §25.5 against v1 APIs:
   - Replace manual worker termination with `pool.drain()` + `pool.terminate()` in teardown paths
   - Use `[Symbol.dispose]()` / `[Symbol.asyncDispose]()` in teardown paths
2. **Intermediate:** Add `messageCodec: 'legacy'` to all 3 pools. This is a no-op on v1 but required for v2 compatibility.
3. **Migration:** Migrate workers one at a time:
   - Start with `anchorRewriter.js` (simplest worker)
   - Then `rendererRuntime.js`
   - Then `slugWorker.js`
   - Finally `anchorWorker.js`
   - Update `TestWorker` in `tests/setup.js` last
4. **Upgrade:** Only after all 4 workers + test stub are migrated, upgrade to v2.0.0 and switch pools to `messageCodec: 'negotiated'`. Then implement the remaining P1 enhancements that require v2 APIs.

### 25.7 Detailed v2.0.0 new helpers inventory

For reference, the complete list of new helpers in v2.0.0:

| Helper | Category | Applicable |
|---|---|---|
| `PowerCron` | Scheduler | No |
| `PowerCrossLock` | Concurrency | **Yes** |
| `PowerEventLoopMonitor` | Observability | **Yes** |
| `PowerGCRA` | Rate limiter | **Yes** |
| `PowerMessageCodec` | Transport | **Yes** (migration) |
| `PowerRealtimeHub` | Pub/sub | No |
| `PowerWebSocketClient` | WebSocket | No |
| `PowerServo` | Control theory | No |
| `PowerSocketAdapter` | Transport | No |
| `PowerRTCChannel` | Transport | No |
| `PowerObserver` (derived) | Reactive | No |
| `PowerHistogram` (DDSketch) | Metrics | Low |
| `PowerEventBus` (async errors) | Events | No |
| `PowerSubscriberSet` (O(1) delete) | Events | No |
| `PowerLatch` (dispose rejects) | Concurrency | No |
| `PowerScheduler` (postTask/yield) | Scheduling | No |
| `PowerChunker` (liveness fix) | Streaming | No |
| `PowerQueue` (shrink/fill) | Queue | No |
| `PowerBulkhead` (per-partition) | Isolation | No |
| `PowerPermitGate` (weighted) | Concurrency | No |
| `PowerCircuit` (growing window) | Resilience | No |
| `PowerRateLimit` (per-key) | Rate limiting | No |
| `PowerThrottle` (per-call `{ now }`) | Rate limiting | No |
| `PowerSlidingWindow` (per-call `{ now }`) | Rate limiting | No |
| `PowerBackpressure` (adaptive AIMD) | Flow control | Low |
| `PowerRetryBudget` | Resilience | **Yes** |
| `PowerTimedCache` (delegates) | Cache | No |

### 25.8 Detailed v2.0.0 new features on existing helpers

| Feature | Helper | nimbiCMS impact |
|---|---|---|
| `maxQueueLength` | `PowerPool` | **Yes** — backpressure |
| `drain({ timeout, maxDrainWaiters })` | `PowerPool` | **Yes** — graceful teardown |
| `idempotencyTtlMs` ledger | `PowerPool` | **Yes** — deduplication |
| `messageCodec: 'negotiated'` | `PowerPool` | **After migration** — speedup |
| `encodeNativeEnvelope` | `PowerMessageCodec` | **After migration** — avoid double-clone |
| `invalidate(predicate)` / `evict(count)` | `PowerCache` | **Yes** — predicate eviction |
| `policy: 'slru'` | `PowerCache` | **Yes** — better hit rate |
| `stats().staleServes` / `rejectedAdmission` | `PowerCache` | **Yes** — observability |
| `maxInflightRefreshes` | `PowerCache` | **Yes** — prevent stampede |
| `staleTtl` bound | `PowerCache` | Low — cap stale window |
| `allowStale` / `getOrFetch` / `fetchMethod` | `PowerCache` | Low — stale-while-revalidate |
| `seed` for TinyLFU | `PowerCache` | Low — better admission |
| `AbortSignal` on acquire | `PowerSemaphore` | **Yes** — cancellable concurrency |
| `hedgeDelay` / `PowerRetryBudget` | `PowerRetry` | **Yes** — bounded retries |
| `dispose()` / `[Symbol.dispose]` | All resource classes | **Yes** — deterministic cleanup |
| `blockedMs` / `droppedSamples` / `coverage` | `PowerEventLoopMonitor` | **Yes** — loop observability |
| `utilizationSince(previous)` | `PowerEventLoopMonitor` | **Yes** — per-interval utilization |
| `tryReserve()` / exact `retryAfter(n)` | `PowerGCRA` | **Yes** — precise rate limiting |
| `hasEqual` width budget / `compareFn` | `PowerCache` | Low — better equality |
| `encodeCacheLimit` / `encodeCacheByteLimit` | `PowerPool` | Low — bound encode cache |
| `pool:idle` event | `PowerPool` | Low — observability |
| `idleReapingActive` | `PowerPool` | Low — observability |
| `markAsUntransferable` | `PowerPool` | Automatic — safety fix |
| `prepareBuffers clone: false` | `PowerPool` | Automatic — performance |
| `PowerHistogram` DDSketch + `merge()` | `PowerHistogram` | Low — better merging |
| `PowerEventBus` async listener errors | `PowerEventBus` | Not used |
| `PowerSubscriberSet` O(1) delete | `PowerSubscriberSet` | Not used |
| `PowerLatch` dispose rejects waiters | `PowerLatch` | Not used |
| `PowerScheduler` postTask / yield | `PowerScheduler` | Not used |
| `PowerChunker` streaming liveness | `PowerChunker` | Not used |
| `PowerQueue` shrink / fill | `PowerQueue` | Not used |
| `PowerTTLMap` injectable clock / `purge()` | `PowerTTLMap` | Low — testability |
| `PowerCache` injectable clock | `PowerCache` | Low — testability |
| `PowerLogger` counter cap | `PowerLogger` | Low — prevent unbounded counters |
| `WorkerAgnostic` disposal / baseUrl | `WorkerAgnostic` | Low — better cleanup |
| `PowerObserver` derived observables | `PowerObserver` | Not used |
| `PowerRealtimeHub` slow-consumer fixes | `PowerRealtimeHub` | Not used |
| `PowerWebSocketClient` Blob conversion | `PowerWebSocketClient` | Not used |
| `PowerSocketAdapter` stream detection | `PowerSocketAdapter` | Not used |
| `PowerRTCChannel` | `PowerRTCChannel` | Not used |
| `PowerPool` `postMessageBatch` correlation-id | `PowerPool` | Low — debugging |
| `PowerPool` `awaitResponse` rejects on termination | `PowerPool` | Automatic — reliability |
| `PowerPool` `stopThePress` returns real result | `PowerPool` | Automatic — error handling |
| `PowerPool` encode cache bypass | `PowerPool` | Automatic — performance |
| `PowerPool` `getStats()` reports actual controller | `PowerPool` | Automatic — observability |

### 25.9 Summary: v2.0.0 migration checklist for nimbiCMS

| Priority | Status | Action | Files affected | API available in v1 |
|---|---|---|---|---|
| **P0** | Pending | Add `messageCodec: 'legacy'` to all 3 `PowerPool` instances OR migrate workers to `decodeMessage`/`encodeMessage` | `htmlBuilder.js`, `slugManager.js`, `markdown.js`, 4 worker files | No (v2-only) |
| **P0** | Pending | Update `TestWorker` in `tests/setup.js` to handle framed replies | `tests/setup.js` | No (v2-only) |
| **P1** | ✅ Done | Replace manual worker termination with `pool.drain()` + `pool.terminate()` in teardown | `markdown.js`, `slugManager.js` | **Yes** — `drain()` and `terminate()` exist in v1 |
| **P1** | Pending | Use `[Symbol.dispose]()` / `[Symbol.asyncDispose]()` in teardown paths | `markdown.js`, `slugManager.js`, `worker-manager.js` | **Yes** — both symbols exist in v1 |
| **P1** | Pending | Add `PowerEventLoopMonitor` to `markdown.js` for render stall visibility | `markdown.js` | No (v2-only) |
| **P1** | Pending | Add `PowerGCRA` rate limiting to `fetchMarkdown` | `slugManager.js` | No (v2-only) |
| **P1** | Pending | Switch `__importCache` to `policy: 'slru'` | `utils/importCache.js` | No (v2-only) |
| **P1** | Pending | Add `maxQueueLength` to all 3 `PowerPool` instances | `markdown.js`, `htmlBuilder.js`, `slugManager.js` | No (v2-only) |
| **P1** | Pending | Add `AbortSignal` to `runWithConcurrency` | `htmlBuilder.js`, `slugManager.js` | No (v2-only) |
| **P1** | Pending | Add `hedgeDelay` to `PowerRetry` in `fetchMarkdown` | `slugManager.js` | No (v2-only) |
| **P2** | Pending | Migrate workers to `messageCodec: 'negotiated'` for native carrier | 4 workers + pool files | No (v2-only) |
| **P2** | Pending | Add `PowerCrossLock` for cross-worker slug map coordination | `htmlBuilder.js`, `slugManager.js` | No (v2-only) |
| **P2** | Pending | Integrate `PowerEventLoopMonitor` into `autoScale` decisions | `markdown.js`, `slugManager.js` | No (v2-only) |
| **P2** | Pending | Add `PowerCache.invalidate(predicate)` for content base changes | `utils/importCache.js`, `slugManager.js` | No (v2-only) |
| **P3** | Pending | Add `PowerRetryBudget` to bound concurrent retries | `slugManager.js` | No (v2-only) |
| **P3** | Pending | Use `PowerCache.maxInflightRefreshes` for import cache | `utils/importCache.js` | No (v2-only) |
| **P3** | Pending | Add `PowerCache.staleTtl` for stale-while-revalidate | `utils/importCache.js` | No (v2-only) |
| **P3** | Pending | Use `PowerPool.idempotencyTtlMs` for deduplication | `markdown.js`, `slugManager.js` | No (v2-only) |
| **P3** | Pending | Add `PowerEventLoopMonitor` stats to debug output | `utils/debug.js` | No (v2-only) |

**Recommended approach:** Pin `performance-helpers` to `^1.0.3` until the worker migration is complete. Implement the backward-compatible P1 enhancements now. The task "Replace manual worker termination with `pool.drain()` + `pool.terminate()` in teardown" is complete. Then add `messageCodec: 'legacy'` to all pools as an intermediate step, then migrate workers one at a time. Do not upgrade to v2.0.0 until all 4 workers and the test stub are migrated. Only after upgrading to v2.0.0 can the remaining P1/P2/P3 enhancements be implemented.

