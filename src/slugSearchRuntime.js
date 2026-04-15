import * as slugManagerRuntime from "./slugManager.js";

let _indexPromise = null;
let _cachedIndex = [];

const DEFAULT_MAX_CRAWL_QUEUE = 1000;
const DEFAULT_CONCURRENCY = 4;

function _slugify(value) {
  let slug = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, "")
    .replace(/ /g, "-");
  slug = slug.replace(/(?:-?)(?:md|html)$/g, "");
  slug = slug.replace(/-+/g, "-");
  slug = slug.replace(/^-|-$/g, "");
  if (slug.length > 80) slug = slug.slice(0, 80).replace(/-+$/g, "");
  return slug;
}

function _sanitizePath(path) {
  return String(path ?? "").replace(/^[./]+/, "");
}

function _trimTrailingSlash(path) {
  return String(path ?? "").replace(/\/+$/, "");
}

function _ensureTrailingSlash(path) {
  return _trimTrailingSlash(path) + "/";
}

function _isExternalHref(href, contentBase) {
  if (!href || typeof href !== "string") return false;
  if (href.startsWith("//")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    if (contentBase && typeof contentBase === "string") {
      try {
        const target = new URL(href);
        const baseUrl = new URL(contentBase);
        if (target.origin === baseUrl.origin)
          return !target.pathname.startsWith(baseUrl.pathname);
      } catch (_) {}
    }
    return true;
  }
  return false;
}

function _toAbsoluteBase(contentBase) {
  const origin =
    typeof location !== "undefined" && location.origin
      ? location.origin
      : "http://localhost";
  const baseInput = String(contentBase ?? "");
  if (!baseInput) return origin + "/";
  if (/^[a-z][a-z0-9+.-]*:/i.test(baseInput))
    return _ensureTrailingSlash(baseInput);
  if (baseInput.startsWith("/"))
    return origin + _ensureTrailingSlash(baseInput);
  return origin + "/" + _ensureTrailingSlash(baseInput);
}

async function _fetchText(path, contentBase) {
  const base = _toAbsoluteBase(contentBase);
  const url = new URL(String(path ?? "").replace(/^\//, ""), base).toString();
  const res = await fetch(url);
  if (!res || !res.ok) return null;
  return await res.text();
}

async function _runWithConcurrency(
  items,
  worker,
  concurrency = DEFAULT_CONCURRENCY,
) {
  const queue = Array.isArray(items) ? items.slice() : [];
  const limit = Math.max(1, Number(concurrency) || 1);
  const runners = [];
  for (let i = 0; i < Math.min(limit, queue.length); i++) {
    runners.push(
      (async () => {
        while (queue.length) {
          const item = queue.shift();
          if (item == null) continue;
          await worker(item);
        }
      })(),
    );
  }
  await Promise.all(runners);
}

async function _crawlAllMarkdown(
  contentBase,
  maxQueue = DEFAULT_MAX_CRAWL_QUEUE,
) {
  const seenDirs = new Set();
  const found = new Set();
  const queue = [""];
  const baseAbs = _toAbsoluteBase(contentBase);
  const basePath = _ensureTrailingSlash(new URL(baseAbs).pathname);
  while (queue.length && queue.length <= maxQueue) {
    const dir = queue.shift();
    if (dir == null || seenDirs.has(dir)) continue;
    seenDirs.add(dir);
    const url = new URL(String(dir ?? ""), baseAbs).toString();
    let html = null;
    try {
      const res = await fetch(url);
      if (!res || !res.ok) continue;
      html = await res.text();
    } catch (_) {
      continue;
    }
    if (!html) continue;

    const hrefRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match = null;
    while ((match = hrefRegex.exec(html))) {
      const href = match[1];
      if (
        !href ||
        _isExternalHref(href, baseAbs) ||
        href.startsWith("..") ||
        href.includes("/../")
      )
        continue;

      if (href.endsWith("/")) {
        try {
          const nextUrl = new URL(href, url);
          let relDir = nextUrl.pathname.startsWith(basePath)
            ? nextUrl.pathname.slice(basePath.length)
            : nextUrl.pathname.replace(/^\//, "");
          relDir = _ensureTrailingSlash(_sanitizePath(relDir));
          if (!seenDirs.has(relDir)) queue.push(relDir);
        } catch (_) {}
        continue;
      }

      if (!/\.(md|html?)($|[?#])/i.test(href)) continue;
      try {
        const linkUrl = new URL(href, url);
        let rel = linkUrl.pathname.startsWith(basePath)
          ? linkUrl.pathname.slice(basePath.length)
          : linkUrl.pathname.replace(/^\//, "");
        rel = _sanitizePath(rel).split(/[?#]/)[0];
        if (rel) found.add(rel);
      } catch (_) {}
    }
  }
  return Array.from(found);
}

function _extractTitleAndExcerpt(raw, isHtml) {
  const text = String(raw ?? "");
  if (isHtml) {
    const title = (
      (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] ||
      (text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] ||
      ""
    )
      .replace(/<[^>]+>/g, "")
      .trim();
    const excerpt = ((text.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    return { title, excerpt };
  }
  const title = ((text.match(/^#\s+(.+)$/m) || [])[1] || "").trim();
  const paragraphs = text.split(/\r?\n\s*\r?\n/);
  let excerpt = "";
  for (let i = 1; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (p && !/^#/.test(p)) {
      excerpt = p.replace(/\r?\n/g, " ");
      break;
    }
  }
  return { title, excerpt };
}

export async function buildSearchIndex(
  contentBase,
  indexDepth = 1,
  noIndexing = undefined,
  seedPaths = undefined,
) {
  if (_indexPromise) return _indexPromise;
  _indexPromise = (async () => {
    const excludes = Array.isArray(noIndexing)
      ? new Set(noIndexing.map((p) => _sanitizePath(p)))
      : new Set();
    const seeds = Array.isArray(seedPaths)
      ? seedPaths.map((p) => _sanitizePath(p)).filter(Boolean)
      : [];
    const discovered = await _crawlAllMarkdown(contentBase);
    const allPaths = Array.from(new Set(discovered.concat(seeds)))
      .filter((p) => /\.(md|html?)$/i.test(p))
      .filter(
        (p) =>
          !Array.from(excludes).some(
            (x) => x && (p === x || p.startsWith(x + "/")),
          ),
      );

    const entries = [];
    await _runWithConcurrency(allPaths, async (path) => {
      const raw = await _fetchText(path, contentBase);
      if (!raw) return;
      const isHtml = /\.html?$/i.test(path);
      const { title, excerpt } = _extractTitleAndExcerpt(raw, isHtml);
      const pageSlug = _slugify(title || path);
      entries.push({ slug: pageSlug, title, excerpt, path });

      if (Number(indexDepth) >= 2) {
        const headingRegex = isHtml
          ? /<h2[^>]*>([\s\S]*?)<\/h2>/gi
          : /^##\s+(.+)$/gm;
        let match = null;
        while ((match = headingRegex.exec(raw))) {
          const heading = String(match[1] ?? "")
            .replace(/<[^>]+>/g, "")
            .trim();
          if (!heading) continue;
          entries.push({
            slug: `${pageSlug}::${_slugify(heading)}`,
            title: heading,
            excerpt: "",
            path,
            parentTitle: title || "",
          });
        }
      }
    });

    _cachedIndex = entries;
    return _cachedIndex;
  })();

  try {
    return await _indexPromise;
  } finally {
    _indexPromise = null;
  }
}

export async function crawlForSlug(slug, base, maxQueue) {
  const normalized = _slugify(slug);
  if (!normalized) return null;

  const idx = await buildSearchIndex(base);
  const hit = (Array.isArray(idx) ? idx : []).find((entry) => {
    try {
      const key = String(entry?.slug ?? "").split("::")[0];
      return key === normalized;
    } catch (_) {
      return false;
    }
  });
  if (hit?.path) return hit.path;

  const candidates = [`${normalized}.html`, `${normalized}.md`];
  for (const candidate of candidates) {
    try {
      const raw = await _fetchText(candidate, base);
      if (raw) return candidate;
    } catch (_) {}
  }

  const discovered = await _crawlAllMarkdown(
    base,
    maxQueue || DEFAULT_MAX_CRAWL_QUEUE,
  );
  for (const path of discovered) {
    const baseName = String(path ?? "")
      .replace(/^.*\//, "")
      .replace(/\.(md|html?)$/i, "");
    if (_slugify(baseName) === normalized) return path;
  }
  return null;
}

async function getSlugRuntime() {
  return slugManagerRuntime;
}

export async function buildSearchIndexWorker(
  contentBase,
  indexDepth = 1,
  noIndexing = undefined,
) {
  const runtime = await getSlugRuntime();
  return runtime.buildSearchIndexWorker(contentBase, indexDepth, noIndexing);
}

export async function awaitSearchIndex(opts = {}) {
  const runtime = await getSlugRuntime();
  return runtime.awaitSearchIndex(opts);
}
