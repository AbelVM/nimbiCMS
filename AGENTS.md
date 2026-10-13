# AGENTS.md — nimbiCMS Operational Guide

> Last updated: 2026-10-06
> Project: nimbi-cms v1.1.0 | ESM | MIT | Author: Abel Vázquez Montoro

---

## 1. Project overview

nimbiCMS is a lightweight, client-side CMS for static sites. It renders Markdown, builds navigation, manages search, and updates SEO tags — all in the browser, with no backend.

- **Repo**: https://github.com/AbelVM/nimbiCMS
- **Homepage**: https://abelvm.github.io/nimbiCMS/
- **Source**: plain JavaScript in `src/` (no TypeScript source)
- **Types**: `src/index.d.ts` is **generated** by `scripts/gen-dts.js` from JSDoc comments — do not edit it by hand
- **Minimum Node**: Node 22+ (cssnano 9 / postcss 9 require Node 22; `engines.node` is stale at `>=16` but intentionally untouched for semver safety)

---

## 2. Install / setup

```bash
npm ci
```

- `node_modules` must be clean. If you see missing `.bin/` or stripped `package.json` files inside `node_modules`, run `npm ci` again.
- Do **not** use `npm install` for CI-like setups; `npm ci` is the canonical install command.

---

## 3. Scripts

| Script | Purpose | Notes |
|--------|---------|-------|
| `npm test` | Run full test suite (Vitest 5) | 799 tests; uses jsdom 30 |
| `npm run test:coverage` | Run tests with V8 coverage | Provider: `@vitest/coverage-v8` v5 |
| `npm run lint` | ESLint on `src/` | 0 errors target |
| `npm run lint:fix` | Auto-fix lint issues | |
| `npm run format` | Prettier on `src/**/*.js` | |
| `npm run build` | Build lib + UMD bundles | Runs `build:lib` then `build:umd` |
| `npm run build:lib` | Vite lib build (ESM/CJS) | |
| `npm run build:umd` | Vite UMD build | Requires `BUILD_TARGET=umd` |
| `npm run build:analyze` | Build with bundle visualizer | |
| `npm run preview` | Vite preview server | |
| `npm run gen-dts` | Generate `src/index.d.ts` from JSDoc | Run after adding new exports |
| `npm run check-dts` | Type-check `src/index.d.ts` with TS 7 | Uses `node node_modules/typescript7/bin/tsc` |
| `npm run type-test` | Run `tsd` type tests | **Pre-existing failure**: `src/index.test-d.ts` does not exist |
| `npm run docs` | Generate TypeDoc docs | Uses `typedoc` v0.28.20 (TS 6 API) |
| `npm run prepare` | Full prep: build + gen-dts + docs | CI entry point |
| `npm run a11y:scan` | Run axe-core accessibility scan | |
| `npm run benchmark:lighthouse` | Run Lighthouse benchmarks | Uses `benchmarks/benchmark-lighthouse.js` |
| `npm run dev` | Vite dev server | |

---

## 4. Source layout

```
src/
├── nimbi-cms.js          # Public entrypoint; re-exports from submodules
├── lib/
│   └── index.js          # Convenience re-exports for `nimbi-cms/lib`
├── init.js               # initCMS() and option parsing
├── htmlBuilder.js        # Article rendering, TOC, anchors
├── nav.js                # Navigation tree building
├── slugManager.js        # Slug resolution, crawling, search index
├── slugSearchRuntime.js  # Runtime slug search
├── markdown.js           # Markdown parsing pipeline
├── codeblocksManager.js  # Code highlighting (highlight.js)
├── hookManager.js        # Hook system
├── seoManager.js         # SEO meta tags
├── runtimeSitemap.js     # RSS/Atom/Sitemap generation
├── l10nManager.js        # Localization
├── bulmaManager.js       # Bulma theming
├── ui.js                 # UI helpers
├── imagePreview.js       # Image preview
├── indexManager.js       # Index cache management
├── router.js             # Routing logic
├── jsdoc-typedefs.js     # JSDoc type definitions
├── worker-manager.js     # Worker pool management
├── version.js            # Version constant
├── utils/
│   ├── frontmatter.js
│   ├── events.js
│   ├── debug.js
│   ├── idle.js
│   ├── textMetrics.js
│   ├── sharedDomParser.js
│   ├── emojiMap.js
│   ├── importCache.js
│   ├── helpers.js
│   ├── urlHelper.js
│   └── l10n-defaults.js
└── worker/
    ├── anchorWorker.js
    ├── anchorRuntime.js
    ├── anchorRewriter.js
    ├── renderer.js
    ├── rendererRuntime.js
    ├── renderer.entry.js
    └── slugWorker.js
```

### Key patterns

- **Workers**: `src/worker/` contains Web Worker code. Tests use a `TestWorker` stub defined in `tests/setup.js`.
- **JSDoc types**: All public APIs are documented with JSDoc. `scripts/gen-dts.js` parses these and writes `src/index.d.ts`.
- **CSS side effects**: `src/nimbi-cms.js` imports Bulma, highlight.js, and custom CSS. The package declares `sideEffects` for these files.

---

## 5. TypeScript 7 — side-by-side aliasing

### Why?

- `typedoc` v0.28.20 **crashes** under TypeScript 7 (`TypeError: Cannot read properties of undefined (reading 'PropertyDeclaration')` at `ts4.SyntaxKind`). It requires the TS 6 compiler API.
- `tsd` v0.33.0 **bundles its own** `@tsd/typescript@^5.9.2` and is independent of the project's `typescript` version.
- We want to type-check our generated `.d.ts` with TS 7 for modern strictness.

### The setup

In `package.json`:

```json
"typescript": "npm:@typescript/typescript6@^6.0.2",
"typescript7": "npm:typescript@^7.0.2"
```

- `typescript` → TS 6.0.3 (used by `typedoc` via its peer dependency)
- `typescript7` → TS 7.0.2 (used explicitly by `check-dts`)

### How it works

- `npm install` resolves both aliases into `node_modules/`:
  - `node_modules/typescript/` → TS 6.0.3
  - `node_modules/typescript7/` → TS 7.0.2
- `check-dts` runs: `node node_modules/typescript7/bin/tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck --ignoreConfig`
- `tsconfig.json` uses `moduleResolution: "Bundler"` (changed from `"Node"` for TS 7 compatibility) and `ignoreDeprecations: "6.0"` (harmless in TS 7).

### Do not change

- Do **not** upgrade `typedoc` to 0.29 (does not exist; 0.28.20 is latest).
- Do **not** try to make `typedoc` work with TS 7 — it is a known incompatibility.
- Do **not** remove the `typescript7` alias — it is the only way to run TS 7 in this project.

---

## 6. Vitest 5 — mocking rules

### Hard rules

1. **`vi.mock()` and `vi.doMock()` must be at the top level** (module scope). Vitest 5 throws on load if they are nested inside `describe` or `beforeEach`.
2. **`vi.unmock()` is deprecated/removed** for top-level hoisting. Do not use it in `afterEach`.
3. **`clearMocks` defaults to `true`** in Vitest 5. This project pins it to `false` in `vitest.config.js` because the existing suite records mock call history across tests.

### Dynamic / per-test factories

Use `vi.doMock()` for per-test mock factories:

```js
vi.doMock('module', () => ({ ... }))
```

`vi.doMock` is runtime-safe and can be called inside `beforeEach` or individual tests.

### Static mocks

Hoist to module scope:

```js
vi.mock('module', () => ({ ... }))
```

### Config

`vitest.config.js`:
- `environment: 'jsdom'`
- `globals: true`
- `testTimeout: 20000` (raised to avoid intermittent CI timeouts)
- `clearMocks: false` (preserves mock call history)
- `coverage.provider: 'v8'`

---

## 7. jsdom 30 — navigator is getter-only

Under jsdom 30, `navigator` is getter-only on the Window prototype. Direct assignment throws.

**Correct pattern:**

```js
Object.defineProperty(globalThis, 'navigator', {
  value: { ... },
  configurable: true,
  writable: true,
  enumerable: true,
})
```

Always restore the original value in `afterEach`.

---

## 8. Build / test / docs conventions

### Build

- `npm run build` produces:
  - `dist/nimbi-cms.es.js` (ESM)
  - `dist/nimbi-cms.cjs.js` (CJS)
  - `dist/nimbi-cms.js` (UMD, legacy)
- Build outputs are **not** committed (see `.gitignore`).
- `dist/nimbi-cms.css` is generated but also not committed.

### Tests

- **799 tests** pass with 0 failures (verified 2026-10-05).
- Test files: `tests/**/*.test.js`
- Setup: `tests/setup.js` (stubs Worker, IntersectionObserver, fetch clone, console.warn filter)
- Use `npx vitest run` for CI (non-watch mode).
- `tests/nav/buildNav.more-branches.test.js` is timing-flaky under parallel load (passes in isolation). If it flakes in CI, re-run the suite.

### Docs

- TypeDoc generates Markdown docs into `docs/`.
- `npm run docs` must pass after any public API change.
- `npm run gen-dts` must pass after any new export is added.

### Type checking

- `npm run check-dts` validates `src/index.d.ts` with TS 7.
- `npm run type-test` runs `tsd` — **currently fails** with pre-existing `src/index.test-d.ts does not exist` error. This is independent of the TS 7 upgrade.

---

## 9. Known issues

| Issue | Status | Notes |
|-------|--------|-------|
| `engines.node: ">=16"` | Stale | Real minimum is Node 22+ (cssnano 9). Intentionally untouched for semver safety. |
| `npm run type-test` | Pre-existing failure | `tsd` looks for `src/index.test-d.ts` which does not exist. Independent of TS 7. |
| `tests/nav/buildNav.more-branches.test.js` | Timing-flaky | Passes in isolation; flakes under parallel CI load. |
| `benchmark` script | Broken | Points to deleted `scripts/benchmark-cdp.js`. Use `benchmark:lighthouse` instead. |
| `benchmarks/benchmark-lighthouse.js` | Untracked | New file; not yet committed. |

---

## 10. Do not do

1. **Do not edit `src/index.d.ts` by hand** — it is generated. Run `npm run gen-dts` instead.
2. **Do not upgrade `typedoc`** — 0.28.20 is latest; it crashes under TS 7.
3. **Do not nest `vi.mock()`** — Vitest 5 throws on load.
4. **Do not use `vi.unmock()`** — remove it; use `clearMocks: false` or `vi.doMock()` instead.
5. **Do not assign `navigator` directly** — use `Object.defineProperty` (jsdom 30).
6. **Do not run `npm install` in CI** — use `npm ci`.
7. **Do not change `engines.node`** without understanding semver implications for published package.
8. **Do not delete `benchmarks/benchmark-lighthouse.js`** — it is the active benchmark script.
9. **Do not commit build outputs** (`dist/`, `example/`, `coverage/`).
10. **Do not use `sed`/`awk`/`echo` for file edits** — use the `edit` or `write` tools.

---

## 11. Dependency upgrade notes (2026-10-05)

### Applied upgrades

- **Vitest**: 4.x → 5.0.3
- **@vitest/coverage-v8**: 2.x → 5.0.3
- **TypeScript**: 6.0.3 (side-by-side with 7.0.2)
- **jsdom**: 29 → 30
- **cssnano**: 7 → 9
- **postcss-discard-duplicates**: 7 → 9
- **postcss-merge-rules**: 7 → 9
- **puppeteer**: 24 → 25
- **marked**: 18.0.0 → 18.1.0
- Plus 23 patch/minor bumps across the toolchain

### Vulnerabilities

- Dropped from **48** to **11** after upgrades.

### Test fixes

- `tests/worker/slugWorker.unit.test.js`: Updated assertion to match 4-arg `buildSearchIndex` signature.
- `tests/markdown.coverage.extra.test.js`: Fixed `navigator` assignment for jsdom 30.

---

## 12. Quick reference

```bash
# Full verification sequence
npm ci
npm run build
npm run gen-dts
npm run check-dts
npm test
npm run lint
npm run docs
npm run prepare
```

Expected results:
- Build: 0 errors
- gen-dts: 0 errors
- check-dts: 0 errors
- Test: 799 passed / 0 failed
- Lint: 0 errors
- Docs: 0 errors
- Prepare: 0 errors
