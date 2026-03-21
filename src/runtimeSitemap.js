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
    const pathname = (location.pathname || '/').replace(/\/+/g, '/')
    const name = pathname.split('/').filter(Boolean).pop() || ''
    if (!name) return false
    const wantXml = /^(sitemap|sitemap\.xml)$/i.test(name)
    const wantHtml = /^(sitemap|sitemap\.html)$/i.test(name)
    if (!wantXml && !wantHtml) return false

    const json = generateSitemapJson(opts)

    if (wantXml) {
      const xml = generateSitemapXml(json)
      try {
        document.open()
        document.write(xml)
        document.close()
      } catch (e) {
        try { document.body.innerHTML = '<pre>' + _escapeXml(xml) + '</pre>' } catch (e2) {}
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
