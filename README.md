# nimbiCMS_pre

Lightweight client-side CMS used for local editing and testing.

## Table of Contents
1. [Quick start](#quick-start)
2. [Development notes](#development-notes)
3. [Features](#features)
4. [Options & API](#options--api)
5. [Theming & Customization](#theming--customization)
6. [Localization](#localization)
7. [Content workflow](#content-workflow)
8. [Testing](#testing)
9. [Security & audit](#security--audit)
10. [Available Bulmaswatch themes](#available-bulmaswatch-themes)
11. [Next steps](#next-steps)

---

## Quick start

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
  repeat navigations and reduces network traffic.
- URL slug fallback **no longer** appends `.md`/`.html`; passing an
  unmapped slug produces a 404 rather than assuming a filename.  Slugs are
  sanitized to strip any accidental `.md`/`.html` text from headers.  To
  keep direct links working even before any page has loaded, the router will
  perform a one-time check of the home page’s H1 slug and map it if it
  matches the requested slug; this means cold-start requests to the home
  slug yield the expected content rather than an error.

## Features

- Client-side rendering of GitHub‑flavored Markdown.
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
- `defaultStyle` – `'light' | 'dark'` (default `'light'`). Controls initial
  theme; use `setStyle()` to toggle later.
- `bulmaCustomize` – `'none' | 'local' | '{theme_name}'` (default `'none'`).
  - `'none'`: bundled Bulma.
  - `'local'`: load `<contentPath>/bulma.css` or `/bulma.css` and inject it.
  - `'{theme_name}'`: load from `https://unpkg.com/bulmaswatch/{theme_name}`.
- `highlightTheme` – initial highlight.js theme (default `monokai`).

> **Note:** the formerly available `languages` option has been removed. Fenced-
> code detection handles language registration automatically.

The `initCMS` export itself is returned when you call it; additional helpers
are exposed (all are also available from the UMD bundle namespace).

> **TypeScript users:**  a `src/index.d.ts` declaration file is shipped with
> the package that describes the public API.


- `registerLanguage(name, modulePath)` – dynamically register a highlight.js
  language (path may be a CDN URL).
- `setStyle('light'|'dark')` – switch between light and dark modes (adds
  `data-theme` / `is-dark` class). This is the runtime API for dark/light
  toggling.
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

Example translation file:

```json
{
  "de": { "navigation": "Navigation", "onThisPage": "Auf dieser Seite" }
}
```

Usage:

```js
initCMS({ el: '#app', contentPath: './content', l10nFile: '/i18n/l10n.json', lang: 'de' })
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
https://jenil.github.io/bulmaswatch/ and load via `bulmaCustomize`.

## Next steps

- Bundle extra highlight.js languages to reduce runtime CDN requests.
- Run a smoke test on the example build and report missing assets/console errors.
