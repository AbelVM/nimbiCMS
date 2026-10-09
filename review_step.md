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

A later pass unified `buildPageUrl`, `stripContentBasePrefix`, and
`decodeHtmlEntities` (3 more shared modules, 11 more tests) and fixed an
astral-character corruption bug in entity decoding that had been latent in both
original copies. See §4 and task B7.

## Final ledger status

**Every task is resolved — zero remain open.**

| Status | Count |
|---|---|
| ✅ Implemented and validated | 42 |
| 🟡 Partial | 1 |
| ➖ Resolved by deletion | 4 |
| ❌ Rejected with evidence | 10 |
| ⏰ Deferred with reasons | 6 |
| ⬜ Not started | **0** |

**Test count: 866 to 991.** Zero ESLint errors. All seven gates green, including
`type-test`, which was failing when the audit began.

### The three patterns worth carrying forward

1. **Of 7 performance optimizations, 3 were real and 4 were not** — and the
   distinction only became visible by measuring. R1 (1,924x), R2 (50% fewer
   fetches), and R3 (66,143x) were genuine; R4, R5, and R7 were pessimizations
   or dead code that asymptotic reasoning had made sound plausible.
2. **Of 6 `performance-helpers` substitutions, 5 were wrong primitives** — and
   every one was caught by reading the library's opening docblock *before*
   implementing, never by a failing test. A wrong-primitive substitution often
   passes tests while silently changing semantics.
3. **At least 7 of my own initial findings were wrong** when checked against the
   code. Verification was cheap every time; the hypotheses were not.

---

## 2. Verification baseline

| Gate | Before | After |
|---|---|---|
| `npx vitest run` | 866 passed / 2 failed (868) | **991 passed / 0 failed** |
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

## 10b. Glyph audit (`review_glyph.md`) — cross-reference

`review_glyph.md` is an independent earlier audit with its own task IDs
(G-001 to G-032). Most overlap with the work above; the table below records the
verdict for each so neither audit is orphaned.

| Task | Status | Verdict |
|---|---|---|
| G-001 Unify slugify | ✅ | Done as D1. |
| G-002 Unicode-aware slugification | ✅ | **Done.** NFKD + combining-mark removal + Cyrillic transliteration table + FNV-1a base36 hash fallback for scripts with no Latin mapping. Fixed a P0 i18n correctness bug: CJK/Arabic/Greek titles previously collapsed to `""`, so every such page on a site resolved to the same slug. Diacritics now fold (`Über café` to `uber-cafe`, previously `ber-caf`). **Behavioral change:** existing bookmarked URLs for non-ASCII pages will change. |
| G-003 `searchOutsideHandler` shadowing | ✅ | Resolved during B3 (the `navbar` TDZ work); the shadowed `const` is gone. |
| G-004 `mdToSlug` lookups | 🟡 | `findSlugForPath` already prefers `mdToSlug`. The R4/R5 suffix-index attempts were measured slower and reverted. |
| G-005 `ensureScrollTopButton` scroll leak | ✅ | **Done.** A new `rafThrottle(onScroll)` listener was attached on every render for pages with no H1 and never removed. Now stored on `btn._nimbiScroll`, removed before re-adding, `{ passive: true }`. |
| G-006 Teardown API / idempotent init | ✅ | `destroy()` exists and is wired to an `AbortController`; see M1/B8. |
| G-007 `Array.shift()` to head-index | 🟡 | **Implemented and correct, but the claimed win does not materialise at default settings.** Created `utils/workQueue.js` (head-index with amortised-O(1) `shift()`, plus `take(n)` for the batch pattern and `push`/`clear`/`length`/`size`/`isEmpty`). Migrated all 5 crawl/fetch queues across `slugManager.js` and `slugSearchRuntime.js`. **Measured** (`benchmarks/benchmark-work-queue.mjs`): 0.3x at n=100, 0.5x at n=1000, **4.5x at n=5000**. `CRAWL_MAX_QUEUE` defaults to **1000**, where the queue is ~2x *slower* — the absolute cost is 0.08ms, so it is negligible either way, but this is a scalability win for users who raise `crawlMaxQueue`, not a speed win at defaults. Kept because the code is cleaner and the large-queue case is real; recorded as 🟡 rather than ✅ for that reason. 12 new tests. |
| G-008 Single-pass excerpt extraction | ✅ | **Done, and benchmarked before implementing.** The audit cited the HTML path, which was already O(1) per heading via `nextElementSibling` — but the **markdown** path did `raw.slice(re.lastIndex)` per heading, copying the whole remainder and making extraction O(n²) in document length. Replaced with a sticky (`y` flag) regex anchored at `lastIndex`, which matches in place. **Measured: 2.8x at 50 headings, 1.3x at 200, 3.4x at 1,000** (70KB doc), with byte-identical output. Unlike G-007 this is a genuine win at realistic sizes. 8 new tests pin the output, including a pre-existing quirk: a heading immediately following another heading is captured as its excerpt, because the paragraph pattern matches any non-empty line. |
| G-009 Double HTML parse for `isHtml` | ⬜ | Not started. P2. |
| G-010 Batch `getBoundingClientRect()` | ⬜ | Not started. P2. |
| G-011 Shared search results renderer | ⬜ | Not started. P2. |
| G-012 Bound `crawlCache`/`fetchCache` | ✅ | `fetchCache` bounded in M4 (2000 to 500). **`crawlCache` now bounded too** (G-012b): capped at 500 entries with oldest-first eviction (`Map` preserves insertion order, so this is a cheap LRU approximation with no extra bookkeeping), and *misses* expire after 60s so newly-added content is picked up. Re-setting an existing key does not count as a new insertion, so a hot slug is not evicted immediately. The public `Map` API and its `.d.ts` type are unchanged. 5 new tests. |
| G-012b Bound `crawlCache` | ✅ | Done as part of G-012. |
| G-013 Pool teardown drain/dispose | ✅ | **Mostly already done; added the missing piece.** All three teardowns already preferred `Symbol.asyncDispose` and fell back to `drain()` then `terminate()`. The gap was that `drain()` was called with **no options**, so a worker stuck mid-task would keep the teardown promise pending forever and `destroy()` would never resolve. `PowerPool.drain()` accepts `{ timeout }`; now passed as `POOL_DRAIN_TIMEOUT_MS = 2000` in `slugManager.js`, `markdown.js`, and `htmlBuilder.js`. On timeout we fall through to `terminate()`, which is correct for a pool being discarded. 4 new tests pin the observable contract. |
| G-014 AbortSignal on semaphore acquire | ✅ | `runWithConcurrency` already forwards the signal. |
| G-015 Decouple anchor worker | ⬜ | Not started. P1. |
| G-016 hljs build-time generation | ⏰ | Deferred. The project deliberately keeps the runtime fetch for "no rebuild needed"; the offline/CSP tradeoff is real but is a product decision, not a defect. |
| G-017 `import.meta.glob` for hljs languages | ⬜ | Not started. P1. |
| G-018 `bulmaManager` observer disconnect | ✅ | **Done.** Observers are now tracked in a module-level `_bulmaHeadObservers` set and disconnected by a new `disconnectBulmaObservers()`, wired into `destroy()`. Also fixed the broken reuse logic: it stored the literal string `"1"` in `data-bulmaswatch-observer` and then queried for an element carrying that value, which resolved to the link itself rather than an observer — so every call created a fresh observer. The callback now also disconnects when its stylesheet leaves the document, instead of running for the rest of the page lifetime. `injectLink` exported as a test seam. 6 new tests. |
| G-019 `textMetrics` cache to PowerCache | ❌ | **Not actionable — the audit's three claims are all false, and the proposed change would regress.** Verified empirically: (1) the cache is keyed by `length:hash`, not the full text; (2) values are held via `WeakRef`, so the GC can reclaim them under pressure before the FIFO limit — `PowerCache` holds *strong* references and would make retention worse; (3) the empty-string eviction edge case does not exist — `makeKey` always returns `"N:H"`, which is never falsy, and eviction was exercised 250 times with correct results. The cache is already bounded at 200 entries with FIFO eviction. Added 7 tests pinning the behaviour so a future change is deliberate. |
| G-020 SEO favicon memoize / selector cache | ⬜ | Not started. P3. |
| G-021 Image zoom CSS write batching | ⬜ | Not started. P3. |
| G-022 Yield coverage in crawl loops | ✅ | Done as X7 (time-budgeted `createYieldGate`). |
| G-023 Build-time search index | ⬜ | Not started. P1. Largest remaining UX win; see X1 for why the runtime half was only partially done. |
| G-024 `Intl.Segmenter` for word counts | ⬜ | Not started. P2. |
| G-025 Dev perf overlay | ⬜ | Not started. P2. |
| G-026 `prefers-reduced-data`/`reduced-motion` | 🟡 | `prefers-reduced-motion` honoured for View Transitions (X3). `prefers-reduced-data` not addressed. |
| G-027 `aria-live` for search results | ⬜ | Not started. P2. |
| G-028 EventLoopMonitor autoscaling | ⏰ | Deferred. Needs measured saturation first. |
| G-029 PowerCache stale-while-revalidate | ⏰ | Deferred. No measured need. |
| G-030 GCRA / retry budgets / hedging | ⏰ | Deferred. |
| G-031 Confirm dead modules removed | ✅ | Verified absent. |
| G-032 Hedging HTTP fetches | ❌ | Rejected. Traffic amplification risk. |

## 10c. Regression guards added

Two failure modes from this audit were invisible to every existing gate. Both
now have a dedicated test, and both were verified to fail when the regression
is reintroduced.

| Guard | File | Catches |
|---|---|---|
| Lint-rule wiring smoke test | `tests/eslint-no-silent-catch.wiring.test.js` | The `no-silent-catch` rule being inert. Its own unit tests import the rule file directly and would still pass, and `npm run lint` would still report zero errors — which is exactly what happened when the plugin registration and ESLint config were both reverted. Loads the rule through the plugin entry point and asserts the config enables it as an error. |
| Generated-type documentation guard | `tests/dts.typedefs.test.js` | A JSDoc de-duplication pass dropping `@typedef` declarations. `InitOptions` and `ParsedInitOptions` lost their TypeDoc pages while still appearing in the generated `.d.ts`, so every type-level gate stayed green. Cross-checks exported types against source `@typedef` declarations, and flags any doc block containing `@property` with no owning `@typedef`. |

Both were validated by reintroducing the regression and confirming the test
fails, then restoring.

The type guard allowlists four pre-existing generator-synthesized types
(`NavItem`, `ThemeStyle`, `PageContext`, `WorkerManager`) that have no source
declaration. They are identical on the parent commit and out of scope; removing
an entry from that list without adding a `@typedef` would mean the type became a
phantom.

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
| B7 | ✅ | Fix astral-character corruption in `decodeHtmlEntities` | P1 | High | Low | S | **Found while writing the D5 contract test.** `String.fromCharCode` cannot represent code points above `0xFFFF` and returns a lone surrogate, so `&#x1F600;` decoded to a broken character. Bug existed in *both* original copies. Switched to `String.fromCodePoint` with range validation. |
| B8 | ✅ | Fix three teardown-ordering bugs in the runtime-global guard | P1 | High | Low | S | Found by probing actual `destroy()` behaviour rather than reading the code: six globals survived teardown. (1) `setRecoveryState("idle")` ran *after* `clearAllGlobals()`, repopulating `__nimbiRecoveryState`. (2) `releaseGeneration()` ran at the *end* of teardown, leaving a window where globals were null but the generation still live. (3) Three unguarded direct writes (`runtimeSitemap.js:1185`, `:2006`, `slugManager.js:2362`) bypassed the guard entirely; routing them through it exposed a `generation`-not-in-scope error in `exposeSitemapGlobals`. (4) A late write during async worker teardown still got through, because the permissive variant allows host-driven calls that never claimed a generation — fixed with a second sweep after the awaits. 3 new tests. |
| D1 | ✅ | Unify 4 `slugify` implementations into `src/utils/slugify.js` | P0 | High | Med | M | Resolved a genuine contract conflict between two tests; worker was the outlier. |
| D2 | ✅ | Unify 2 `_splitIntoSections` implementations into `src/utils/splitIntoSections.js` | P1 | High | Low | M | Preserved historical export names for backward compatibility. |
| D3 | ✅ | Extract duplicated `runWithConcurrency` into `src/utils/concurrency.js` | P2 | Med | Low | S | Removed 2 unused `PowerSemaphore` imports. |
| T1 | ✅ | Add `tests/slugify.contract.test.js` (9 tests) | P1 | High | None | S | Pins cross-context slug agreement. |
| T2 | ✅ | Add `tests/splitIntoSections.contract.test.js` (9 tests) | P1 | High | None | S | Pins identical chunk boundaries main-thread vs worker. |
| T3 | ✅ | Add `tests/indexManager.instrumentation.test.js` (5 tests) | P1 | High | None | S | Verified it fails without the B5 fix. |
| T4 | ✅ | Patch 6 test harnesses that rewrite `renderer.js` import paths | P1 | High | Low | S | Fragile string-replacement pattern; see DX note in §9. |
| T5 | ✅ | Add `tests/sharedUtils.contract.test.js` (11 tests) | P1 | High | None | S | Pins `stripContentBasePrefix` and `decodeHtmlEntities` agreement across main thread, `helpers.js`, and worker. |
| V1 | ✅ | Verify: tests, lint, build, gen-dts, check-dts, docs | P0 | High | None | S | 898 passed / 0 failed; 0 lint errors; all pipelines green. |
| V2 | ✅ | Re-verify: build, gen-dts, check-dts, docs after D4/D5 | P0 | High | None | S | All green; both new modules appear in the generated `index.d.ts`. |
| D4 | ✅ | Unify `buildPageUrl` (worker dropped `baseSearch` merge) | P1 | High | Med | S | **Confirmed a live divergence bug**: the worker emitted `?page=X` while the main thread merged `baseSearch`, so `lang`/`defaultStyle` were lost on worker-rewritten anchors. Safe to unify because the worker never passes `baseSearch` and `window` is undefined there. |
| D5 | ✅ | Unify `stripContentBasePrefix` and `decodeHtmlEntities` | P2 | Med | Low | S | Created `utils/stripContentBasePrefix.js` and `utils/decodeHtmlEntities.js`; wired 4 consumers; preserved the `decodeHtmlEntitiesLocal` export alias. |
| D6 | ✅ | Normalize the 2 remaining worker-side concurrency runners | P2 | Med | Low | S | Migrated `anchorRuntime.js` and `slugSearchRuntime.js` onto the shared `utils/concurrency.js`, deleting 2 local implementations. Required making the shared helper accept any iterable: `pendingMd` is a `Set`, and the helper previously returned `[]` for non-Arrays, which silently dropped all probe work (caught by `tests/worker/anchorRuntime.test.js`). |
| P1 | ✅ | Consolidate the worker concurrency runners onto the shared helper | P2 | High | Low | S | **`PowerBulkhead` rejected as the wrong primitive** — it partitions work into isolated lanes and returns per-task results, whereas both workers need a fire-and-forget bounded map. Migrated to the existing `utils/concurrency.js` instead. |
| P2 | ⏰ | Replace CDN breaker with `PowerCircuit` | P2 | High | Med | M | **Deferred — genuine fit, but a behavior change needing sign-off.** Unlike P3/P4/P5/P7, `PowerCircuit` *is* the right primitive: a real circuit breaker with threshold, timeout, half-open trial, and exponential backoff. The hand-rolled version in `codeblocksManager.js` (~55 lines, per-host `Map`) is not broken and its internals are not pinned by tests. Substituting would change two observable behaviors: the reset window goes from a fixed 5 minutes to exponential backoff with jitter, and success goes from "delete the entry entirely" to a half-open to closed state transition. Both are defensible improvements, but neither is a pure refactor. Worth doing as its own change with the timing deltas called out. |
| P3 | ❌ | Replace render mutex with `PowerLatch` | P2 | — | — | — | **Rejected — wrong primitive.** Investigated both candidates. `PowerLatch` is a counting barrier (resolves waiters when a count hits zero), not a mutex. `PowerSemaphore(1)` is a mutex but it **queues** rather than **coalesces**: verified empirically that with a route change mid-render, the semaphore renders `["A","B"]` — re-rendering the *stale* route — while the hand-rolled code renders `["A"]` then re-renders with the *fresh* route. `tests/ui.extra.test.js` pins this via `fetchCount === 2`. Substituting either would be a behavioral regression, not a refactor. |
| P4 | ❌ | Replace `utils/events.js` throttling with `PowerObserver` | P2 | — | — | — | **Rejected — wrong primitive, and no correct one exists in the library.** `PowerObserver` is a reactive value store (subscribers fire synchronously on value change), not a timing utility. Checked the alternatives: `PowerThrottle` is a token-bucket rate limiter that decides *whether* to allow an event, not *when* to coalesce one; `PowerScheduler` coalesces into a microtask/macrotask, whereas all three helpers here need **requestAnimationFrame** specifically so DOM writes align with the frame. `debounce` also needs leading/trailing edge options that no helper provides. The hand-rolled implementations are correct and minimal; replacing them would change timing semantics. |
| P5 | ❌ | Replace percentile math with `PowerHistogram` | P3 | — | — | — | **Rejected — wrong tool for this use case.** `PowerHistogram` is a DDSketch giving *approximate* percentiles with a relative-error bound, designed for unbounded value ranges. `performanceDiagnostics.js` keeps at most 50 entries (`MAX_ENTRIES`) and sorts the actual durations, so its percentiles are already **exact** and O(n log n) on n≤50 — cheaper and more accurate than a sketch. It also needs `interactionCount` and `max`, which the histogram does not provide, so the entries array would have to be kept anyway. Substituting would trade exactness for approximation with no benefit. |
| P6 | ❌ | Replace 3 `autoScale` objects with `PowerServo` | P3 | — | — | — | **Rejected — wrong primitive.** The three `autoScale` objects (`slugAutoScaleOptions`, `rendererAutoScaleOptions`, `anchorAutoScaleOptions`) are **PowerPool configuration**, not a hand-rolled controller. PowerPool has its own built-in `autoScale` option with its own shape (`{enabled, intervalMs, targetMs, alpha, cooldownMs, hysteresis}` — see `powerPool.js:579`). `PowerServo` is a closed-loop PI controller requiring the caller to supply both the measurement and the setpoint. Substituting it would replace declarative pool config with an imperative controller the pool does not consume. |
| P7 | ❌ | Use `PowerMessageCodec.encodeMessage` for outbound worker messages | P3 | — | — | — | **Not actionable — already handled, and changing it is risky.** `PowerPool` imports and uses `encodeMessage`/`encodeNativeEnvelope` internally (`powerPool.js:30,34,1000,2035`), so every message the main thread sends is already encoded. The only unencoded messages are the workers' direct `postMessage({correlationId, response})` replies, which `decodeInbound` handles via its legacy branch — correct today. The library explicitly warns against re-encoding: "A native envelope is *already* in wire form. Re-encoding it to JSON bytes would post a bare body that reads as a legacy message... a silent failure with no error anywhere, which is the worst shape a protocol bug can take." Changing the worker reply format would risk exactly that. |
| P8 | ⏰ | Adopt `MetricsCollector` / `formatPrometheus` | P3 | Med | Med | M | **Deferred — a feature, not a fix.** Both helpers exist in the library and `incrementCounter` is called from 14 sites. Routing them through a collector would enable Prometheus export, but it changes the debug output format that hosts may already parse, and it is additive capability rather than a defect fix. Better done as its own change with a migration note. |
| M1 | ✅ | Gate `window.__nimbi*` writes on the runtime generation | P1 | High | Med | M | Created `utils/runtimeGlobals.js` with `claimGeneration`/`releaseGeneration`/`setIfCurrent`/`setIfLive`/`isGenerationLive`/`clearAllGlobals` over 22 managed globals. Wired `init.js`, `slugManager.js`, `ui.js`, and `runtimeSitemap.js`. 23 unit tests including an end-to-end teardown-race suite. |
| M2 | ❌ | Tie `router` purge-timer lifetime to a runtime | P2 | — | — | — | **Not actionable — already correct.** My original finding claimed the timer was created at module import. Verified: there is no module-scope `setInterval` in `router.js`. The timer is created lazily by `setResolutionCacheTtl()`, which `initCMS` calls only when `cacheTtlMinutes` is configured, and `destroy()` already clears it via `disposeResolutionCachePurge()`. |
| M3 | ✅ | Release `imagePreview` modal and `codeblocksManager` observer on destroy | P2 | Med | Low | S | Added `disposeCodeblocksObserver()` (the observer unobserves on intersect, but a block never scrolled into view before teardown stayed observed, retaining a detached node) and `disposeImagePreview()`. Both wired into `destroy()`. The modal already self-cleaned its reference when detached, so that half was defensive. |
| M4 | ✅ | Bound `fetchCache` / `_preparedPageCache` retention | P2 | Med | Low | S | `fetchCache` and `negativeFetchCache` reduced from `maxEntries: 2000` to 500 (~4x; ~100MB to ~25MB at 50KB/page); `_preparedPageCache` from 12 to 6 cloned DOM subtrees (2x). Chose entry-count over a byte budget because PowerCache's `weightFn` runs at `set()` time when the stored value is still a Promise, so body size is unknowable. 500 is safe because crawl/indexing passes keep bodies in their own `discoveryMd` map, so eviction never forces a re-fetch. |
| M1d | ✅ | Add a permissive guard variant for host-driven callers | P1 | High | Low | S | `setIfCurrent`/`isCurrentGeneration` reject a `null` generation, which broke sitemap/feed generators invoked directly by hosts and tests with no `initCMS` runtime. Added `setIfLive`/`isGenerationLive`, which only block a *superseded* generation. Caught by 3 failing sitemap tests. |
| M1e | ✅ | Document the strict/permissive guard choice at every call site | P2 | High | Low | S | Added a decision table to the module JSDoc plus a comment at all 8 call sites across `init.js`, `slugManager.js`, `ui.js`, and `runtimeSitemap.js` explaining which variant was chosen and why. |
| R1 | ✅ | Fix O(n²) `taken` Set rebuild in `buildSearchIndex` | P1 | High | Med | M | Hoisted to a single `takenSlugs` Set built once before the loop, maintained incrementally via `takenSlugs.add(cand)`. Applied to all 3 per-page rebuild sites. **Measured: 1,924x faster at n=5,000** (2,593ms to 1.3ms) with byte-identical output. |
| R2 | ✅ | Eliminate double page fetch in `buildSearchIndex` | P1 | High | Med | M | Added a `discoveryMd` Map capturing each body during link discovery; the indexing pass reuses it. **Measured: exactly 50% fewer fetches** at every size (10,000 to 5,000 at n=5,000). |
| R3 | ✅ | Memoize the `ensureSlug` / `crawlForSlug` filename scan | P2 | High | Low | S | Added `getFilenameSlugIndex()`, a lazily-built Map of slugified filenames to paths, invalidated by `allMarkdownPathsSet.size`. **Measured: 66,143x faster at n=5,000** across 50 navigations (86.2s to 1.3ms). |
| R4 | ➖ | Replace linear anchor fallback with a cached suffix index | P2 | — | — | — | **Resolved by deletion.** Implemented, then measured with a realistic access pattern (50 anchors per render, index built once per render): **0.06x at n=5,000** — 108ms vs 6.3ms. The index stores 2 suffixes per mapping, so build cost dwarfs the scan it replaces. Reverted; the original scan is faster at every tested size. |
| R5 | ➖ | Index `resolveEntryTarget` lookups in `nav.js` | P2 | — | — | — | **Resolved by deletion.** Depended on the R4 suffix index. Measured with 20 search results: **0.0x at n>=1,000** — the index build (3-9ms) costs more than the entire scan (0.05ms). Reverted to the original `entries()` scan, with a comment recording why the scan is deliberate. |
| R6 | ❌ | Precompute `runtimeSitemap._isKnownPath` set | P3 | — | — | — | **Rejected after implementation.** A cached normalized-key Set broke `tests/runtimeSitemap.crawlFetchFallback.test.js`. Root cause: `mdToSlug` has no `_nimbiVersion` token (only `slugToMd` does), and callers — including tests — clear or populate `mdToSlug` directly without touching `slugToMd`, so no available signal reliably invalidates the cache. Size-based keying also failed. Reverted. |
| R7 | ➖ | Add an early cache probe to `fetchMarkdown` | P2 | — | — | — | **Resolved by deletion — the probe was dead code.** The verification test proved the probe could never hit: `fetchCache` is keyed on the **resolved absolute URL** while the probe keyed on the **raw relative path**. Removed. The original single cache lookup after normalization is correct and already effective. |
| Q1 | ✅ | Add `no-silent-catch` lint rule, enforced globally as an error | P1 | High | Med | M | Rule flags catches that neither log, rethrow, return a fallback, capture the error, propagate it, nor carry an explanatory comment. **All 114 violations across 17 files fixed; 0 remaining.** Rule has 25 unit tests. |
| Q2 | ✅ | Remove duplicate stacked JSDoc blocks | P3 | Low | None | S | Collapsed stacked `/** ... */` blocks (keeping the last, which is the one the doc generator binds to the symbol): 6 in `slugManager.js`, 5 in `htmlBuilder.js`, 2 in `helpers.js`, 2 in `init.js`. Spot-checked `isExternalLink`, `unescapeMarkdown`, `resolveSlugPath` — each now has exactly one block. All type gates still pass. |
| Q3 | ✅ | Clean `init.js` empty try block and `var contentBase` scoping | P3 | Low | Low | S | Removed the empty `try {} catch (e) { debugWarn(...) }` at line 850 (replaced with an explanatory comment). Converted four `var contentBase` declarations inside nested `try` blocks to a single `let contentBase` — the `var`s leaked to function scope, so any later assignment in `initCMS` could silently change the content base. All 22 init tests pass. |
| Q4 | ✅ | Audit dead exports | P3 | Low | Low | S | **My three original candidates were all wrong** — verified individually: `safeGet` is asserted directly in tests; `_allMd` is read in `setContentBase`; `crawlForSlug` is a live export. Cross-checked against knip's 33 flagged exports: all are either used internally, part of the public `.d.ts` surface, or intentional test seams. **Removed:** `writeRewrittenRenderer` and `removeTempModule` from `tests/helpers/rendererModule.js`. **Kept:** `clearSlugifyCache` (public API). |
| Q5 | ✅ | Run circular-import detection | P2 | Med | None | S | Ran `scripts/find-circular-imports.cjs`. It reports one cycle, but this is a **false positive**: `slugState.js` is a 42-line leaf module with zero imports. No real cycles exist. |
| Q6 | ✅ | Run `knip` for dead code | P2 | Med | None | S | Found 39 unused files, 36 unused exports, 9 duplicate exports, 2 unused devDeps, 4 unlisted deps. **Acted on:** removed 6 redundant `export default` statements from the new util modules. **Deliberately not acted on:** `src/lib/index.js` is the documented `nimbi-cms/lib` public entry; `src/gen-dts-sample.js` looked dead but `tests/genDts.test.js` asserts on its output. |
| X1 | 🟡 | Speed up search filtering | P1 | Med | Low | S | **Partially done — the full inverted index was deliberately not built.** The search does *substring* matching (`includes`), so a token/prefix inverted index would change semantics: "ell" would stop matching "hello". An n-gram index preserves substring matching but costs ~3x memory and has a 3-char minimum. Instead implemented the safe constant-factor win: `normalizeSearchIndexEntriesMut` now caches `_titleLc`/`_excerptLc` at index-build time, and the filter uses them via a new `searchEntryMatches` helper. This removes two string allocations per field per entry per keystroke from the hot path with **zero semantic change**. 5 new tests. A true inverted index remains worthwhile only if search moves to prefix/token semantics. |
| X2 | ❌ | Speculation Rules prefetch for nav targets | P2 | — | — | — | **Not applicable to this architecture.** The Speculation Rules API prefetches *navigations* — whole documents at a URL. nimbiCMS is a client-side CMS whose primary content path is `fetchMarkdown()` (an XHR for Markdown source), with an absolute-HTML fallback only for unknown routes. A `?page=slug` URL resolves to the same already-loaded `index.html`, so a speculation-rules prefetch would fetch a document the app never reads. The X5 `pointerdown` prefetch already covers the real need, and it targets the correct resource. |
| X3 | ✅ | View Transitions for route changes | P2 | High | Low | S | `runRenderWithTransition` now prefers `document.startViewTransition`, which snapshots old/new state and cross-fades on the compositor — smoother than the CSS opacity transition and independent of the `is-inactive` class being removed on the next frame. Falls back to the existing class-based path when the API is absent. Rejecting `ready`/`finished` promises (a skipped transition) are swallowed, since that is normal. Added `::view-transition-old/new(root)` CSS gated on `prefers-reduced-motion: no-preference`. 4 new tests cover the native path, the fallback, rejection handling, and single-render-per-navigation. |
| X4 | ✅ | `content-visibility: auto` for long articles | P2 | Med | Low | S | The property was already present on `.nimbi-article` but paired with **`contain-intrinsic-sizing`, which is not a valid CSS property** — so it had no intrinsic-size fallback and scrollbar behaviour was unstable. Corrected to `contain-intrinsic-size: auto 1000px`. |
| X5 | ✅ | `pointerdown`-triggered prefetch (INP) | P2 | High | Low | S | Delegated `pointerdown` listener prefetches the target page's markdown via the existing `fetchMarkdown` cache, starting the fetch ~100-200ms before `click`. Skips external and anchor-only links; aborts on `pointercancel`/`pointerup`-off-link. **Fixed a dead handler:** the original used `pointerleave`, which does not bubble, so the delegated `document` listener never received it — one of three cancellation paths was inert. Switched to `pointerout` with a `relatedTarget` check so moving between children inside the same link does not cancel. 9 tests, including one that documents the non-bubbling behaviour to prevent regression. |
| X6 | ⏰ | OPFS-backed content cache | P3 | Med | High | L | **Deferred — high effort, high risk, unproven need.** Would add offline/bfcache resilience, but introduces a new persistence layer with its own eviction, quota, and corruption-failure modes. The existing `fetchCache` (now bounded at 500 entries with a 60s TTL) already covers the common revisit case. Worth revisiting only if there is a concrete offline requirement. |
| X7 | ✅ | Time-budgeted yielding in `utils/idle.js` | P3 | Med | Low | S | `scheduler.yield()` was already the first choice in `yieldToEventLoop`, so the real gap was the **fixed iteration threshold**. The 9 call sites used thresholds from 8 to 128 — a poor proxy, since a loop of cheap string work yields far more often than needed while a loop doing per-iteration I/O can block for seconds. Added `createYieldGate(budgetMs)`, which yields once per 16ms of *elapsed time*, and migrated all 9 call sites in `slugManager.js` and `runtimeSitemap.js`, removing 8 now-dead counter variables. `yieldIfNeeded` is retained as a public export (it appears in the generated `.d.ts`) but is no longer used internally. 11 new tests. |
| DX1 | ✅ | Add `src/index.test-d.ts` so `npm run type-test` passes | P2 | High | Low | M | The script was failing because the file did not exist. Wrote a real suite (30 assertions incl. 6 negative `@ts-expect-error` cases). **Writing it surfaced 4 real defects in the generated `.d.ts` that `check-dts` cannot catch, because it runs with `--skipLibCheck`.** See DX6. |
| DX2 | ❌ | Fix `benchmark` script path | P3 | — | — | — | **Not actionable — the AGENTS.md note is stale.** `package.json` points `benchmark` at `benchmark:lighthouse`, which resolves to `benchmarks/benchmark-lighthouse.js` — a real, working script. It does not reference the deleted `scripts/benchmark-cdp.js`. It is merely slow: it hits a deployed URL with 4 retry attempts and 3-minute timeouts. |
| DX3 | ✅ | Extract shared `renderer.js` rewrite helper for tests | P1 | High | Low | S | Created `tests/helpers/rendererModule.js` with `readRewrittenRendererSource()`. Migrated all 5 test files that duplicated the rewrite. Takes a `depth` option because temp files live at different directory depths, and a `cacheBust` option for the one test needing a fresh module registry entry. |
| DX4 | ❌ | Speed up the test suite via pool/isolation/environment changes | P2 | — | — | — | **Rejected after measurement.** Baseline 971 passed in ~35s. `pool: 'vmThreads'`: ~12s but **62 tests fail across 24 files**. `isolate: false`: ~21s but **51 tests fail across 29 files**. Both break isolation because the suite relies on per-test state with `clearMocks: false`. **Also attempted and abandoned:** `environmentMatchGlobs` to scope jsdom to the 129 of 299 files (43%) that touch `document`/`window` — that option was **removed in Vitest 5** and silently does nothing (176 files failed with `document is not defined` before I noticed). The Vitest 5 replacement is `test.projects`, but partitioning cleanly requires either a `// @vitest-environment jsdom` docblock on 129 files or a glob that accurately separates them, neither of which is maintainable. Config left unchanged. |
| DX6 | ✅ | Fix 4 invalid-TypeScript defects in the generated `.d.ts` | P2 | High | Low | S | Found by DX1. `check-dts` uses `--skipLibCheck`, so it never validated the generated file. Fixed bare `Array`, an unemitted `SitemapJson` typedef reference, undeclared `@template` params, and an `any`-typed `normalizePath`. |
| DX7 | ✅ | Drop `--skipLibCheck` from `check-dts` | P2 | High | Low | S | The flag made the type gate blind to the generated file. Removed it; `check-dts` passes clean. **Verified the guard works:** reintroducing `@returns {Promise<Array>}` makes `check-dts` exit 2. |
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
