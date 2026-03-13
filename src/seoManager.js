import { normalizePath } from './utils/helpers.js'

/**
 * Page data shape passed around the renderer.
 * @typedef {Object} PageData
 * @property {Object} [meta]
 * @property {string} [raw]
 */

/**
 * Set or update a single meta tag or property in the document head.
 *
 * @param {string} name
 * @param {string} content
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
  } catch (e) { console.warn('[seoManager] upsertLinkRel failed', e) }
}

function setOgTwitter(meta, titleOverride, imageOverride, descOverride) {
  const title = (titleOverride && String(titleOverride).trim()) ? titleOverride : (meta.title || document.title)
  upsertMeta('property', 'og:title', title)
  const desc = (descOverride && String(descOverride).trim()) ? descOverride : (meta.description || '')
  upsertMeta('property', 'og:description', desc)
  upsertMeta('name', 'twitter:card', meta.twitter_card || 'summary_large_image')
  const img = imageOverride || meta.image
  if (img) {
    upsertMeta('property', 'og:image', img)
    upsertMeta('name', 'twitter:image', img)
  }
}

/**
 * Populate standard meta tags (title, description, og:image, etc.) using
 * the provided page metadata.  Overrides allow caller to supply alternate
 * values.
 *
 * @param {PageData} data
 * @param {string} [titleOverride]
 * @param {string} [imageOverride]
 * @param {string} [descOverride]
 * @param {string} [initialDocumentTitle]
 * @returns {void}
 */
export function setMetaTags(data, titleOverride, imageOverride, descOverride, initialDocumentTitle = '') {
  const meta = data.meta || {}
  const existingHtmlDesc = (document && document.querySelector) ? (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) || '' : ''
  const finalDesc = descOverride || meta.description || existingHtmlDesc || ''
  setTag('description', finalDesc)
  setTag('robots', meta.robots || 'index,follow')
  setOgTwitter(meta, titleOverride, imageOverride, finalDesc)
}

/**
 * Read the site name from existing meta tags, if present.
 * @returns {string|null}
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
    console.warn('[seoManager] getSiteNameFromMeta failed', e)
  }
  return ''
}

/**
 * Inject JSON-LD structured data based on page metadata and defaults.
 *
 * @param {PageData} data
 * @param {string} pagePath
 * @param {string} [titleOverride]
 * @param {string} [imageOverride]
 * @param {string} [descOverride]
 * @param {string} [initialDocumentTitle]
 * @returns {void}
 */
export function setStructuredData(data, pagePath, titleOverride, imageOverride, descOverride, initialDocumentTitle = '') {
  try {
    const meta = data.meta || {}
    const title = (titleOverride && String(titleOverride).trim()) ? titleOverride : (meta.title || initialDocumentTitle || document.title)
    const description = (descOverride && String(descOverride).trim()) ? descOverride : (meta.description || (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) || '')
    const image = imageOverride || meta.image || null
    // build canonical URL: prefer a path-based pagePath when available
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
    } catch (e) { canonical = location.href.split('#')[0]; console.warn('[seoManager] compute canonical failed', e) }

    if (canonical) upsertLinkRel('canonical', canonical)
    try { upsertMeta('property', 'og:url', canonical) } catch (e) { console.warn('[seoManager] upsertMeta og:url failed', e) }

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
  } catch (e) { console.warn('[seoManager] setStructuredData failed', e) }
}

import readingTime from 'reading-time/lib/reading-time'

/**
 * High-level helper invoked by the main renderer to update all SEO-related
 * metadata (meta tags, structured data, document title, etc.) based on the
 * freshly parsed page.
 *
 * @param {Function} t - localization function
 * @typedef {Object} ParsedPage
 * @property {Object} [meta]

 * @param {function(string, Object=): string} t - localization function
 * @param {string} initialDocumentTitle
 * @param {ParsedPage} parsed
 * @param {HTMLElement} toc
 * @param {HTMLElement} article
 * @param {string} pagePath
 * @param {string|null} anchor
 * @param {HTMLElement|null} topH1
 * @param {string|null} h1Text
 * @param {string|null} slugKey
 * @param {PageData} data
 * @returns {void}
 */
export function applyPageMeta(t, initialDocumentTitle, parsed, toc, article, pagePath, anchor, topH1, h1Text, slugKey, data) {
    try {
      const labelEl = toc.querySelector('.menu-label')
      if (labelEl) {
        labelEl.textContent = topH1 ? (topH1.textContent || t('onThisPage')) : t('onThisPage')
      }
    } catch (e) { console.warn('[seoManager] update toc label failed', e) }

    try {
      const metaTitle = parsed.meta && parsed.meta.title ? String(parsed.meta.title).trim() : ''
      const firstImgEl = article.querySelector('img')
      const firstImageUrl = firstImgEl ? (firstImgEl.getAttribute('src') || firstImgEl.src || null) : null
      let descOverride = ''
      try {
        let found = ''
        if (h1Text) {
          let sib = article.querySelector('h1')?.nextElementSibling
          while (sib && !(sib.tagName && sib.tagName.toLowerCase() === 'h2')) {
            if (sib.tagName && sib.tagName.toLowerCase() === 'p') {
              const txt = (sib.textContent || '').trim()
              if (txt) { found = txt; break }
            }
            sib = sib.nextElementSibling
          }
        }
        if (!found) {
          const existingDescTag = document.querySelector('meta[name="description"]')
          found = existingDescTag && existingDescTag.getAttribute ? (existingDescTag.getAttribute('content') || '') : ''
        }
        descOverride = found
      } catch (e) { console.warn('[seoManager] compute descOverride failed', e) }

      try { setMetaTags(parsed, h1Text, firstImageUrl, descOverride) } catch (e) { console.warn('[seoManager] setMetaTags failed', e) }
      try { setStructuredData(parsed, slugKey, h1Text, firstImageUrl, descOverride, initialDocumentTitle) } catch (e) { console.warn('[seoManager] setStructuredData failed', e) }
      const siteName = getSiteNameFromMeta()
      if (h1Text) {
        if (siteName) document.title = `${siteName} - ${h1Text}`
        else document.title = `${initialDocumentTitle || 'Site'} - ${h1Text}`
      } else if (metaTitle) {
        document.title = metaTitle
      } else {
        document.title = initialDocumentTitle || document.title
      }
    } catch (e) { console.warn('[seoManager] applyPageMeta failed', e) }

    try {
      const prev = article.querySelector('.nimbi-reading-time')
      if (prev) prev.remove()
      if (h1Text) {
        const rt = readingTime(data.raw || '')
        const minutes = rt && typeof rt.minutes === 'number' ? Math.ceil(rt.minutes) : 0
        const p = document.createElement('p')
        p.className = 'nimbi-reading-time'
        p.textContent = minutes ? t('readingTime', { minutes }) : ''
        const topH1Elem = article.querySelector('h1')
        if (topH1Elem) topH1Elem.insertAdjacentElement('afterend', p)
      }
    } catch (ee) { console.warn('[seoManager] reading time update failed', ee) }
  }