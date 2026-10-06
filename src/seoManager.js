/**
 * SEO helpers: meta tags and structured data.
 *
 * Utilities to set standard meta tags, Open Graph/Twitter tags, and JSON-LD
 * structured data for pages.
 *
 * @module seoManager
 */
import { normalizePath, applyCspNonce } from "./utils/helpers.js";
import { getTextMetrics } from "./utils/textMetrics.js";
import { debugWarn } from "./utils/debug.js";
import { availableLanguages, getLanguages } from "./slugManager.js";

/**
 * Page data shape passed around the renderer.
 * @typedef {Object} PageData
 * @property {Object} [meta]
 * @property {string} [raw]
 */

/**
 * Set or update a single meta tag in the document head.
 * @param {string} name - Meta tag name (e.g. 'description').
 * @param {string} content - Meta tag content value.
 * @returns {void}
 */
export function setTag(name, content) {
  const escapedName =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(String(name))
      : String(name);
  let tag = document.querySelector(`meta[name="${escapedName}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Ensure essential document-level meta tags exist (charset, viewport).
 * Safe to call multiple times; only adds missing tags.
 * @returns {void}
 */
export function ensureDocumentMeta() {
  try {
    if (typeof document === "undefined" || !document.head) return;
    try {
      if (!document.querySelector('meta[charset]')) {
        const charset = document.createElement("meta");
        charset.setAttribute("charset", "utf-8");
        document.head.prepend(charset);
      }
    } catch (e) {}
    try {
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        viewport.setAttribute("content", "width=device-width, initial-scale=1");
        document.head.appendChild(viewport);
      }
    } catch (e) {}
  } catch (e) {}
}

function upsertMeta(attrName, attrValue, content) {
  const escapedAttrValue =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(String(attrValue))
      : String(attrValue);
  let sel = `meta[${attrName}="${escapedAttrValue}"]`;
  let tag = document.querySelector(sel);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLinkRel(rel, href) {
  try {
    if (!rel) return;
    const escapedRel =
      typeof CSS !== "undefined" && CSS.escape
        ? CSS.escape(String(rel))
        : String(rel);
    let link = document.querySelector(`link[rel="${escapedRel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  } catch (e) {
    debugWarn("[seoManager] upsertLinkRel failed", e);
  }
}

/**
 * Detect whether a language code is RTL using Intl.Locale.
 * @param {string} lang - Language code (e.g. 'ar', 'he', 'fa').
 * @returns {boolean} - True when the language is right-to-left.
 */
function _isRtlLang(lang) {
  try {
    if (!lang) return false;
    const loc = new Intl.Locale(lang);
    if (loc.textInfo && typeof loc.textInfo.direction === "string") {
      return loc.textInfo.direction === "rtl";
    }
    // Fallback: check known RTL language prefixes
    const short = String(lang).split("-")[0].toLowerCase();
    return ["ar", "he", "fa", "ur", "ps", "sd", "ug", "ku", "dv", "yi"].includes(
      short,
    );
  } catch (_) {
    return false;
  }
}

/**
 * Emit hreflang `<link rel="alternate">` tags for every configured
 * available language plus an `x-default` fallback. Each tag points to
 * the current page URL with the appropriate `?lang=` query parameter.
 * Safe to call multiple times; existing tags are updated in place.
 * @param {string} [pageSlug] - Optional page slug for the canonical URL.
 * @returns {void}
 */
export function setHreflangTags(pageSlug) {
  try {
    if (typeof document === "undefined" || !document.head) return;
    const langs = getLanguages();
    if (!Array.isArray(langs) || langs.length === 0) return;

    try {
      const base =
        typeof location !== "undefined" && location?.origin
          ? location.origin + location.pathname.split("?")[0]
          : "";
      if (!base) return;

      const slug = pageSlug || "";
      const baseUrl = slug
        ? `${base}?page=${encodeURIComponent(slug)}`
        : base;

      // Remove any previously emitted hreflang links to avoid duplicates
      try {
        const existing = document.querySelectorAll(
          'link[rel="alternate"][hreflang]',
        );
        existing.forEach((el) => el.remove());
      } catch (_) {}

      for (const lang of langs) {
        try {
          const href = `${baseUrl}&lang=${encodeURIComponent(String(lang))}`;
          const link = document.createElement("link");
          link.setAttribute("rel", "alternate");
          link.setAttribute("hreflang", String(lang));
          link.setAttribute("href", href);
          document.head.appendChild(link);
        } catch (_) {}
      }

      // x-default fallback
      try {
        const xDefault = document.createElement("link");
        xDefault.setAttribute("rel", "alternate");
        xDefault.setAttribute("hreflang", "x-default");
        xDefault.setAttribute("href", baseUrl);
        document.head.appendChild(xDefault);
      } catch (_) {}
    } catch (e) {
      debugWarn("[seoManager] setHreflangTags failed", e);
    }
  } catch (e) {
    debugWarn("[seoManager] setHreflangTags failed", e);
  }
}

/**
 * Set or update Open Graph and Twitter Card meta tags.
 * @param {Object} meta - Page metadata object.
 * @param {string} [titleOverride] - Optional title override.
 * @param {string} [imageOverride] - Optional image URL override.
 * @param {string} [descOverride] - Optional description override.
 * @param {string} [pageType] - Optional page type for og:type (e.g. 'article', 'website').
 * @returns {void}
 */
function setOgTwitter(
  meta,
  titleOverride,
  imageOverride,
  descOverride,
  pageType,
) {
  const title =
    titleOverride && String(titleOverride).trim()
      ? titleOverride
      : meta.title || document.title;
  upsertMeta("property", "og:title", title);
  const desc =
    descOverride && String(descOverride).trim()
      ? descOverride
      : meta.description || "";
  if (desc && String(desc).trim())
    upsertMeta("property", "og:description", desc);
  if (desc && String(desc).trim())
    upsertMeta("name", "twitter:description", desc);
  upsertMeta(
    "name",
    "twitter:card",
    meta.twitter_card || "summary_large_image",
  );
  const img = imageOverride || meta.image;
  if (img) {
    upsertMeta("property", "og:image", img);
    upsertMeta("name", "twitter:image", img);
    if (meta.image_width)
      upsertMeta("property", "og:image:width", String(meta.image_width));
    if (meta.image_height)
      upsertMeta("property", "og:image:height", String(meta.image_height));
  }
  // og:type — default to 'website', use 'article' for content pages
  const ogType = pageType || meta.og_type || (meta.type === "Article" ? "article" : "website");
  upsertMeta("property", "og:type", ogType);
  // og:locale — derive from current language
  try {
    const lang =
      typeof navigator !== "undefined"
        ? navigator.language || navigator.languages?.[0] || "en"
        : "en";
    const locale = String(lang).replace("-", "_").toLowerCase();
    upsertMeta("property", "og:locale", locale);
    // og:locale:alternate — one per available language
    const langs = getLanguages();
    if (Array.isArray(langs) && langs.length > 0) {
      for (const l of langs) {
        try {
          const altLocale = String(l).replace("-", "_").toLowerCase();
          upsertMeta("property", "og:locale:alternate", altLocale);
        } catch (_) {}
      }
    }
  } catch (_) {}
  // article:published_time / article:modified_time
  if (meta.date) {
    try {
      const d = new Date(meta.date);
      if (!isNaN(d.getTime()))
        upsertMeta("property", "article:published_time", d.toISOString());
    } catch (_) {}
  }
  if (meta.dateModified) {
    try {
      const d = new Date(meta.dateModified);
      if (!isNaN(d.getTime()))
        upsertMeta("property", "article:modified_time", d.toISOString());
    } catch (_) {}
  }
  // twitter:site / twitter:creator
  if (meta.twitter_site)
    upsertMeta("name", "twitter:site", String(meta.twitter_site));
  if (meta.twitter_creator)
    upsertMeta("name", "twitter:creator", String(meta.twitter_creator));
}

/**
 * Populate standard meta tags (title, description, open-graph, twitter, etc.)
 * @param {PageData} data - Parsed page data including `meta` and `raw`.
 * @param {string} [titleOverride] - Optional title to use instead of `meta.title`.
 * @param {string} [imageOverride] - Optional image URL for Open Graph/Twitter.
 * @param {string} [descOverride] - Optional description override.
 * @param {string} [_initialDocumentTitle] - Fallback site/document title.
 * @returns {void}
 */
export function setMetaTags(
  data,
  titleOverride,
  imageOverride,
  descOverride,
  _initialDocumentTitle = "",
) {
  const meta = data.meta || {};
  const existingHtmlDesc = document?.querySelector
    ? document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || ""
    : "";
  const finalDesc =
    descOverride && String(descOverride).trim()
      ? descOverride
      : meta.description && String(meta.description).trim()
        ? meta.description
        : existingHtmlDesc && String(existingHtmlDesc).trim()
          ? existingHtmlDesc
          : "";
  if (finalDesc && String(finalDesc).trim()) setTag("description", finalDesc);
  setTag("robots", meta.robots || "index,follow");
  setOgTwitter(meta, titleOverride, imageOverride, finalDesc, meta.type);
  setHreflangTags(data.slug || data.meta?.slug || "");
}

/**
 * Read the site name from existing meta tags, if present.
 * @returns {string} - The site name from meta tags, or empty string if not found.
 */
export function getSiteNameFromMeta() {
  try {
    const candidates = [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]',
    ];
    for (const sel of candidates) {
      const m = document.querySelector(sel);
      if (m) {
        const c = m.getAttribute("content") || "";
        if (c?.trim()) return c.trim();
      }
    }
  } catch (e) {
    debugWarn("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}

/**
 * Inject JSON-LD structured data for the provided page metadata.
 * @param {PageData} data - Parsed page data used to build structured data.
 * @param {string} pagePath - Page path used to compute the canonical URL.
 * @param {string} [titleOverride] - Optional override for the title.
 * @param {string} [imageOverride] - Optional override for the image.
 * @param {string} [descOverride] - Optional override for the description.
 * @param {string} [initialDocumentTitle] - Fallback document title.
 * @returns {void}
 */
export function setStructuredData(
  data,
  pagePath,
  titleOverride,
  imageOverride,
  descOverride,
  initialDocumentTitle = "",
) {
  try {
    const meta = data.meta || {};
    const title =
      titleOverride && String(titleOverride).trim()
        ? titleOverride
        : meta.title || initialDocumentTitle || document.title;
    const description =
      descOverride && String(descOverride).trim()
        ? descOverride
        : meta.description ||
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") ||
          "";
    const image = imageOverride || meta.image || null;
function _computeCanonical(page) {
  try {
    const p = normalizePath(page);
    try {
      const base = location.origin + location.pathname;
      return base.split("?")[0] + "?page=" + encodeURIComponent(p);
    } catch (e) {
      return location.href.split("#")[0];
    }
  } catch (e) {
    return location.href.split("#")[0];
  }
}

    const canonical = _computeCanonical(pagePath);

    if (canonical) upsertLinkRel("canonical", canonical);
    try {
      upsertMeta("property", "og:url", canonical);
    } catch (e) {
      debugWarn("[seoManager] upsertMeta og:url failed", e);
    }

    function _inferPageType(page, meta) {
      try {
        const raw = String(meta?.type || "").trim();
        if (raw) return raw;
        const p = String(page || "").replace(/^\/+|\/+$/g, "").toLowerCase();
        if (!p || p === "index" || p === "home") return "WebPage";
        const segments = p.split("/");
        const first = segments[0] || "";
        const last = segments[segments.length - 1] || "";
        const map = {
          about: "AboutPage",
          contact: "ContactPage",
          blog: "Blog",
          posts: "Blog",
          article: "Article",
          articles: "Article",
          news: "NewsArticle",
          product: "Product",
          products: "Product",
          event: "Event",
          events: "Event",
          person: "ProfilePage",
          people: "ProfilePage",
          author: "ProfilePage",
          authors: "ProfilePage",
          search: "SearchResultsPage",
          faq: "FAQPage",
          faqs: "FAQPage",
          help: "WebPage",
          support: "WebPage",
          docs: "TechArticle",
          documentation: "TechArticle",
          tutorial: "TechArticle",
          howto: "HowTo",
          "how-to": "HowTo",
          recipe: "Recipe",
          recipes: "Recipe",
          review: "Review",
          reviews: "Review",
          video: "VideoObject",
          videos: "VideoObject",
          audio: "AudioObject",
          podcast: "PodcastEpisode",
        };
        // For single-segment paths (e.g., /blog, /about), use the first segment mapping
        if (segments.length === 1 && map[first]) return map[first];
        // For multi-segment paths, check the last segment first (e.g., /blog/about -> AboutPage)
        if (map[last]) return map[last];
        // Default to Article for content paths
        return "Article";
      } catch (_) {
        return "Article";
      }
    }

    const pageType = _inferPageType(pagePath, meta);
    const json = {
      "@context": "https://schema.org",
      "@type": pageType,
      headline: title || "",
      description: description || "",
      url: canonical || location.href.split("#")[0],
    };
    if (image) json.image = String(image);
    if (meta.date) json.datePublished = meta.date;
    if (meta.dateModified) json.dateModified = meta.dateModified;
    if (meta.author) {
      json.author = {
        "@type": "Person",
        name: String(meta.author),
      };
    }
    try {
      // Publisher: prefer frontmatter `meta.publisher` (string or
      // { name } object), falling back to the site name from meta tags.
      let publisherName = "";
      if (meta.publisher) {
        publisherName =
          typeof meta.publisher === "string"
            ? String(meta.publisher).trim()
            : meta.publisher?.name
              ? String(meta.publisher.name).trim()
              : "";
      }
      if (!publisherName) {
        publisherName = getSiteNameFromMeta();
      }
      if (publisherName) {
        json.publisher = {
          "@type": "Organization",
          name: publisherName,
        };
      }
    } catch (_) {}
    if (canonical) {
      json.mainEntityOfPage = {
        "@type": "WebPage",
        "@id": canonical,
      };
    }

    const id = "nimbi-jsonld";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      applyCspNonce(el);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(json, null, 2).replace(/<\/script>/gi, "<\\/script>");
  } catch (e) {
    debugWarn("[seoManager] setStructuredData failed", e);
  }
}

// Lightweight in-memory SEO map; can be configured at runtime via `setSeoMap`.
let seoMap =
  typeof window !== "undefined" && window.__SEO_MAP ? window.__SEO_MAP : {};

/**
 * Replace the internal SEO map used by `injectSeoForPage`.
 * @param {Object} map - Mapping of page => {title, description, image, ...}
 */
export function setSeoMap(map) {
  try {
    if (!map || typeof map !== "object") {
      seoMap = {};
      return;
    }
    seoMap = Object.assign({}, map);
  } catch (e) {
    debugWarn("[seoManager] setSeoMap failed", e);
  }
}

/**
 * Inject minimal SEO metadata (title, description, canonical, JSON-LD)
 * for a given `page` token. Safe to call early during init to populate
 * head tags before heavier rendering runs.
 * @param {string} page - page token (slug or path)
 * @param {string} [initialDocumentTitle] - optional fallback title
 */
export function injectSeoForPage(page, initialDocumentTitle = "") {
  try {
    if (!page) return;
    const meta = seoMap?.[page]
      ? seoMap[page]
      : typeof window !== "undefined" && window.__SEO_MAP?.[page]
        ? window.__SEO_MAP[page]
        : null;
    // Ensure canonical for the page
    try {
      const canonical =
        location.origin +
        location.pathname +
        "?page=" +
        encodeURIComponent(String(page ?? ""));
      upsertLinkRel("canonical", canonical);
      try {
        upsertMeta("property", "og:url", canonical);
      } catch (e) {}
    } catch (e) {}
    // If we don't have a map entry, still leave canonical/og:url in place
    if (!meta) return;
    try {
      if (meta.title) document.title = String(meta.title);
    } catch (e) {}
    try {
      if (meta.description) setTag("description", String(meta.description));
    } catch (e) {}
    try {
      // Populate standard meta tags (robots, og, twitter) using setMetaTags
      try {
        setMetaTags(
          { meta: meta, slug: page },
          meta.title || undefined,
          meta.image || undefined,
          meta.description || undefined,
          initialDocumentTitle,
        );
      } catch (e) {
        /* continue */
      }
    } catch (e) {}
    try {
      setHreflangTags(page);
    } catch (e) {}
    try {
      setStructuredData(
        { meta: meta },
        page,
        meta.title || undefined,
        meta.image || undefined,
        meta.description || undefined,
        initialDocumentTitle,
      );
    } catch (e) {
      debugWarn("[seoManager] inject structured data failed", e);
    }
  } catch (e) {
    debugWarn("[seoManager] injectSeoForPage failed", e);
  }
}

/**
 * Mark the current document as a not-found (404) page and apply
 * appropriate SEO metadata (robots, description, canonical, JSON-LD).
 * Safe to call at runtime; no-op when DOM is unavailable.
 * @param {Object} [meta] - optional meta object containing title/description/image
 * @param {string} [pagePath] - optional page path used for canonical URL generation
 * @param {string} [titleOverride] - optional title override
 * @param {string} [descOverride] - optional description override
 */
export function markNotFound(
  meta = {},
  pagePath = "",
  titleOverride = undefined,
  descOverride = undefined,
) {
  try {
    const m = meta || {};
    const title =
      typeof titleOverride === "string" && titleOverride.trim()
        ? titleOverride
        : m.title || "Not Found";
    const desc =
      typeof descOverride === "string" && descOverride.trim()
        ? descOverride
        : m.description || "";
    try {
      setTag("robots", "noindex,follow");
    } catch (e) {}
    try {
      if (desc && String(desc).trim()) setTag("description", String(desc));
    } catch (e) {}
    try {
      setMetaTags(
        { meta: Object.assign({}, m, { robots: "noindex,follow" }) },
        title,
        m.image || undefined,
        desc,
      );
    } catch (e) {}
    try {
      setStructuredData(
        { meta: Object.assign({}, m, { title: title, description: desc }) },
        pagePath || "",
        title,
        m.image || undefined,
        desc,
      );
    } catch (e) {}
  } catch (e) {
    debugWarn("[seoManager] markNotFound failed", e);
  }
}

/**
 * Apply page-level SEO metadata: meta tags, structured data, and document title.
 * @param {Function} t - Localization function used for labels.
 * @param {string} initialDocumentTitle - Fallback title when none present.
 * @param {Record<string,unknown>} parsed - Parsed page object with `meta` and other fields.
 * @param {HTMLElement} toc - Table-of-contents element for the page.
 * @param {HTMLElement} article - Article element containing the page HTML.
 * @param {string} pagePath - The path of the page being rendered.
 * @param {string|null} anchor - Optional anchor fragment to consider.
 * @param {HTMLElement|null} topH1 - Top H1 element for the page (if any).
 * @param {string|null} h1Text - Text of the top H1.
 * @param {string|null} slugKey - Computed slug key for the page.
 * @param {PageData} data - Full page data, including raw markdown for reading time.
 * @returns {void}
 */
export function applyPageMeta(
  t,
  initialDocumentTitle,
  parsed,
  toc,
  article,
  pagePath,
  anchor,
  topH1,
  h1Text,
  slugKey,
  data,
) {
  try {
    if (toc?.querySelector) {
      const labelEl = toc.querySelector(".menu-label");
      if (labelEl) {
        labelEl.textContent = topH1?.textContent || t("onThisPage");
      }
    }
  } catch (e) {
    debugWarn("[seoManager] update toc label failed", e);
  }

  try {
    const metaTitle = parsed.meta?.title
      ? String(parsed.meta.title).trim()
      : "";
    const firstImgEl = article?.querySelector?.("img") || null;
    const firstImageUrl = firstImgEl
      ? firstImgEl.getAttribute("src") || firstImgEl.src || null
      : null;
    let descOverride = "";
    try {
      let found = "";
      try {
        const h1El = topH1 || article?.querySelector?.("h1") || null;
        if (h1El) {
          let sib = h1El.nextElementSibling;
          const parts = [];
          while (sib && !(sib.tagName && sib.tagName.toLowerCase() === "h2")) {
            try {
              if (sib.classList?.contains("nimbi-article-subtitle")) {
                sib = sib.nextElementSibling;
                continue;
              }
            } catch (_e) {}
            const txt = (sib.textContent || "").trim();
            if (txt) parts.push(txt);
            sib = sib.nextElementSibling;
          }
          if (parts.length) {
            found = parts.join(" ").replace(/\s+/g, " ").trim();
          }
          if (!found && h1Text) found = String(h1Text).trim();
        }
      } catch (e) {
        debugWarn("[seoManager] compute descOverride failed", e);
      }
      if (found && String(found).length > 160)
        found = String(found).slice(0, 157).trim() + "...";
      descOverride = found;
    } catch (e) {
      debugWarn("[seoManager] compute descOverride failed", e);
    }

    let displayTitle = "";
    try {
      if (metaTitle) displayTitle = metaTitle;
    } catch (_e) {
      /* ignore */
    }
    if (!displayTitle) {
      try {
        if (topH1?.textContent) displayTitle = String(topH1.textContent).trim();
      } catch (_e) {
        /* ignore */
      }
    }
    if (!displayTitle) {
      try {
        const h2 = article.querySelector("h2");
        if (h2?.textContent) displayTitle = String(h2.textContent).trim();
      } catch (_e) {
        /* ignore */
      }
    }
    if (!displayTitle) displayTitle = pagePath || "";

    try {
      setMetaTags(
        parsed,
        displayTitle || undefined,
        firstImageUrl,
        descOverride,
      );
    } catch (e) {
      debugWarn("[seoManager] setMetaTags failed", e);
    }
    try {
      setStructuredData(
        parsed,
        slugKey,
        displayTitle || undefined,
        firstImageUrl,
        descOverride,
        initialDocumentTitle,
      );
    } catch (e) {
      debugWarn("[seoManager] setStructuredData failed", e);
    }
    const siteName = getSiteNameFromMeta();
    if (displayTitle) {
      if (siteName) document.title = `${siteName} - ${displayTitle}`;
      else
        document.title = `${initialDocumentTitle || "Site"} - ${displayTitle}`;
    } else if (metaTitle) {
      document.title = metaTitle;
    } else {
      document.title = initialDocumentTitle || document.title;
    }
  } catch (e) {
    debugWarn("[seoManager] applyPageMeta failed", e);
  }

  try {
    try {
      const prevs = article.querySelectorAll(".nimbi-reading-time");
      prevs?.forEach((p) => p.remove());
    } catch (_e) {}
    if (h1Text) {
      const metrics = getTextMetrics(data?.raw || "");
      const rt = metrics?.readingTime ? metrics.readingTime : null;
      const minutes =
        typeof rt?.minutes === "number" ? Math.ceil(rt.minutes) : 0;
      const rtText = minutes ? t("readingTime", { minutes }) : "";
      if (!rtText) return;
      const topH1Elem = article.querySelector("h1");
      if (topH1Elem) {
        const subtitleEl = article.querySelector(".nimbi-article-subtitle");
        try {
          if (subtitleEl) {
            const span = document.createElement("span");
            span.className = "nimbi-reading-time";
            // text only; visual separator handled via CSS ::before so it can be toggled per-breakpoint
            span.textContent = rtText;
            subtitleEl.appendChild(span);
          } else {
            const sub = document.createElement("p");
            sub.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const span = document.createElement("span");
            span.className = "nimbi-reading-time";
            span.textContent = rtText;
            sub.appendChild(span);
            try {
              topH1Elem.parentElement.insertBefore(sub, topH1Elem.nextSibling);
            } catch (e) {
              try {
                topH1Elem.insertAdjacentElement("afterend", sub);
              } catch (e2) {
                /* ignore */
              }
            }
          }
        } catch (err) {
          try {
            const sub = document.createElement("p");
            sub.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const span = document.createElement("span");
            span.className = "nimbi-reading-time";
            span.textContent = rtText;
            sub.appendChild(span);
            topH1Elem.insertAdjacentElement("afterend", sub);
          } catch (err2) {
            /* ignore */
          }
        }
      }
    }
  } catch (ee) {
    debugWarn("[seoManager] reading time update failed", ee);
  }
}
