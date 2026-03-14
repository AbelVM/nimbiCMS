
<img src="./assets/logo.png" alt="logo" style="height:256px;width:256px;" />

# nimbiCMS

Lightweight client-side CMS used for local editing and testing.

## Table of Contents

1. [Quick start](#quick-start)
2. [Problem statement](#problem-statement)
3. [Features](#features)
5. [Options & API](#options--api)
6. [Theming & Customization](#theming--customization)
7. [Localization](#localization)
8. [Content workflow](#content-workflow)
9. [Testing](#testing)
10. [Security & audit](#security--audit)
11. [Available Bulmaswatch themes](#available-bulmaswatch-themes)
12. [Next steps](#next-steps)

---

## Quick start

Remember this project exists because you want a CMS with **no database, no build step
on the server, and zero backend**.
Just drop a few markdown files into a folder, run a static host (e.g. GitHub
Pages) and the client code does the rest: it crawls the directory, turns
Markdown into HTML, hooks links, handles slugs and anchors, keeps a nav, and
updates SEO tags – all in the browser.  You can even edit content via the
GitHub web editor and refresh to see changes.  Perfect for gh-pages, S3, or
the kind of lightweight site where you want live preview without any server.

### basic HTML example

```html
<!doctype html>
<html><head><meta charset="utf-8">
<script src="/dist/nimbi-cms.js"></script>
<link rel="preload" href="/dist/nimbi-cms.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/dist/nimbi-cms.css"></noscript>
</head><body>
<div id="app" style="height:100vh"></div>
<script>
  // UMD bundle exposes global `nimbiCMS`
  // `contentPath` is optional and defaults to `./content` if omitted
  nimbiCMS.initCMS({ el: '#app' /*, cacheTtlMinutes: 10 */ })
</script>
</body></html>
```

### Bundle format usage

Examples showing how to consume each shipped bundle format produced by the build.

- UMD (browser global)

```html
<!-- include the UMD bundle and CSS -->
<link rel="stylesheet" href="/dist/nimbi-cms.css">
<script src="/dist/nimbi-cms.js"></script>
<div id="app"></div>
<script>
  // UMD exposes a global `nimbiCMS` object
  nimbiCMS.initCMS({ el: '#app' })
</script>
```

- ESM (modern bundlers / `<script type="module">`)

```html
<script type="module">
  // import from the ES build artifact
  import initCMS, { getVersion } from '/dist/nimbi-cms.es.js'

  // If you prefer named imports from the package, bundlers can resolve
  // the `module` field in package.json to this file.
  initCMS({ el: '#app' })
  // optional: read runtime version
  getVersion().then(v => console.log('nimbi-cms version', v))
</script>
```

- CJS (Node / CommonJS consumers)

```js
// require the CommonJS build
const { initCMS, getVersion } = require('./dist/nimbi-cms.cjs.js')

// initCMS is available to mount the library in a DOM-like environment
// (useful in SSR test harnesses or Node environments that provide DOM)
initCMS({ el: '#app' })
// optional: read runtime version
getVersion().then(v => console.log('nimbi-cms version', v))
```

Notes:

- The UMD build is a single, self-contained `dist/nimbi-cms.js` file that exposes the public API on the `nimbiCMS` global.
- The ES build is `dist/nimbi-cms.es.js` and is ideal for modern bundlers and `<script type="module">` usage.
- The CJS build is `dist/nimbi-cms.cjs.js` for CommonJS consumers.
- CSS is always shipped as `dist/nimbi-cms.css` and should be loaded alongside the script for styling.

Now create a `content/_navigation.md` file like this:

```markdown
- [Home](_home.md)
- [Blog](blog/)
```

(usually you’d add proper titles, links to posts etc.); that file drives the
sidebar navigation.

Then follow the normal build & serve steps below:

```bash
npm install
npm run build -- --outDir example/dist
```

Then serve `example/` for local testing:

```bash
npx http-server example -p 5174
# visit http://127.0.0.1:5174/
```

The dev workflow uses Vite; you can start the dev server with:

```bash
npm run dev
```

and open the example at `http://localhost:5173/example/index.html`.

## Search indexing depth

You can control how deep the client-side search index should go with the `indexDepth` option passed to `initCMS()` or via the URL query parameter `indexDepth` (values `1`, `2`, or `3`).

- `indexDepth: 1` (default) — index only H1 titles and excerpts.
- `indexDepth: 2` — also index H2 headings; H2 results include a subtle parent label showing the page's H1.
- `indexDepth: 3` — also index H3 headings; H3 results include a subtle parent label showing the page's H1 for context.

Example (URL param): `?indexDepth=3`

Example (init option):

```js
nimbiCMS.initCMS({ el: '#app', indexDepth: 3 })
```

## Crawling & search options

- `skipRootReadme` (default: `false`): by default the indexer treats a repository-root `README.md` like any other content page and will discover links within it. Set this option to `true` (via `initCMS({ skipRootReadme: true })` or `setSkipRootReadme(true)`) to opt-out and prevent link discovery inside the repository root README.

- External links are never crawled: absolute URLs (e.g. `http:`/`https:`), protocol-relative links (`//`), `mailto:` and other URI schemes are ignored by the crawler to prevent accidental traversal off-site.

- Markdown escapes are unescaped for search results: titles and heading text extracted from Markdown have common backslash escapes removed so results display `\_clearHooks` as `_clearHooks` for a cleaner UX.


Behavior notes for `indexDepth=2` and `indexDepth=3`:

- Search results for H2 (when `indexDepth>=2`) and H3 (when `indexDepth=3`) headings include a subtle parent label showing the containing page's H1. This helps users understand deeper-heading results' context at-a-glance.

Example of how a deeper-heading result may be rendered in the search UI (simplified):

```html
<div class="search-result">
  <div class="result-parent">My Page Title</div> <!-- shown for H2/H3 results when configured -->
  <div class="result-title">Section A</div>
  <div class="result-excerpt">A short excerpt from the section...</div>
</div>
```

- Content lives under `example/content/`.
- The SPA uses `?page=` query parameters internally.
- Build output is written to `example/dist` when targeting the example case.

Notes and recent fixes

- Slug resolution no longer guesses filenames: unmapped slugs return 404
  unless matched by an explicit nav or a discovered title slug.
- Improved caching and navigation handling (bfcache, scroll restore, and
  eager image marking heuristics) to reduce perceptible reloads and layout
  shifts.
- Search can be built lazily (`searchIndexMode: 'lazy'`) and falls back to
  a main-thread build if the worker is unavailable.

## Features

- Client-side rendering of GitHub‑flavored Markdown.
- Optional client-side search box built from H1 titles and excerpts (enabled by default).
- Code is now organized into small modules (`router.js`, `markdown.js`,
  `router.js`, `markdown.js`, etc.) to ease maintenance and testing.
- Sticky per-page TOC and Bulma‑based UI components (navbar, menu).
- Runtime updates for SEO, Open Graph and Twitter meta tags.
- Lazily loads images by default, while heuristically marking above‑the‑fold
  images as eager (adds `fetchpriority="high"` where appropriate). A CSS
  custom property `--nimbi-image-max-height-ratio` lets you tune what counts
  as "above the fold".
- Image preview modal with zoom controls, wheel zoom, drag pan, double-click to zoom, and touch pinch support.
- Syntax highlighting using `highlight.js` — only JS is bundled; other
  languages are auto-registered when detected.
- Simple theming (light/dark) and Bulma customization options.
- UMD build is self‑contained (no separate worker asset required). The markdown
  renderer now runs in an inlined Web Worker so the distributed bundle remains
  a single JS file while still off‑loading heavy parsing work off the main
  thread. Anchor rewriting currently runs in‑thread for portability, with a
  worker implementation kept in the source for future experimentation.

Worker manager (brief)

The repo includes a small `worker-manager` helper to standardize Worker
lifecycle and request/response messaging. Use `makeWorkerManager(createWorker, name)`
for a safe, cancellable request helper and `createWorkerFromRaw()` to build
Blob-backed workers for inline bundling. Prefer `manager.send(...)` for
short-lived RPC-style interactions and call `manager.terminate()` during
teardown for long-lived workers.

## Options & API

`initCMS(options)` mounts the CMS into a page. Options are grouped below by functionality.

**Core**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `el` | `string` \\ `Element` | required | CSS selector or DOM element used as the mount target. |
| `contentPath` | `string` | `./content` | URL path to the content folder serving `.md`/`.html` files; trailing slashes are normalized. |
| `allowUrlPathOverrides` | `boolean` | `false` | When `true` allows `contentPath`, `homePage`, and `notFoundPage` to be overridden via URL query parameters (opt-in; use with caution for security). |

**Indexing**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `searchIndex` | `boolean` | `true` | Enable the runtime search index and render a search box in the navbar. |
| `searchIndexMode` | `'eager' \| 'lazy'` | `'eager'` | When to build the index (`'eager'` on init, `'lazy'` on first query). |
| `indexDepth` | `1 \| 2 \| 3` | `1` | How deep headings are indexed (H1, H2, H3). |
| `noIndexing` | `string[]` | — | Paths (relative) to exclude from discovery and indexing. |
| `skipRootReadme` | `boolean` | `false` | When `true`, skip link discovery inside repository-root `README.md`. |

**Styling & Theming**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `defaultStyle` | `'light' \| 'dark'` | `'light'` | Initial UI theme. |
| `bulmaCustomize` | `'none' \| 'local' \| string` | `'none'` | Bulma customization source: `'none'` bundled, `'local'` loads `<contentPath>/bulma.css`, or a Bulmaswatch theme name to load from unpkg. |
| `highlightTheme` | `string` | `monokai` | Initial highlight.js theme. |

**Localization**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `lang` | `string` | — | UI language code (short form, e.g. `en`, `de`). |
| `l10nFile` | `string` | — | Path to a JSON localization file (relative paths resolve against the page). |
| `availableLanguages` | `string[]` | — | When set, the CMS treats a leading path segment as a language code and maps slugs per-language. |

**Caching & Performance**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `cacheTtlMinutes` | `number` | `5` | TTL for slug-resolution cache entries (minutes). Set to `0` to disable expiration. |
| `cacheMaxEntries` | `number` | — | Maximum entries in the router resolution cache. |
| `crawlMaxQueue` | `number` | `1000` | Upper bound on directories queued during breadth-first crawl. Set to `0` to disable the guard. |

**Advanced & Extensions**

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `markdownExtensions` | `Array<object>` | — | `marked`-style extension/plugin objects registered at init via `addMarkdownExtension()`. Useful for custom tokenizers, renderers, and link transforms. |

The `markdownExtensions` example (registering a simple inline tokenizer):

```js
// add a custom inline tokenizer that uppercases text
const upperExt = {
  name: 'upper',
  level: 'inline',
  start(src) { return src.search(/[A-Z]{2,}/); },
  tokenizer(src) {
    const match = /^[A-Z]{2,}/.exec(src);
    if (match) return { type: 'upper', raw: match[0], text: match[0].toLowerCase() };
  },
  renderer(token) { return `<span class="upper">${token.text}</span>`; }
};

initCMS({ el: '#app', markdownExtensions: [upperExt] });
```

The `initCMS` export itself is returned when you call it; additional helpers
are exposed (all are also available from the UMD bundle namespace).

### Version helper

The bundle exposes a small runtime helper so consumers can read the shipped
package version programmatically and the library shows a subtle build label
in the bottom-left corner of the mount element when initialized.

- `getVersion()` — async function that resolves to the package `version` string (e.g. `0.1.0`). Use this to display the library version in your UI or diagnostics.

When `initCMS()` runs it will append a non-interactive label with the text
`Ninbi CMS v. ${version}` to the mount element. The label falls back to
`Ninbi CMS v. 0.0.0` when a runtime package.json import isn't available.

> **TypeScript users:** a `src/index.d.ts` declaration file is shipped with
> the package that describes the public API. It includes not only the main
> `initCMS` options but also the lower‑level utilities and maps documented below.
> 
> The file is generated by a helper script (`npm run gen-dts`) which scans the
> source tree for `export` statements and JSDoc comments.  The script also
> prepends some manual type definitions (like `InitOptions`, `HookContext`,
> and the core hook helpers) and adds a comment header before each block to
> indicate the original source file.  This makes it easy to trace a type back
> to where it lives in `src/`.
> 
> If you modify or add exports you should rerun the script; it will overwrite
> the automatically generated portion of the declaration.  For additional
> corner‑case coverage we maintain a small sample file (`src/gen-dts-sample.js`)
> that the unit test exercises, so the generator is exercised against nested
> 
> The generated declaration also inserts a brief comment before each export
> block indicating the originating source file, which makes it easy to trace a
> type back to its implementation.
> generics, unions, destructured parameters, and other tricky cases.
> 
> To validate the output, use `npm run check-dts` (a thin wrapper around
> `tsc --noEmit ...`).  This is handy in CI or before publishing to
> catch accidental syntax errors caused by complex JSDoc expressions.

### Advanced utilities

For plugin authors and power users who want to dig deeper, here’s what you
can grab from the bundle.  Examples follow each group.

- `runHooks(name, ctx)` – trigger any hook yourself (useful in tests or if
  you build your own navigation).  

  ```js
  // manually fire onPageLoad for analytics when you inject HTML
  import { runHooks } from 'nimbi-cms'
  runHooks('onPageLoad', { pagePath:'foo.md', article:el })
  ```

- markdown plug-in helpers: addMarkdownExtension(ext) & setMarkdownExtensions(list) allow runtime registration of marked extensions.
- Slug/markdown helpers: `slugToMd`, `mdToSlug` (maps), `ensureSlug()`,
  `crawlForSlug()`, `setContentBase()`, `clearFetchCache()`, and the
  `fetchCache` map.  Handy if you want to show a list of all slugs or resolve
  them yourself.

  ```js
  import { slugToMd, ensureSlug } from 'nimbi-cms'
  // log all known slugs
  console.log(Array.from(slugToMd.keys()))
  // programmatically resolve one
  ensureSlug('my-page', '/content/').then(p => console.log(p))
  ```

- Code‑highlight helpers: `registerLanguage()`, `loadSupportedLanguages()`,
  `SUPPORTED_HLJS_MAP`, `BAD_LANGUAGES`, and `observeCodeBlocks()`.
  Use this if you want to pre‑register extra languages or tweak the list.
  The supported-language list is now fetched lazily (only when a code block
  is encountered or you explicitly call `registerLanguage`), so startup cost
  is minimal.  You can still manually call `loadSupportedLanguages()` if you
  prefer eager loading or want to inspect the map.

  ```js
  import { registerLanguage, observeCodeBlocks } from 'nimbi-cms'
  registerLanguage('r') // load R syntax from CDN on demand
  observeCodeBlocks(document.body)
  ```

- Misc helpers like `slugify()`, `isExternalLink()`, `normalizePath()`,
  `setLazyload()`, and `safe()` are also exported for reuse in plugins.

  ```js
  import { slugify } from 'nimbi-cms'
  console.log(slugify('My super title')) // -> 'my-super-title'
  ```

- Slug/markdown helpers: `slugToMd`, `mdToSlug` (maps), `ensureSlug()`,
  `crawlForSlug()`, `setContentBase()`, `clearFetchCache()`, and the
  `fetchCache` map.  These let you interrogate or modify the slug resolution
  state directly.
- Code‑highlight helpers: `registerLanguage()`, `loadSupportedLanguages()`,
  `SUPPORTED_HLJS_MAP`, `BAD_LANGUAGES`, and the `observeCodeBlocks()` hook.
- Low‑level helpers such as `slugify()`, `isExternalLink()`, `normalizePath()`,
  `setLazyload()`, and `safe()` are also available for reuse in plugins.

The TypeScript declaration file includes types for all of these symbols.

- `registerLanguage(name, modulePath)` – dynamically register a highlight.js
  language (path may be a CDN URL).
- `setStyle('light'|'dark')` – switch between light and dark modes (adds
  `data-theme` / `is-dark` class). This is the runtime API for dark/light
  toggling.
- `setLang(code)` – change the UI language on the fly. The string argument
  is a short locale code (e.g. `'de'`, `'fr'`); it falls back to English
  if the requested dictionary isn’t available.
- `setThemeVars(vars)` – apply a set of CSS custom properties (`--foo:bar`)
  on the document root; handy for theming colors/fonts without rebuilding
  Bulma.
- `setHighlightTheme(name, { useCdn })` – change the code highlight theme.

Example:

```javascript
// example
import initCMS, { setStyle, setThemeVars } from 'nimbi-cms'

setStyle('dark')                    // switch mode
setThemeVars({ '--primary': '#06c' }) // tweak colors/fonts
```

### Plugin Hooks

A minimal plugin/extension API lets you run custom code at key moments. The
following convenience functions are exported; they all accept a callback which
is invoked with a single context object describing the current state.

- `onPageLoad(fn)` – called **after** a page has been rendered and inserted
  into the DOM. Useful for analytics, search indexing, or runtime tweaks.
- `onNavBuild(fn)` – called after the navigation bar is constructed (before
  it’s attached to the document), when you can mutate links or add extra
  controls.
- `transformHtml(fn)` – called just before an article node is appended; you can
  manipulate the element or inspect the generated HTML string.

A generic `addHook(name,fn)` is also available; supported names are
`'onPageLoad'`, `'onNavBuild'`, and `'transformHtml'`. Errors thrown by hooks are
caught and ignored so third‑party code can’t crash the main CMS.

For example:

```js
import initCMS, { onPageLoad, onNavBuild } from 'nimbi-cms'

onNavBuild(({navWrap, navbar, linkEls}) => {
  const input = document.createElement('input')
  input.placeholder = 'search…'
  navWrap.querySelector('.navbar-start').prepend(input)
})

onPageLoad(({pagePath, article}) => {
  console.log('page done', pagePath)
})
```

These hooks give you an easy entry point for adding analytics, search,
custom rendering, and other features without needing to fork the source.


## HTML Links without Extensions

Navigation entries or anchors pointing at HTML pages need not include the
`.html` suffix.  During startup the CMS will automatically append the
extension when building slug mappings so that clicking or searching for the
slug works regardless of whether the original link had the file name or not.


## Theming & Customization

Bulma is bundled by default. To alter styles at runtime, use
`bulmaCustomize` with `'local'` or a Bulmaswatch theme name:

```js
initCMS({ el: '#app', contentPath: './content', bulmaCustomize: 'flatly' })
```

For build‑time custom Bulma, replace the import in `src/nimbi-cms.js` with
your compiled CSS and rebuild.

Light/dark toggling is managed via `defaultStyle` or `setStyle()`; highlight
colors can be changed with `setHighlightTheme()` (CDN load if `useCdn=true`).

## Localization

- `lang` option forces a UI language (short code, e.g. `en`, `de`).
- `l10nFile` may point to a JSON file of translations; relative paths resolve
  against the page directory.
- Built‑in defaults live in `DEFAULT_L10N`; loaded files merge on top and fall
  back to English.

To localize content (e.g. `content/en/` and `content/fr/`), point `contentPath`
at the desired language directory (for example, `contentPath: './content/en/'`).
The `lang` option only affects UI strings, not which content directory is used.

Example:

```js
// initial render (English content + UI)
initCMS({ el: '#app', contentPath: './content/en/', lang: 'en', availableLanguages: ['en','fr'] })

// later (French content + UI). This typically requires re-initializing the
// CMS or reloading the page with the new configuration.
initCMS({ el: '#app', contentPath: './content/fr/', lang: 'fr', availableLanguages: ['en','fr'] })
```

After initialization you can also change only the UI language at any time by
calling the exported `setLang(code)` helper. This updates internal state so
subsequent calls to `t()` return strings from the new dictionary.

> Note: `setLang()` does **not** reload or re-initialize the CMS; it only
> affects UI strings and the slug resolution logic when `availableLanguages` is
> configured. To switch content folders (e.g. `content/en/` → `content/fr/`),
> re-run `initCMS()` with a different `contentPath` (and `availableLanguages`).

Example translation file:

```json
{
  "de": { "navigation": "Navigation", "onThisPage": "Auf dieser Seite" }
}
```

Usage:

```js
// contentPath is optional
initCMS({ el: '#app', l10nFile: '/i18n/l10n.json', lang: 'de' })

// later, switch to French at runtime
import { setLang } from 'nimbi-cms'
setLang('fr')
```

## Content workflow

Drop `.md` files into your content directory. No build step is necessary; a
static server that serves the files is sufficient.

**Required files**

- Home page: by default, `_home.md` is required. You can override this with the `homePage` option to use a different `.md` or `.html` file as the home page.
- `_navigation.md` – renders into the navbar; use Markdown links.
- `_404.md` – optional fallback for 404 responses. When the server
  responds to a requested `.md` path with an HTML document (for example
  an SPA server that returns `index.html` for unknown routes), the CMS
  treats that as a missing markdown page and will attempt to load
  `/_404.md` from the configured content base so a proper 404 page can be
  rendered instead of the site's index HTML.
* `homePage` – **string** (optional, default `'_home.md'`). Sets the site’s home page. Can be a `.md` or `.html` file. If not set, falls back to `'_home.md'`. Example:
  ```js
  initCMS({ el: '#app', homePage: 'index.html' })
  ```
  This allows you to use either a Markdown or HTML file as the home page.
* `notFoundPage` – **string** (optional, default `'_404.md'`). Sets the site's not-found page. Can be a `.md` or `.html` file. When the CMS detects a missing markdown request or the server returns HTML for a `.md` path (common with SPA fallbacks), the configured `notFoundPage` will be used if available. Example:
  ```js
  initCMS({ el: '#app', notFoundPage: '_404.md' })
  ```

Example nav markup:

```
[Home](_home.md)
[Blog](blog.md)
[About](about.md)
```


Links are converted to hash‑based navigation (`?page=…`), preserving anchors.

## Testing

A comprehensive Vitest suite covers every module as well as the declaration
generator itself.  The `tests/genDts.test.js` file runs `npm run gen-dts` and
inspects the resulting `src/index.d.ts` for a handful of edge‑case types
(see `src/gen-dts-sample.js` for the corresponding exports).  This ensures
that future tweaks to `scripts/gen-dts.js` don’t regress the handling of
unions, nested generics, destructuring, etc.


- Anchor/hash behaviour: open
  `http://127.0.0.1:5174/?page=dummy-html-test-page#some-anchor`.
- Verify no mass `.md` fetches by inspecting the network tab on an HTML page.

## Security & audit

Dependencies were updated during development. If you need a conservative
upgrade policy, let me know and I can prepare a selective plan.

### Runtime path sanitization

To reduce the risk of accidental exposure or path traversal on static hosts,
the client now sanitizes and normalizes runtime path options. Important
behaviour changes:

- `contentPath`, `homePage`, and `notFoundPage` are not accepted from the
  page URL query string by default. These values may be provided programmatically
  via the `initCMS()` `options` object only.
- When the host page explicitly opts in by passing `allowUrlPathOverrides: true`
  to `initCMS()`, the library will consider URL query string overrides. Even
  in that mode the values are validated and unsafe values are rejected.

Sanitization rules applied client-side:

- `contentPath`: must be a non-empty string, must not contain `..` segments,
  must not be an absolute URL (no `protocol://`), must not start with `//`,
  and must not be an absolute filesystem path (leading `/` or Windows drive
  prefix). The value is normalized to a relative path with a trailing slash.
- `homePage` / `notFoundPage`: must be a simple basename (no slashes), only
  contain letters, numbers, dot, underscore or hyphen, and must end with
  `.md` or `.html`. Example safe names: `index.html`, `_home.md`.

If an unsafe value is detected the library will throw a `TypeError` when
initializing. Unit tests were added to cover the common misuse cases
(`tests/init.sanitization.test.js`) and the existing URL-override tests
ensure the default behaviour (ignoring URL-provided paths) remains safe.

If you need an advanced opt-in for integration tests or unusual hosting
environments, use `allowUrlPathOverrides: true` with caution and only when
you control the embedding page and the static host configuration.

### Opt-in usage example (cautious)

If you really need URL-driven overrides (for example in an integration test
or a special controlled embed scenario), you must enable them explicitly in
script code — they cannot be enabled from the URL itself. Only do this when
you control both the embedding page and the static host's content layout.

UMD example (bundle exposes `nimbiCMS`):

```html
<script>
  // Only enable in trusted environments
  nimbiCMS.initCMS({ el: '#app', allowUrlPathOverrides: true })
</script>
```

ES module example:

```js
import initCMS from 'nimbi-cms'

// Only enable in trusted environments where the host page is controlled
initCMS({ el: '#app', allowUrlPathOverrides: true })
```

Note: enabling `allowUrlPathOverrides` still runs client-side validation; if
an unsafe value is supplied the call to `initCMS()` will throw a `TypeError`.
Prefer passing `contentPath`, `homePage`, and `notFoundPage` directly in the
`options` object from secure script code rather than relying on URL query
parameters.

## Available Bulmaswatch themes

default, cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux,
materia, minty, nuclear, pulse, sandstone, simplex, slate, solar, spacelab,
superhero, united, yeti.

See previews at
<https://jenil.github.io/bulmaswatch/> and load via `bulmaCustomize`.

## Next steps

- Bundle extra highlight.js languages to reduce runtime CDN requests.
- Run a smoke test on the example build and report missing assets/console errors.