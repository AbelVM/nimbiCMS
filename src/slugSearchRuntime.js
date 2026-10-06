import * as slugManagerRuntime from "./slugManager.js";
import { parseFrontmatter } from "./utils/frontmatter.js";

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
  seedPaths = undefined,
) {
  const seenDirs = new Set();
  const found = new Set();
  const queue = [""];
  if (Array.isArray(seedPaths)) {
    for (const path of seedPaths) {
      try {
        const normalized = _sanitizePath(path);
        if (normalized) queue.push(normalized);
      } catch (_) {}
    }
  }
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

    const hrefs = [];
    const htmlLinkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
    const mdLinkRe = /(?:^|[^!])\[[^\]]+\]\(([^)]+)\)/g;
    let match = null;

    while ((match = htmlLinkRe.exec(html))) {
      try {
        if (match?.[1]) hrefs.push(match[1]);
      } catch (_) {}
    }
    while ((match = mdLinkRe.exec(html))) {
      try {
        if (match?.[1]) hrefs.push(match[1]);
      } catch (_) {}
    }

    for (const href of hrefs) {
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

      if (/\.(md|html?)($|[?#])/i.test(href)) {
        try {
          const linkUrl = new URL(href, url);
          let rel = linkUrl.pathname.startsWith(basePath)
            ? linkUrl.pathname.slice(basePath.length)
            : linkUrl.pathname.replace(/^\//, "");
          rel = _sanitizePath(rel).split(/[?#]/)[0];
          if (rel) {
            found.add(rel);
            if (!seenDirs.has(rel)) queue.push(rel);
          }
        } catch (_) {}
        try {
          const rootLinkUrl = new URL(href, baseAbs);
          let rootRel = rootLinkUrl.pathname.startsWith(basePath)
            ? rootLinkUrl.pathname.slice(basePath.length)
            : rootLinkUrl.pathname.replace(/^\//, "");
          rootRel = _sanitizePath(rootRel).split(/[?#]/)[0];
          if (rootRel && !found.has(rootRel)) {
            found.add(rootRel);
            if (!seenDirs.has(rootRel)) queue.push(rootRel);
          }
        } catch (_) {}
        continue;
      }

      let path = href.split(/[?#]/)[0].replace(/\/+$/, "");
      let rootPath = null;
      try {
        const rootUrl = new URL(href, baseAbs);
        rootPath = rootUrl.pathname.startsWith(basePath)
          ? rootUrl.pathname.slice(basePath.length)
          : rootUrl.pathname.replace(/^\//, "");
      } catch (_) {}
      try {
        const resolved = new URL(href, url);
        path = resolved.pathname.startsWith(basePath)
          ? resolved.pathname.slice(basePath.length)
          : resolved.pathname.replace(/^\//, "");
      } catch (_) {}
      path = _sanitizePath(path).split(/[?#]/)[0].replace(/\/+$/, "");
      if (rootPath) {
        rootPath = _sanitizePath(rootPath).split(/[?#]/)[0].replace(/\/+$/, "");
      }
      const lastSegment = String(path).split("/").pop() || "";
      if (/\.[^./]+$/i.test(lastSegment)) continue;
      if (path) {
        const candidates = [
          `${path}.md`,
          `${path}.html`,
          `${path}/README.md`,
          `${path}/README.html`,
        ];
        for (const candidate of candidates) {
          found.add(candidate);
          if (!seenDirs.has(candidate)) queue.push(candidate);
        }
      }
      if (rootPath && rootPath !== path) {
        const rootCandidates = [
          `${rootPath}.md`,
          `${rootPath}.html`,
          `${rootPath}/README.md`,
          `${rootPath}/README.html`,
        ];
        for (const candidate of rootCandidates) {
          if (!found.has(candidate)) {
            found.add(candidate);
            if (!seenDirs.has(candidate)) queue.push(candidate);
          }
        }
      }
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
    const discovered = await _crawlAllMarkdown(contentBase, DEFAULT_MAX_CRAWL_QUEUE, seeds);
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
      // Extract lastmod from frontmatter date/dateModified fields
      let lastmod = null;
      let image = null;
      try {
        if (!isHtml) {
          const { data: fm } = parseFrontmatter(raw);
          const dateRaw = fm.dateModified || fm.date || fm.lastmod;
          if (dateRaw) {
            const d = new Date(dateRaw);
            if (!isNaN(d.getTime())) lastmod = d.toISOString().split("T")[0];
          }
          // Extract image from frontmatter (og:image, image, cover, featured_image)
          const imgRaw = fm.image || fm.og_image || fm.cover || fm.featured_image;
          if (imgRaw && String(imgRaw).trim()) {
            image = String(imgRaw).trim();
          }
        }
      } catch (_) {}
      entries.push({ slug: pageSlug, title, excerpt, path, lastmod, image });

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
            lastmod,
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
  seedPaths = undefined,
) {
  const runtime = await getSlugRuntime();
  return runtime.buildSearchIndexWorker(
    contentBase,
    indexDepth,
    noIndexing,
    seedPaths,
  );
}

export async function awaitSearchIndex(opts = {}) {
  const runtime = await getSlugRuntime();
  return runtime.awaitSearchIndex(opts);
}
