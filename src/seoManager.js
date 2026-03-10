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
  } catch (e) { }
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

export function setMetaTags(data, titleOverride, imageOverride, descOverride, initialDocumentTitle = '') {
  const meta = data.meta || {}
  const existingHtmlDesc = (document && document.querySelector) ? (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) || '' : ''
  const finalDesc = descOverride || meta.description || existingHtmlDesc || ''
  setTag('description', finalDesc)
  setTag('robots', meta.robots || 'index,follow')
  setOgTwitter(meta, titleOverride, imageOverride, finalDesc)
}

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
  }
  return ''
}

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
        const p = String(pagePath).replace(/^[\.\/]+/, '')
        try {
          const base = location.origin + location.pathname
          canonical = base.split('?')[0] + '?page=' + encodeURIComponent(p)
        } catch (e) {
          canonical = location.href.split('#')[0]
        }
      } else {
        canonical = location.href.split('#')[0]
      }
    } catch (e) { canonical = location.href.split('#')[0] }

    if (canonical) upsertLinkRel('canonical', canonical)
    try { upsertMeta('property', 'og:url', canonical) } catch (e) { }

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
  } catch (e) { }
}
