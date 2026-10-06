# SSR / Prerender Decision

nimbiCMS is a **100% client-rendered** CMS. All page resolution, markdown fetching,
and rendering happens in the browser. This document explains the SEO implications
of that choice, why prerender/SSG is not currently implemented, and how it could
be added in the future.

## 1. Current state: client-only rendering

nimbiCMS has no server-side rendering or static-site generation step. When a user
(or crawler) visits a URL like:

```
/?page=my-article
```

the server returns a minimal HTML shell. The nimbiCMS runtime then:

1. Reads `?page=` via `src/router.js:fetchPageData`
2. Resolves the slug to a markdown path via `src/slugManager.js:ensureSlug`
3. Fetches the raw markdown via `src/slugManager.js:fetchMarkdown`
4. Renders the article into the DOM via `src/htmlBuilder.js`

All content is discovered and hydrated after JavaScript execution.

## 2. SEO implications: empty shells for `?page=` URLs

Because content is fetched and rendered client-side, crawlers that do not execute
JavaScript (or execute it with delay/limited fidelity) will see only the initial
HTML shell for `?page=` URLs.

The runtime sitemap (`src/runtimeSitemap.js`) exposes all pages as `?page=slug`
URLs:

```js
const loc = baseNoQs + "?page=" + encodeURIComponent(slug);
```

This means:

- **Search engine crawlers** may index an empty page rather than the rendered content.
- **Social link previews** (Open Graph, Twitter Cards) will not see article content
  unless prerendered.
- **Accessibility tools** that do not run JS will miss content.

The sitemap module does generate `<lastmod>`, `<title>`, and `<image>` metadata,
but these are only useful when paired with a fully-rendered page.

## 3. Decision: no prerender/SSG (current rationale)

The project intentionally keeps nimbiCMS 100% client-rendered for the following
reasons:

- **Simplicity**: No build step is required to generate static HTML. Content is
  fetched and rendered at runtime.
- **Dynamic content**: Markdown files can be updated on the server without
  rebuilding the site.
- **SPA navigation**: Internal navigation uses the `?page=` query parameter
  without full page reloads, giving a fast in-app experience.
- **Static hosting compatibility**: nimbiCMS works on any static file host
  (GitHub Pages, Netlify, S3, etc.) without server-side configuration.

The tradeoff is that crawlers without JS execution see an empty shell. For sites
where SEO is critical, this is a known limitation.

## 4. Future options: adding prerender / SSG

If SEO for `?page=` URLs becomes a requirement, the following approaches are
compatible with the existing architecture:

### 4a. Pre-render on deploy (lightweight SSG)

Add a build step that calls `generateSitemapJson` and then, for each slug,
calls `fetchPageData` and writes the rendered HTML to a static file.

Relevant entry points:

- `src/runtimeSitemap.js:generateSitemapJson` — produces the full list of
  slugs and their metadata.
- `src/router.js:fetchPageData` — resolves a slug and fetches its content.
- `src/htmlBuilder.js` — renders markdown to HTML (used by the init pipeline).

The generated files could be served at `?page=<slug>` paths or, preferably,
at clean paths like `/articles/my-article/`.

### 4b. Deferred prerendering (on-demand)

For large sites, generate HTML only for frequently-crawled slugs. Detect crawler
user-agents at the server/proxy level and serve a prerendered snapshot for those
requests while keeping client-rendering for normal users.

### 4c. Dynamic rendering via CDN

Use a CDN edge function (e.g., Cloudflare Workers, Netlify Edge Functions) that
calls `fetchPageData` server-side and returns the rendered HTML. This keeps the
static hosting model while giving crawlers full content.

### 4d. Clean-URL migration

If moving away from `?page=` URLs, the slug resolution logic in
`src/slugManager.js:slugToMd` and `src/slugManager.js:mdToSlug` is decoupled
from the query parameter. Clean paths can be mapped to the same slug resolution
pipeline with minimal changes to `src/router.js:fetchPageData`.

## 5. Relevant code paths

| Module | Key exports | Role |
|--------|------------|------|
| `src/router.js` | `fetchPageData` | Resolves `?page=` to content, performs slug lookup and candidate fetching. |
| `src/slugManager.js` | `ensureSlug`, `fetchMarkdown`, `buildSearchIndex`, `slugToMd`, `mdToSlug` | Slug resolution, markdown fetching, and index building. |
| `src/runtimeSitemap.js` | `generateSitemapJson`, `generateSitemapXml`, `handleSitemapRequest` | Generates sitemap/feeds from the runtime index. |
| `src/htmlBuilder.js` | Article rendering | Turns markdown into rendered HTML. |
| `src/nimbi-cms.js` | `initCMS` | Entry point that wires router, sitemap, and rendering together. |
