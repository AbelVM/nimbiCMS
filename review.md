# nimbiCMS Engineering Audit

## Scope and method

This audit covers the current `newarch` worktree and source under `src/`, tests, build configuration, scripts, package metadata, and generated bundle measurements. `notes.md` was intentionally excluded. No production source code was changed by this audit.

Evidence used:

- Source and tests were inspected with exact symbol searches and local call-chain reads.
- The repository dead-code and circular-import scripts were run, with heuristic results treated as candidates rather than proof.
- `npm run lint` passed.
- `npm run build:lib` passed.
- `npm run test` ran 289 files / 867 tests: 867 passed and 0 failed after the audit fixes.
- Targeted failure: `tests/nav.search.test.js:57`, eager search renders no `a[href]` result.
- Build baseline: ESM 1,015.59 kB / 264.86 kB gzip; CJS 797.90 kB / 243.20 kB gzip; UMD 1,301.83 kB / 293.27 kB gzip; CSS 503.67 kB / 49.56 kB gzip.
- Current worktree also contains unrelated/generated changes in `CHANGELOG.md` and `dist/`; those are not attributed to this audit.

## Executive summary

The highest-value work is lifecycle correctness and search determinism. `destroy()` currently looks synchronous to callers while worker disposal is asynchronous, and several module or closure-level timers, RAF callbacks, listeners, and debounced handlers are not centrally cancellable. The eager search path also has a real regression: the index promise resolves, input handling runs, but the result panel contains no result anchor.

The largest performance opportunity is reducing work shipped and repeated. The browser receives a roughly 1 MB ESM bundle plus 504 kB CSS before compression, while search and anchor resolution still perform duplicate builds, repeated normalization, and fallback map scans. Workers reduce main-thread cost in some paths, but their lifecycle, queue cancellation, transfer size, and fallback behavior need a single ownership model.

Recommended order: fix search and add a regression test, make runtime teardown async and idempotent, make every scheduled operation abortable, remove duplicate indexing, then optimize bundle boundaries and large-content algorithms with benchmarks.

## Historical findings and correctness risks

The findings below are the original audit snapshots. The implementation plan and validation matrix are authoritative for current status; several P0/P1 items below have since been remediated.

### F-01: Eager search does not reliably render results

- **Evidence:** `src/nav.js` around `ensureSearchIndex`, the debounced `handleInput`, and the eager initialization block; reproduced by `tests/nav.search.test.js:57`.
- **Observed behavior:** `npm run test` reports 827 passing and 1 failing test. The failure is `results.querySelector('a[href]') === null` after an eager search for `find`.
- **Likely cause:** search index readiness and DOM rendering are split across promise callbacks and a deferred DOM-write scheduler. The code can choose a non-authoritative or empty index after the eager promise resolves, then schedule panel insertion after the test/assertion or after state has changed.
- **Fix:** expose one `searchReady` promise, snapshot the query and generation before awaiting it, select one authoritative index, render synchronously or return the DOM-write promise, and ignore stale generations. Add an eager-path test and a rapid-query test.
- **Priority:** P0. This is a user-visible regression and the only full-suite failure.

### F-02: Lazy search can build the index twice

- **Evidence:** `src/nav.js` in `ensureSearchIndex`.
- **Observed behavior:** when the worker returns a non-empty index, the function still invokes the main-thread `buildFn` and compares the two arrays.
- **Cost:** duplicate network/discovery, parsing, allocation, and index normalization. For large sites this can double startup work and increase worker/main-thread contention.
- **Fix:** define an explicit authority policy: worker result is authoritative when complete; otherwise return a typed partial result and schedule a background enrichment pass. Do not run both builders in the critical path.
- **Priority:** P1.

### F-03: `destroy()` does not await asynchronous worker teardown

- **Evidence:** `src/init.js` `destroy()` calls `teardownRendererWorkerPool`, `teardownSlugWorkerPool`, and `teardownAnchorWorkerPool` without awaiting their promises, while the JSDoc advertises teardown as complete on return.
- **Impact:** callers can immediately reinitialize and create new pools while old workers are still draining. In-flight responses can race with the new runtime, and tests cannot reliably assert that resources were released.
- **Fix:** make `destroy()` return a memoized `Promise<void>`, abort first, stop accepting new work, await all pool drains in parallel, clear timers/listeners/caches, then remove DOM. Preserve idempotence by returning the same promise.
- **Priority:** P0 for applications that mount/unmount or hot-reload CMS instances.

### F-04: The anchor pool is a module singleton that cannot be recreated

- **Evidence:** `src/htmlBuilder.js` creates `const _anchorPool` eagerly at module load and `teardownAnchorWorkerPool()` only drains/terminates it.
- **Impact:** after destroy, a later `initCMS()` in the same module instance can see a terminated pool. The fallback object also has no real restart semantics.
- **Fix:** store a nullable pool factory/state object; lazily create on first use, transition through `running -> draining -> closed`, and create a fresh pool after teardown. Add a destroy/reinitialize test.
- **Priority:** P0.

### F-05: Scheduled callbacks and listeners outlive the runtime

- **Evidence:** `src/utils/events.js` debounce and RAF helpers have no `cancel()`/`flush()`; `src/nav.js` installs debounced input and document/window listeners; `src/init.js` schedules delayed version-label work and one-shot activity listeners.
- **Impact:** callbacks retain DOM nodes, closures, indexes, and configuration after destroy; late callbacks can mutate a removed DOM tree or a newly initialized instance.
- **Fix:** return cancellable handles from debounce, rafThrottle, and `scheduleDOMWrite`; register all handles in an instance-owned disposer; use one `AbortSignal` for DOM listeners and async work. Do not rely only on removing the root element.
- **Priority:** P0/P1 depending on whether repeated initialization is supported.

### F-06: Router TTL sweep is started at module import and has no runtime teardown

- **Evidence:** `src/router.js` calls `_scheduleResolutionCachePurge()` at module scope and stores the interval in `_resolutionCachePurgeTimerId`; `destroy()` does not clear it.
- **Impact:** the interval keeps the module/runtime active for the page lifetime and remains after CMS destruction. In tests it also adds open-handle and fake-timer noise.
- **Fix:** make cache sweeping instance-owned or expose `disposeResolutionCache()`. Start only when a runtime opts into TTL, and clear on destroy. Prefer cache-native expiry if PowerCache supports it without a compatibility sweep.
- **Priority:** P1.

### F-07: Retry policy can amplify work

- **Evidence:** `src/slugManager.js` uses `PowerRetry` plus fetch/index fallback paths; the configured retry behavior and fallback calls should be treated as a single retry budget.
- **Risk:** a failed request can be attempted by PowerRetry and then again by a higher-level fallback, producing as many as six attempts in the observed path. This increases latency, bandwidth, and server load.
- **Fix:** classify errors as abort, transient, or permanent; apply one retry budget per logical content request; add jittered exponential backoff and a total deadline; never retry HTTP 4xx or abort errors. Instrument attempts and final outcome.
- **Priority:** P1. Confirm the exact call graph with a request-count test before changing policy.

### F-08: Repeated full-map scans make path resolution scale poorly

- **Evidence:** `src/htmlBuilder.js` `_resolveSlugForWorkerPath` and the worker equivalent iterate `slugToMd` and resolved maps after direct lookups fail.
- **Impact:** anchor rewriting can degrade toward O(anchors x mappings), especially with localized paths and suffix matching. The same basename and suffix values are recomputed repeatedly.
- **Fix:** build normalized `path -> slug`, basename, and collision buckets once per content-index generation. Resolve exact path first, then deterministic collision handling; avoid suffix scans in the hot path.
- **Priority:** P1 for large sites.

### F-09: Error handling is too silent for production diagnosis

- **Evidence:** broad `catch {}` blocks appear throughout navigation, rendering, anchor rewriting, and initialization.
- **Impact:** invalid content, worker failures, CSP restrictions, and browser API gaps become indistinguishable from empty content. This raises support cost and can hide partial rendering.
- **Fix:** use typed error categories and one debug logger boundary; preserve abort errors separately; surface a minimal user-facing fallback while recording a structured diagnostic. Keep compatibility catches only around optional APIs.
- **Priority:** P1.

## Memory, resource retention, and lifecycle

- Module-level maps in `src/slugState.js`, the router cache, and global search indexes intentionally persist, but their ownership and reset rules are not uniform. Define a content-generation token and clear or replace all generation-scoped maps together.
- `window.__nimbi*` globals are nulled by `destroy()`, but late promises can repopulate them because completion is not guarded by an instance token. Every async completion should check `signal.aborted` and `runtimeGeneration`.
- Worker message queues and pending promises need cancellation semantics. Terminating a worker is insufficient if queue entries retain message payloads and resolver closures until timeout.
- Blob URL revocation is handled in parts of `worker-manager.js`, but worker instances need an explicit registry so every created worker can be terminated and every URL revoked during disposal.
- `scheduleDOMWrite` retains queued closures until its next frame. A `cancel()` method and a disposed flag are required to release queued DOM closures immediately.
- Cache limits are present, but cache keys should not include large object graphs or unbounded localized metadata. Store compact immutable values and expose hit/miss/eviction counters in debug mode.
- Add repeated `initCMS() -> destroy()` soak tests with fake timers and worker stubs. Assert zero active timers, zero pending queue items, zero live workers, and no DOM mutations after disposal.

## Performance recommendations

### Startup and bundle

- The current ESM bundle is approximately 1.02 MB before compression and 265 kB gzip; UMD is approximately 1.30 MB and 293 kB gzip. Treat this as a product budget, not only a build statistic.
- Split optional capabilities: syntax highlighting, Bulma, image preview, sitemap/RSS generation, worker clients, and diagnostics should be independently importable or lazily loaded.
- Audit whether all of `highlight.js` and Bulma are required in the default entrypoint. Prefer a documented core entrypoint plus opt-in integrations.
- Remove the `import.meta` CJS/UMD warning in `src/markdown.js` by using Vite-injected constants or a small build-time environment helper.
- Add CI bundle budgets for parsed, gzip, and brotli sizes, with a deliberate exception process.

### Search and indexing

- Normalize title/excerpt once when building the index; search should not lowercase and stringify every entry on every keystroke.
- Use a generation-stamped immutable index and a compact token map. For small indexes, a normalized array is enough; for large indexes, add an inverted token index or a bounded MiniSearch/FlexSearch-style worker index.
- Debounce input, cancel stale queries, and rank exact title matches before prefix, token, and excerpt matches. Return a stable top-K result set.
- Chunk fallback indexing by time budget and use `await globalThis.scheduler?.yield?.()` with a `setTimeout(0)` fallback. `scheduler.yield()` is supported in current Chrome/Edge and newer Firefox but not Safari, so it must be feature-detected.
- Do not use `isInputPending()` as the strategy; current web.dev guidance recommends yielding rather than polling that API.

### Rendering and DOM

- Avoid repeated `innerHTML` parse/serialize cycles in anchor rewriting. Prefer one DOM parse and batched mutations, then one serialization only when a worker contract requires HTML.
- Batch DOM reads before writes and avoid forced layout inside render loops. Use `DocumentFragment` and bounded insertion batches for large navigation trees.
- Streamed fallback rendering should have a documented threshold. For small documents, a single parse is faster; for large documents, yield between parse/highlight/DOM phases.
- Use `content-visibility: auto` and containment selectively for long article/nav regions, with tests for find-in-page, anchors, and accessibility tree behavior.

### Workers and concurrency

- Transfer compact typed/serialized data rather than repeatedly cloning full HTML and maps. Measure structured-clone cost separately from worker execution.
- Configure queue bounds, cancellation, and deadlines consistently across renderer, slug, and anchor pools. A rejected queue should produce a typed, recoverable error rather than an empty result.
- Auto-scaling should be driven by measured service time and queue pressure, with a hard device-aware upper bound. Do not create workers merely because cores are available.
- Add benchmarks for 100, 1,000, and 10,000 pages and for localized path collisions. Record main-thread blocking, worker time, clone time, peak heap, and total bytes.

## Robustness and code quality

- Replace nested defensive `try/catch` blocks with small boundary helpers that validate inputs and report one structured error. The current nesting makes control flow difficult to prove.
- Make public lifecycle contracts explicit: `initCMS()` returns an instance handle, `destroy()` returns a promise, and all instance-scoped state lives behind that handle rather than module globals.
- Centralize URL/path normalization. `router`, `htmlBuilder`, worker runtime, and slug management each contain overlapping basename, suffix, and trailing-slash logic.
- Generate and check types after public API changes; do not manually edit `src/index.d.ts`.
- Add tests for abort, timeout, worker unavailable, CSP/Blob failure, malformed front matter, duplicate slugs, localized collisions, destroy during render, and reinitialize after destroy.
- The dead-code scan found eight candidates in `src/worker/anchorRuntime.js` and the unused-export scan found fifteen candidates. These must be verified against worker entrypoints, dynamic imports, public compatibility, and tests before removal.
- The circular-import script reports `indexManager.js -> slugState.js -> slugManager.js -> slugManager.js`. `slugState.js` appears intentionally extracted to break the runtime cycle; the report may be confused by its JSDoc type import. Verify with an AST/module-graph tool before refactoring.
- `package.json` still exposes a broken benchmark path referring to deleted `scripts/benchmark-cdp.js`; remove or repair it and make Lighthouse the documented benchmark entrypoint.

## Developer experience

- Add `npm run audit:structure`, `npm run test:targeted`, `npm run benchmark:content`, and `npm run check:bundle` scripts with quiet CI-friendly output.
- Provide a debug panel or opt-in API exposing index generation, cache hit/miss, worker queue depth, active workers, render timings, and cancellation counts.
- Add a minimal fixture site with 10, 1,000, and 10,000 pages for repeatable performance tests.
- Add a lifecycle test helper that tracks timers, listeners, workers, object URLs, and pending promises. This makes leak regressions cheap to catch.
- Document the supported deployment contract: static hosting, CSP requirements for workers/Blob URLs, optional assets, browser fallback behavior, and the async destroy contract.
- Keep test output clean by filtering expected jsdom navigation/scroll warnings at the test boundary rather than swallowing application errors.

## User experience, accessibility, and responsiveness

- Search should show an immediate loading state, retain the last valid results while a new query is pending, and show a clear empty state. Never make the dropdown appear empty because an async result is stale.
- Add keyboard behavior for opening, navigating, selecting, and closing search results; keep focus management and `aria-expanded`/`aria-controls` synchronized.
- Use a live region for result counts and errors, but avoid announcing every keystroke when the query is still changing.
- Respect `prefers-reduced-motion`; route transitions, scroll-top behavior, and deferred reveal effects should become immediate.
- Use responsive nav overflow behavior that remains usable at narrow widths and zoom levels. Test at 320, 375, 768, and 1280 CSS pixels with 200% text zoom.
- Avoid layout shifts from late version labels, highlighting, images, and search panels by reserving dimensions or using stable placeholders.
- Ensure focus is restored after route changes and that removed content cannot retain focus.
- Add automated axe checks plus keyboard-only browser tests for search, navigation, headings, landmarks, and link targets.

## State-of-the-art strategies worth adopting

- **Cooperative scheduling:** introduce one shared `yieldToMain()` helper using feature-detected `scheduler.yield()` and a fallback. Yield based on elapsed budget, approximately 30-50 ms, rather than after every item.
- **Field responsiveness diagnostics:** use `PerformanceObserver` for `long-animation-frame` when supported, and fall back to long-task timing. Keep only sampled/high-value entries and report no content or user data.
- **Interaction measurement:** use the web-vitals INP attribution model in an optional diagnostics build; correlate slow interactions with CMS render phases.
- **Navigation prefetch:** use intent-based prefetch on visible/internal links with an AbortController and a small LRU response cache. Do not prefetch on constrained data or save-data connections.
- **Incremental indexing:** persist a compact content index in IndexedDB keyed by content manifest/version, invalidate by hash, and rebuild only changed pages. Keep this opt-in because storage and invalidation add complexity.
- **Content-addressed caching:** cache fetched markdown by URL plus ETag/Last-Modified where hosting permits; keep a hard byte budget and abort stale fetches.
- **Speculative rendering:** for stable internal links, pre-resolve route metadata before click while keeping the visible render cancellable. Measure before enabling by default.

## Second sweep: accessibility, SEO, GEO/AEO, and Google indexing

This sweep extends the engineering review into discoverability and inclusive use. It does not claim that Google has failed to index a deployment: indexing status requires Search Console URL Inspection, server logs, and representative `site:` checks for the real public origin. The findings below describe implementation and deployment risks visible in this repository.

### Accessibility findings

- **A-01: The stored axe result is clean but incomplete.** `a11y-report.json` contains zero entries in `violations`, 25 passing rules, and one `incomplete` `color-contrast` rule. The scan URL is a temporary localhost hash route, and `scripts/a11y-runner.js` checks one post-load shell. It does not cover rendered Markdown variants, keyboard sequences, 200% zoom, reduced motion, mobile overflow, or route transitions. Treat it as a useful smoke test, not a release gate.
- **A-02: The mobile menu uses an anchor as a button.** The generated `.navbar-burger` has `role="button"`, but its native element is an `<a>` without an `href`. This weakens keyboard behavior and makes activation, focus, and default semantics dependent on custom listeners. Use a real `<button type="button">` with `aria-controls`, synchronized `aria-expanded`, Escape handling, and focus return to the trigger.
- **A-03: Search and route changes need an explicit interaction contract.** Search results are asynchronous and the UI already has open/expanded state. The implementation needs a labelled input, stable `aria-controls`, a live result-count/error region, keyboard movement with `aria-activedescendant` or roving focus, Escape close, and focus restoration after navigation. Add browser tests rather than relying on axe’s static naming checks.
- **A-04: Rendered content needs content-level accessibility tests.** Markdown can produce headings, links, images, tables, code blocks, and raw HTML. The shell scan cannot establish heading order, meaningful image alternatives, table headers, link names, focusable embedded content, or contrast in author content. Run axe against fixtures containing each construct and assert the generated HTML contract.
- **A-05: Motion and viewport behavior are not covered by the current scan.** CSS transitions and fixed/sticky regions exist, but there is no evidence of a reduced-motion override or automated checks for narrow widths, text zoom, focus visibility, and scroll-container usability. Add `prefers-reduced-motion: reduce` behavior and responsive browser checks at 320/375/768/1280 CSS pixels and 200% zoom.

### SEO, GEO, AEO, and indexing findings

- **SEO-01: Initial HTML is an empty application shell.** `index.html` exposes a generic title/description and `<div id="app"></div>`; page-specific title, description, canonical, Open Graph, JSON-LD, and article content are injected by JavaScript. Google can render JavaScript, but this weakens first-wave discovery, social previews, non-JavaScript crawlers, validators, and AI retrieval systems. Because nimbiCMS has no publication build step, mitigate this at runtime with an early manifest/SEO-map bootstrap, fast route-level metadata fetches, deterministic deep-link rendering, and documented optional host-side HTML generation. Do not make prerendering a core requirement.
- **SEO-02: Runtime sitemap generation is not the same as publishing crawl assets.** `src/runtimeSitemap.js` can return XML, but no root `robots.txt` or static `sitemap.xml` is present in the repository. The deployment must actually publish `/robots.txt` with a sitemap declaration and `/sitemap.xml` (or a sitemap index) containing only reachable, canonical URLs. Add a deployed-asset smoke test and document the hosting adapter.
- **SEO-03: Query canonical URLs create a route and indexing dependency.** Canonicals and sitemap locations use `?page=`. This is valid in principle, but every URL must resolve directly on a cold request, render the same page without relying on a prior client route, and avoid alternate cosmetic/hash URLs becoming index candidates. Prefer clean path URLs when the host can serve them; otherwise test canonical, internal links, redirects, and sitemap output as one contract.
- **SEO-04: Hreflang must be reciprocal and canonical-aligned.** Runtime hreflang tags use the same query-based route family. Each language variant needs a self-reference, reciprocal alternates, valid language-region codes, and canonicals pointing to the corresponding variant. Add a validator that detects missing return links, duplicate tags, invalid URLs, and alternates that canonicalize elsewhere.
- **SEO-05: Structured data is page-level and minimal, not an entity graph.** `setStructuredData()` emits one generic inferred type with headline/description/url and optional author/publisher. It does not consistently provide stable `@id` values, site-level `Organization`/`WebSite`, `BreadcrumbList`, image dimensions, article dates, or language context. Type inference from path names can also select an unsuitable schema type. Generate schema from explicit front matter and validate it with representative Article, WebPage, BreadcrumbList, Organization, and WebSite fixtures; do not emit unsupported rich-result types by guesswork.
- **SEO-06: Metadata mutation can lose multi-valued tags.** `upsertMeta()` is designed around one matching element, while tags such as `og:locale:alternate` are multi-valued. Repeated route changes can overwrite alternates instead of maintaining the complete set. Use keyed reconciliation for singleton tags and a replace-all strategy for collections, then assert head-tag uniqueness and completeness after several navigations.
- **SEO-07: 404 handling is only runtime-visible.** `markNotFound()` applies `noindex,follow` after rendering. A server that returns HTTP 200 for every SPA URL still presents soft-404 risk, and a crawler that does not execute JavaScript never sees the directive. Provide real HTTP 404 responses where hosting permits, or configure a host-side fallback/edge adapter; at runtime, ensure unknown URLs are excluded from sitemap and internal navigation.
- **SEO-08: GEO/AEO extraction signals are not explicit.** Dynamic rendering delays the answer-bearing content, and generic JSON-LD does not provide concise definitions, ordered steps, FAQ evidence, or trustworthy entity/source relationships. Preserve semantic headings, put a direct answer near the top of each content page, expose author/date/source fields in front matter, and make the runtime DOM and manifest expose the same factual text. Do not add FAQ or HowTo schema unless the visible content meets the relevant structured-data policy.
- **SEO-09: Canonical correctness needs deployment verification.** Existing tests assert query-based canonical construction, but do not prove behavior on a production subpath, alternate host, trailing slash, encoded slug, locale route, or cold deep link. Add a matrix test against the deployed origin for status, canonical, robots, hreflang, structured data, and redirect behavior; use Search Console URL Inspection as the authority for actual indexing.
- **SEO-10: The default entrypoint ships heavy presentation dependencies.** `src/nimbi-cms.js` imports Bulma and the full highlight.js stylesheet for every consumer. This is primarily a performance issue, but it also delays content exposure and can worsen Core Web Vitals that affect search experience. Offer runtime-lazy style/highlighting integrations, backed by bundle and Lighthouse budgets; do not require a build-time split for correctness.

## Third sweep: runtime-only CMS risks

This sweep treats browser execution as the publication mechanism. Recommendations that require a static-site generator, a pre-rendered page per document, or a server-side CMS are explicitly out of scope unless implemented as optional host integrations.

### Runtime architecture and reliability

- **R-01: Configuration is globally mutable and instance isolation is incomplete.** `initCMS()` writes module state and several `window.__nimbi*` globals, while `cmsAbortController` is module-scoped. Two mounts on one page can overwrite each other’s UI, SEO map, language, cache settings, sitemap state, and teardown controller. Make the runtime handle the owner of configuration and global hooks; use instance IDs and reject or explicitly support multiple mounts.
- **R-02: Destroy is still synchronous despite asynchronous resources.** `destroy()` aborts work and invokes worker teardown without awaiting it, then immediately removes DOM. Late worker/fetch completions can repopulate globals or mutate detached nodes. Return an idempotent promise and gate every completion on the instance signal and generation.
- **R-03: Runtime crawling has no durable generation/version contract.** The slug maps and path sets are populated as discovery proceeds, but cached routes, search indexes, sitemap entries, SEO metadata, and nav state can represent different content generations. Define a manifest/content version, stamp all derived artifacts, and atomically publish a completed generation.
- **R-04: Directory crawling assumes a host fetch contract.** On-the-fly discovery can require directory listings or a manifest. Static hosts may return an HTML fallback with status 200, opaque responses, redirects, or a blocked cross-origin response. Validate content type and response shape before parsing, support an explicit manifest as the preferred runtime input, and report a precise configuration error when discovery is impossible.
- **R-05: Network failure has no clear degraded mode.** Slow/offline startup can leave partial navigation, empty search, and incomplete sitemap state without a consistent retry or offline message. Use `navigator.onLine` only as a hint, classify fetch failures, expose retry controls, preserve the last valid generation, and avoid replacing usable content with an empty partial index.
- **R-06: Runtime persistence is absent or underspecified.** A client-only CMS pays crawl/index costs on every fresh visit. Add an optional versioned IndexedDB cache for raw content and derived indexes, bounded by bytes and entries, with stale-while-revalidate and explicit invalidation. Do not use localStorage for large Markdown or executable configuration.
- **R-07: Worker fallback can silently change the performance and security profile.** Worker construction failures fall back to main-thread work, while large parsing/highlighting tasks can then block interaction. Expose worker availability and fallback timing in diagnostics, cap main-thread work with cooperative yields, and make CSP/worker failures visible to the host.
- **R-08: CSP and nonce handling need an explicit runtime contract.** The application creates JSON-LD, style/link hints, Blob workers, and optionally executes embedded scripts. A nonce can cover inline elements but not every Blob or dynamic execution policy. Document required `script-src`, `worker-src`, `style-src`, and `connect-src` directives; default embedded scripts to disabled and fail closed when policy prevents a requested capability.
- **R-09: Embedded scripts are a persistent trust-boundary escape hatch.** `allowEmbeddedScripts` executes content with `new Function(...)`. DOM sanitization does not make this safe because execution happens after sanitization and can access the host page. Keep it opt-in per trusted source, surface a visible configuration warning in debug mode, and add tests proving the default path never executes script content.
- **R-10: Cache invalidation and memory ceilings are not unified.** Fetch, negative-fetch, resolution, prepared-page, search, and Blob URL caches have separate limits and lifetimes. A long-lived tab or changing content base can retain old generations and duplicate raw/parsed HTML. Add one runtime memory budget, clear generation-owned caches on content-version change, and measure bytes rather than only entry counts.
- **R-11: Runtime sitemap exposure can mutate the application document.** `runtimeSitemap.js` contains document-writing behavior and global pending timers. Calling sitemap/feed exposure in the same tab can replace the CMS document or race with a pending write. Prefer returning a `Response`/string or opening an isolated endpoint/document, and make exposure opt-in, idempotent, abortable, and isolated from the app mount.
- **R-12: Observability is global and unbounded.** `window.__nimbiRenderingErrors__`, render timings, cold-route records, and debug logs are global mutable arrays. Bound them by count/age, attach instance and content-generation IDs, redact URLs/content, and provide a host callback or diagnostic snapshot instead of requiring global inspection.

### Runtime UX, data, and platform behavior

- **R-13: Route transitions need transactional rendering.** Fetch, parse, highlight, metadata, scroll, and focus updates can complete in different orders. Render into a detached fragment, commit only when the route generation is current, and update title/canonical/focus together so users and crawlers never observe a mixed page state.
- **R-14: Runtime localization can produce inconsistent document state.** `setLang()` updates the document language, but cached pages, SEO tags, hreflang, nav labels, and search fields may be from another language. Include language in cache/index keys and atomically refresh `lang`, metadata, visible labels, and search data.
- **R-15: User content and runtime config share too much authority.** Front matter, plugins, hooks, custom renderers, and `window` overrides can affect DOM, metadata, fetch paths, and execution. Define a trust model for content versus host configuration, validate plugin boundaries, and prevent content metadata from setting arbitrary resource URLs or global options.
- **R-16: Large documents can duplicate work and memory.** Streaming parses chunks, caches prepared templates, then clones article DOM for navigation; workers also clone messages. Set a size threshold, measure peak heap and clone cost, release chunk buffers promptly, and choose one representation per active page instead of retaining raw, HTML, template, and clone copies simultaneously.
- **R-17: Browser lifecycle events are not first-class inputs.** Background-tab throttling, `pagehide`, BFCache restoration, visibility changes, and connection changes affect timers, workers, and fetches. Pause nonessential crawling/indexing when hidden, abort or checkpoint before pagehide, restore safely from BFCache, and avoid treating a visibility transition as a fresh content generation.
- **R-18: Runtime SEO cannot guarantee crawler execution.** Without a build step, canonical content is dependent on JavaScript execution and content fetch availability. Provide a machine-readable manifest and sitemap from the host, expose early metadata from the manifest, link every page through ordinary crawlable URLs, and document that actual indexing must be verified per deployment rather than promised by the client library.

## `performance-helpers` v2 opportunities

Current adoption of `PowerPool`, `PowerCache`, `PowerMemoizer`, `PowerRetry`, `PowerDeadline`, and `PowerSemaphore` is a good foundation, but the ownership model is incomplete.

1. Wrap each runtime in one `PowerDeadline` linked to its `AbortSignal`; pass the remaining budget to fetch, worker messages, and rendering instead of independent fixed timeouts.
2. Use one `PowerSemaphore` for global expensive work such as markdown parsing, highlighting, and fallback indexing so multiple CMS instances cannot saturate the device.
3. Use `PowerMemoizer` for pure path normalization, slug resolution, and normalized search fields with generation-aware invalidation. Do not memoize DOM nodes or mutable maps.
4. Use `PowerCache` for bounded content and resolution caches, but avoid a second manual TTL sweep unless legacy-record compatibility is required. Add metrics for hit rate and evictions.
5. Use `PowerRetry` only at the outer logical operation boundary. Configure retry predicates, jitter, maximum elapsed time, and abort propagation; do not stack it with lower-level retries.
6. Give every `PowerPool` a disposer and registry entry. Await drain, reject queued work on abort, terminate workers, and recreate pools lazily after disposal.
7. Add helper adapters for `signal`, `deadline`, and `generation` so every subsystem follows one cancellation contract instead of bespoke options.

## Implementation plan

Status legend: ✅ Done; 🟡 Partial; ⬜ Not started; ⏰ Deferred; ➖ Resolved by deletion; ❌ Rejected / Won't Do / Non actionable.

| Task ID | Status | Task | Priority | ROI | Risk | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-01 | ✅ Done | Fix eager search readiness, stale-query generations, and result rendering | P0 | Very high | Medium | S | Eager results render synchronously; regression coverage passes |
| AUD-02 | ✅ Done | Remove duplicate worker/main-thread search builds | P1 | High | Medium | S | Complete worker result is authoritative; focused coverage passes |
| AUD-03 | ✅ Done | Make `destroy()` async, idempotent, and await all pool teardown | P0 | Very high | Medium | M | Abort-first memoized promise awaits all pool drains; reinit clears completed teardown |
| AUD-04 | ✅ Done | Make anchor/renderer/slug pools lazy, registered, cancellable, and recreatable | P0 | Very high | High | M | Anchor pool now lazy and recreated after teardown |
| AUD-05 | ✅ Done | Add cancellable debounce, RAF, DOM-write, timer, and listener disposers | P0 | High | Medium | M | Cancellable handles added; nav input binds to AbortSignal |
| AUD-06 | ✅ Done | Remove router module timer leak and scope TTL sweeping to runtime lifetime | P1 | High | Low | S | Import-time sweep removed; destroy disposes runtime sweep |
| AUD-07 | ✅ Done | Establish one retry/deadline/abort budget for fetch and worker work | P1 | High | Medium | M | PowerRetry and PowerDeadline now own the request budget; regression tests enforce three attempts and router signal forwarding |
| AUD-08 | ✅ Done | Replace path-resolution scans with generation-built lookup indexes | P1 | High | Medium | M | Main/worker snapshots index basename and two-segment suffix keys |
| AUD-09 | 🟡 Partial | Centralize path normalization and simplify nested error handling | P1 | Medium | Medium | M | Main and anchor-worker paths now share normalization, basename, and suffix helpers; nested error handling remains |
| AUD-10 | ✅ Done | Add lifecycle soak tests and resource-leak assertions | P0 | Very high | Low | M | Repeated init/destroy coverage verifies mount/UI ownership, worker-pool registry cleanup, empty queue diagnostics, and sitemap timer-disposer invocation |
| AUD-11 | 🟡 Partial | Add content-size benchmark fixtures and performance budgets | P1 | High | Low | M | `npm run benchmark:content` exercises the real crawl/index path across 100/1k/10k generated Markdown pages, reports elapsed time/heap delta, and enforces size-specific budgets; browser INP/LoAF budgets remain |
| AUD-12 | ✅ Done | Introduce cooperative yielding for fallback indexing/render phases | P1 | High | Medium | M | Existing loops use `yieldIfNeeded`; helper now prefers `scheduler.yield()` with idle/timer fallbacks |
| AUD-13 | 🟡 Partial | Split optional bundles and audit Bulma/highlight.js imports | P1 | High | Medium | L | Single-entry bundle remains by requirement; parsed, gzip, and Brotli budgets now run through `npm run check:bundle`; optional dependency splitting remains |
| AUD-14 | 🟡 Partial | Improve worker queue bounds, clone payloads, and auto-scaling metrics | P1 | Medium | High | M | Existing pools retain bounded `maxQueueLength` and auto-scaling; shared diagnostics now expose queue length, pressure, active tasks, and worker count |
| AUD-15 | 🟡 Partial | Use PowerCache/PowerMemoizer with generation-aware invalidation | P1 | Medium | Medium | M | Fetch and negative caches now include runtime generation/language when a manifest exists; broader cache ownership and metrics remain |
| AUD-16 | 🟡 Partial | Use PowerDeadline/PowerSemaphore for coordinated resource budgets | P1 | High | Medium | M | Existing helpers are present but not unified |
| AUD-17 | ✅ Done | Add search ranking, empty/loading states, focus, and ARIA behavior | P1 | High | Medium | M | Exact title, title-prefix, title-token, title-substring, and excerpt matches rank deterministically; focused coverage passes |
| AUD-18 | 🟡 Partial | Add reduced-motion, zoom, narrow viewport, and CLS protections | P1 | Medium | Low | M | Reduced-motion, 200% text-size, four viewport fixtures, horizontal-overflow results, and a 0.1 CLS budget now run; broader interaction coverage remains |
| AUD-19 | 🟡 Partial | Add optional LoAF/long-task/INP diagnostics with sampling | P2 | Medium | Low | M | Opt-in feature-detected LoAF/long-task/Event Timing observers are bounded to 50 entries, support clamped opt-in sampling, capture interaction timing fields, expose p50/p75/p95 duration summaries, and dispose with the runtime |
| AUD-20 | ✅ Done | Verify dead-code and circular-import candidates with AST reachability | P1 | Medium | Medium | S | Candidates verified as referenced; reported cycle is JSDoc-only through shared slug state; no live helper deleted |
| AUD-21 | ✅ Done | Remove the broken `benchmark-cdp.js` script reference | P1 | Medium | Low | S | `npm run benchmark` delegates to `benchmark:lighthouse` |
| AUD-22 | ✅ Done | Add bundle/build/type/test/a11y commands to CI documentation | P2 | Medium | Low | S | README and CI workflow document lint, test, build, declarations, types, and a11y |
| AUD-23 | ⏰ Deferred | IndexedDB incremental index and content-addressed offline cache | P2 | Medium | Medium | L | Implement only after baseline indexing is measured |
| AUD-24 | ❌ Rejected / Won't Do / Non actionable | Adopt `isInputPending()` as an input responsiveness strategy | P3 | None | Medium | S | Current web.dev guidance recommends yielding instead |
| AUD-25 | ✅ Done | Replace the mobile menu anchor with a native button and complete focus/state behavior | P0 | High | Low | S | Native button, Escape close, focus return, and `aria-controls` tested |
| AUD-26 | 🟡 Partial | Add browser accessibility fixtures for Markdown, search, navigation, zoom, and reduced motion | P1 | High | Medium | M | Axe now runs across four viewport fixtures, reduced motion, 200% text-size overflow checks, and a rendered Markdown-link focus/click check; search interaction remains |
| AUD-27 | 🟡 Partial | Publish real `robots.txt`, `sitemap.xml`, and 404 assets for supported static hosts | P0 | Very high | Medium | M | Static-host adapter responsibilities and runtime sitemap response generation are documented; `seo:inspect` now requires a reachable `robots.txt` declaring the inspected sitemap; generated host assets remain deployment-specific |
| AUD-28 | 🟡 Partial | Establish one canonical URL contract for clean or query routes | P0 | Very high | High | M | Shared parser/converter tests now cover clean paths, query routes, anchors, cosmetic params, and preservation of absolute external document links; host redirects, cold deep links, and sitemap locations remain |
| AUD-29 | 🟡 Partial | Add reciprocal hreflang and multi-valued head-tag reconciliation | P1 | High | Medium | M | Hreflang links and alternate Open Graph locales now reconcile, clear stale values, and filter invalid BCP 47 tags; reciprocal links and deployment-level canonical alignment remain |
| AUD-30 | ❌ Rejected / Won't Do / Non actionable | Make prerendered/static HTML a core publication requirement | P0 | Very high | High | L | Incompatible with the browser-only/no-build product model; cover optional host adapters and runtime mitigations in AUD-35, AUD-37, and AUD-52 |
| AUD-31 | 🟡 Partial | Replace heuristic schema inference with explicit validated entity graphs | P1 | High | Medium | M | JSON-LD now emits stable page/site/organization IDs, language, and validated BreadcrumbList metadata; heuristic page-type inference and broader fixtures remain |
| AUD-32 | 🟡 Partial | Add deployed SEO inspection and indexing diagnostics | P1 | High | Medium | M | `npm run seo:inspect -- URL` checks status, title, robots, canonical, hreflang, and JSON-LD; Search Console workflow and richer schema validation remain |
| AUD-33 | 🟡 Partial | Add direct-answer and source metadata conventions for GEO/AEO content | P1 | Medium | Medium | M | README now documents visible direct answers, authoritative source links, and structured-data parity; automated content-policy checks remain |
| AUD-34 | 🟡 Partial | Split core, styling, and highlighting entrypoints | P1 | High | Medium | L | Kept one public library entry and one unique main bundle per requested packaging contract; optional entrypoint splitting remains deferred |
| AUD-35 | 🟡 Partial | Make runtime state instance-owned and define multi-mount behavior | P0 | Very high | High | M | Runtime rejects duplicate initialization on one mount and performs an awaited teardown handoff when switching to another connected mount; independent multi-mount instances are still unsupported |
| AUD-36 | ✅ Done | Make destroy asynchronous, idempotent, and generation-aware | P0 | Very high | Medium | M | Covered by AUD-03 destroy promise, abort teardown, reinit reset, and stale-generation guards |
| AUD-37 | 🟡 Partial | Add manifest/content-version contracts for all runtime-derived artifacts | P0 | Very high | Medium | M | Runtime exposes one immutable generation/content-base/language manifest with a snapshotted source identity; nav results, search-index arrays, SEO document state, and cache consumers carry explicit generation identity; sitemap/feed host responses now accept a manifest and emit identity headers, while broader artifact validation remains |
| AUD-38 | 🟡 Partial | Harden runtime discovery against fallback HTML, redirects, CORS, and bad content types | P1 | High | Medium | M | Shared fetch path rejects HTML fallback for `.md` requests and handles configured 404 content; structured diagnostics now distinguish network/CORS, HTTP, redirect, and invalid-content-type failures |
| AUD-39 | 🟡 Partial | Add offline, retry, partial-index, and stale-content behavior | P1 | High | Medium | M | Existing fetch retries and connection state remain; init now exposes bounded loading/ready/failed/idle recovery state with generation identity, while stale-content reuse and partial-index UI remain |
| AUD-40 | ⬜ Not started | Add optional bounded IndexedDB persistence for content and indexes | P2 | Medium | Medium | L | Version by manifest hash; use stale-while-revalidate and byte budgets |
| AUD-41 | ✅ Done | Instrument worker availability and main-thread fallback cost | P1 | High | Low | S | Worker creation failures, worker count, Blob URL creation/revocation, shared pool queue/active-task diagnostics, reason-labeled fallback counts, and duration totals are exposed |
| AUD-42 | 🟡 Partial | Document and test the CSP contract for runtime-created resources | P0 | High | High | M | Nonce APIs, `worker-src blob:`, `connect-src`, `style-src`, response-mode guidance, and focused nonce/directive/lifecycle tests are covered; browser header-policy enforcement remains |
| AUD-43 | 🟡 Partial | Tighten embedded-script trust boundaries and default-deny tests | P0 | Very high | High | M | Default-deny stripping, explicit opt-in, same-origin default, exact absolute http(s) origin validation, and explicit external-origin allowlisting are tested; trusted-source policy remains host responsibility |
| AUD-44 | 🟡 Partial | Unify cache ownership, invalidation, and memory budgets | P1 | High | Medium | M | Raw-worker Blob URL cache has a hard 200-entry bound, explicit runtime disposal, and eviction diagnostics; Markdown fetch/discovery and slug-search caches now clear at init and content-base boundaries, while broader ownership remains |
| AUD-45 | 🟡 Partial | Isolate sitemap/feed responses from the live application document | P0 | High | High | M | `handleSitemapRequest({ returnResponse: true, url })` now works for server/edge adapters without browser globals; `destroy()` clears delayed writer timers, while host endpoint wiring and default writer removal remain |
| AUD-46 | 🟡 Partial | Bound and identify runtime diagnostics | P2 | Medium | Low | S | Runtime error records are capped at 50 entries, scalar fields at 2,000 characters, carry a per-init runtime ID, redact query values/fragments, and support an optional host callback; broader privacy policy remains host responsibility |
| AUD-47 | 🟡 Partial | Commit route transitions transactionally with coherent SEO and focus updates | P0 | Very high | High | M | Stale URL changes discard results; preparation and transform hooks now finish before mutation; detached article/TOC insertion, full container replacement, metadata update, and focus restoration now occur in one synchronous commit; broader rollback policy remains |
| AUD-48 | 🟡 Partial | Include language and host configuration in cache/index keys | P1 | High | Medium | M | Router resolution and slug-search in-flight index caches now scope by language, normalized content base, depth, exclusions, and seeds; broader nav/index ownership audit remains |
| AUD-49 | 🟡 Partial | Define content/plugin trust boundaries and validate runtime configuration | P0 | High | High | M | Embedded scripts now require same-origin or explicit external-origin allowlisting; URL overrides remain opt-in and malformed manifest configuration is rejected, while front matter/plugin authority limits remain |
| AUD-50 | 🟡 Partial | Add large-document memory and clone-cost thresholds | P1 | High | Medium | M | Markdown worker cloning is capped at 2 MiB, larger inputs use the existing chunked fallback, and available `performance.memory.usedJSHeapSize` is recorded; broader retention audits remain |
| AUD-51 | ✅ Done | Handle page lifecycle and connection events explicitly | P1 | Medium | Medium | M | BFCache, scroll restoration, online/offline state, and document visibility state/events are covered |
| AUD-52 | 🟡 Partial | Add runtime-only crawler and manifest conformance checks | P0 | Very high | Medium | M | `seo:inspect` now checks manifest, sitemap, `robots.txt` sitemap declaration, core metadata, and configurable bounded cold probes for internal links; full crawler-scale validation remains |

## Validation matrix

| Check | Result | Interpretation |
| --- | --- | --- |
| `npm run lint -- --quiet` | Pass | No lint errors in the audited source |
| `npm run build:lib` | Pass | Library build succeeds |
| `npm run a11y:scan` | Pass | Accessibility scan completes and writes the report |
| `npm run test -- --reporter=dot` | Pass: 868 / 868 | Full suite passes; focused route, embedded-script, SEO contract, cache lifecycle, and manifest identity suites pass |
| Circular import script | Candidate reported | Verify JSDoc/dynamic-entry false positives with AST graph |
| Dead-code script | 8 candidates | Verify worker entrypoint reachability before deletion |
| Unused-export script | 15 candidates | Verify public/test compatibility before deletion |

## External references

- [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks): cooperative yielding, `scheduler.yield()` fallback, batching, and avoiding `isInputPending()`.
- [MDN: Scheduler.yield()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield): current support and feature detection.
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController): cancellation of fetch and response-body consumption.
- [Chrome for Developers: Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames): feature detection, attribution, and field diagnostics for INP/smoothness.
