# nimbiCMS_pre

Lightweight client-side CMS used for local editing and testing.

## Quick start

Install dependencies and build the project (uses Vite):

```bash
npm install
npm run build -- --outDir example/dist
```

Serve the `example` folder for local testing:

```bash
npx http-server example -p 5174
# then open http://127.0.0.1:5174/
```

## Development notes

- Content lives under `example/content/`.
- The SPA uses `?page=` query parameters to navigate client-side.
- The build output is written to `example/dist` when running the build command above.

Recent fixes and behaviour you should know about:

- Avoids hardcoded `.md` appends and index fallbacks; slug resolution prefers known mappings.
- Supports raw `.html` content (parses title/H1 and maps to a slug) without forcing markdown rendering.
- Prevents aggressive prefetching of linked markdown files (no longer fetches all `.md` files from an index page).
- Preserves URL hash anchors when navigating and improved scroll-to-anchor handling.
- Intercepts navbar and content links to perform SPA navigation (prevents full page reloads).
- Lazy-loads images and defers code highlighting (IntersectionObserver) for better initial load.

## Testing

- To verify anchor/hash behaviour open a page with a hash, e.g.:

  `http://127.0.0.1:5174/?page=dummy-html-test-page#some-anchor`

- To check that mass `.md` prefetching is disabled, open an HTML page (like the dummy) and inspect the Network tab — you should not see many `.md` fetches.

If you want, I can update this README with more details, add contributor notes, or open a local server and run checks for you.
<p align="center">
  <img src="logo.png" alt="Nimbi CMS logo" width="160" />
</p>

 # Nimbi CMS 

A compact client-side CMS library that renders GitHub-flavored Markdown in the browser. Built with Vite and distributed as ES/CJS/UMD bundles plus a single CSS file. The UMD build is self-contained and intended for static sites.

Key features
- Client-side rendering with `initCMS({ el, contentPath })` — fetches raw `.md` files from a static `contentPath`.
- Sticky per-page Table of Contents (TOC) and Bulma-based UI components (navbar, menu).
- Runtime SEO / Open Graph / Twitter meta updates.
- Syntax highlighting via `highlight.js` (bundled language: `javascript`). Additional languages are auto-detected from fenced-code blocks and registered on-demand (no need to pass `languages` to `initCMS`).
 - Syntax highlighting via `highlight.js`. Languages are not pre-registered; the library auto-detects fenced-code languages and registers highlight.js languages on-demand (no need to pass `languages` to `initCMS`). You can still pre-register or manually register languages with `registerLanguage()` if desired.
- The library applies sensible scrolling behavior to its internal container (including `-webkit-overflow-scrolling: touch`) so host pages do not need to set those styles manually.
- The UMD bundle is self-contained (renderer inlined); no separate worker asset is required for UMD consumers.

 Quick start (dev)

 1. Install dependencies:

 ```bash
 npm install
 ```

 2. Run the Vite dev server:

 ```bash
 npm run dev
 ```

 3. Open the example in your browser:

 http://localhost:5173/example/index.html

 Build (production)

 ```bash
 npm run build
 ```

 The build places library bundles and a single CSS file into `example/dist/` when run with the example target. Serve the `example/` folder from a static server that does not rewrite `.md` requests.

 Serve the example (static)

 ```bash
 npx serve example -l 5173
 # then open http://localhost:5173/example/index.html
 ```

**Options & API**

- `initCMS(options)` — Mount the CMS into your page. `options` is an object with the following keys:
  - `el` (required): a CSS selector string that identifies the mount element (e.g. `#app`). For backwards compatibility a DOM element is still accepted, but prefer a selector.
  - `contentPath` (optional): URL path to your content folder that serves raw `.md` files (default: `./content` or `/content` depending on how you pass it). Use a trailing slash or omit; the library normalizes it.
  - `defaultStyle` (optional): `'light' | 'dark'` (default: `'light'`). Controls the initial page theme; use `setStyle()` to toggle at runtime.
  - `bulmaCustomize` (optional): `'none' | 'local' | '{theme_name}'` (default: `'none'`).
    - `'none'` — use the bundled Bulma styles.
    - `'local'` — attempt to load a local `bulma.css` from the content folder (`<contentPath>/bulma.css`) or from the site root (`/bulma.css`) and inject it as an override so it augments the bundled rules.
    - `'{theme_name}'` — load a Bulmaswatch theme from `https://unpkg.com/bulmaswatch/{theme_name}/bulmaswatch.min.css`.
  - `languages` (optional, deprecated): previously allowed pre-registration of highlight.js languages. The library now auto-detects fenced-code languages in each loaded markdown page and registers languages on-demand. You can still call `registerLanguage()` manually if needed.
  - `highlightTheme` (optional): initial highlight.js theme name (bundled default: `monokai`). Use `setHighlightTheme()` to switch themes later.

Returns: the `initCMS` function itself (default export) and the library also exposes helpers described below.

Runtime helpers (exports):
- `registerLanguage(name, modulePath)` — dynamically register a `highlight.js` language; `modulePath` may be a CDN URL or the local module path (e.g. `javascript.js`).
- `setStyle('light'|'dark')` — toggle the document theme classes at runtime.
- `setHighlightTheme(name, { useCdn })` — switch highlight.js theme; when `useCdn=true` loads the theme CSS from CDN, otherwise uses the bundled default when available.

Localization (l10n)
- `lang` (init option): set the UI language short code (e.g. `en`, `de`). When provided, the library will prefer this language if translations exist.
- `l10nFile` (init option): URL or path to a JSON file containing translations. If a relative path is provided it is resolved against the current page directory. The file is fetched and merged into the built-in defaults at runtime.
- Behavior: the library keeps a `DEFAULT_L10N` table built-in and merges any loaded translations on top of it. Missing keys fall back to English (`en`). Loading errors are ignored so l10n is optional.
- Example `l10n.json` shape:

```json
{
  "de": {
    "navigation": "Navigation",
    "onThisPage": "Auf dieser Seite",
    "readingTime": "{minutes} min Lesezeit"
  },
  "es": {
    "navigation": "Navegación",
    "onThisPage": "En esta página",
    "readingTime": "{minutes} min de lectura"
  }
}
```

Example: load a remote translation file and force German UI

```js
initCMS({ el: '#app', contentPath: './content', l10nFile: '/i18n/l10n.json', lang: 'de' })
```

The library exposes no additional l10n API surface beyond `lang` and `l10nFile`; translations are looked up internally for UI labels such as the TOC heading, navbar labels and the reading-time string.

Example usage:

```js
// preferred: CSS selector mount
initCMS({ el: '#app', contentPath: './content', bulmaCustomize: 'flatly' })

// backwards-compatible: DOM element
// initCMS({ el: document.getElementById('app'), contentPath: './content' })
```

 **Theming & Customization**

 - Bulma is bundled so pages look good out-of-the-box. To customize Bulma use the `bulmaCustomize` option when calling `initCMS`.

 ```js
 // no customization (default)
 initCMS({ el: document.getElementById('app'), contentPath: './content' })

 // use a local bulma.css in the content folder (appended after bundled CSS)
 initCMS({ el, contentPath: './content', bulmaCustomize: 'local' })

 // use a Bulmaswatch theme (example: 'flatly')
 initCMS({ el, contentPath: './content', bulmaCustomize: 'flatly' })
 ```

 - For build-time custom Bulma (embed your compiled Bulma), replace the bundled import in `src/nimbi-cms.js` with your compiled CSS and run `npm run build`.

- The library no longer injects verbose debug logs by default and normalizes alias parsing for highlight.js so malformed alias artifacts are not used as module names.

 - Light / Dark: use `defaultStyle` and `setStyle('dark'|'light')`.

 - Code highlighting theme: bundled default is `monokai`. Use `setHighlightTheme(name, { useCdn: true })` to load other themes from CDN.


Content workflow
- Publish by committing `.md` files into your `content/` folder (or `example/content/`). No build step required for content changes — static hosting that serves the `.md` files is sufficient.
**Required files**

- `_home.md`: the site's home page. This file is required and must exist in the `content/` folder — the library will fail to initialize without it.
- `_navigation.md`: when present the library will render `_navigation.md` into the top navbar. Use simple Markdown links to point to other `.md` pages (for the home link use `_home.md`). Example:

- `_404.md`: optional fallback page. When present the library will render `_404.md` if a requested `.md` file returns a 404 response.

```
 [Home](_home.md)
 [Blog](blog.md)
 [About](about.md)
```

Links to `.md` pages will be converted into the app's hash-based navigation (e.g. `#blog.md` or `#blog.md::anchor`). If you prefer not to supply `_navigation.md`, the library will still run but the navbar will be absent.

 Security & audit
 - The repo's dependencies were updated during development. If you want a conservative audit process (no major upgrades), tell me and I can prepare a selective upgrade plan.

 Available Bulmaswatch themes (examples)
 - default, cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux,
   materia, minty, nuclear, pulse, sandstone, simplex, slate, solar, spacelab,
   superhero, united, yeti

 See the full list and previews at https://jenil.github.io/bulmaswatch/ — to use a theme pass its name as `bulmaCustomize` and the library will load the style from unpkg.

 Next steps I can help with
 - Bundle additional `highlight.js` languages into the library to avoid CDN requests.
 - Run a smoke-test of `example/` served statically and report missing assets / console errors.
