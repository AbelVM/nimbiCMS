/**
 * Runtime sitemap generator and optional UI helpers.
 * Everything runs client-side at runtime; nothing happens at build time.
 */
import { allMarkdownPaths, slugToMd } from './slugManager.js'
import { normalizePath } from './utils/helpers.js'

function _getBase() {
  try {
    const base = (typeof location !== 'undefined' && location && typeof location.pathname === 'string') ? (location.origin + location.pathname.split('?')[0]) : (typeof location !== 'undefined' && location.origin ? location.origin : 'http://localhost')
    return String(base)
  } catch (e) {
    return 'http://localhost/'
  }
}

/**
 * Generate a sitemap JSON object using available runtime markdown paths.
 * @param {Object} [opts]
 * @param {boolean} [opts.includeAllMarkdown=true]
 * @returns {{generatedAt:string,entries:Array}}
 */
export function generateSitemapJson(opts = {}) {
  const { includeAllMarkdown = true } = opts || {}
  const base = _getBase()
  const paths = []
  try {
    if (includeAllMarkdown && Array.isArray(allMarkdownPaths) && allMarkdownPaths.length) {
      paths.push(...allMarkdownPaths)
    } else {
      for (const v of Array.from(slugToMd.values())) {
        if (!v) continue
        if (typeof v === 'string') paths.push(v)
        else if (v && typeof v === 'object') {
          if (v.default) paths.push(v.default)
          if (v.langs) {
            for (const lv of Object.values(v.langs || {})) if (lv) paths.push(lv)
          }
        }
      }
    }
  } catch (e) { console.warn('[runtimeSitemap] gather paths failed', e) }

  const seen = new Set()
  const entries = []
  for (let p of paths) {
    try {
      if (!p) continue
      p = normalizePath(String(p))
      if (seen.has(p)) continue
      seen.add(p)
      const loc = base.split('?')[0] + '?page=' + encodeURIComponent(p)
      entries.push({ loc, path: p })
    } catch (e) { /* ignore per-path errors */ }
  }
  return { generatedAt: new Date().toISOString(), entries }
}

function _escapeXml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/**
 * Convert sitemap JSON to XML (sitemap protocol v0.9)
 * @param {Object|Array} json
 * @returns {string}
 */
export function generateSitemapXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : (json && json.entries ? json.entries : []))
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n'
  s += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (const e of entries) {
    try {
      s += '  <url>\n'
      s += `    <loc>${_escapeXml(String(e.loc || e.path || ''))}</loc>\n`
      if (e.lastmod) s += `    <lastmod>${_escapeXml(String(e.lastmod))}</lastmod>\n`
      s += '  </url>\n'
    } catch (err) { /* ignore per-entry errors */ }
  }
  s += '</urlset>\n'
  return s
}

/**
 * Generate RSS 2.0 feed from sitemap JSON
 * @param {Object|Array} json
 * @returns {string}
 */
export function generateRssXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : (json && json.entries ? json.entries : []))
  const base = _getBase().split('?')[0]
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n'
  s += '<rss version="2.0">\n'
  s += '<channel>\n'
  s += `<title>${_escapeXml('Sitemap RSS')}</title>\n`
  s += `<link>${_escapeXml(base)}</link>\n`
  s += `<description>${_escapeXml('RSS feed generated from site index')}</description>\n`
  const lastBuild = (json && json.generatedAt) ? new Date(json.generatedAt).toUTCString() : new Date().toUTCString()
  s += `<lastBuildDate>${_escapeXml(lastBuild)}</lastBuildDate>\n`
  for (const e of entries) {
    try {
      const loc = String(e.loc || e.path || '')
      s += '<item>\n'
      s += `<title>${_escapeXml(String(e.path || e.loc || ''))}</title>\n`
      s += `<link>${_escapeXml(loc)}</link>\n`
      s += `<guid>${_escapeXml(loc)}</guid>\n`
      if (e && e.lastmod) {
        try {
          const dt = new Date(e.lastmod)
          if (!isNaN(dt)) s += `<pubDate>${_escapeXml(dt.toUTCString())}</pubDate>\n`
        } catch (_) {}
      }
      s += '</item>\n'
    } catch (err) { /* per-item ignore */ }
  }
  s += '</channel>\n'
  s += '</rss>\n'
  return s
}

/**
 * Generate Atom 1.0 feed from sitemap JSON
 * @param {Object|Array} json
 * @returns {string}
 */
export function generateAtomXml(json) {
  const entries = (json && Array.isArray(json.entries)) ? json.entries : (Array.isArray(json) ? json : (json && json.entries ? json.entries : []))
  const base = _getBase().split('?')[0]
  const updated = (json && json.generatedAt) ? new Date(json.generatedAt).toISOString() : new Date().toISOString()
  let s = '<?xml version="1.0" encoding="utf-8"?>\n'
  s += '<feed xmlns="http://www.w3.org/2005/Atom">\n'
  s += `<title>${_escapeXml('Sitemap Atom')}</title>\n`
  s += `<link href="${_escapeXml(base)}" />\n`
  s += `<updated>${_escapeXml(updated)}</updated>\n`
  s += `<id>${_escapeXml(base)}</id>\n`
  for (const e of entries) {
    try {
      const loc = String(e.loc || e.path || '')
      const entryUpdated = (e && e.lastmod) ? (new Date(e.lastmod).toISOString()) : updated
      s += '<entry>\n'
      s += `<title>${_escapeXml(String(e.path || e.loc || ''))}</title>\n`
      s += `<link href="${_escapeXml(loc)}" />\n`
      s += `<id>${_escapeXml(loc)}</id>\n`
      s += `<updated>${_escapeXml(entryUpdated)}</updated>\n`
      s += '</entry>\n'
    } catch (err) { /* per-entry ignore */ }
  }
  s += '</feed>\n'
  return s
}

function _extractLinksFromText(text) {
  try {
    const out = []
    if (!text) return out
    // markdown links: [text](href)
    const md = /\[[^\]]+\]\(([^)]+)\)/g
    let m
    while ((m = md.exec(text)) !== null) {
      if (m[1]) out.push(m[1])
    }
    // html anchors: <a href="..."> or <a href='...'>
    const ah = /<a[^>]+href=["']([^"']+)["']/gi
    while ((m = ah.exec(text)) !== null) {
      if (m[1]) out.push(m[1])
    }
    return out
  } catch (e) { return [] }
}

async function _fetchNavDerivedEntries(opts = {}) {
  if (typeof fetch === 'undefined' || typeof location === 'undefined') return []
  const { navigationPage, homePage, contentBase } = opts || {}
  const candidates = []

  // Prefer configured pages when provided (root and contentBase variants)
  try {
    if (navigationPage && typeof navigationPage === 'string') {
      candidates.push('/' + String(navigationPage || '').replace(/^\/+/, ''))
      if (contentBase) {
        try { candidates.push(new URL(String(navigationPage || ''), String(contentBase)).toString()) } catch (_) {}
      }
    }
  } catch (_) {}
  try {
    if (homePage && typeof homePage === 'string') {
      candidates.push('/' + String(homePage || '').replace(/^\/+/, ''))
      if (contentBase) {
        try { candidates.push(new URL(String(homePage || ''), String(contentBase)).toString()) } catch (_) {}
      }
    }
  } catch (_) {}

  // Common fallbacks (preserve legacy behavior)
  const fallback = [
    '/_navigation.md', '/_navigation.html', '/_home.md', '/_home.html',
    '/content/_navigation.md', '/content/_navigation.html', '/content/_home.md', '/content/_home.html'
  ]
  for (const f of fallback) if (!candidates.includes(f)) candidates.push(f)

  const base = _getBase().split('?')[0]
  const seen = new Set()
  const results = []
  for (const c of candidates) {
    try {
      const u = (typeof c === 'string' && (/^https?:\/\//i.test(c))) ? c : new URL(c, location.origin).toString()
      const res = await fetch(u, { method: 'GET' })
      if (!res || !res.ok) continue
      const text = await res.text()
      const links = _extractLinksFromText(text)
      for (let href of links) {
        try {
          try {
            const parsed = new URL(href, u)
            if (parsed.origin !== location.origin) continue
            href = parsed.pathname.replace(/^\//, '')
          } catch (err) {
            // leave href as-is
          }
          href = normalizePath(String(href || ''))
          if (!href) continue
          if (seen.has(href)) continue
          seen.add(href)
          results.push({ loc: base + '?page=' + encodeURIComponent(href), path: href })
        } catch (e) { /* per-link ignore */ }
      }
      if (results.length) return results
    } catch (e) { /* ignore per-candidate */ }
  }
  return []
}

/**
 * Attach a minimal sitemap download UI to a container element.
 * This is optional and only runs when explicitly invoked.
 * @param {Element|string} target - container element or selector
 * @param {Object} [opts] - options passed to generator and UI
 * @returns {Element|null}
 */
export function attachSitemapDownloadUI(target, opts = {}) {
  try {
    if (typeof document === 'undefined') return null
    const container = (typeof target === 'string') ? document.querySelector(target) : target
    if (!container || !container.appendChild) return null
    const wrapper = document.createElement('div')
    wrapper.className = 'nimbi-sitemap-ui'
    wrapper.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:9999;padding:6px;background:rgba(0,0,0,0.6);border-radius:6px;'

    const makeBtn = (label) => {
      const b = document.createElement('button')
      b.textContent = label
      b.style.cssText = 'color:#fff;background:transparent;border:1px solid rgba(255,255,255,0.2);padding:6px 8px;margin:2px;border-radius:4px;cursor:pointer'
      return b
    }

    const btnJson = makeBtn('sitemap.json')
    btnJson.title = 'Download sitemap.json'
    btnJson.addEventListener('click', () => {
      try {
        const json = generateSitemapJson(opts)
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = opts.filename || 'sitemap.json'
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 5000)
      } catch (e) { console.warn('[runtimeSitemap] download json failed', e) }
    })

    const btnXml = makeBtn('sitemap.xml')
    btnXml.title = 'Download sitemap.xml'
    btnXml.addEventListener('click', () => {
      try {
        const json = generateSitemapJson(opts)
        const xml = generateSitemapXml(json)
        const blob = new Blob([xml], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = opts.filename || 'sitemap.xml'
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 5000)
      } catch (e) { console.warn('[runtimeSitemap] download xml failed', e) }
    })

    wrapper.appendChild(btnJson)
    wrapper.appendChild(btnXml)
    container.appendChild(wrapper)
    return wrapper
  } catch (e) { console.warn('[runtimeSitemap] attach UI failed', e); return null }
}

/**
 * Handle a direct request for a sitemap route at runtime.
 * Intercepts requests for `/sitemap`, `/sitemap.html`, and `/sitemap.xml`
 * when the host serves the SPA `index.html` for those paths. This allows
 * crawlers that execute JavaScript (e.g. Google) to receive a sitemap
 * generated from the runtime index data. This is opt-in and must be
 * enabled by the host via `initCMS({ exposeSitemap: true })` or
 * `window.__nimbiExposeSitemap = true`.
 *
 * Returns `true` when the request was handled and the document was
 * replaced with the sitemap contents; `false` otherwise.
 *
 * Note: because this runs client-side there is no server-side
 * `Content-Type` header control. For full crawler compatibility a
 * server-generated sitemap.xml is preferred.
 */
export function handleSitemapRequest(opts = {}) {
  try {
    if (typeof location === 'undefined' || typeof document === 'undefined') return false

    // Allow `?sitemap` query form at site root (no other params, no anchor)
    // Only handle when the query contains the single `sitemap` key (value may be empty).
    let wantXml = false
    let wantHtml = false
      let wantRss = false
      let wantAtom = false
    try {
      if (typeof location.search === 'string' && location.search) {
        const sp = new URLSearchParams(location.search)
        if (sp.has('sitemap')) {
          let onlySitemap = true
          for (const k of sp.keys()) {
            if (k !== 'sitemap') {
              onlySitemap = false
              break
            }
          }
          if (onlySitemap) {
            // Do not handle if there's a fragment anchor present
            if (location.hash && String(location.hash || '').trim()) {
              return false
            }
            wantXml = true
          } else {
            return false
          }
        }
      }
    } catch (e) { /* ignore search parsing issues */ }

    // Also accept hash-based `#/?sitemap` (cosmetic URL form)
    try {
      if (!wantXml && typeof location.hash === 'string' && location.hash && location.hash.startsWith('#/?')) {
        const qs = location.hash.slice(2) // remove leading '#'
        const sp = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs)
        if (sp.has('sitemap')) {
          let onlySitemap = true
          for (const k of sp.keys()) {
            if (k !== 'sitemap') { onlySitemap = false; break }
          }
          if (onlySitemap) {
            wantXml = true
          }
        }
      }
    } catch (e) { /* ignore hash parsing issues */ }

      if (typeof location.search === 'string' && location.search) {
        const sp = new URLSearchParams(location.search)
        if (sp.has('rss')) {
          let onlyRss = true
          for (const k of sp.keys()) { if (k !== 'rss') { onlyRss = false; break } }
          if (onlyRss) {
            if (location.hash && String(location.hash || '').trim()) return false
            wantRss = true
          } else return false
        } else if (sp.has('atom')) {
          let onlyAtom = true
          for (const k of sp.keys()) { if (k !== 'atom') { onlyAtom = false; break } }
          if (onlyAtom) {
            if (location.hash && String(location.hash || '').trim()) return false
            wantAtom = true
          } else return false
        }
      }
    // Honor host preference to render HTML for `?sitemap` when explicitly requested
    try {
      if (typeof window !== 'undefined' && window && window.__nimbiPreferHtmlSitemap === true && wantXml) {
        wantXml = false
        wantHtml = true
      }
    } catch (e) { /* ignore preference check errors */ }

    // Fallback: handle path-based /sitemap and /sitemap.xml routes
    if (!wantXml && !wantHtml) {
      const pathname = (location.pathname || '/').replace(/\/\/+/g, '/')
      const name = pathname.split('/').filter(Boolean).pop() || ''
      if (!name) return false
      wantXml = /^(sitemap|sitemap\.xml)$/i.test(name)
      wantHtml = /^(sitemap|sitemap\.html)$/i.test(name)
      wantRss = /^(rss|rss\.xml)$/i.test(name)
      wantAtom = /^(atom|atom\.xml)$/i.test(name)
      if (!wantXml && !wantHtml && !wantRss && !wantAtom) return false
    }

    const json = generateSitemapJson(opts)

    // If we don't have entries, attempt an async fallback that tries to
    // fetch a likely navigation or home markdown file (e.g. `/_navigation.md`, `/_home.md`)
    // and extract links to populate the sitemap. We return `true` immediately
    // (we will write the sitemap later when the fetch completes) so the
    // SPA init can short-circuit; the actual document replacement happens
    // asynchronously when results arrive.
    async function _fetchFallbackAndWrite(format = 'sitemap') {
      try {
        const entries = await _fetchNavDerivedEntries(opts)
        if (entries && entries.length) {
          let xml2 = ''
          if (format === 'rss') xml2 = generateRssXml({ generatedAt: new Date().toISOString(), entries })
          else if (format === 'atom') xml2 = generateAtomXml({ generatedAt: new Date().toISOString(), entries })
          else xml2 = generateSitemapXml({ generatedAt: new Date().toISOString(), entries })
          try {
            try {
              document.open('application/xml', 'replace')
            } catch (_) {
              try { document.open() } catch (_) {}
            }
            document.write(xml2)
            document.close()

            // Best-effort: navigate to a Blob URL containing the XML so the
            // browser treats the resource as standalone XML and avoids
            // injection from extensions that may alter the written DOM.
            try {
              if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
                const blob = new Blob([xml2], { type: 'application/xml' })
                const blobUrl = URL.createObjectURL(blob)
                try { location.href = blobUrl } catch (_) {
                  try { if (typeof window !== 'undefined' && window && typeof window.open === 'function') window.open(blobUrl, '_self') } catch (_) {}
                }
                setTimeout(() => { try { URL.revokeObjectURL(blobUrl) } catch (_) {} }, 5000)
              }
            } catch (_) {}

            return
          } catch (e) {
            // Try a data: URL navigation as a best-effort to let the browser
            // treat the content as XML. If that fails, fall back to HTML-escaped
            // presentation inside a <pre>.
            try {
              if (typeof location !== 'undefined' && location) {
                const dataUrl = 'data:application/xml;charset=utf-8,' + encodeURIComponent(xml2)
                try { location.href = dataUrl; return } catch (_) {}
                try { if (typeof window !== 'undefined' && window && typeof window.open === 'function') { window.open(dataUrl, '_self'); return } } catch (_) {}
              }
            } catch (_) {}
            try { document.body.innerHTML = '<pre>' + _escapeXml(xml2) + '</pre>' } catch (e2) {}
            return
          }
        }
      } catch (e) {
        console.warn('[runtimeSitemap] fallback fetch failed', e)
      }
    }

    if (wantXml) {
      if (json && Array.isArray(json.entries) && json.entries.length) {
        const xml = generateSitemapXml(json)
        try {
          try {
            document.open('application/xml', 'replace')
          } catch (_) {
            try { document.open() } catch (_) {}
          }
          document.write(xml)
          document.close()

          // Best-effort: navigate to a Blob URL containing the XML so the
          // browser treats the resource as standalone XML and avoids
          // injection from extensions that may alter the written DOM.
          try {
            if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
              const blob = new Blob([xml], { type: 'application/xml' })
              const blobUrl = URL.createObjectURL(blob)
              try { location.href = blobUrl } catch (_) {
                try { if (typeof window !== 'undefined' && window && typeof window.open === 'function') window.open(blobUrl, '_self') } catch (_) {}
              }
              setTimeout(() => { try { URL.revokeObjectURL(blobUrl) } catch (_) {} }, 5000)
            }
          } catch (_) {}

        } catch (e) {
          try {
            if (typeof location !== 'undefined' && location) {
              const dataUrl = 'data:application/xml;charset=utf-8,' + encodeURIComponent(xml)
              try { location.href = dataUrl } catch (_) {}
            }
          } catch (_) {}
          try { document.body.innerHTML = '<pre>' + _escapeXml(xml) + '</pre>' } catch (e2) {}
        }
      } else {
        // start async fallback but still return true synchronously
        _fetchFallbackAndWrite()
      }
      return true
    }

    if (wantRss) {
      if (json && Array.isArray(json.entries) && json.entries.length) {
        const rss = generateRssXml(json)
        try {
          try { document.open('application/rss+xml', 'replace') } catch (_) { try { document.open() } catch (_) {} }
          document.write(rss)
          document.close()
          try {
            if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
              const blob = new Blob([rss], { type: 'application/rss+xml' })
              const blobUrl = URL.createObjectURL(blob)
              try { location.href = blobUrl } catch (_) { try { if (typeof window !== 'undefined' && window && typeof window.open === 'function') window.open(blobUrl, '_self') } catch (_) {} }
              setTimeout(() => { try { URL.revokeObjectURL(blobUrl) } catch (_) {} }, 5000)
            }
          } catch (_) {}
        } catch (e) {
          try {
            if (typeof location !== 'undefined' && location) {
              const dataUrl = 'data:application/rss+xml;charset=utf-8,' + encodeURIComponent(rss)
              try { location.href = dataUrl } catch (_) {}
            }
          } catch (_) {}
          try { document.body.innerHTML = '<pre>' + _escapeXml(rss) + '</pre>' } catch (e2) {}
        }
      } else {
        _fetchFallbackAndWrite('rss')
      }
      return true
    }

    if (wantAtom) {
      if (json && Array.isArray(json.entries) && json.entries.length) {
        const atom = generateAtomXml(json)
        try {
          try { document.open('application/atom+xml', 'replace') } catch (_) { try { document.open() } catch (_) {} }
          document.write(atom)
          document.close()
          try {
            if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
              const blob = new Blob([atom], { type: 'application/atom+xml' })
              const blobUrl = URL.createObjectURL(blob)
              try { location.href = blobUrl } catch (_) { try { if (typeof window !== 'undefined' && window && typeof window.open === 'function') window.open(blobUrl, '_self') } catch (_) {} }
              setTimeout(() => { try { URL.revokeObjectURL(blobUrl) } catch (_) {} }, 5000)
            }
          } catch (_) {}
        } catch (e) {
          try {
            if (typeof location !== 'undefined' && location) {
              const dataUrl = 'data:application/atom+xml;charset=utf-8,' + encodeURIComponent(atom)
              try { location.href = dataUrl } catch (_) {}
            }
          } catch (_) {}
          try { document.body.innerHTML = '<pre>' + _escapeXml(atom) + '</pre>' } catch (e2) {}
        }
      } else {
        _fetchFallbackAndWrite('atom')
      }
      return true
    }

    // sitemap.html
    try {
      let html = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>'
      html += '<h1>Sitemap</h1><ul>'
      for (const e of (json && json.entries) || []) {
        try {
          const loc = String(e.loc || '')
          html += `<li><a href="${loc}">${loc}</a></li>`
        } catch (err) { /* ignore per-entry */ }
      }
      html += '</ul></body></html>'
      try {
        document.open()
        document.write(html)
        document.close()
      } catch (e) {
        try { document.body.innerHTML = html } catch (e2) {}
      }
      return true
    } catch (e) {
      console.warn('[runtimeSitemap] handleSitemapRequest failed to render', e)
      return false
    }
  } catch (e) { console.warn('[runtimeSitemap] handleSitemapRequest failed', e); return false }
}
