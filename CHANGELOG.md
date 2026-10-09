# Changelog

All notable changes to **nimbiCMS** will be documented in this file.

## Unreleased

- **[PERF]** Extract Markdown heading excerpts with a sticky regex anchored at the heading instead of copying the remainder of the document once per heading, making index construction linear rather than quadratic in document length. Measured up to 3.4x faster on a 1,000-heading document with identical output.
- **[PERF]** Drain crawl and fetch queues through a head-index work queue instead of `Array.shift()`, which re-indexes every remaining element. Measured 4.5x faster at 5,000 entries and neutral at the default 1,000-entry queue size; adds `benchmarks/benchmark-work-queue.mjs`.
- **[FIX]** Disconnect the MutationObservers that keep Bulmaswatch theme stylesheets last in `<head>` on teardown, instead of leaving them watching `document.head` for the lifetime of the page. They also stop once their stylesheet is removed, and the broken observer-reuse lookup that created a fresh observer on every call is gone.
- **[PERF]** Bound the slug-crawl cache at 500 entries with oldest-first eviction, and expire cached misses after 60 seconds so newly published content is picked up. The cache previously grew by one entry per probed slug, including misses, for the lifetime of the session.
- **[FIX]** Slugify non-ASCII titles instead of collapsing them to an empty string. Accented Latin letters now fold to their base character (`Über café` to `uber-cafe`, previously `ber-caf`), Cyrillic transliterates to Latin (`Привет мир` to `privet-mir`), and titles with no Latin mapping at all (CJK, Arabic, Greek) fall back to a stable hash so every page still gets a distinct, non-empty slug. **This changes existing URLs for non-ASCII pages.**
- **[FIX]** Release the runtime generation and sweep debug globals again after asynchronous teardown completes, so an in-flight write can no longer repopulate `window.__nimbi*` state after `destroy()`. Three unguarded writes that bypassed the generation check are now routed through it.
- **[FIX]** Remove the previous scroll listener before attaching a new one in the scroll-to-top button, so rendering a page without an H1 no longer accumulates one listener per render for the page lifetime.
- **[PERF]** Cache the lowercased title and excerpt on each search-index entry when the index is built, so filtering on every keystroke no longer re-allocates two strings per field per entry. Match semantics are unchanged.
- **[PERF]** Yield to the event loop on an elapsed-time budget rather than a fixed iteration count during crawling and sitemap generation, so loops doing cheap work stop yielding unnecessarily while loops doing per-iteration I/O cannot block for seconds between yields.
- **[FEAT]** Cross-fade route changes with the native View Transitions API when available, falling back to the existing CSS opacity transition on browsers without it. Skipped transitions and reduced-motion preferences are respected.
- **[PERF]** Prefetch the target page's Markdown on `pointerdown` for internal navigation links, starting the fetch roughly 100-200ms before the click and reusing the existing fetch cache. External and anchor-only links are skipped, and in-flight prefetches are aborted when the pointer is cancelled, dragged off the link, or moved away from it.
- **[PERF]** Skip rendering off-screen article content via `content-visibility`, correcting the companion property to the valid `contain-intrinsic-size` so the placeholder size is honoured and scrollbar behaviour stays stable.
- **[PERF]** Bound content retention: the Markdown fetch and negative-fetch caches now hold 500 entries instead of 2000, and the prepared-page DOM cache holds 6 cloned articles instead of 12.
- **[FIX]** Publish the live search index to its debug global again; the guard call referenced a variable that was not in scope, so the assignment threw and was swallowed, leaving the global permanently unset.
- **[CHORE]** Collapse duplicated stacked JSDoc blocks across `slugManager`, `htmlBuilder`, `helpers`, and `init`, and replace an empty `try`/`catch` plus function-scoped `var` declarations in `initCMS` with a single block-scoped `let`.
- **[FIX]** Create the runtime `AbortController` before any listener registration in `initCMS`, so the `error` and `unhandledrejection` handlers actually attach; previously they dereferenced a `null` controller and the resulting `TypeError` was swallowed, leaving `onRuntimeError` and `__nimbiRenderingErrors__` permanently empty.
- **[FIX]** Import `toCanonicalHref` in `init.js`, which was called but never imported, silently disabling URL canonicalization at runtime.
- **[FIX]** Clear the runtime `indexSet` when the slug maps are cleared, so stale content paths cannot survive a `slugToMd.clear()` until the next explicit index refresh.
- **[FIX]** Replace the module-scope capture-phase `document` `input` listener with an element-scoped listener bound to the runtime signal, so it no longer fires for every input event on the page for the page lifetime and is released on teardown.
- **[FIX]** Hoist the `navbar` declaration out of its creation site to remove a temporal-dead-zone hazard, since `typeof` does not guard a `const` that has not yet been initialized.
- **[CHORE]** Unify four divergent `slugify` implementations into a single canonical, memoized `utils/slugify` module shared by the main thread and both workers, so worker-generated slugs resolve against main-thread slug maps.
- **[CHORE]** Unify the duplicated `_splitIntoSections` implementations into a shared `utils/splitIntoSections` module so streamed and non-streamed rendering produce identical chunk boundaries.
- **[CHORE]** Extract the duplicated `runWithConcurrency` helper into a shared `utils/concurrency` module.
- **[CHORE]** Remove unreachable zoom-HUD code from the image preview modal; the target element was never created in either the DOM-built or `innerHTML` fallback path, and the zoom level is already shown by the existing zoom label.
- **[TEST]** Add cross-context contract suites pinning slug and section-splitting agreement between the main thread and the workers, plus slug-map instrumentation coverage; the full suite passes with 1029 tests.
- **[TEST]** Re-root generated worker-module import rewrites in the renderer test harnesses so new relative imports in `worker/renderer.js` do not break module resolution.
- **[FIX]** Clear delayed runtime sitemap writes during `destroy()` so sitemap timers cannot outlive the CMS runtime; repeated lifecycle regression coverage now verifies the disposer and empty worker queues.
- **[CHORE]** Centralize basename and multi-segment path helpers across main-thread and anchor-worker resolution.
- **[PERF]** Expose reason-labeled renderer, anchor, and slug main-thread fallback counts in worker-pool diagnostics.
- **[PERF]** Track aggregate duration totals for renderer, anchor, and slug main-thread fallbacks.
- **[FIX]** Defer article, navigation, and SEO mutation until route preparation and transform hooks complete for the current URL.
- **[FIX]** Restore keyboard focus to the committed main landmark after a current route transition when focus belonged to the outgoing CMS content.
- **[FIX]** Apply route metadata in the same synchronous commit as the prepared article and navigation DOM.
- Added `npm run benchmark:content` for repeatable real-indexer crawl measurements across 100, 1,000, and 10,000 generated Markdown pages with elapsed-time and heap-delta output.
- **[PERF]** Enforce generous per-size elapsed-time and heap-growth budgets in the content benchmark.
- **[PERF]** Record feature-detected browser heap usage alongside bounded long-task, LoAF, and Event Timing diagnostics.
- **[FIX]** Scope Markdown fetch and negative-cache entries by runtime generation and language, preventing stale content reuse after a runtime manifest change.
- **[PERF]** Add bounded p50/p75/p95 duration and interaction-count summaries to opt-in performance diagnostics.
- **[TEST]** Assert worker-pool registry cleanup across repeated initialization and teardown cycles.
- **[CHORE]** Expose bounded Markdown fetch-cache entry and capacity diagnostics for runtime ownership checks.
- **[TEST]** Extend browser accessibility fixtures with keyboard-focus and click checks for rendered Markdown links, including a labeled fallback fixture when content is absent.
- **[TEST]** Extend `seo:inspect` with bounded cold deep-link probes for discovered internal URLs.
- **[PERF]** Add clamped opt-in sampling to performance diagnostics while preserving full collection by default.
- **[FIX]** Add runtime manifest and recovery state contracts, generation-scoped sitemap responses, language/content-base cache keys, fallback-content validation, retry/deadline handling, and online/offline lifecycle handling.
- **[SEO]** Improve canonical and cosmetic route handling, hreflang and alternate locale reconciliation, structured JSON-LD identifiers, sitemap isolation, and deployed SEO inspection checks.
- **[SECURITY]** Keep embedded scripts and URL overrides opt-in, validate runtime configuration, define CSP requirements, enforce default-deny script behavior, and redact query values/fragments from runtime diagnostics.
- **[SECURITY]** Restrict external embedded scripts to same-origin or explicitly allowlisted origins via `embeddedScriptOrigins`.
- **[SEO]** Filter invalid configured language tags before emitting hreflang and alternate Open Graph locale metadata.
- **[SEO]** Allow `seo:inspect` deployments to raise the bounded internal-link probe count with `--max-links=N`.
- **[RUNTIME]** Clear the Markdown fetch and negative-result caches when starting a new CMS runtime generation.
- **[RUNTIME]** Clear slug-crawl and directory-discovery caches when content-base configuration changes or a new runtime starts.
- **[RUNTIME]** Make connected mount changes perform an awaited singleton teardown handoff while retaining same-mount duplicate protection.
- **[RUNTIME]** Allow host adapters to generate isolated sitemap/feed responses with an explicit request URL without browser globals.
- **[FIX]** Replace prepared route article and TOC containers atomically before applying route metadata and focus updates.
- **[SECURITY]** Validate embedded script allowlists as absolute http(s) origins without credentials, paths, queries, or fragments.
- **[RUNTIME]** Propagate runtime generation, language, and content-base identity through host-generated sitemap/feed response headers.
- **[SECURITY]** Clear CSP nonces when a new runtime omits `cspNonce`, preventing stale nonce state from crossing teardown and reinitialization.
- **[SEO]** Extend `seo:inspect` to require reachable `robots.txt` with an explicit declaration for the inspected sitemap.
- **[ROUTING]** Preserve absolute external document links when converting supported internal routes to canonical URLs.
- **[CACHE]** Clear generation-scoped slug-search promises and indexes when initializing a new runtime.
- **[RUNTIME]** Snapshot and freeze supplied runtime-manifest source metadata so derived artifacts keep stable identity.
- **[TEST]** Expand regression coverage for lifecycle, routing, SEO, CSP, worker/cache behavior, performance diagnostics, accessibility fixtures, and jsdom/Vitest upgrades; the full suite passes with 863 tests.
- **[CHORE]** Add CLS, parsed/gzip/Brotli bundle, Event Timing, worker-pool, cache, and bounded-diagnostic checks to the audit tooling.
- **[NOTE]** Optional bundle splitting remains deferred to preserve the one-main-bundle contract; IndexedDB persistence, host-generated crawl assets, cold deep-link crawling, and broader multi-mount support remain deployment or follow-up work.
- **[FIX]** Search now preserves the complete lazy-built index and returns results reliably after reloads, including entries discovered through navigation links.
- **[CHORE]** Complete the migration from the vendored performance-helpers implementation to the `performance-helpers@2.0.0` package, updating imports, generated types, documentation, lint configuration, and integration points.
- **[FIX]** Switch worker pools to the negotiated message codec so modern structured-clone and binary payload handling remains available across renderer, anchor, and slug workers.
- **[FIX]** Add a shared DOMPurify factory for consistent sanitization in browser and worker environments while avoiding duplicate bundling.
- **[TEST]** Update worker, markdown, DOM parser, cache, deadline, and codec coverage for performance-helpers v2 behavior and remove obsolete legacy-codec assumptions.
- **[CHORE]** Bump dependencies and dev-dependencies to the latest versions
  - **Vitest 5** (`vitest`, `@vitest/coverage-v8`): test files updated to hoist `vi.mock`/`vi.doMock` calls to the top level, as Vitest 5 makes nested mocks a hard error. `clearMocks` pinned to `false` to preserve existing mock-call-history behavior.
  - **TypeScript 7** (`typescript`): type-checked with TS 7 via a side-by-side compiler setup (`typescript7`), keeping `typescript` on 6.x for `typedoc`, which still requires the TS 6 compiler API. `tsconfig.json` uses `moduleResolution: "Bundler"` and `check-dts` runs with `--ignoreConfig`.
  - **jsdom 30**, **cssnano 9** (+ `postcss-discard-duplicates` 9, `postcss-merge-rules` 9), **puppeteer 25** (with the required `await` on `executablePath()`), **marked 18.1.0**, plus minor/patch bumps across the toolchain.
- **[TEST]** Fix `slugWorker.unit.test.js` to pass the 4-arg `buildSearchIndex` signature (`contentBase, indexDepth, noIndexing, seedPaths`) introduced in the source.
- **[TEST]** Fix `markdown.coverage.extra.test.js` to set `navigator` via `Object.defineProperty`, which is required under jsdom 30 (the property is getter-only).

## V1.1.0 Extreme Makeover

Brand new architecture on top of [performance-helpers](https://abelvm.github.io/performance-helpers).

- Improved performance, both in cold start and in transitions
- The new architecture is much more robust and easier to maintain.
- Leaner bundles
- Less potential bugs

- **[FIX]** Code highlighting regression
- **[FIX]** Indexing regression
- **[FEAT]** Gate the execution of external scripts in the pages with `executeEmbeddedScripts` option
- **[FEAT]** Added `lighthouse` benchmarks to avoid performance regressions
- **[CHORE]** Bump dependencies and dev-dependencies to latest versions

## v1.0.8

- **[FIX]** Minor CSS tweaks
- **[PERF]** Override the indexing to provide early rendering for cold URLs

## v1.0.7

- **[FIX]** Hot fix for a path regression when deployed
- **[FIX]** Minor documentation issue
- **[CHORE]** Raised tests coverage

## v1.0.6 Need for Speed

- **[FIX]** Slug dedupe regression
- **[FIX]** Some resources were imported from CDN regardless being already bundled
- **[FIX]** Stalled fetches are now being managed
- **[FEAT]** Added cosmetic URLs (`website/#/slug[#anchor][?params]`) on top of canonical URLs (`website/?page=slug[#anchor][?params]`)
- **[FEAT]** Improved SEO management
- **[FEAT]** Added a dynamic sitemap
- **[FEAT]** Added dynamic RSS 2.0 and ATOM 1.0 endpoints
- **[FEAT]** More flexible defaults for `homePage` and `notFoundPage`
- **[FEAT]** Centralized logging behavior
- **[FEAT]** Improved UI responsiveness for heavy indexing
- **[PERF]** Improved parallel indexing: 6x faster
- **[PERF]** Reuse DOMParser
- **[PERF]** Memoize expensive transforms and metrics
- **[PERF]** Use Sets/Maps for membership checks
- **[PERF]** Batch DOM updatesnpm install
- **[PERF]** Gate expensive debug/log formatting
- **[PERF]** Fetch caching & dedupe
- **[PERF]** Negative cache for dynamic imports
- **[PERF]** Limit and tune concurrency
- **[PERF]** Hot-regex & allocations
- **[PERF]** Cache size / eviction policies
- **[PERF]** Large DOM queries are now scoped
- **[PERF]** Debounce/heavy-event throttling
- **[PERF]** Streaming processing for big content
- **[CHORE]** Improved JSDoc coverage and quality
- **[CHORE]** Raised tests coverage

## v1.0.5

- **[FIX]** Nasty regression at `contentPath` management
- **[FIX]** Minor styling issues in system mode when system is dark
- **[FIX]** Minor fixes

## v1.0.4

- **[FIX]** Some weird corner case wih `contentPath` leads to wrong paths
- **[FIX]** If `homePage` is set to a non existent HTML file, it might produce a folder listing instead
- **[FIX]** Subtle CSS error in responsive view

## v1.0.3

- **[FIX]** HTML Character Entities were not properly rendered
- **[FEAT]** Smoother page transitions
- **[FEAT]** Added `navigationPage` option to enable custom navigation index
- **[FEAT]** Added support for markdown emojis :tada:
- **[PERF]** Parallel indexing, highly improved search box initial availability time
- **[PERF]** Workers pool for parallel processing
- **[PERF]** Enhanced workers life cycle management
- **[A11Y]** Keyboard navigation added to search results
- **[A11Y]** Enforced [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag) 2.0, 2.1, 2.2 on level A, AA and AAA as well as a number of best practices
- **[DOCS]** Add documentation to scripts
- **[CHORE]** Housecleaning: removed leftovers
- **[CHORE]** Improved JSDoc coverage and quality
- **[CHORE]** Improved tests coverage

## v1.0.2

- **[FIX]** Playground retrieval of highlight.js themes was failing.
- **[FEAT]** Bundle size optimizations, 50% bundled CSS size reduction.
- **[FEAT]** Playground improved.

## v1.0.1

- **[FIX]** Disabled image preview for images wrapped in links.
- **[FIX]** Use repo-relative contentPath to avoid root fetches.
- **[FIX]** Fixed gh-pages path.
- **[DOCS]** Document `.nojekyll` to serve underscore-markdown files in gh-pages.

## v1.0.0

- First release.

- **[FIX]** Stabilize router TTL cache test under high parallel load by using a longer TTL and asserting the stored value instead of relying on time-based eviction.
- **[RUNTIME]** Isolate sitemap/feed responses from the live document: `handleSitemapRequest` now defaults to returning the generated body string without calling `document.open/write/close`; opt in to legacy document writes with `writeToDocument: true`. `initCMS` forwards `writeToDocument: exposeSitemap !== false` for the `/?sitemap` URL path. Added `exposeSitemapGlobals` and re-exported sitemap generation helpers (`generateSitemapJson`, `generateSitemapXml`, `generateRssXml`, `generateAtomXml`, `generateLlmsTxt`) from the public entrypoint. `destroy()` clears delayed sitemap writer timers.
