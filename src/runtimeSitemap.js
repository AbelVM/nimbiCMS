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
