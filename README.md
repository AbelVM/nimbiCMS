
<img src="./logo.png" alt="logo" width="256" height="256" />

# nimbiCMS

Lightweight client-side CMS used for local editing and testing.

## Table of Contents

1. [Quick start](#quick-start)
2. [Problem statement](#problem-statement)
3. [Development notes](#development-notes)
4. [Features](#features)
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
<link rel="stylesheet" href="/dist/nimbi-cms.css">
</head><body>
<div id="app" style="height:100vh"></div>
<script>
  // UMD bundle exposes global `nimbiCMS`
  // `contentPath` is optional and defaults to `./content` if omitted
  nimbiCMS.initCMS({ el: '#app' /*, cacheTtlMinutes: 10 */ })
</script>
</body></html>
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

## Development notes

- Content lives under `example/content/`.
- The SPA uses `?page=` query parameters internally.
- Build output is written to `example/dist` when targeting the example case.

Recent behaviour fixes worth knowing:

- Avoids hardcoded `.md` appends, `_home` prefixes, or index fallbacks; slugs
  resolve only via explicit mappings and derived H1 values (no guessing).  The
  CMS now pre-computes the slug for the home page during initialization and
  populates every nav-linked page's slug ahead of the first render, so
  direct linking to a slug works even on a cold start.
- Supports raw `.html` content (parses title/H1 and maps to a slug) without
  forcing Markdown rendering.
- Prevents aggressive prefetching of linked markdown files.
- Preserves URL hash anchors during navigation and improves scroll handling.
- Intercepts navbar/content links to perform SPA navigation (no reloads).
- Lazy-loads images and defers code highlighting via `IntersectionObserver`.
- In-memory caching of fetched markdown and slug resolutions speeds up
  repeat navigations and reduces network traffic.  The router cache is
  subject to both a maximum entry count and a time‑to‑live (TTL) so a
  long‑running page won't accumulate stale lookups; the TTL is configurable
  via the `cacheTtlMinutes` option passed to `initCMS()`.
- URL slug fallback **no longer** appends `.md`/`.html`; passing an
  unmapped slug produces a 404 rather than assuming a filename.  Slugs are
  sanitized to strip any accidental `.md`/`.html` text from headers.  To
  keep direct links working even before any page has loaded, the router will
  perform a one-time check of the home page’s H1 slug and map it if it
  matches the requested slug; this means cold-start requests to the home
  slug yield the expected content rather than an error.  When a slug isn't
  found in the navigation we fall back to crawling the `contentPath` using
  directory listings, looking for a markdown file whose title slug matches
  the requested value.  This on‑demand traversal means arbitrary files in
  arbitrarily deep subfolders resolve correctly on static servers, with the
  results cached for subsequent lookups.

## Features

- Client-side rendering of GitHub‑flavored Markdown.
- Optional client-side search box built from H1 titles and excerpts (enabled by default).
- Code is now organized into small modules (`router.js`, `markdown.js`,
  `filesManager.js`, etc.) to ease maintenance and testing.
- Sticky per-page TOC and Bulma‑based UI components (navbar, menu).
- Runtime updates for SEO, Open Graph and Twitter meta tags.
- Syntax highlighting using `highlight.js` — only JS is bundled; other
  languages are auto-registered when detected.
- Simple theming (light/dark) and Bulma customization options.
- UMD build is self‑contained (no separate worker asset required).

## Options & API

`initCMS(options)` mounts the CMS into a page. Options:

- `el` **(required)** – CSS selector string for the mount element (e.g.
  `#app`). A DOM element is also accepted for compatibility.
- `contentPath` – URL path to the content folder serving raw `.md` files
  (default `./content` or `/content`). The library normalizes trailing slashes.
- `cacheTtlMinutes` – **number** (default `5`).  Time‑to‑live for slug resolution cache entries, expressed in minutes.  Internally this is converted to milliseconds and assigned to `RESOLUTION_CACHE_TTL` in the router module.  Setting this to `0` effectively turns off expiration (the cache is still size‑bounded by cacheMaxEntries).
- `cacheMaxEntries` – **number** (optional).  Maximum number of entries the
  router will hold in its resolution cache.  If unspecified the built‑in
  constant `RESOLUTION_CACHE_MAX` (currently 100) is used.  Fine‑tune this
  when targeting devices with limited memory or when you want a larger cache
  for a heavy traffic site.
- `crawlMaxQueue` – **number** (default `1000`). Upper bound on the number of
  directories the internal slug crawler will queue during a breadth‑first
  traversal.  Setting this to `0` disables the guard; a lower value improves
  safety on deeply nested content trees but may prevent discovery of pages in
  extreme structures.
- `searchIndex` – **boolean** (default `true`). When enabled the CMS
  builds a lightweight index of page titles/excerpts and inserts a search box
  into the navbar.  The search input is initially disabled and shows a
  Bulma loading spinner while the index is being constructed; once ready the
  field becomes interactive.  Placeholder text is pulled from the
  localization dictionary under the key `searchPlaceholder` (see `l10n`
  options).

  The core index builder runs entirely at runtime when `initCMS()` is
  called.  It gathers slug information from three sources in order:

  1. the `allMarkdownPaths` array, which is populated at build time only by the
     example harness; library consumers ship with an empty list.
  2. slug mappings inferred from navigation links or previously visited pages.
  3. a directory crawl (`crawlAllMarkdown`) of the `contentPath`, which works
     even when the server does not expose directory listings.

  Because the index is built on init, there is **no** build-time scanning or
  embedding of content paths.  The crawler will traverse directory listings at
  runtime to discover every `.md`/`.html` file in the `contentPath`.
  Disable `searchIndex` to skip the work entirely.
- `defaultStyle` – `'light' | 'dark'` (default `'light'`). Controls initial
  theme; use `setStyle()` to toggle later.
- `bulmaCustomize` – `'none' | 'local' | '{theme_name}'` (default `'none'`).
  - `'none'`: bundled Bulma.
  - `'local'`: load `<contentPath>/bulma.css` or `/bulma.css` and inject it.
  - `'{theme_name}'`: load from `https://unpkg.com/bulmaswatch/{theme_name}`.
- `highlightTheme` – initial highlight.js theme (default `monokai`).
- `markdownExtensions` – **Array&lt;object&gt;** (optional). A list of [marked](https://github.com/markedjs/marked) extension/plugin objects to register during initialization. These will be added via `addMarkdownExtension()` before any content is rendered; useful for custom syntax, link transformations, or other parser tweaks. Theres a big list of off-the-shelf extensions [here](https://marked.js.org/using_advanced#extensions).

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

> **Note:** the formerly available `languages` option has been removed. Fenced-
> code detection handles language registration automatically.

The `initCMS` export itself is returned when you call it; additional helpers
are exposed (all are also available from the UMD bundle namespace).

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

### Plugin Hooks (new)

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


## HTML links without extensions

Navigation anchors pointing at HTML pages do not need to include the
`.html` suffix.  During initialization the CMS will append the extension when
creating slug mappings, ensuring both clicks and search resolve correctly.

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

After initialization you can also change the UI language at any time by
calling the exported `setLang(code)` helper. This updates internal state so
subsequent calls to `t()` return strings from the new dictionary.

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

- `_home.md` – the site’s home page (must exist).
- `_navigation.md` – renders into the navbar; use Markdown links.
- `_404.md` – optional fallback for 404 responses.

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

## Available Bulmaswatch themes

default, cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux,
materia, minty, nuclear, pulse, sandstone, simplex, slate, solar, spacelab,
superhero, united, yeti.

See previews at
<https://jenil.github.io/bulmaswatch/> and load via `bulmaCustomize`.

## Next steps

- Bundle extra highlight.js languages to reduce runtime CDN requests.
- Run a smoke test on the example build and report missing assets/console errors.
