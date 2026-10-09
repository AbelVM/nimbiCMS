---
title: nimbiCMS
author: Abel Vázquez Montoro
date: 2026-10-06
---

<img src="./assets/logo.png" alt="nimbiCMS logo" style="height:256px;width:256px;" />

# nimbiCMS

**A lightweight, fast, SEO-friendly CMS for static sites. No database, no build step, no backend — just Markdown files and a browser.**

[![npm version](https://img.shields.io/npm/v/nimbi-cms.svg)](https://www.npmjs.com/package/nimbi-cms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Tests](https://img.shields.io/badge/tests-799%20passed-success.svg)](#)

---

## What is nimbiCMS?

nimbiCMS turns a folder of Markdown or HTML files into a fully functional website. It runs entirely in the browser — no server, no database, no compilation. Drop your content files into a folder, serve them from any static host (GitHub Pages, S3, Netlify, etc.), and nimbiCMS handles the rest:

- Renders Markdown to HTML on the fly
- Builds navigation, search, and table of contents automatically
- Manages URLs, slugs, and SEO meta tags
- Keeps the site fast with web workers and smart caching

This very site is built with nimbiCMS. Edit a Markdown file, save, refresh — the site updates instantly.

---

## Who is this for?

**If you want to publish content without managing a CMS, nimbiCMS is for you.**

- **Writers & editors** who want to write in Markdown and publish with a git push
- **Developers** who need a lightweight content layer without a backend
- **Teams** that want GitHub Pages (or any static host) to be their entire infrastructure
- **Hobbyists** who want a personal site, blog, or knowledge base without operational overhead

It is **not** a multi-user editorial platform with roles, workflows, or a visual page builder. If you need that, look at Ghost, Strapi, or Sanity. If you want to write Markdown, push to a repo, and have a site — you are in the right place.

---

## Quick start

### Option A: GitHub Pages (no coding required)

The fastest way to get a site live:

1. Create a new public repository on GitHub
2. Upload the files from this repo (or use the template)
3. Enable GitHub Pages in Settings → Pages → Source: `main` branch
4. Edit content in the `content/` folder using GitHub's web editor
5. Your site is live at `https://<username>.github.io/<repository>/`

See [Using with GitHub Pages](#using-with-github-pages) for details.

### Option B: npm (for developers)

```bash
npm install nimbi-cms
```

Then include the bundle in your HTML:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/dist/nimbi-cms.css">
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import initCMS from '/dist/nimbi-cms.es.js'
    initCMS({ el: '#app' })
  </script>
</body>
</html>
```

That is it. Put your `.md` files in a `content/` folder and you have a site.

---

## Features

### For content authors

- **Write in Markdown** — GitHub-flavored Markdown with tables, task lists, emojis, and more
- **No build step** — save a file, refresh the page, see changes
- **Edit anywhere** — use GitHub's web editor, VS Code, or any text editor
- **Automatic navigation** — define links once in `_navigation.md`, the navbar updates itself
- **Built-in search** — visitors can search headings and excerpts across all pages
- **Reading time** — estimated reading time shown automatically
- **Image preview** — click any image to zoom, pan, and inspect details
- **Syntax highlighting** — code blocks are highlighted automatically for 190+ languages
- **Dark mode** — light, dark, and system preference themes built in

### For developers

- **Zero backend** — runs entirely client-side; any static host works
- **Web workers** — indexing, slug resolution, and rendering run off the main thread
- **SEO-friendly** — canonical URLs, Open Graph, Twitter Cards, dynamic sitemap, RSS, and Atom feeds
- **Pluggable** — hooks (`onPageLoad`, `onNavBuild`, `transformHtml`) let you customize without forking
- **Multiple formats** — UMD, ESM, and CJS bundles included
- **Compact** — single JS file (~71 KB gzipped) and single CSS file (~48 KB gzipped including Bulma)
- **Fully typed** — TypeScript definitions generated from JSDoc
- **Tested** — 799 tests, 0 flakiness target, Vitest 5 + jsdom 30

### Performance

- 1200+ Markdown documents indexed in under a second
- Lazy image loading with above-the-fold eager detection
- Parallel indexing with configurable concurrency
- Fetch caching and negative caching to avoid repeated requests
- Streaming processing for large content collections

---

## How it works

1. You create a folder of `.md` and/or `.html` files
2. You create a `_navigation.md` file with links to your pages
3. You serve the folder from any static web server
4. nimbiCMS crawls the content, builds an index, and renders pages on demand
5. Visitors navigate using clean URLs; the site updates SEO tags and meta data automatically

### Required files

| File | Purpose |
|------|---------|
| `_navigation.md` | Defines the navbar links. Example: `[Home](home.md)` |
| `home.md` or `index.html` | Your home page. The first link in `_navigation.md` is used by default. |
| `_404.md` | Optional custom "not found" page. |

### Optional files

- `bulma.css` — custom Bulma overrides (when using `bulmaCustomize: 'local'`)
- `l10n.json` — translation strings for UI localization
- Any `.md` or `.html` file in the content folder becomes a page

---

## Installation

### From npm

```bash
npm install nimbi-cms
npm run build
```

### From CDN

No install needed. Load directly in the browser:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nimbi-cms@1.1.0/dist/nimbi-cms.css">

<!-- ESM (modern browsers) -->
<script type="module">
  import initCMS from 'https://cdn.jsdelivr.net/npm/nimbi-cms@1.1.0/dist/nimbi-cms.es.js'
  initCMS({ el: '#app' })
</script>

<!-- UMD (legacy / global) -->
<script src="https://unpkg.com/nimbi-cms@1.1.0/dist/nimbi-cms.js"></script>
<script>
  nimbiCMS.initCMS({ el: '#app' })
</script>
```

### Development

```bash
git clone https://github.com/AbelVM/nimbiCMS.git
cd nimbiCMS
npm ci
npm run dev
```

### Verification

The CI workflow runs the same core checks used locally:

```bash
npm run lint
npm run test
npm run build
npm run gen-dts
npm run check-dts
npm run a11y:scan
```

---

## Configuration

`initCMS(options)` mounts the CMS into a page. Below are the most common options.

### Essential

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `el` | `string` / `Element` | **required** | CSS selector or DOM element to mount into. |
| `contentPath` | `string` | `'/content'` | URL path to your content folder. |
| `homePage` | `string` | first nav link | Path to your home page (e.g. `'home.md'`). |
| `notFoundPage` | `string` / `null` | `null` | Path to a custom 404 page (e.g. `'_404.md'`). |

### Appearance

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultStyle` | `'light'` / `'dark'` / `'system'` | `'light'` | Initial color theme. |
| `bulmaCustomize` | `string` | `'none'` | `'none'` (bundled), `'local'` (load `bulma.css` from content), or a [Bulmaswatch](https://jenil.github.io/bulmaswatch/) theme name. |
| `navbarLogo` | `string` | `'favicon'` | Logo for the navbar: `none`, `favicon`, a URL, or `copy-first` / `move-first`. |

### Search & indexing

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `searchIndex` | `boolean` | `true` | Enable the search box. |
| `searchIndexMode` | `'eager'` / `'lazy'` | `'eager'` | Build index on load (`eager`) or on first search (`lazy`). |
| `indexDepth` | `1` / `2` / `3` | `1` | How deep headings are indexed (H1–H3). |
| `noIndexing` | `string[]` | — | Paths to exclude from search. |

### Advanced

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lang` | `string` | — | UI language code (e.g. `'en'`, `'de'`). |
| `l10nFile` | `string` | `null` | Path to a JSON translation file. |
| `availableLanguages` | `string[]` | — | Enable multi-language slug resolution. |
| `cacheTtlMinutes` | `number` | `5` | Cache TTL for slug resolution (minutes). |
| `fetchConcurrency` | `number` / `'auto'` | `'auto'` | Max simultaneous network requests. |
| `exposeSitemap` | `boolean` | `true` | Expose runtime sitemap at `/?sitemap`. |
| `allowEmbeddedScripts` | `boolean` | `false` | **Security-sensitive.** Allow scripts in Markdown/HTML. Only enable for fully trusted content. |
| `embeddedScriptOrigins` | `string[]` | `[]` | Additional origins permitted for external embedded scripts; same-origin scripts are allowed when embedded scripts are enabled. |

> **Tip:** All options can also be set via URL parameters when `allowUrlPathOverrides: true` is enabled. For security, this is off by default.

For the full API reference, see [docs/README.md](docs/README.md).

---

## URL structure

nimbiCMS uses two URL formats that work together:

| Type | Format | Purpose |
|------|--------|---------|
| **Cosmetic** | `https://example.com/#/slug#anchor?params` | What users see and click |
| **Canonical** | `https://example.com/?page=slug#anchor&params` | Used for SEO, sitemaps, and internal requests |

The browser shows the cosmetic form. Under the hood, nimbiCMS uses canonical URLs for `<link rel="canonical">`, sitemaps, and fetches so search engines see stable, indexable addresses.

---

## Runtime endpoints

When enabled, nimbiCMS exposes these client-side endpoints:

- `/?sitemap` — XML sitemap (canonical `?page=` URLs)
- `/?rss` — RSS 2.0 feed
- `/?atom` — Atom 1.0 feed

> **Note:** These are generated in the browser. For maximum crawler compatibility, also generate a server-side `sitemap.xml` and list it in `robots.txt`.

### Content Security Policy

For strict CSP, serve content from an allowed `connect-src` origin, allow
module workers created from Blob URLs with `worker-src blob:`, and permit the
runtime's stylesheet sources with `style-src`. Hosts that
inject a nonce into runtime-created inline scripts or styles can pass it with
`setCspNonce(nonce)` before calling `initCMS`.

For server or edge adapters, call `handleSitemapRequest({ returnResponse: true })`
to receive sitemap/feed output without the browser document writer.

Run `npm run seo:inspect -- https://example.com/` to check deployed status,
title, robots, canonical, hreflang, JSON-LD, manifest, sitemap, and internal
links. Pass `--max-links=N` to increase the bounded cold-link probe count from
the default of 20.

### Answer-oriented content

For answer-engine-friendly content, put the direct answer in visible Markdown
near the start of the page, use a descriptive heading and short supporting
paragraphs, and link claims to first-party or authoritative sources. Keep
source links visible to readers; structured data may describe the page but
must not contain claims absent from the rendered content.

---

## Theming

nimbiCMS ships with Bulma CSS and supports runtime theme changes:

```js
initCMS({
  el: '#app',
  defaultStyle: 'dark',
  bulmaCustomize: 'flatly' // any Bulmaswatch theme
})
```

You can also switch themes at runtime:

```js
import { setStyle, ensureBulma, setThemeVars } from 'nimbi-cms'

setStyle('dark')
ensureBulma('local', './content/') // load custom bulma.css
setThemeVars({ '--primary': '#06c' })
```

---

## Localization

```js
initCMS({
  el: '#app',
  lang: 'en',
  l10nFile: '/i18n/l10n.json',
  availableLanguages: ['en', 'fr']
})
```

Switch language at runtime:

```js
import { setLang, t } from 'nimbi-cms'
setLang('fr')
console.log(t('navigation'))
```

---

## Hooks

Extend nimbiCMS without forking:

```js
import { onPageLoad, onNavBuild, transformHtml } from 'nimbi-cms'

onPageLoad(({ pagePath, article }) => {
  console.log('Rendered:', pagePath)
})

onNavBuild(({ navWrap }) => {
  // mutate navigation before it is attached
})

transformHtml((html, article) => {
  // modify the generated HTML string or DOM element
  article.dataset.nimbiRendered = 'true'
})
```

---

## Using with GitHub Pages

nimbiCMS works seamlessly with GitHub Pages and the GitHub web editor.

### Setup

1. Create a public repository
2. Upload the nimbiCMS `dist/` folder and your `content/` folder
3. Add an empty `.nojekyll` file at the repo root (so `_navigation.md` is served)
4. Enable GitHub Pages: Settings → Pages → Source: `main` branch (or `gh-pages`)
5. Create an `index.html` at the repo root:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/dist/nimbi-cms.css">
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import initCMS from '/dist/nimbi-cms.es.js'
    initCMS({ el: '#app', contentPath: './content/' })
  </script>
</body>
</html>
```

For crawler support, publish a host-level `robots.txt` with a `Sitemap:` URL
and generate `sitemap.xml` from `handleSitemapRequest({ returnResponse: true })`
in the deployment adapter. The browser runtime cannot create files at the
static host root. Configure the host's 404 response to serve `index.html`, and
keep the CMS `notFoundPage` for in-app missing content.

### Editing content

1. Open your repo on GitHub
2. Navigate to `content/`
3. Click any `.md` file, then the pencil icon to edit
4. Commit changes
5. Refresh your site — nimbiCMS loads content at runtime, so changes appear immediately

### Tips

- Keep `_navigation.md` updated to control the navbar
- Use `_404.md` for a friendly error page
- Add a `.nojekyll` file so GitHub serves underscore-prefixed files
- For automatic deploys, use a GitHub Action to build and push `dist/` to `gh-pages`

---

## Troubleshooting

**Content not loading / 404 pages**
- Verify `contentPath` points to the correct folder
- Ensure your static host serves `.md` files (some hosts need configuration)

**Styles missing**
- Confirm `dist/nimbi-cms.css` is loaded
- If using `bulmaCustomize: 'local'`, check that `bulma.css` exists in the content path

**Console errors about folder crawling**
- nimbiCMS tries to crawl the `contentPath` folder for faster indexing. If your server returns 404 for directory listings, you will see a harmless warning in the console. This is expected and does not break anything.

**Scripts not running**
- Make sure the mount element exists: `<div id="app"></div>`
- Check that `initCMS({ el: '#app' })` uses the correct selector

---

## Examples

This very site runs nimbiCMS. The files that make it work:

- `index.html` — the host page
- `README.md` — this documentation
- `_navigation.md` — the navbar
- `_404.md` — the not-found page
- `assets/brochure.md` — the landing page content
- `assets/playground.html` — live theme playground

---

## Contributing

Bug reports, feature requests, and pull requests are welcome.

- [Open an issue](https://github.com/AbelVM/nimbiCMS/issues)
- [Read the contributor guide](AGENTS.md)

---

## License

MIT — see [LICENSE.md](LICENSE.md)

---

### Host adapters (server/edge/service-worker)

For non-browser hosts (e.g. Cloudflare Workers, Vercel Edge, or a service worker that serves a sitemap/feed), you can generate isolated responses without touching the live `document`.

```js
import { handleSitemapRequest, generateSitemapXml, generateSitemapJson } from 'nimbi-cms'
// or from nimbi-cms/runtimeSitemap in host-specific builds

async function sitemapHandler(url, index, opts = {}) {
  // Return a Response without writing to document (default)
  const response = await handleSitemapRequest({
    returnResponse: true,
    url,
    index,
    includeAllMarkdown: true,
    ...opts
  })

  return response ?? new Response('', { status: 204 })
}
```

If you only need the raw body or globals in a browser context (e.g. to inspect or post-process), the default `handleSitemapRequest` returns the generated string and publishes diagnostic globals (`window.__nimbiSitemapJson`, `window.__nimbiSitemapFinal`) without mutating the DOM. To opt into the legacy behavior of writing directly to the current document (e.g. for a simple `/?sitemap` browser view in certain embedded contexts), pass `writeToDocument: true`.

See the TypeScript definitions (`src/index.d.ts`) for full option shapes and the returned types.
