
<img src="./assets/logo.png" alt="logo" style="height:256px;width:256px;" />

# nimbiCMS

Lightweight client-side CMS used for local editing and testing.

## Table of Contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [Examples](#examples)
4. [Features](#features)
5. [Options](#options)
6. [API](#api)
7. [Theming](#theming-and-customization)
8. [Localization](#localization)
9. [Content workflow](#content-workflow)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Bulmaswatch themes](#available-bulmaswatch-themes)
13. [GitHub Pages](#using-with-github-pages-and-the-github-file-editor)
14. [Roadmap](#roadmap)
15. [Changelog](#changelog)

---

## Installation

```bash
npm install
npm run build
```

For development with live reload:

```bash
npm run dev
```

## Quick start

NimbiCMS is a client-side CMS for static sites that requires **no database, no server build step, and no backend**.

Just drop your Markdown files into a folder, serve the site (GitHub Pages, S3, etc.), and the client will crawl the content, render Markdown to HTML, hook links, manage slugs and anchors, maintain navigation, and update SEO tags.

Editing content via the GitHub web editor works too—just save and refresh to see updates.

### Basic HTML example

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

### Bundle formats

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

## Examples

Quick runnable examples are provided in the `example/` folder. The simplest way to try the project locally:

```bash
npm install
npm run build -- --outDir example/dist
npx http-server example -p 5174
# then open http://127.0.0.1:5174/example/index.html
```

You can also run the dev server and open the example page with live reload:

```bash
npm run dev
# open http://localhost:5173/example/index.html
```

Programmatic example (UMD):

```html
<div id="app"></div>
<script src="/dist/nimbi-cms.js"></script>
<script>nimbiCMS.initCMS({ el: '#app', contentPath: './content' })</script>
```

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

## Crawling & Search Options

- `skipRootReadme` (default: `false`): by default the indexer treats a repository-root `README.md` like any other content page and will discover links within it. Set this option to `true` (via `initCMS({ skipRootReadme: true })` or `setSkipRootReadme(true)`) to opt-out and prevent link discovery inside the repository root README.

- External links are never crawled: absolute URLs (e.g. `http:`/`https:`), protocol-relative links (`//`), `mailto:` and other URI schemes are ignored by the crawler to prevent accidental traversal off-site.

## Navbar Logo Option

You can display a small site logo at the leftmost position of the navbar by passing the `navbarLogo` option to `initCMS()`.

- `none` — no logo (default behavior if omitted)
- `favicon` — use the page's favicon (only PNG favicons are used; other formats fall back to none)
- `<path>` — a string path or URL to an image (absolute or relative)
- `copy-first` — extract the first `<img>` from the configured `homePage` and use it as the navbar logo
- `move-first` — same as `copy-first` but also marks the image as moved by setting the `data-nimbi-logo-moved` attribute on the document element (consumers can remove the original image during render)

Example:

```js
nimbiCMS.initCMS({ el: '#app', navbarLogo: 'favicon' })
```

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


## Features

- Client-side rendering of GitHub‑flavored Markdown.
- Optional client-side search box built from H1 titles and excerpts (enabled by default).
- Code is now organized into small modules (`router.js`, `markdown.js`, etc.) to ease maintenance and testing.
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

## Options

`initCMS(options)` mounts the CMS into a page. The table below summarizes the supported `InitOptions` (see `src/index.d.ts` for the generated declarations).

### Core

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `el` | `string` \ `Element` | required | CSS selector or DOM element used as the mount target. |
| `contentPath` | `string` | `/content` | URL path to the content folder serving `.md`/`.html` files; normalized to a relative path with trailing slash. |
| `allowUrlPathOverrides` | `boolean` | `false` | Opt-in: when `true`, `contentPath`, `homePage`, and `notFoundPage` may be overridden from the page URL (validated). |

### Indexing and Search

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `searchIndex` | `boolean` | `true` | Enable the runtime search index and render a search box. |
| `searchIndexMode` | `'eager'` \| `'lazy'` | `'eager'` | When to build the index (`'eager'` on init, `'lazy'` on first query). |
| `indexDepth` | `1 \| 2 \| 3` | `1` | How deep headings are indexed (H1, H2, H3). |
| `noIndexing` | `string[]` | — | Paths (relative) to exclude from discovery and indexing. |
| `skipRootReadme` | `boolean` | `false` | When `true`, skip link discovery inside a repository-root `README.md`. |

> Tip: use `indexDepth` (1–3) to control how deeply headings are indexed for search results; higher values include deeper headings and add a parent-label context for H2/H3 hits.

### Routing and Pages

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `homePage` | `string` | `'_home.md'` | Basename for the site home page (`.md` or `.html`). |
| `notFoundPage` | `string` | `'_404.md'` | Basename for the not-found page (`.md` or `.html`). |

### Styling and Theming

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `defaultStyle` | `'light'` \| `'dark'` \| `'system'` | `'light'` | Initial UI theme. |
| `bulmaCustomize` | `string` | `'none'` | `'none'` (bundled), `'local'` (load `<contentPath>/bulma.css`) or a Bulmaswatch theme name to load remotely. |
| `navbarLogo` | `string` | `'favicon'` | Small site logo placed at the leftmost position of the navbar. Supported values: `none`, `favicon` (uses PNG favicon when available), a path or URL to an image, `copy-first` (use first image from `homePage`), and `move-first` (use first image from `homePage` and remove it from the rendered page). |

### Localization

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `lang` | `string` | — | UI language code (e.g. `en`, `de`). |
| `l10nFile` | `string \| null` | `null` | Path to a JSON localization file (relative paths resolve against the page). |
| `availableLanguages` | `string[]` | — | When set, treats a leading path segment as a language code and maps slugs per-language. |

### Caching and Performance

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `cacheTtlMinutes` | `number` | `5` | TTL for slug-resolution cache entries (minutes). Set `0` to disable expiration. |
| `cacheMaxEntries` | `number` | — | Maximum entries in the router resolution cache. |
| `crawlMaxQueue` | `number` | `1000` | Upper bound on directories queued during breadth-first crawl (0 disables the guard). |

### Advanced and Extensions

| Option | Type | Default | Description |
|---|---:|:---:|---|
| `markdownExtensions` | `Array<object>` | — | `marked`-style extension/plugin objects registered at init via `addMarkdownExtension()`. |
| `markdownPaths` | `string[]` | — | Optional host-provided list of markdown paths used by slug resolution/search. |

## API

The `nimbi-cms` package exports a small set of helpers in addition to the
default `initCMS` export. These are available as named imports in ESM and as
properties on the `nimbiCMS` global in UMD builds.

> **Note:** the default export (`initCMS`) and the `default` alias are intentionally excluded from this list.

### Version

- `getVersion()` — returns a `Promise<string>` that resolves to the shipped package version (e.g. `"0.1.0"`). Useful for displaying build metadata or detecting whether the loaded bundle matches a deployed backend.

```js
import { getVersion } from 'nimbi-cms'
getVersion().then(v => console.log('nimbiCMS version', v))
```

### Hooks (extension points)

These helpers let you hook into internal rendering and navigation without forking the source.

- `addHook(name, fn)` — register a callback for one of the supported hook points (`'onPageLoad' | 'onNavBuild' | 'transformHtml'`).
- `onPageLoad(fn)` — fired after a page is rendered and inserted into the DOM. Useful for analytics, adding UI enhancements, or triggering client-side behavior once content is available.
- `onNavBuild(fn)` — fired after the navigation HTML is constructed but before it is attached to the document; ideal for mutating nav links, injecting controls, or adding a search input.
- `transformHtml(fn)` — fired just before an article node is appended; gives you access to the generated DOM element and HTML string so you can alter structure, add attributes, or instrument the output.
- `runHooks(name, ctx)` — programmatically invoke hook callbacks (useful in tests or when you want to replay a lifecycle event after manually inserting content).
- `_clearHooks()` — clear all registered hooks. This is mainly intended for unit tests so each test can start with a clean hook slate.

```js
import { onPageLoad, onNavBuild, transformHtml } from 'nimbi-cms'

onPageLoad(({ pagePath, article }) => {
  console.log('page rendered', pagePath)
  // e.g. initialize custom widgets inside the loaded article
})

onNavBuild(({ navWrap }) => {
  const btn = document.createElement('button')
  btn.textContent = 'Toggle theme'
  btn.onclick = () => setStyle('dark')
  navWrap.querySelector('.navbar-end')?.appendChild(btn)
})

transformHtml((html, article) => {
  // Add a data attribute to every rendered page
  article.dataset.nimbiRendered = 'true'
})
```

### Theming & Styling helpers

- `ensureBulma(bulmaCustomize?, pageDir?)` — ensures Bulma is loaded. Pass `'local'` to load a local `bulma.css` (looks in the page directory and `/${pageDir}/bulma.css`), or pass a Bulmaswatch theme name (e.g. `'flatly'`) to load from unpkg.
- `setStyle(style)` — switch between light/dark/system modes by updating `data-theme` and the `is-dark` class on the document. This matches the behavior of the built-in theme toggle.
- `setThemeVars(vars)` — apply a set of CSS custom properties (e.g. `{ "--primary": "#06c" }`) on the document root for runtime theming without rebuilding.

```js
import { ensureBulma, setStyle, setThemeVars } from 'nimbi-cms'

// Load a Bulmaswatch theme from unpkg
ensureBulma('flatly')

// Or load a local bulma.css (useful for self-hosted overrides)
ensureBulma('local', './content/')

setStyle('dark')
setThemeVars({ primary: '#06c', 'font-family': 'system-ui' })
```

### Localization helpers

- `t(key, ...args)` — translate a UI string key using the currently loaded locale dictionary. Supports parameter substitution like `t('helloUser', 'Alice')`.
- `loadL10nFile(url)` — fetch and merge a JSON localization file into the current dictionary. Does not automatically rerender UI (useful for on-demand language packs).
- `setLang(code)` — switch the UI language at runtime (e.g. `'en'`, `'de'`). This updates internal strings and affects slug resolution when `availableLanguages` is configured.

```js
import { t, loadL10nFile, setLang } from 'nimbi-cms'

// Dynamic translation
console.log(t('navigation'))

// Load an external translations file
await loadL10nFile('/i18n/l10n.json')
setLang('de')
```

### Code highlighting helpers

- `registerLanguage(name, modulePath)` — dynamically register a `highlight.js` language. Useful to lazy-load rarely used languages from a CDN.
- `loadSupportedLanguages()` — preload the supported languages map used by the on-demand language loader.
- `observeCodeBlocks(root)` — scan a DOM subtree and apply syntax highlighting to code blocks using the currently registered languages.
- `setHighlightTheme(name, { useCdn })` — switch the theme used by `highlight.js` (optionally fetch the CSS from CDN when `useCdn=true`).
- `SUPPORTED_HLJS_MAP` — map of supported highlight.js language identifiers (useful for building language selection UIs).
- `BAD_LANGUAGES` — list of languages that should not be auto-registered (usually because they are unsupported or conflict with browser file types).

```js
import { registerLanguage, observeCodeBlocks, setHighlightTheme } from 'nimbi-cms'

registerLanguage('r', 'https://unpkg.com/highlight.js/lib/languages/r.js')
observeCodeBlocks(document.body)
setHighlightTheme('monokai', { useCdn: true })
```

> For a complete listing of exported symbols and TypeScript types, see [the documentation](docs/README.md).

## HTML Links without Extensions

Navigation entries or anchors pointing at HTML pages need not include the
`.html` suffix.  During startup the CMS will automatically append the
extension when building slug mappings so that clicking or searching for the
slug works regardless of whether the original link had the file name or not.


## Theming and Customization

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

## Content Workflow

Drop `.md` files into your content directory. No build step is necessary; a
static server that serves the files is sufficient.

**Required files**

- `_home.md` — required by default. You can override this with the `homePage` option to use a different `.md` or `.html` file as the home page.
  ```js
  initCMS({ el: '#app', homePage: 'index.html' })
  ```
- `_navigation.md` — renders into the navbar; use Markdown links.
- `_404.md` — optional fallback for 404 responses. When the server responds to a requested `.md` path with an HTML document (e.g., an SPA fallback serving `index.html`), the CMS treats that as a missing markdown page and will attempt to load `/_404.md` from the configured content base so a proper 404 page can be rendered instead of the site's index HTML.
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
<https://jenil.github.io/bulmaswatch/> and load via `bulmaCustomize` option or `ensureBulma` method.

## Using with GitHub Pages and the GitHub file editor

Nimbi CMS works well with GitHub Pages and the built-in GitHub web file editor. Minimal steps:

- Enable GitHub Pages for the repository (Settings → Pages) and choose the branch/folder you want to publish (e.g., `gh-pages` or `main` / `/docs`).
- Ensure your published site serves the built `dist` assets (upload `dist/` to the chosen branch or use a build step / GitHub Action to publish).
- Place your content under a folder (default: `content/`) or set `contentPath` when calling `initCMS()` to point somewhere else.

Editing content via the GitHub web editor:

1. Open the repository on [GitHub](https://github.com) and navigate to the `content/` folder (or your chosen `contentPath`).
2. Click any `.md` file, then click the pencil icon to edit the file in the browser.
3. Make changes and commit them directly to the branch. The published site will receive the updates on the next Pages build (or immediately if you host the `dist` on the same branch).
4. Refresh the site to see the updated content. Nimbi CMS loads content at runtime, so browser refresh shows the latest files.

Tips:
- Add or update `content/_navigation.md` to control the navigation bar; the nav is re-built when pages are crawled.
- If you publish `dist/` separately (for example to `gh-pages`), consider a GitHub Action to build and push `dist/` automatically from `main`.
- To preview locally before pushing, run:

```bash
npm run build -- --outDir example/dist
npx http-server example -p 5174
# visit http://127.0.0.1:5174/
```

Security note: Avoid exposing sensitive paths via URL query options; do not allow untrusted runtime overrides for `contentPath`, `homePage`, or `notFoundPage` unless you validate them server- or build-side.

## Roadmap

- See the project issue tracker for planned improvements and priorities.

## Troubleshooting

### Content not loading / 404 pages
- Verify `contentPath` is correct and matches the directory containing your `.md` files.
- Ensure your static server is serving those files (a 404 is often because the content folder isn’t published or the path is wrong).
- If you’re using `homePage`/`notFoundPage`, confirm those files exist and are reachable (the default is `_home.md` and `_404.md`).

### Styles not appearing / Bulma missing
- Ensure `dist/nimbi-cms.css` is loaded alongside `dist/nimbi-cms.js`.
- If using `bulmaCustomize: 'local'`, confirm `bulma.css` exists in the content path or at `/bulma.css`.
- If using a Bulmaswatch theme, verify the theme name is correct (see `Available Bulmaswatch themes`).

### Scripts failing / no mount element
- Make sure the mount element exists (`<div id="app"></div>`) and `initCMS({ el: '#app' })` uses the correct selector.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details on recent changes, bug fixes, and improvements.