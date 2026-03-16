
<img src="logo.png" alt="logo" style="height:256px;width:256px;" />

# NimbiCMS — Fast. Small. Delightful.

Imagine publishing a complete, polished website without a build pipeline, a server, or bloated tooling. That's NimbiCMS: a compact, opinionated toolkit that turns folder-based Markdown into an accessible, SEO-friendly site in minutes. It’s built for teams who value speed, clarity, and developer happiness.

## Why NimbiCMS?

NimbiCMS lets you publish directly from Markdown. Our runtime renders GitHub‑flavored Markdown with `marked.js`, generates a sticky table of contents, estimates reading time, and keeps meta tags (Open Graph, Twitter) accurate as visitors navigate. Authors write in their favorite editor, push to a static host (GitHub Pages, S3, Netlify), and the site updates with no build step.

Search and indexing are flexible: enable an eager index on load for smaller sites, or use lazy indexing for large collections to keep initial load fast. Heavy tasks run in web workers so the main thread stays snappy for users.

## A polished experience for visitors

Visitors enjoy fast, accessible pages: small bundles, lazy image loading, and an intuitive image preview with zoom and gestures make media-heavy content feel responsive. Syntax highlighting and on-demand language registration keep code blocks readable without inflating every bundle. Built-in theming (light/dark/system) and runtime CSS variable overrides let you match your brand instantly.

## Developers move faster

NimbiCMS is intentionally modular. Import only the managers you need (`nav`, `markdown`, `imagePreview`, `worker-manager`), call `initCMS()` to boot, and use hooks (`onPageLoad`, `onNavBuild`, `transformHtml`) to customize behavior without hacking internals. Multiple bundle formats (UMD, ESM, CJS) and compact deliverables (single JS + CSS files) make integration trivial across environments.

We also prioritized testability: modules run under `jsdom`, include shims for browser-only APIs, and expose lifecycle hooks that are easy to assert in unit tests — leading to less flaky CI and faster refactoring.

## Publishing — minimal friction

Publishers simply add `.md`/`.html` files to the content folder, edit `_navigation.md` and `_home.md` for structure, and push to the static host. Preview locally with `npm run dev` and point `initCMS()` at your content path to verify changes instantly. Images placed alongside pages are auto-discovered and lazy-loaded; use `noIndexing` to hide drafts from the runtime search index. For brand control, set `bulmaCustomize: 'local'` and include a `bulma.css` in your content directory.

For quick, on-the-fly edits you can also use GitHub's web editor directly in the repository: open a Markdown file, edit in the browser, and commit to the default branch or a feature branch. This is great for copy fixes and small updates when you don't need a local workflow — preview locally with `npm run dev` if you'd like to verify changes before publishing.

## Who should use NimbiCMS?

It’s perfect for documentation, blogs, marketing sites, and small knowledge bases where you want fast publishing, great UX, and minimal ops. It’s not intended as a full editorial platform for complex multi-user workflows — instead, think of NimbiCMS as the fast, maintainable content layer you add when you want to publish with confidence.
