# nimbiCMS — Deep Engineering Audit (Glyph Cluster)

**Date:** 2026-10-08  
**Scope:** `src/**` (44 modules, ~22,500 LOC), build config, lint config, test suite, `scripts/`, `benchmarks/`, `.gitignore`, `package-lock.json`  
**Exclusions:** `notes.md` (as instructed)  
**Reviewer:** Senior JS/High-Performance Computing expert (Glyph Cluster)  

---

## Executive Summary

This audit builds on the existing deep review in `tmp/review.md` (1838 lines) and confirms:
- **Test suite:** 826/826 tests passing (0 failures)  
- **Lint:** 0 errors, 1,889 warnings  
- **Build:** Success (ESM/CJS/UMD bundles)  
- **Types:** `gen-dts` + `check-dts` pass  
- **Bundle:** 800 KB raw / 244 KB gzip JS, 50 KB gzip CSS, 5–8 inline workers  

The project is in excellent shape with many fixes already applied. Remaining opportunities cluster around: (1) i18n/slugification for non-ASCII, (2) memory retention/leakage from event listeners and caches, (3) O(n×m)/O(n²) hot-path performance, (4) worker bundle duplication, (5) robustness (runtime external deps, dynamic imports), and (6) fuller adoption of `performance-helpers@2.0.0` features.

---

## 1. Potential Bugs & Their Fixes

### B1. Divergent `slugify` implementations cause heading anchor mismatches
- **Locations:** `src/slugManager.js` (canonical, memoized, truncates to 80, strips `md`/`html` suffix), `src/markdown.js` (4× inline copies, no truncation, no suffix strip), `src/slugSearchRuntime.js` (1 copy, no trim).  
- **Evidence:** `foo.md` → slugManager gives `foo`, markdown gives `foomd`. Long headings and non-ASCII differ.  
- **Impact:** Search index (uses slugManager) and DOM heading IDs (use markdown copies) can diverge; broken deep links.  
- **Fix:** Unify on canonical `slugManager.slugify`; export/import it in markdown and slugSearchRuntime. Remove duplicates. Add tests for suffix stripping and truncation consistency.  
- **Status:** 🟡 Partial (markdown copies replaced by canonical import in recent fixes; `slugSearchRuntime.js` still has its own copy).

### B2. Non-ASCII slugs collapse to empty → degenerate to `HOME_SLUG`
- **Locations:** All slugify copies use `[^a-z0-9]` only.  
- **Evidence:** `日本語のページ` → `""`, `Привет мир` → `""`/`"-"`, `Ünïcödé` → `ncd`, `Über café` → `ber-caf`.  
- **Impact:** For CJK/Cyrillic/Greek/Arabic sites, every page collapses to `HOME_SLUG`; navigation/search/links break; heading IDs become empty/duplicate.  
- **Fix:** Unicode normalization (`NFKD`), strip combining marks (Mn), transliterate common Latin ligatures/diacritics, fallback to short stable hash (e.g. FNV-1a/base36) when result is empty; use `Intl.Segmenter` for boundary-aware truncation.  
- **Priority:** P0 (correctness/i18n).

### B3. Nav search outside-click handler cannot be removed (shadowing)
- **Location:** `src/nav.js:237` declares `let searchOutsideHandler = null;` but `:1707` declares `const searchOutsideHandler = …` inside block (shadows).  
- **Impact:** `removeEventListener` never possible; document listeners accumulate across `createNav()` calls. Also duplicate `input` listener existed (fixed).  
- **Fix:** Assign to outer variable, not const-shadow; track handler references on the nav instance for teardown.  
- **Status:** 🟡 Partial (duplicate input listener removed; shadowing remains).

### B4. Duplicate/misaligned slug resolution in search/index paths
- **Locations:** `nav.findSlugForPath` does full scan of `slugToMd` entries; `htmlBuilder` does similar scans. But `mdToSlug` (path→slug) exists and is maintained.  
- **Impact:** O(index × slugs) scans; correctness risk if maps diverge.  
- **Fix:** Prefer `mdToSlug.get(path)` with fallbacks to `.md`/`.html`; remove full-entry scans where possible.  
- **Status:** ⬜ Not started.

### B5. Minor robustness in markdown fallback paths
- **Note:** Recent fixes replaced worker-unavailable throw with synchronous hljs fallback in fenced code path. Anchor worker still imports `slugManager` (see bundle duplication) creating tight coupling.  
- **Fix:** Decouple anchor worker core (no slugManager) so fallback behavior doesn’t pull heavy deps.  
- **Status:** ⬜ Not started.

---

## 2. Potential Performance Improvements

| Issue | Hot path | Cost | Fix | Priority |
|---|---|---|---|---|
| P1. `Array.shift()` in crawl/fetch queues | `slugManager.js:1726,1751`; `slugSearchRuntime.js:104,127` | O(n) per shift → O(n²) under load (crawlMaxQueue up to 1000+) | Head index: `let head=0; const item=arr[head++]; if(head>arr.length/2) arr=arr.slice(head); head=0;` or ring buffer. | P1 |
| P2. H2/H3 excerpt extraction slices entire remainder repeatedly | `slugManager.js:1896–1908,2118` | O(n²) string copies/scans on large docs | Compute offsets from single regex pass; slice between offsets once; or strip tags once to parallel text buffer. | P1 |
| P3. O(n×m) scans over `slugToMd` | `htmlBuilder._resolveSlugForWorkerPath`, `getSlugForRelativePath`, `preScanHtmlSlugs`; `nav.findSlugForPath`, `resolveEntryTarget` | Linear-in-product; 10^6 iterations per large article render in worst case | Use `mdToSlug` (path→slug) O(1). Build/memoize per `indexVersion`. | P1 |
| P4. Double HTML parse for `isHtml` pages | `htmlBuilder.js:1855–1876` | Two parses + full serialize | Reuse parsed `doc` or pass `data.html` unchanged; avoid re-parsing. | P2 |
| P5. Forced layout via `getBoundingClientRect()` in loops | `utils/helpers.js:253–254` (eager images) | Synchronous reflows (100 images → 100 layouts) | Read all rects first (batch), then write attributes; or rely on IntersectionObserver. | P2 |
| P6. Search does full index scan per keystroke + duplicated rendering | `nav.js:597–605`, rendering duplicated (~80 lines) | O(index×fields) per keystroke | Debounce (exists) + tokenization/prefix index; extract shared `showResults` helper. Consider MiniSearch/FlexSearch with build-time serialized index (SOTA). | P2 |
| P7. `buildSearchIndex` may do full crawl even when candidates exist; discovery sequential | `slugManager.js:1714`, `router.js:600–626` | Many sequential 404s/network trips on cold slug | Skip crawl if `indexPaths` yield candidates; parallelize with `PowerSemaphore`; early exit on first hit; make crawl opt-in or build-time. | P2 |
| P8. Per-render favicon encoding + duplicate links | `seoManager.js:95–121`, `setFaviconHref` appends without upsert | Re-encodes 4KB RGBA per render; head accumulates links | Module-level memoized data URI; upsert existing `<link rel="icon">` (match rel/type). | P3 |
| P9. Repeated `querySelector` scans in SEO path | `seoManager.js` (upsertMeta/setTag/getSiteNameFromMeta/upsertLink/JSON-LD) | ~12 full-doc queries per render | Cache by selector key in module Map; invalidate on DOM changes only if needed. | P3 |
| P10. Image zoom does many CSS writes per wheel event (unbatched) | `imagePreview.js:462–507` | Jank on trackpad flicks | Batch via `rafThrottle` or `scheduleDOMWrite` (already available). | P3 |

**Notes:** P6 with build-time index is a meaningful SOTA improvement for large content sets (faster startup, smaller runtime work, offline-capable prebuilt index).

---

## 3. Potential Memory Leaks, Retention

| ID | Location | Issue | Impact | Fix | Priority |
|---|---|---|---|---|---|
| L1 | `htmlBuilder.js:2808–2838` (`ensureScrollTopButton`) | When no `topH1`, `root.addEventListener("scroll", rafThrottle(onScroll))` runs on **every** render; listener never removed. Also non-passive in effect; closes over stale nodes. | Unbounded listener accumulation per page render (no-H1 pages); retains detached DOM subtrees (stale `tocLabel`, `lastBtn`). | Store handler on button (`btn._nimbiScroll`); `removeEventListener` before re-adding; use `{ passive: true }`; attach once per button instance; prefer observer path when possible. | P0 |
| L2 | `bulmaManager.js:40–63` (`injectLink` MutationObserver) | Observer on `document.head` never `disconnect()`ed; fights cascade by moving nodes up to 1000 times; retains link node. | Retention + layout thrashing; leaves stylesheet in wrong position after cap with no diagnostic. | Replace with `adoptedStyleSheets`, CSS layers, or explicit ordering; if observer must remain, add `disconnect()` on teardown/unmount and idempotent guard. | P1 |
| L3 | `slugManager.js:2670` (`crawlCache`) | Unbounded `Map` with one entry per decoded slug probed **including misses**; no TTL/size cap. | Grows over long crawl sessions; retains keys/values indefinitely. | Add maxEntries + TTL (PowerCache/PowerTTLMap) with eviction policy; track misses separately with short TTL. | P1 |
| L4 | `utils/textMetrics.js` | Cache keyed by entire document text (`length:hash` added recently but verify semantics); FIFO eviction can miss empty-string key edge cases; retains full bodies as keys/refs. | Retains up to N page bodies; memory pressure grows with session length. | Migrate to `PowerCache` (SLRU) with bounded size in bytes/entries; avoid storing full text as key unnecessarily; add telemetry/eviction logging in dev. | P1 |
| L5 | `ui.js:84–85` (`_preparedPageCache`) | Caches 12 full `article.cloneNode(true)` DOM trees. | Retains 12 cloned DOM subtrees (heavy). | Ensure clones don’t retain listeners; consider WeakRef? Or reduce size; add clear on destroy/navigation away. | P2 |
| L6 | `slugManager.fetchCache`, `importCache` | Documented unbounded in content mode; need verification of caps/TTL. | Retention under heavy fetch. | Enforce caps via PowerCache (SLRU) already used in importCache; add explicit bounds for fetchCache. | P2 |
| L7 | `nav.js` (document-level listeners: `input`, `click`, `touchstart`) | Listeners never removable due to shadowed `searchOutsideHandler`; `createNav()` leaves them behind. | Accumulates across re-inits; leaks nav instance refs via closures. | Teardown API per nav instance; track listener tokens; fix shadowing; remove on destroy. | P0 |
| L8 | `ui.js:410–473` (window listeners: `popstate`, `hashchange`, `pageshow`, `pagehide`) | Registered per `createUI()` with no removal. `initCMS()` called twice doubles them. | Leaks entire mount tree (closures capture DOM refs). | AbortController per UI instance; `{ signal }` to `addEventListener`; return `{ destroy() }`. Also makes `setLang()` re-init path safe. | P0 |
| L9 | `markdown.js` `scheduleDOMWrite` closures | Retain article refs until next frame; if navigation away mid-stream, queued fns keep refs. | Transient retention; can compound with rapid nav. | Cancel pending batch on teardown; track cancellation tokens; clear queue on destroy. | P2 |
| L10 | `codeblocksManager.__hlObserver` | Pending entries retain detached `el` refs if page torn down during observe work. | Minor retention; can grow if frequent re-renders. | Unobserve on element removal; disconnect observer on teardown; prune pending set. | P2 |

**Verification:** Add leak-focused tests (repeated `initCMS()` + nav + render cycles) or use heap snapshots in dev; ensure `destroy()` paths actually drop refs.

---

## 4. Use of `performance-helpers@2.0.0` Beyond Current Use

Current usage: PowerCache/PowerMemoizer (slugManager, helpers, importCache), PowerDeadline (slugManager), PowerRetry (slugManager), PowerPool (markdown, slugManager), PowerSemaphore (slugManager concurrency), PowerLogger (debug), PowerTTLMap (importCache). Worker migration to v2 noted as complete.

### 4.1 High-value v2 features to adopt

| Feature | Helper | Applicability | Implementation | Priority | ROI | Risk |
|---|---|---|---|---|---|---|
| `maxQueueLength` | PowerPool | **Yes** | Already configured in renderer/slug pools (100). Verify behavior under backpressure (reject vs wait). | P2 | Med | Low |
| `drain({ timeout, maxDrainWaiters })` | PowerPool | **Yes** | Improve teardown (teardownRendererWorkerPool/teardownSlugWorkerPool) with timeout + graceful drain before terminate. | P1 | High | Low |
| `messageCodec: 'negotiated'` | PowerPool | **Yes** (after migration) | Already set. Ensure worker entrypoints negotiate correctly; add telemetry if needed. | P2 | Med | Low |
| `encodeNativeEnvelope` | PowerMessageCodec | **Yes** (after migration) | Avoid double-clone on native posts; relevant if moving heavy payloads. | P3 | Med | Low |
| `dispose()` / `[Symbol.dispose]` / `[Symbol.asyncDispose]` | Resource classes (Pool/Cache/Semaphore/etc.) | **Yes** | Add deterministic cleanup in teardown paths; use `using`/explicit dispose where possible. | P1 | High | Low |
| `AbortSignal` on `acquire` | PowerSemaphore | **Yes** | `runWithConcurrency` already forwards signal; also allow per-acquire cancellation on teardown/shutdown. | P1 | High | Low |
| `policy: 'slru'` | PowerCache | **Yes** | Applied to importCache. Consider applying to fetchCache, crawlCache (see L3,L6). | P1 | High | Low |
| `invalidate(predicate)`, `evict(count)` | PowerCache | **Low/Deferred** | Useful for targeted invalidation (contentBase change, lang change) beyond `clear()`. | P3 | Med | Low |
| `stats().staleServes`, `maxInflightRefreshes`, `allowStale`/`getOrFetch`/`fetchMethod`, `staleTtl`, `seed` (TinyLFU) | PowerCache | **Deferred** | Only if we add stale-while-revalidate for imports/fetch; no measured need yet. | P4 | Low | Low |
| `hasEqual` width budget / `compareFn` | PowerCache | **Low** | Better equality for complex keys if introduced later. | P4 | Low | Low |
| `encodeCacheLimit` / `encodeCacheByteLimit` | PowerPool | **Low** | Bound worker encode cache memory; observability. | P3 | Med | Low |
| `pool:idle` event, `idleReapingActive` | PowerPool | **Low** | Observability/telemetry for pool behavior. | P3 | Low | Low |
| `utilizationSince(previous)`, `blockedMs`, `droppedSamples`, `coverage` | PowerEventLoopMonitor | **Deferred** | Need measured event-loop saturation to justify feeding into autoscale. | P4 | Low | Med |
| `hedgeDelay`, `PowerRetryBudget` | PowerRetry | **Rejected/Deferred** | Hedging can duplicate HTTP traffic (amplify origin load). No measured retry storm; single-flight + negative cache + concurrency caps suffice. | ❌/P4 | Low | Med (traffic amplification) |
| `tryReserve()`, exact `retryAfter(n)` | PowerGCRA | **Deferred** | Only if origin-rate limiting observed or adding per-origin policy. | P4 | Low | Med |

### 4.2 New v2 helpers not applicable (keep as-is)
PowerCron, PowerCrossLock (no shared worker-side state), PowerRealtimeHub/WebSocketClient/SocketAdapter/RTCChannel (no realtime sockets), PowerServo (no control theory), PowerObserver derived observables (not used), PowerEventBus async error handling (not used), PowerScheduler/postTask/yield (not used), PowerChunker (not used), PowerQueue shrink/fill (not used), PowerBulkhead/Circuit/RateLimit/PermitGate/Throttle/SlidingWindow (not directly needed with current model).

### 4.3 Concrete actions for v2 adoption
1. **Teardown hardening:** Update `teardownRendererWorkerPool()`/`teardownSlugWorkerPool()` to prefer `asyncDispose()` if available, else `drain({timeout})` then `terminate()`; add `dispose()` calls on any resource instances we own.
2. **Semaphore lifecycle:** Ensure all `PowerSemaphore.run()` calls can be cancelled on destroy (AbortSignal) — `runWithConcurrency` already does; extend to any ad-hoc semaphore uses.
3. **Cache policy expansion:** Apply `policy: 'slru'` + explicit `maxEntries`/TTL to `crawlCache` and `fetchCache` (with different TTLs for hits vs misses).  
4. **Observability hooks (dev-only):** Expose pool stats via `getWorkerPoolDiagnostics()` (exists) and optionally log on drain/dispose in dev builds.  
5. **Message codec verification:** Add a smoke test path or debug log (dev-only) confirming negotiated codec is active; avoid forcing legacy codec.

---

## 5. Robustness Improvements

| Item | Location | Issue | Fix | Priority | Risk |
|---|---|---|---|---|---|
| R1. Runtime fetch of `SUPPORTED_LANGUAGES.md` from raw.githubusercontent.com | `src/codeblocksManager.js:60,322–381` | Blocks first codeblock render on external fetch; fails offline/air-gapped; leaks to 3rd party; expands CSP (raw.githubusercontent.com + cdn.jsdelivr.net + unpkg.com). | **Option A (recommended):** Generate `supportedLanguages.json` at build time (scripts/gen-supported-langs.js) from highlight.js package; import as JSON/ES module. Keep runtime fetch behind opt-in flag `hljs.supportedLangsUrl` for advanced users. **Note from tmp/review:** project chose to keep runtime fetch intentionally for "no rebuild needed" — but offline/robustness tradeoff is real. Recommend Option A as default + opt-in override. | P1 | Low |
| R2. Dynamic language imports use `/* @vite-ignore */` with template literal | `src/codeblocksManager.js:347–353` | Bundler told to ignore; runtime `import()` resolves relative to document URL → 404s in browser; always falls back to jsDelivr. | Use `import.meta.glob('../../../node_modules/highlight.js/lib/languages/*.js', { eager:false })` to emit proper code-split chunks; build a map `name→() => import(...)`. Keep jsDelivr fallback only when glob not available (tests/SSR) or behind flag. | P1 | Low |
| R3. Anchor worker imports `slugManager` (heavy transitive deps) | `src/worker/anchorRewriter.js:1–15` | Pulls slug worker factory + PowerPool + caches into worker bundle; nested-worker risk; fetchMarkdown fallback useless in worker (per-worker cold cache). | Extract `src/worker/anchorCore.js` with only helpers/urlHelper/debug; worker consumes snapshot only; remove `fetchMarkdown` fallback from worker path (let main thread resolve). Reduces bundle duplication and memory. | P1 | Med |
| R4. `initCMS()` not idempotent; no teardown | `src/init.js`, `src/ui.js` | Calling twice doubles global listeners (window/nav), leaks mount tree, breaks `setLang()` re-init semantics. | Add idempotence guard (track mounted instance); provide `destroy()` returning cleanup (AbortController abort, disconnect observers, remove listeners, clear caches/timers, teardown worker pools). Update `setLang()` to use safe re-render path. | P0 | Med |
| R5. Potential XSS/parser edge cases in embedded scripts | `src/htmlBuilder.js:executeEmbeddedScripts` | Has whitelist in recent fixes (M-26); verify against all cases (data: with weird MIME, svg script, etc.). Add regression tests. | Expand tests for edge cases; consider sandboxing strategy; document security model. | P2 | Low |
| R6. `addResourceHints`/preload paths | `src/utils/helpers.js` (M-50) | Verify URLs are safe (no user-controlled unvalidated hrefs leading to tracker injection in hints)? Hints are speculative; low risk. | Ensure only trusted contentBase-derived URLs passed; add allowlist if user can inject. | P3 | Low |
| R7. Worker error handling | `src/worker-manager.js` (M-32 added error listener on createWorkerFromRaw) | Verify all worker creation paths covered (PowerPool-created workers vs raw). | Audit all worker types (slug, renderer, anchor if any raw) have 'error'/'messageerror' handling + fallback paths logged. | P2 | Low |

**Note R1:** Recommend generating supported languages at build time as the default (offline-first, CSP-tight, deterministic). Keep runtime override for the stated "no rebuild needed" use case but document tradeoffs.

---

## 6. Code Quality Improvements

| Item | Location(s) | Issue | Fix | Priority |
|---|---|---|---|---|
| CQ1. Unify slugify (5 copies) | slugManager, markdown (4x), slugSearchRuntime (1x) | Duplication + divergence (B1,B2). | Single source of truth (`slugManager.slugify`); unit tests cover ASCII/non-ASCII, suffixes, truncation, empty→hash fallback. | P0 |
| CQ2. Replace full-scan slug lookups with mdToSlug | htmlBuilder/nav | O(n×m) perf + duplication (P3). | Centralize `resolveSlugForPath(path)` using mdToSlug with fallbacks; remove ad-hoc scans. | P1 |
| CQ3. Extract shared search result rendering | `nav.js` | Duplicated ~80 lines for results rendering (P6). | Factor into `renderSearchResults(container, matches, handlers)`; call from both code paths. | P2 |
| CQ4. Avoid `queue.shift()` everywhere | slugManager, slugSearchRuntime | O(n²) (P1). | Head-index queue helper or ring buffer; update call sites. | P1 |
| CQ5. Single-pass excerpt extraction | slugManager | O(n²) (P2). | Offset-based slicing from single pass; add tests for edge cases (no H2, nested, HTML entities). | P1 |
| CQ6. Remove dead/commented code & clarify TODOs | Various | Minor cruft (many fixes already removed dead). | Run eslint with `no-unused-vars` strictness (warnings exist) and prune obvious dead paths; convert TODOs to tracked tasks. | P3 |
| CQ7. Strengthen types in JSDoc | src/jsdoc-typedefs.js + modules | Generated `index.d.ts` exists; some internal types implicit. | Add precise types for cache entries, pool stats, nav state; regenerate d.ts. | P3 |
| CQ8. Consistent error messages | slugManager/router/markdown | Mix of messages ("failed to fetch md", timeouts). | Centralize error taxonomy; include codes for programmatic handling. | P3 |
| CQ9. Avoid eager string concatenation in debug hot paths | nav.js (M-65 fixed) | Verify no other cases. | Grep for `debug*(` with concatenation in loops; use template args or lazy formatters. | P3 |

---

## 7. Ergonomics, Developer Experience (DX), UX, Responsiveness

| Area | Item | Current | Proposed | Priority | ROI |
|---|---|---|---|---|---|
| **DX** | Dev-mode diagnostics | `performanceDiagnostics.js`, `workerPoolDiagnostics.js` exist. | Add dev-only overlay (toggle via `?perf=1` or `window.__nimbiPerf()`) showing pool stats, queue lengths, fallbacks, long tasks, LCP/INP hints. | P2 | High |
| **DX** | Bundle analysis | `build:analyze` exists (rollup-plugin-visualizer). | Document usage; add size budgets in CI (`check:bundle` exists) and fail on >10% regression. | P3 | Med |
| **DX** | Repro scripts | benchmarks exist. | Add `scripts/leak-smoke.mjs` (repeated initCMS/render cycles) + simple heap check guidance; add `scripts/slug-bench.mjs`. | P3 | Med |
| **DX** | Config docs | AGENTS.md comprehensive. | Add "Memory/Leak checklist" + "v2 helpers adoption" sections; link to this review. | P3 | Low |
| **Ergonomics** | Destroy API | Missing. | Return `{ destroy() }` from `createUI()`/`initCMS()`; expose `teardown*` as public API or called by destroy. | P0 | High |
| **Ergonomics** | Idempotent init | Not enforced. | Guard against double mount; warn in dev if called twice with same el. | P0 | High |
| **UX** | Search UX | Linear scan; no diacritics/prefix; duplicated rendering. | Add MiniSearch build-time index: BM25, prefix, fuzzy(0.2), diacritic folding; prebuild `search-index.json` at build time; load async. Huge UX win for large sites. | P2 | High |
| **UX** | i18n/lang switch | `setLang()` exists; needs safe re-render without listener leaks. | Fix via destroy/recreate or targeted re-render with cleanup; set `document.documentElement.lang` (M-40 done) + dir if needed. | P0 | High |
| **UX** | Image preview focus trap | M-35/M-29 added focus trap/cleanup. | Verify Tab/Shift+Tab cycles, Escape closes, focus returns to trigger; add ARIA roles if missing. | P2 | Med |
| **UX** | A11y: nav search | M-34/M-36/M-37 added roles/aria. | Add live region for results count (`aria-live="polite"`); ensure roving tabindex or activedescendant updates on keyboard nav. | P2 | Med |
| **Responsiveness** | Eager/above-fold images | `getBoundingClientRect()` loop (P5). | Replace with IntersectionObserver-based eager prefetch/lazy; respect `prefers-reduced-data`? | P2 | Med |
| **Responsiveness** | Worker pool autoscaling | Present (PowerPool autoScale). | Consider feeding EventLoopMonitor.utilizationSince() later if measured saturation; tune thresholds based on device classes. | P4 | Low |
| **Responsiveness** | Long tasks | `performanceDiagnostics` observes longtask/long-animation-frame. | Surface to dev overlay; add yield points in crawl loops (yieldIfNeeded exists) — verify coverage in slugManager crawlBatch. | P2 | Med |
| **Responsiveness** | Scroll handlers | L1 (scroll listener leak). | Make passive, coalesce, remove on teardown; consider IntersectionObserver for scroll-to-top. | P0 | High |

---

## 8. Duplicated/Dead Code, Circular Imports, Potential Refactors

| Item | Type | Location | Issue | Fix | Priority |
|---|---|---|---|---|---|
| RC1. Slugify duplication (5 copies) | Duplication | slugManager, markdown×4, slugSearchRuntime×1 | Source of B1,B2 divergence. | Canonicalize to slugManager.slugify; add tests. | P0 |
| RC2. Search results rendering duplicated | Duplication | `nav.js` (two code paths building same UI) | ~80 lines duplicated (P6). | Extract shared renderer with same classes/ARIA. | P2 |
| RC3. `HTML_PARSER` constant | Dead (removed?) | `htmlBuilder.js` | M-59 says removed. Verify grep returns none. | Confirm removed; no action. | ✅ (done) |
| RC4. `ensureBaseBulma` | Dead | `bulmaManager.js` | M-60 removed. Verify. | Confirm. | ✅ (done) |
| RC5. `marked.setOptions` with removed options | Dead config | `markdown.js` | M-61 removed. | Confirm. | ✅ (done) |
| RC6. `wasPageToken` | Dead | `slugManager.js` | M-62 removed. | Confirm. | ✅ (done) |
| RC7. `anchorRewriter.js` module | Dead (removed?) | `src/worker/anchorRewriter.js` + docs | M-70 says deleted. Verify file absent. | Confirm deletion; ensure no imports remain. | ✅ (done) |
| RC8. Anchor worker pulls slugManager (circular/import coupling) | Circular/import bloat | `anchorRewriter` path → slugManager | Creates transitive deps into worker context; duplicates bundles (R3). | Extract anchorCore (no slugManager). This breaks the import cycle in practice and shrinks worker. | P1 |
| RC9. `slugManager` imports Worker via `?worker&inline` while also being imported by workers | Structural coupling | slugManager ↔ worker paths | Worker bundles include slugManager init code (caches, memoizers, worker factories) — wasteful and can create hidden cycles. | Strict layering: worker core modules must not import slugManager; pass data via postMessage/snapshot only. | P1 |
| RC10. `highlight.js` language glob approach | Refactor (robustness) | codeblocksManager | Fix R2 with static glob; remove runtime URL construction fragility. | Implement import.meta.glob map. | P1 |
| RC11. Queue helpers | Refactor | slugManager/slugSearchRuntime | Replace shift() with head-index; extract reusable `Deque` or small helper. | DRY, perf win. | P1 |
| RC12. Search index building | Refactor | slugManager | Separate crawl vs discovery vs merge; add early exits; make opt-in. Enables build-time index path. | Improves perf + testability. | P2 |

**Circular imports:** Static import cycle detector run earlier showed 0 static cycles. The "circular" concern is more about **runtime bundle inclusion** (slugManager pulled into worker context) than ESM static cycles. Fix by layering (RC8, RC9).

---

## 9. New SOTA Algorithms, Strategies, or Techniques

| Item | Category | Rationale | Implementation | Priority | Effort | ROI |
|---|---|---|---|---|---|---|
| S1. Build-time full-text search (MiniSearch/FlexSearch) | Search (SOTA for static sites) | Current runtime scan per keystroke (P6). Build-time: ship compact index, load instantly, BM25 ranking, prefix+fuzzy, diacritics, field weights. | Add build step: `scripts/build-search-index.mjs` reads all markdown (via existing discovery or fs scan), extracts title/H1/H2/excerpt, slug/path, builds MiniSearch index, serializes to `dist/search-index.json` (or embed small). Runtime loads JSON (or inlined) instead of `buildSearchIndex()` crawling at init. | P1 | Med | High |
| S2. Unicode-aware slugification with transliteration fallback | i18n (modern) | Fix B2 for CJK/Cyrillic/Arabic; use `String.prototype.normalize('NFKD')`, remove Mn, map common diacritics/ligatures, optional `unorm` not needed; fallback to FNV-1a hash. Consider `@sindresorhus/slugify`-style approach but keep no extra dep? Or implement minimal (no new dep). | Implement minimal Unicode slugify (no new runtime dep) with small transliteration tables for Latin/Cyrillic common cases; hash fallback when empty. Add comprehensive tests. | P0 | Med | High |
| S3. Use `Intl.Segmenter` for word counts & truncation | i18n/perf | Current `text.split(/\s+/)` counts CJK as 1 word (breaks reading-time accuracy); segmenter gives grapheme/word boundaries. | In `textMetrics.js`, use `Intl.Segmenter('en', {granularity:'word'})` when available; fallback to split. Also use for boundary-aware slug truncation. | P2 | Low | Med |
| S4. EventLoopMonitor-driven autoscaling (optional) | Perf/infra | PowerPool has latency-based autoscale; v2 adds `utilizationSince()`. Only adopt if measurements show event-loop saturation correlates with bad scale decisions. | Add behind flag; collect baseline metrics first (perfDiagnostics already there). Defer until evidence exists. | P4 | Med | Low |
| S5. Stale-while-revalidate for imports (PowerCache) | Caching | `importCache` uses negative cache + single-flight; v2 allows `allowStale`/`getOrFetch`. Could improve cold navigation if we had refresh strategy. | Evaluate need; no current bottleneck measured. Defer. | P4 | Med | Low |
| S6. Content-visibility/containment hints in CSS | Rendering | Large article DOM can benefit from `content-visibility: auto; contain-intrinsic-size: 800px;` on article sections. | Add CSS in `nimbi-cms-extra.css` for article blocks/toc; test with large pages. Improves offscreen rendering. | P3 | Low | Med |

**Recommendation:** S1 + S2 are highest impact SOTA items. S1 changes architecture (build-time index) but aligns with static-site nature and removes runtime crawl work.

---

## 10. Features Beyond Current Ones

| Feature | Description | Value | Effort | Priority | Notes |
|---|---|---|---|---|---|
| F1. Public `destroy()`/teardown API | Export `destroy()` from main module; `initCMS()` returns `{ instance, destroy() }` or sets global cleanup. | DX/ergonomics; enables safe SPA-like re-inits, hot reload, tests. | Med | P0 | Fixes L7,L8,R4. |
| F2. Build-time search index | Prebuilt `search-index.json` with MiniSearch; runtime loads instead of crawling. | UX perf; offline-first; smaller init work; scales to 10k pages. | Med | P1 | S1. |
| F3. Dev perf overlay | `?debug=perf` shows pool stats, queue, fallbacks, long tasks, heap estimate, render timings. | DX; catches leaks/perf regressions early. | Med | P2 | Uses existing diagnostics. |
| F4. `prefers-reduced-data` / `prefers-reduced-motion` respect | Disable eager image loading, reduce animations, skip some preloads. | UX/accessibility; respects user preferences. | Low | P2 | Easy win. |
| F5. Resource hints policy | Make `addResourceHints` configurable (preconnect/preload strategy); allow opt-out. | Perf tuning. | Low | P3 | Existing helper (M-50). |
| F6. Sitemap/robots improvements | `generateRobotsTxt` exists (M-45); add `sitemapIndex` support, lastmod precision, image/video sitemap? | SEO. | Med | P3 | M-44/M-45 done; extend if needed. |
| F7. Content prefetch on hover | Prefetch markdown on link hover (with cooldown) for perceived speed. | UX. | Med | P3 | Use `importUrlWithCache` + `requestIdleCallback`. |
| F8. Theme transition tokens | CSS custom props for theme transitions; reduce FOUC. | UX polish. | Low | P3 | Bulma theming exists. |

---

## 11. Implementation Plan

Implementation plan uses the requested UTF-8 status icons.

| Icon | Meaning |
|---|---|
| ✅ | Done — implemented & validated (tests/lint/types/benchmark as noted) |
| 🟡 | Partial — started, gated off by default, or done-but-not-yet-wired |
| ⬜ | Not started |
| ⏰ | Deferred |
| ➖ | Resolved by deletion — dead/phantom code or constraint-violating feature removed |
| ❌ | Rejected / Won't Do / Non actionable |


### Implementation Plan Table

| Task ID | Status | Task | Priority | ROI | Risk | Effort | Notes |
|---|---|---|---|---|---|---|---|
| G-001 | 🟡 | Unify `slugify` to single canonical (`slugManager.slugify`); export/import in markdown & slugSearchRuntime; remove 4 duplicates | P0 | High | Low | S (0.5d) | Fixes B1. Markdown copies replaced partially; `slugSearchRuntime.js` still has its own copy. Add tests. |
| G-002 | ⬜ | Unicode-aware slugification with transliteration + empty→hash fallback; use `Intl.Segmenter` for truncation | P0 | High | Med | M (1–2d) | Fixes B2 (CJK/Cyrillic/Arabic). No new runtime dep; add transliteration tables for common cases. |
| G-003 | ⬜ | Fix nav `searchOutsideHandler` shadowing; assign to outer var; track handlers on nav instance for teardown | P0 | High | Low | S (0.5d) | Fixes B3. Enables proper listener removal (L7). |
| G-004 | ⬜ | Replace full-scan slug lookups with `mdToSlug` in htmlBuilder/nav; add `resolveSlugForPath` helper | P1 | High | Low | S (0.5d) | Fixes B4/P3. O(1) lookups; remove O(n×m) scans. |
| G-005 | ⬜ | Fix L1: `ensureScrollTopButton` scroll listener leak — store/remove handler per button, use `{passive:true}`, avoid accumulating per render | P0 | High | Low | S (0.5d) | Critical leak. |
| G-006 | ⬜ | Add teardown API: `destroy()` for UI/nav instances; use AbortController with `{signal}` for all window/document listeners; make `initCMS()` idempotent | P0 | High | Med | M (1–2d) | Fixes L7,L8,R4,F1. Enables safe re-init/lang switch. |
| G-007 | ⬜ | Replace `Array.shift()` with head-index (ring buffer) in crawl/fetch queues (slugManager, slugSearchRuntime) | P1 | High | Low | S (0.5d) | Fixes P1 (O(n²)→O(1) amortized). |
| G-008 | ⬜ | Single-pass H2/H3 excerpt extraction (slugManager); avoid slicing remainder each iteration | P1 | High | Low | S (0.5d) | Fixes P2. |
| G-009 | ⬜ | Double HTML parse for `isHtml` pages: reuse parsed doc or avoid re-parse | P2 | Med | Low | S (0.25–0.5d) | Fixes P4. |
| G-010 | ⬜ | Batch `getBoundingClientRect()` reads in eager image handling (or use IntersectionObserver) | P2 | Med | Low | S (0.25d) | Fixes P5 (reduces layout thrash). |
| G-011 | ⬜ | Extract shared search results renderer in nav (remove ~80 lines duplication) | P2 | Med | Low | S (0.25d) | CQ3. |
| G-012 | ⬜ | Migrate crawlCache/fetchCache to PowerCache with SLRU + caps/TTL (L3,L6) | P1 | High | Low | S (0.5d) | Better retention control. |
| G-013 | ⬜ | Improve pool teardown: use `drain({timeout})` then `terminate()`; prefer `asyncDispose()`; add `dispose()` on owned resources (PowerPool) | P1 | High | Low | S (0.25–0.5d) | v2 adoption: drain/dispose. |
| G-014 | ⬜ | Expand AbortSignal propagation to semaphore acquisitions on teardown paths | P1 | High | Low | S (0.25d) | v2: `AbortSignal` on acquire. |
| G-015 | ⬜ | Decouple anchor worker: extract `anchorCore.js` (no slugManager import); worker uses snapshot only; remove fetchMarkdown fallback from worker path | P1 | High | Med | M (1–2d) | Fixes R3, RC8, RC9; reduces worker bundle duplication. |
| G-016 | 🟡 | Highlight.js language loading: replace runtime raw.githubusercontent.com fetch with build-time generation (default) + opt-in override; or gate behind flag. Current keeps runtime intentionally. | P1 | High | Low | M (1d) | Fixes R1 (offline/robustness/CSP). Recommend build-time default. |
| G-017 | ⬜ | Fix dynamic hljs language imports: use `import.meta.glob` to emit proper chunks; keep jsDelivr fallback only when glob unavailable | P1 | High | Low | S (0.5d) | Fixes R2. |
| G-018 | ⬜ | Bulma injectLink MutationObserver: add `disconnect()` on teardown; consider CSS layers/adoptedStyleSheets long-term | P1 | Med | Low | S (0.25d) | Fixes L2. |
| G-019 | ⬜ | textMetrics cache: migrate to PowerCache (SLRU) with bounded size; avoid retaining full text keys unnecessarily; handle empty-string eviction edge | P1 | Med | Low | S (0.25–0.5d) | Fixes L4. |
| G-020 | ⬜ | SEO: memoize favicon data URI; upsert `<link rel="icon">` (no duplicates); cache selector lookups in upsertMeta/setTag paths | P3 | Med | Low | S (0.25d) | Fixes P8,P9. |
| G-021 | ⬜ | Image preview zoom: batch CSS writes via `rafThrottle`/`scheduleDOMWrite` | P3 | Med | Low | S (0.25d) | Fixes P10. |
| G-022 | ⬜ | Long tasks/yield coverage: verify `yieldIfNeeded` in slugManager crawlBatch; surface diagnostics in dev overlay | P2 | Med | Low | S (0.25d) | Responsiveness/DX. |
| G-023 | ⬜ | Build-time search index (MiniSearch/FlexSearch): add build script, serialize index, load at runtime (replaces runtime crawl scan) | P1 | High | Med | M (2d) | S1,F2. Major UX/perf win; requires build integration. |
| G-024 | ⬜ | `Intl.Segmenter` for word counts in textMetrics + boundary-aware truncation in slugify | P2 | Med | Low | S (0.25d) | S3; improves i18n accuracy. |
| G-025 | ⬜ | Dev perf overlay (`?perf=1` or global) showing pool stats/queues/fallbacks/long tasks | P2 | Med | Low | M (1d) | F3, DX. |
| G-026 | ⬜ | Respect `prefers-reduced-data` and `prefers-reduced-motion` | P2 | Med | Low | S (0.25d) | F4, a11y. |
| G-027 | ⬜ | A11y: add `aria-live="polite"` for search results count; verify roving tabindex/activedescendant updates | P2 | Med | Low | S (0.25d) | UX/a11y. |
| G-028 | ⏰ | EventLoopMonitor-driven autoscaling (feed `utilizationSince()` to PowerPool autoScale) | P4 | Low | Med | M (1–2d) | S4. Defer until measurements show saturation. |
| G-029 | ⏰ | PowerCache advanced features (allowStale/getOrFetch, maxInflightRefreshes, staleTtl) | P4 | Low | Low | S (0.5d) | S5. Defer until needed. |
| G-030 | ⏰ | GCRA/retry budgets/hedging (PowerRetryBudget, hedgeDelay) | P4 | Low | Med | M (1d) | Traffic amplification risk; reject hedging now, defer budget until retry storm measured. |
| G-031 | ➖ | Remove/confirm already-deleted dead modules (anchorRewriter) — no action if absent | Done | — | — | XS | RC7; M-70 done. |
| G-032 | ❌ | Hedging HTTP fetches (hedgeDelay) | Rejected | Low | High | — | Can duplicate origin load; single-flight + negative cache + caps suffice. |

**Effort key:** XS (<0.25d), S (0.25–0.5d), M (1–2d), L (>2d). Priority P0/P1/P2/P3/P4 per impact.

