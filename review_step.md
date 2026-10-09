# nimbiCMS — Deep Audit, Findings & Implementation Plan

> Audit date: 2026-10-09
> Scope: `src/` (24,345 LOC across 43 modules), `tests/` (294 files), build & tooling config
> Method: full source read of every module, `performance-helpers` v2.0.0 API surface review,
> empirical verification via the test suite, ESLint, build, `gen-dts`, `check-dts`, and TypeDoc.
> `notes.md` was disregarded per instruction.

---

## 1. Executive summary

The codebase is in good shape: 898 tests pass, 0 ESLint errors, and the build,
type-generation, type-check, and docs pipelines are all green. The architecture
(worker pools, PowerPool/PowerCache/PowerMemoizer integration, slug-state
extraction to break a circular import) shows deliberate engineering.

The audit found **6 real bugs**, **3 significant duplication/divergence problems**,
and **1 block of dead code**. The most serious class of issue was **worker/main-thread
divergence**: four independent `slugify` implementations and two independent
`_splitIntoSections` implementations meant the workers and the main thread could
disagree about the same input. That class of bug does not fail tests — it produces
broken links and inconsistent streamed output in production.

Two findings from my initial hypothesis list turned out to be **wrong** and were
discarded after reading the `performance-helpers` source (see §7). One
recommendation (`PowerChunker` for section splitting) was also incorrect and was
replaced with a plain extraction.

**Net result of the work:** `src/` shrank by 107 lines while gaining 3 shared
modules and 23 new regression tests.

---

## 2. Verification baseline

| Gate | Before | After |
|---|---|---|
| `npx vitest run` | 866 passed / 2 failed (868) | **898 passed / 0 failed** |
| `npx eslint src/` | 1 error, 2766 warnings | **0 errors**, 2766 warnings |
| `npm run build` | pass | pass |
| `npm run gen-dts` | pass | pass |
| `npm run check-dts` | pass | pass |
| `npm run docs` | pass | pass |

Bundle sizes (unchanged in kind; the refactor is size-neutral to slightly smaller):

| Artifact | Raw | Gzip |
|---|---|---|
| `dist/nimbi-cms.es.js` | 1,259.17 kB | 337.45 kB |
| `dist/nimbi-cms.cjs.js` | 1,035.65 kB | 315.31 kB |
| `dist/nimbi-cms.js` (UMD) | 1,542.03 kB | 366.50 kB |
| `dist/nimbi-cms.css` | 506.15 kB | 49.98 kB |

---

## 3. Bugs found and fixed

### B1 — `init.js`: `cmsAbortController` null-dereference silently disabled error reporting

**Severity: High.** `cmsAbortController` was declared `let cmsAbortController = null`
(line 314) but only assigned at line ~1446, while the `error` and
`unhandledrejection` listeners consumed `cmsAbortController.signal` at lines 872
and 885. Reading `.signal` off `null` throws `TypeError`, which the enclosing
`try { … } catch (e) {}` swallowed. **The runtime error-reporting listeners were
never attached**, so `onRuntimeError` never fired and `window.__nimbiRenderingErrors__`
stayed empty.

**Fix:** hoisted controller creation to the top of `initCMS`, before any listener
registration and before the first `await`. Also re-mint the controller after the
internal `destroy()` call on the mount-switch path (line ~597), because `destroy()`
now nulls it — without this, switching mounts regressed
`tests/init.homepage.test.js`.

**Lesson:** the `catch (e) {}` that hid this is exactly the pattern that makes
initialization-order bugs invisible. See §8 (robustness).

### B2 — `init.js`: missing `toCanonicalHref` import

**Severity: High.** `init.js:1014` called `toCanonicalHref(currentHref)` but the
file only imported `parseHrefToRoute` from `./utils/urlHelper.js`. This was the
repo's single ESLint `no-undef` error, and at runtime it meant **URL
canonicalization silently never executed** (again swallowed by a `try`).

**Fix:** `import { parseHrefToRoute, toCanonicalHref } from "./utils/urlHelper.js";`

### B3 — `nav.js`: module-scope global `input` listener leaked for the page lifetime

**Severity: Medium (perf + leak).** A `document.addEventListener("input", …, true)`
at module scope ran at import time, was never removed, and fired in the **capture
phase for every input event on the entire document** — forever. Its only job was
to unhide `#nimbi-search-results` when the user typed in the search box.

**Fix:** replaced with an element-scoped listener on `searchInput`, bound to the
runtime `AbortSignal` via the existing `addEventListener` helper, so `destroy()`
releases it. Verified against `nav.search.burger.test.js` (which dispatches a
bubbling `input` event) and `nav.search.outside.test.js`.

### B4 — `nav.js`: `navbar` temporal-dead-zone hazard

**Severity: Low (latent).** `closeMobileMenu` guarded with
`typeof navbar !== "undefined"`. For a `const`, `typeof` **throws
`ReferenceError`** in the TDZ rather than returning `"undefined"`, so the guard
provided no protection. Currently safe only because every call site happens to
run after the declaration.

**Fix:** hoisted to `let navbar = null` alongside the other state, assigned at the
creation site, and simplified the now-redundant `typeof` chains to a single
`const scope = navbar ?? navbarWrap ?? null`.

### B5 — `indexManager.js`: stale `indexSet` after `slugToMd.clear()`

**Severity: Medium.** `slugManager` patched `slugToMd.clear()` to bump
`_nimbiVersion`, but `_trackMap` only wrapped `set`. After a `clear()`, `indexSet`
retained **every path seen before the clear** and served stale entries until the
next explicit `refreshIndexPaths()`.

**Fix:** wrapped `clear` as well as `set` in `_trackMap`. Verified the new test
actually catches the regression by temporarily reverting the fix (3 tests failed,
then passed on restore).

### B6 — `imagePreview.js`: dead zoom-HUD code

**Severity: Low (dead code).** `showZoomHud()` queried
`[data-nimbi-preview-zoom-hud]`, an element **never created** in either the
DOM-built path or the `innerHTML` fallback. It was a permanent no-op invoked from
6 call sites, and it scheduled a `setTimeout` that could never fire meaningfully.

**Fix:** removed the dead `zoomHud` query, the `showZoomHud` definition, and all
6 call sites. The zoom percentage is already displayed by the existing
`zoomLabel` control, so no feature was lost.

---

## 4. Duplication and cross-context divergence

This was the highest-value category, because divergence between the main thread
and workers produces **silent production breakage** rather than test failures.

### D1 — Four divergent `slugify` implementations → unified

`slugManager.slugify` (via `PowerMemoizer`), `slugSearchRuntime._slugify`,
`worker/rendererRuntime.slugifyHeading`, and `worker/anchorRuntime.slugifyTitle`
each had their own normalization. The two worker variants **skipped extension
stripping and length capping**, so a slug generated in a worker did not match the
slug the main thread derived from the same text — the learned mapping then pointed
at a page that did not exist in the index.

**Fix:** created `src/utils/slugify.js` as the single canonical, memoized
implementation and wired all four consumers to it. `markdown.js` already
delegated correctly and needed no change.

**Contract conflict discovered.** Unifying immediately broke two existing tests
that asserted *mutually exclusive* behavior:

- `tests/worker/anchorRuntime.test.js` expected `slugify("Probe Html")` → `"probe-html"`
- `tests/filesManager.test.js` expected `slugify("readme-md")` → `"readme"`

No single rule satisfies both. I determined the **unconditional strip is the
documented contract** — `filesManager.test.js` asserts it explicitly and
deliberately ("ensure trailing words are preserved when not exactly md/html"),
and the main thread's `buildSearchIndex` already produced `"probe"` for that
title. The worker was the outlier, and its test had been asserting a bug. I
corrected the worker test with a comment explaining why.

I first tried a "only strip when the source contained a dot" guard, which
satisfied both tests — but rejected it because it silently changed long-standing
main-thread behavior for titles ending in `md`/`html`. Consistency with the
established contract beat local elegance.

**Regression test:** `tests/slugify.contract.test.js` (9 tests) pins
cross-context agreement across 13 inputs × 3 implementations, plus the
normalization rules, length cap, and empty-input behavior.

### D2 — Two divergent `_splitIntoSections` implementations → unified

`markdown.js` and `worker/rendererRuntime.js` each had a copy. Divergent chunk
boundaries would make **streamed output differ from non-streamed output** for the
same document.

**Fix:** created `src/utils/splitIntoSections.js`, wired both call sites, deleted
both local copies. Preserved the historical `_splitIntoSections` export name on
`markdown.js` and `worker/renderer.js` for backward compatibility.

**Regression test:** `tests/splitIntoSections.contract.test.js` (9 tests) proves
identical boundaries across 10 documents × 4 chunk sizes, plus invariants: no
empty sections for non-empty input, sections reassemble to the original, and
`#NotAHeading` is not treated as a heading.

### D3 — Duplicated `runWithConcurrency` → extracted

`htmlBuilder.js` and `slugManager.js` had **byte-identical** implementations.
Extracted to `src/utils/concurrency.js` and removed two now-unused
`PowerSemaphore` imports.

### Remaining duplication (not yet addressed)

- `buildPageUrl` — duplicated in `utils/helpers.js` and `worker/anchorRuntime.js`.
  **The worker version drops the `baseSearch` merge**, so this is likely another
  live divergence bug, not just duplication. Highest-value next target.
- `stripContentBasePrefix` — duplicated in `htmlBuilder.js` and `anchorRuntime.js`.
- `decodeHtmlEntities` — duplicated in `utils/helpers.js` and `rendererRuntime.js`.
- Two further concurrency runners with a different signature
  (`items, limit, worker`) in `slugSearchRuntime.js` and `anchorRuntime.js`.

---

## 5. Memory, retention and responsiveness

### Confirmed and fixed

- **Global capture-phase listener** (B3) fired for every input event on the page
  for the page lifetime. Now element-scoped and signal-bound.
- **`destroy()` now nulls `cmsAbortController`** and clears
  `window.__nimbiRuntimeManifest`, which it previously left dangling.

### Identified, not yet fixed

- **`window.__nimbi*` globals** (12+) are written from many modules with no
  generation guard. A late-resolving promise can repopulate them after
  `destroy()`. Recommend gating writes on `currentRuntimeId`.
- **`router._resolutionCachePurgeTimerId`** interval is created at module import
  time, before any runtime exists. `destroy()` does call
  `disposeResolutionCachePurge()`, but the timer's lifetime is not tied to a
  runtime.
- **`imagePreview` modal** is a module singleton never removed on destroy; `_img`
  retains the last image.
- **`codeblocksManager.__hlObserver`** is a module singleton that can observe
  detached nodes.
- **`slugManager.fetchCache` / `negativeFetchCache`** are `PowerCache` with
  `maxEntries: 2000` holding full markdown bodies — up to ~2×2000 page bodies
  retained.
- **`ui.js` `_preparedPageCache`** holds `cloneNode(true)` article templates
  (max 12) — large DOM retention.

### Responsiveness

- `markdown.js` fast path is gated on `!import.meta.env.DEV`, so **dev and test
  builds always take the slow worker path**. Intentional, but worth documenting.
- `buildSearchIndex` fetches every page twice (discovery loop, then `pathMdMap`
  loop) and re-scans `slugToMd.keys()` into a `taken` Set **per page** — O(n²).
- `ensureSlug` iterates `allMarkdownPaths` calling `slugify` per entry, twice.
- `htmlBuilder.getSlugForRelativePath` falls back to a full `slugToMd` iteration
  per unresolved anchor — O(anchors × mappings).
- `nav.resolveEntryTarget` does a permissive `slugToMd.entries()` scan per search
  result.
- `runtimeSitemap._isKnownPath` iterates `mdToSlug.keys()` with `normalizePath`
  per key, per candidate.
- `slugManager.fetchMarkdown` performs ~10 sequential string-normalization passes
  on `path` before any cache lookup.

---

## 6. `performance-helpers` v2.0 — unused surface

Current usage covers 9 of ~60 helpers: `PowerPool`, `PowerCache`, `PowerMemoizer`,
`PowerSemaphore`, `PowerDeadline`, `PowerRetry`, `PowerTTLMap`, `PowerLogger`,
`PowerMessageCodec` (decode side only).

High-value substitutions that **delete code rather than add it**:

| Helper | Replaces | Location |
|---|---|---|
| `PowerBulkhead` / `PowerBackpressure` | 2 remaining hand-rolled concurrency runners | `slugSearchRuntime.js`, `anchorRuntime.js` |
| `PowerCircuit` | hand-rolled CDN circuit breaker | `codeblocksManager.js` |
| `PowerLatch` | `_isRendering` / `_queuedRender` mutex | `ui.js` |
| `PowerObserver` | `rafThrottle` / `debounce` / `scheduleDOMWrite` | `utils/events.js` |
| `PowerHistogram` | hand-rolled percentile math | `performanceDiagnostics.js` |
| `PowerServo` / `PowerAdaptiveProposal` | 3 hand-rolled `autoScale` option objects | `slugManager.js`, `markdown.js`, `htmlBuilder.js` |
| `PowerSubscriberSet` | `slugResolvers` Set + hook Set | `slugManager.js`, `hookManager.js` |
| `MetricsCollector` / `formatPrometheus` | ad-hoc `incrementCounter` counters | `utils/debug.js` |
| `PowerMessageCodec.encodeMessage` | hand-rolled outbound encoding | workers |
| `PowerEventLoopMonitor` | fixed thresholds in `yieldIfNeeded` | `utils/idle.js` |
| `PowerGCRA` / `PowerRateLimit` | unthrottled crawl fetches | `slugManager.js` |
| `PowerBrownout` / `getResourcePressure` | — (new capability) | degrade under memory pressure |
| `measureSync` / `measureAsync` / `monoMs` | `performance.now()` boilerplate | throughout |

---

## 7. Findings investigated and rejected

Recorded so they are not re-litigated.

| Claim | Verdict | Evidence |
|---|---|---|
| `l10nManager` misuses `PowerDeadline.run` as a static method | ❌ **Wrong** | `PowerDeadline.run` is a documented static method (`powerDeadline.js:26`). Both the static and instance forms are valid; `slugManager` uses the instance form. |
| `getSlugPathIndex()` `_nimbiVersion` token is stale | ❌ **Wrong** | The index reads only `slugToMd`, and `_nimbiVersion` bumps on every `set`/`clear` of that map. Invalidation is correct. |
| `PowerChunker` should replace `_splitIntoSections` | ❌ **Wrong** | `PowerChunker` is a pool-based work distributor that runs a callback per chunk via `setTimeout`. It is not a pure string splitter. Replaced with a plain extraction (D2). |
| Strip `md`/`html` only when the source had a dot | ❌ **Rejected** | Satisfied both conflicting tests but silently changed long-standing main-thread behavior. The unconditional strip is the established, explicitly-tested contract. |
| Implement the missing zoom HUD | ➖ **Resolved by deletion** | The element was never created in either code path and the zoom label already shows the percentage. Dead code removed (B6). |

---

## 8. Robustness and code quality

- **~400 `try/catch` blocks**, most swallowing silently. Two of the six bugs in
  this audit (B1, B2) were **hidden by exactly this pattern**. Recommend a lint
  rule requiring either a comment or a `debugWarn` in every catch — the repo
  already has `nimbi-debug/no-empty-catch-without-comment`, but it is a *warning*
  and there are 2766 of them. Promoting a narrow subset to errors would have
  caught B1 and B2.
- **`debugWarn` inside `catch` is itself wrapped in `try/catch`** in several
  places — defensive nesting that adds noise without safety.
- **Duplicate JSDoc blocks** stacked on the same symbol in `slugManager.js`
  (`isExternalLink`, `unescapeMarkdown`, `resolveSlugPath`, `fetchMarkdown`),
  `htmlBuilder.js` (`scrollToAnchorOrTop`), and `helpers.js` (`joinPaths`).
- **`init.js` has an empty `try {} catch (e) {}` block** (lines ~917–920) and a
  `var contentBase` declared inside `try` blocks but used outside.
- **`seoManager.setStructuredData`** has a nested function declaration
  (`_computeCanonical`) mid-block — works only via Annex B semantics.
- **`eslint-plugin-nimbi-debug`** is a local `file:` dependency; consider
  publishing or vendoring it properly.
- **Dead exports:** `nav.js` `safeGet` (exported, unused internally),
  `slugManager._allMd` (written by `_setAllMd`, read only in `setContentBase`),
  `slugSearchRuntime.crawlForSlug`, `src/gen-dts-sample.js`.

---

## 9. Developer and user experience

**DX**
- `npm run type-test` is a **pre-existing failure** (`src/index.test-d.ts` does not
  exist). Either add the file or drop the script.
- `benchmark` script points at a deleted file; only `benchmark:lighthouse` works.
- `engines.node: ">=16"` is stale — the real minimum is Node 22 (cssnano 9).
  Intentionally untouched for semver safety, but it misleads contributors.
- Test suite takes ~31s with jsdom created 294 times (265s of environment setup).
  Vitest suggests `pool: 'vmThreads'` or `isolate: false` — worth measuring.
- Six test files generate a temporary copy of `src/worker/renderer.js` at runtime
  and rewrite its import paths by string replacement. This is **fragile**: adding
  any new relative import to `renderer.js` breaks all six. I hit this during D2
  and had to patch each one. A shared helper for the rewrite would prevent a
  repeat.

**UX**
- Search is a linear `Array.filter` over the whole index per keystroke. An
  inverted index with prefix matching would scale far better.
- No offline/bfcache resilience; an OPFS-backed content cache would help.
- Long articles have no `content-visibility: auto`, so off-screen content still
  costs layout.

---

## 10. New techniques worth adopting

- **Speculation Rules API** (`<script type="speculationrules">`) to prefetch nav
  targets ahead of navigation.
- **View Transitions** (`document.startViewTransition`) for route changes —
  `runRenderWithTransition` already exists as a hook point.
- **`scheduler.yield()` / `scheduler.postTask()`** with priorities to replace
  fixed-threshold yielding in `utils/idle.js`.
- **INP-focused input handling**: trigger prefetch on `pointerdown` rather than
  waiting for navigation.
- **Client-side BM25** over an inverted index for search.
- **`AbortSignal.any`** composition (partially used already).
- **`WeakRef` / `FinalizationRegistry`** for the prepared-page cache.

---

## 11. Implementation plan

Status icons: ✅ done & validated · 🟡 partial · ⬜ not started · ⏰ deferred ·
➖ resolved by deletion · ❌ rejected

| Task ID | Status | Task | Priority | ROI | Risk | Effort | Notes |
|---|---|---|---|---|---|---|---|
| B1 | ✅ | Hoist `cmsAbortController` creation to top of `initCMS`; re-mint after internal `destroy()` | P0 | High | Low | S | Error/unhandledrejection listeners were never attaching. Caught a regression in `init.homepage.test.js` on first attempt. |
| B2 | ✅ | Add missing `toCanonicalHref` import in `init.js` | P0 | High | Low | S | Was the repo's only ESLint error; URL canonicalization silently never ran. |
| B3 | ✅ | Replace module-scope `document` input listener with element-scoped, signal-bound listener | P1 | High | Low | S | Capture-phase listener fired for every input on the page, forever. |
| B4 | ✅ | Hoist `navbar` to `let` to remove TDZ hazard; simplify `typeof` guards | P2 | Med | Low | S | `typeof` does not protect a `const` in the TDZ. |
| B5 | ✅ | Wrap `clear` as well as `set` in `indexManager._trackMap` | P1 | High | Low | S | `indexSet` retained stale paths after `slugToMd.clear()`. Verified by reverting the fix. |
| B6 | ➖ | Remove dead zoom-HUD code from `imagePreview.js` | P3 | Med | None | S | Element never created in either path; zoom label already shows the percentage. |
| D1 | ✅ | Unify 4 `slugify` implementations into `src/utils/slugify.js` | P0 | High | Med | M | Resolved a genuine contract conflict between two tests; worker was the outlier. |
| D2 | ✅ | Unify 2 `_splitIntoSections` implementations into `src/utils/splitIntoSections.js` | P1 | High | Low | M | Preserved historical export names for backward compatibility. |
| D3 | ✅ | Extract duplicated `runWithConcurrency` into `src/utils/concurrency.js` | P2 | Med | Low | S | Removed 2 unused `PowerSemaphore` imports. |
| T1 | ✅ | Add `tests/slugify.contract.test.js` (9 tests) | P1 | High | None | S | Pins cross-context slug agreement. |
| T2 | ✅ | Add `tests/splitIntoSections.contract.test.js` (9 tests) | P1 | High | None | S | Pins identical chunk boundaries main-thread vs worker. |
| T3 | ✅ | Add `tests/indexManager.instrumentation.test.js` (5 tests) | P1 | High | None | S | Verified it fails without the B5 fix. |
| T4 | ✅ | Patch 6 test harnesses that rewrite `renderer.js` import paths | P1 | High | Low | S | Fragile string-replacement pattern; see DX note in §9. |
| V1 | ✅ | Verify: tests, lint, build, gen-dts, check-dts, docs | P0 | High | None | S | 898 passed / 0 failed; 0 lint errors; all pipelines green. |
| D4 | ⬜ | Unify `buildPageUrl` (worker drops `baseSearch` merge) | P1 | High | Med | S | **Likely a live divergence bug**, not just duplication. Highest-value next target. |
| D5 | ⬜ | Unify `stripContentBasePrefix` and `decodeHtmlEntities` | P2 | Med | Low | S | Straightforward extraction. |
| D6 | ⬜ | Normalize the 2 remaining worker-side concurrency runners | P2 | Med | Low | S | Different signature (`items, limit, worker`). |
| P1 | ⬜ | Replace hand-rolled helpers with `PowerBulkhead`/`PowerBackpressure` | P2 | High | Med | M | Deletes 2 concurrency runners. |
| P2 | ⬜ | Replace CDN breaker with `PowerCircuit` | P2 | High | Med | M | `codeblocksManager.js`. |
| P3 | ⬜ | Replace render mutex with `PowerLatch` | P2 | High | Low | S | `ui.js` `_isRendering`/`_queuedRender`. |
| P4 | ⬜ | Replace `utils/events.js` throttling with `PowerObserver` | P2 | Med | Med | M | `rafThrottle`/`debounce`/`scheduleDOMWrite`. |
| P5 | ⬜ | Replace percentile math with `PowerHistogram` | P3 | Med | Low | S | `performanceDiagnostics.js`. |
| P6 | ⬜ | Replace 3 `autoScale` objects with `PowerServo` | P3 | Med | Med | M | `slugManager`, `markdown`, `htmlBuilder`. |
| P7 | ⬜ | Use `PowerMessageCodec.encodeMessage` for outbound worker messages | P3 | Med | Med | M | Only the decode side is used today. |
| P8 | ⬜ | Adopt `MetricsCollector` / `formatPrometheus` | P3 | Med | Med | M | Replaces ad-hoc `incrementCounter`. |
| M1 | ⬜ | Gate `window.__nimbi*` writes on `currentRuntimeId` | P1 | High | Med | M | Late promises can repopulate globals after `destroy()`. |
| M2 | ⬜ | Tie `router` purge-timer lifetime to a runtime | P2 | Med | Low | S | Currently created at module import. |
| M3 | ⬜ | Release `imagePreview` modal and `codeblocksManager` observer on destroy | P2 | Med | Low | S | Module singletons retaining DOM. |
| M4 | ⬜ | Bound `fetchCache` / `_preparedPageCache` retention | P2 | Med | Med | M | Up to ~2×2000 page bodies; 12 cloned article templates. |
| R1 | ⬜ | Fix O(n²) `taken` Set rebuild in `buildSearchIndex` | P1 | High | Med | M | Re-scans `slugToMd.keys()` per page. |
| R2 | ⬜ | Eliminate double page fetch in `buildSearchIndex` | P1 | High | Med | M | Discovery loop + `pathMdMap` loop. |
| R3 | ⬜ | Memoize `ensureSlug` path scan | P2 | Med | Low | S | Iterates `allMarkdownPaths` twice. |
| R4 | ⬜ | Replace linear anchor fallback with the slug-path index | P2 | High | Low | S | `getSlugForRelativePath` is O(anchors × mappings). |
| R5 | ⬜ | Index `resolveEntryTarget` lookups | P2 | Med | Low | S | Permissive `entries()` scan per result. |
| R6 | ⬜ | Precompute `runtimeSitemap._isKnownPath` set | P3 | Low | Low | S | `normalizePath` per key per candidate. |
| R7 | ⬜ | Hoist `fetchMarkdown` path normalization before cache lookup | P2 | Med | Low | S | ~10 sequential passes today. |
| Q1 | ⬜ | Promote a narrow subset of empty-catch warnings to errors | P1 | High | Med | M | Would have caught B1 and B2. 2766 warnings today. |
| Q2 | ⬜ | Remove duplicate stacked JSDoc blocks | P3 | Low | None | S | `slugManager`, `htmlBuilder`, `helpers`. |
| Q3 | ⬜ | Clean `init.js` empty try block and `var contentBase` scoping | P3 | Low | Low | S | Lines ~917–920. |
| Q4 | ⬜ | Remove dead exports (`safeGet`, `_allMd`, `crawlForSlug`, `gen-dts-sample.js`) | P3 | Low | Low | S | Verify with `knip` first. |
| Q5 | ⬜ | Run `madge` for circular imports | P2 | Med | None | S | `slugState.js` extraction fixed one known cycle. |
| Q6 | ⬜ | Run `knip` for dead code | P2 | Med | None | S | Complements Q4. |
| X1 | ⬜ | Inverted index + prefix matching for search | P1 | High | High | L | Replaces linear filter per keystroke. |
| X2 | ⬜ | Speculation Rules prefetch for nav targets | P2 | High | Med | M | Progressive enhancement. |
| X3 | ⬜ | View Transitions for route changes | P2 | High | Med | M | `runRenderWithTransition` is the hook point. |
| X4 | ⬜ | `content-visibility: auto` for long articles | P2 | Med | Low | S | Cheap layout win. |
| X5 | ⬜ | `pointerdown`-triggered prefetch (INP) | P2 | High | Low | S | |
| X6 | ⬜ | OPFS-backed content cache | P3 | Med | High | L | Offline / bfcache resilience. |
| X7 | ⬜ | `scheduler.yield()` / `postTask()` in `utils/idle.js` | P3 | Med | Med | M | Replaces fixed thresholds. |
| DX1 | ⬜ | Fix or remove `npm run type-test` | P2 | Med | Low | S | Pre-existing failure: `src/index.test-d.ts` missing. |
| DX2 | ⬜ | Fix `benchmark` script path | P3 | Low | None | S | Points at a deleted file. |
| DX3 | ⬜ | Extract shared `renderer.js` rewrite helper for tests | P1 | High | Low | S | 6 files duplicate fragile string replacement. |
| DX4 | ⬜ | Measure `pool: 'vmThreads'` / `isolate: false` test speedup | P2 | Med | Med | S | 265s of 294 jsdom environment setups. |
| DX5 | ⏰ | Correct `engines.node` to `>=22` | — | Low | High | S | **Deferred:** intentionally stale for semver safety on a published package. |
| WR1 | ⏰ | Deep web research to validate SOTA recommendations | P2 | Med | None | M | **Deferred:** §10 recommendations are from domain knowledge, not verified against current specs/support tables. |
| WR2 | ⏰ | Measure bundle size directly and set a budget | P3 | Med | Low | S | **Deferred:** figures in §2 come from the build log, not a tracked budget. |

---

## 12. Recommended next actions

1. **D4 — unify `buildPageUrl`.** The worker version drops the `baseSearch` merge,
   which is very likely a live bug of the same class as D1. Small effort, high
   payoff, and the pattern is now well-established.
2. **Q1 — promote a narrow subset of empty-catch warnings to errors.** B1 and B2
   were both invisible because of silent catches. This is the single highest-leverage
   robustness change.
3. **R1 + R2 — `buildSearchIndex` efficiency.** The double fetch and O(n²) `taken`
   Set are the clearest responsiveness wins on large sites.
4. **DX3 — extract the test rewrite helper.** Six files already broke once during
   this audit; a shared helper prevents the next occurrence.
5. **M1 — generation-guard the `window.__nimbi*` globals.** Closes the
   post-`destroy()` repopulation hole.
