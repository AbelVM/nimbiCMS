/**
 * SEO helpers: meta tags and structured data.
 *
 * Utilities to set standard meta tags, Open Graph/Twitter tags, and JSON-LD
 * structured data for pages.
 *
 * @module seoManager
 */
import { normalizePath } from './utils/helpers.js'
import { getTextMetrics } from './utils/textMetrics.js'
import { debugWarn } from './utils/debug.js'

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
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertMeta(attrName, attrValue, content) {
  let sel = `meta[${attrName}="${attrValue}"]`
  let tag = document.querySelector(sel)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLinkRel(rel, href) {
  try {
    if (!rel) return
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', rel)
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  } catch (e) { debugWarn('[seoManager] upsertLinkRel failed', e) }
}

function setOgTwitter(meta, titleOverride, imageOverride, descOverride) {
  const title = (titleOverride && String(titleOverride).trim()) ? titleOverride : (meta.title || document.title)
  upsertMeta('property', 'og:title', title)
  const desc = (descOverride && String(descOverride).trim()) ? descOverride : (meta.description || '')
  if (desc && String(desc).trim()) upsertMeta('property', 'og:description', desc)
  if (desc && String(desc).trim()) upsertMeta('name', 'twitter:description', desc)
  upsertMeta('name', 'twitter:card', meta.twitter_card || 'summary_large_image')
  const img = imageOverride || meta.image
  if (img) {
    upsertMeta('property', 'og:image', img)
    upsertMeta('name', 'twitter:image', img)
  }
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
export function setMetaTags(data, titleOverride, imageOverride, descOverride, _initialDocumentTitle = '') {
  const meta = data.meta || {}
  const existingHtmlDesc = (document && document.querySelector) ? (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) || '' : ''
  const finalDesc = (descOverride && String(descOverride).trim()) ? descOverride : (meta.description && String(meta.description).trim()) ? meta.description : (existingHtmlDesc && String(existingHtmlDesc).trim()) ? existingHtmlDesc : ''
  if (finalDesc && String(finalDesc).trim()) setTag('description', finalDesc)
  setTag('robots', meta.robots || 'index,follow')
  setOgTwitter(meta, titleOverride, imageOverride, finalDesc)
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
      'meta[name="twitter:site"]'
    ]
    for (const sel of candidates) {
      const m = document.querySelector(sel)
      if (m) {
        const c = m.getAttribute('content') || ''
        if (c && c.trim()) return c.trim()
      }
    }
  } catch (e) {
    debugWarn('[seoManager] getSiteNameFromMeta failed', e)
  }
  return ''
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
export function setStructuredData(data, pagePath, titleOverride, imageOverride, descOverride, initialDocumentTitle = '') {
  try {
    const meta = data.meta || {}
    const title = (titleOverride && String(titleOverride).trim()) ? titleOverride : (meta.title || initialDocumentTitle || document.title)
    const description = (descOverride && String(descOverride).trim()) ? descOverride : (meta.description || (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) || '')
    const image = imageOverride || meta.image || null
    let canonical = ''
    try {
      if (pagePath) {
        const p = normalizePath(pagePath)
        try {
          const base = location.origin + location.pathname
          canonical = base.split('?')[0] + '?page=' + encodeURIComponent(p)
        } catch (e) {
          canonical = location.href.split('#')[0]
        }
      } else {
        canonical = location.href.split('#')[0]
      }
    } catch (e) { canonical = location.href.split('#')[0]; debugWarn('[seoManager] compute canonical failed', e) }

    if (canonical) upsertLinkRel('canonical', canonical)
    try { upsertMeta('property', 'og:url', canonical) } catch (e) { debugWarn('[seoManager] upsertMeta og:url failed', e) }

    const json = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title || '',
      'description': description || '',
      'url': canonical || location.href.split('#')[0]
    }
    if (image) json.image = String(image)
    if (meta.date) json.datePublished = meta.date
    if (meta.dateModified) json.dateModified = meta.dateModified

    const id = 'nimbi-jsonld'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(json, null, 2)
  } catch (e) { debugWarn('[seoManager] setStructuredData failed', e) }
}

// Lightweight in-memory SEO map; can be configured at runtime via `setSeoMap`.
let seoMap = (typeof window !== 'undefined' && window.__SEO_MAP) ? window.__SEO_MAP : {}

/**
 * Replace the internal SEO map used by `injectSeoForPage`.
 * @param {Object} map - Mapping of page => {title, description, image, ...}
 */
export function setSeoMap(map) {
  try {
    if (!map || typeof map !== 'object') { seoMap = {}; return }
    seoMap = Object.assign({}, map)
  } catch (e) { debugWarn('[seoManager] setSeoMap failed', e) }
}

/**
 * Inject minimal SEO metadata (title, description, canonical, JSON-LD)
 * for a given `page` token. Safe to call early during init to populate
 * head tags before heavier rendering runs.
 * @param {string} page - page token (slug or path)
 * @param {string} [initialDocumentTitle] - optional fallback title
 */
export function injectSeoForPage(page, initialDocumentTitle = '') {
  try {
    if (!page) return
    const meta = (seoMap && seoMap[page]) ? seoMap[page] : (typeof window !== 'undefined' && window.__SEO_MAP && window.__SEO_MAP[page] ? window.__SEO_MAP[page] : null)
    // Ensure canonical for the page
    try {
      const canonical = location.origin + location.pathname + '?page=' + encodeURIComponent(String(page ?? ''))
      upsertLinkRel('canonical', canonical)
      try { upsertMeta('property', 'og:url', canonical) } catch (e) {}
    } catch (e) {}
    // If we don't have a map entry, still leave canonical/og:url in place
    if (!meta) return
    try { if (meta.title) document.title = String(meta.title) } catch (e) {}
    try { if (meta.description) setTag('description', String(meta.description)) } catch (e) {}
    try {
      // Populate standard meta tags (robots, og, twitter) using setMetaTags
      try { setMetaTags({ meta: meta }, meta.title || undefined, meta.image || undefined, meta.description || undefined, initialDocumentTitle) } catch (e) { /* continue */ }
    } catch (e) {}
    try { setStructuredData({ meta: meta }, page, meta.title || undefined, meta.image || undefined, meta.description || undefined, initialDocumentTitle) } catch (e) { debugWarn('[seoManager] inject structured data failed', e) }
  } catch (e) { debugWarn('[seoManager] injectSeoForPage failed', e) }
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
export function markNotFound(meta = {}, pagePath = '', titleOverride = undefined, descOverride = undefined) {
  try {
    const m = meta || {}
    const title = (typeof titleOverride === 'string' && titleOverride.trim()) ? titleOverride : (m.title || 'Not Found')
    const desc = (typeof descOverride === 'string' && descOverride.trim()) ? descOverride : (m.description || '')
    try { setTag('robots', 'noindex,follow') } catch (e) {}
    try { if (desc && String(desc).trim()) setTag('description', String(desc)) } catch (e) {}
    try { setMetaTags({ meta: Object.assign({}, m, { robots: 'noindex,follow' }) }, title, m.image || undefined, desc) } catch (e) {}
    try { setStructuredData({ meta: Object.assign({}, m, { title: title, description: desc }) }, pagePath || '', title, m.image || undefined, desc) } catch (e) {}
  } catch (e) { debugWarn('[seoManager] markNotFound failed', e) }
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
export function applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data) {
  try {
    if (toc && toc.querySelector) {
      const labelEl = toc.querySelector('.menu-label')
      if (labelEl) {
        labelEl.textContent = topH1 ? (topH1.textContent || t('onThisPage')) : t('onThisPage')
      }
    }
  } catch (e) { debugWarn('[seoManager] update toc label failed', e) }

  try {
    const metaTitle = parsed.meta && parsed.meta.title ? String(parsed.meta.title).trim() : ''
    const firstImgEl = article.querySelector('img')
    const firstImageUrl = firstImgEl ? (firstImgEl.getAttribute('src') || firstImgEl.src || null) : null
    let descOverride = ''
    try {
      let found = ''
      try {
        const h1El = topH1 || (article && article.querySelector ? article.querySelector('h1') : null)
        if (h1El) {
          let sib = h1El.nextElementSibling
          const parts = []
          while (sib && !(sib.tagName && sib.tagName.toLowerCase() === 'h2')) {
            try {
              if (sib.classList && sib.classList.contains('nimbi-article-subtitle')) { sib = sib.nextElementSibling; continue }
            } catch (_e) {}
            const txt = (sib.textContent || '').trim()
            if (txt) parts.push(txt)
            sib = sib.nextElementSibling
          }
          if (parts.length) {
            found = parts.join(' ').replace(/\s+/g, ' ').trim()
          }
          if (!found && h1Text) found = String(h1Text).trim()
        }
          } catch (e) { debugWarn('[seoManager] compute descOverride failed', e) }
      if (found && String(found).length > 160) found = String(found).slice(0, 157).trim() + '...'
      descOverride = found
    } catch (e) { debugWarn('[seoManager] compute descOverride failed', e) }

    let displayTitle = ''
    try {
      if (metaTitle) displayTitle = metaTitle
    } catch (_e) { /* ignore */ }
    if (!displayTitle) {
      try { if (topH1 && topH1.textContent) displayTitle = String(topH1.textContent).trim() } catch (_e) { /* ignore */ }
    }
    if (!displayTitle) {
      try {
        const h2 = article.querySelector('h2')
        if (h2 && h2.textContent) displayTitle = String(h2.textContent).trim()
      } catch (_e) { /* ignore */ }
    }
    if (!displayTitle) displayTitle = pagePath || ''

    try { setMetaTags(parsed, displayTitle || undefined, firstImageUrl, descOverride) } catch (e) { debugWarn('[seoManager] setMetaTags failed', e) }
    try { setStructuredData(parsed, slugKey, displayTitle || undefined, firstImageUrl, descOverride, initialDocumentTitle) } catch (e) { debugWarn('[seoManager] setStructuredData failed', e) }
    const siteName = getSiteNameFromMeta()
    if (displayTitle) {
      if (siteName) document.title = `${siteName} - ${displayTitle}`
      else document.title = `${initialDocumentTitle || 'Site'} - ${displayTitle}`
    } else if (metaTitle) {
      document.title = metaTitle
    } else {
      document.title = initialDocumentTitle || document.title
    }
  } catch (e) { debugWarn('[seoManager] applyPageMeta failed', e) }

  try {
    try { const prevs = article.querySelectorAll('.nimbi-reading-time'); prevs && prevs.forEach(p => p.remove()) } catch (_e) {}
    if (h1Text) {
      const metrics = getTextMetrics(data.raw || '')
      const rt = metrics && metrics.readingTime ? metrics.readingTime : null
      const minutes = rt && typeof rt.minutes === 'number' ? Math.ceil(rt.minutes) : 0
      const rtText = minutes ? t('readingTime', { minutes }) : ''
      if (!rtText) return
      const topH1Elem = article.querySelector('h1')
      if (topH1Elem) {
        const subtitleEl = article.querySelector('.nimbi-article-subtitle')
        try {
          if (subtitleEl) {
            const span = document.createElement('span')
            span.className = 'nimbi-reading-time'
            // text only; visual separator handled via CSS ::before so it can be toggled per-breakpoint
            span.textContent = rtText
            subtitleEl.appendChild(span)
          } else {
            const sub = document.createElement('p')
            sub.className = 'nimbi-article-subtitle is-6 has-text-grey-light'
            const span = document.createElement('span')
            span.className = 'nimbi-reading-time'
            span.textContent = rtText
            sub.appendChild(span)
            try { topH1Elem.parentElement.insertBefore(sub, topH1Elem.nextSibling) } catch (e) { try { topH1Elem.insertAdjacentElement('afterend', sub) } catch (e2) { /* ignore */ } }
          }
        } catch (err) { try { const sub = document.createElement('p'); sub.className = 'nimbi-article-subtitle is-6 has-text-grey-light'; const span = document.createElement('span'); span.className = 'nimbi-reading-time'; span.textContent = rtText; sub.appendChild(span); topH1Elem.insertAdjacentElement('afterend', sub) } catch (err2) { /* ignore */ } }
      }
    }
  } catch (ee) { debugWarn('[seoManager] reading time update failed', ee) }
}
