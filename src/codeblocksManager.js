/**
 * Code block highlighting and highlight.js integration.
 *
 * Manages language registration, theming helpers, and observing code
 * blocks for automatic highlighting.
 *
 * @module codeblocksManager
 */
import hljs from 'highlight.js/lib/core'
import { debugWarn } from './utils/debug.js'
import { runImportWithCache, clearImportCache, setImportNegativeCacheTTL } from './utils/importCache.js'

/**
 * Expose the internal `hljs` (highlight.js core) instance for tests
 * and advanced usage (language registration, theming helpers).
 * This is a runtime reference to the imported highlight.js core.
 */
export { hljs }

const HIGHLIGHT_JS_VERSION = typeof __HIGHLIGHT_JS_VERSION__ !== 'undefined'
  ? String(__HIGHLIGHT_JS_VERSION__)
  : '11.11.1'

/**
 * @typedef {{name?:string,aliases?:string[]}} HLJSLangEntry
 */

/**
 * Explicit alias type for the supported languages map so the d.ts generator
 * can emit a useful signature.
 * @typedef {Map<string,string>} SupportedHljsMap
 */

/**
 * Entry stored in the language import cache.
 * @typedef {Object} LanguageImportCacheEntry
 * @property {Promise<unknown>} [promise]
 * @property {unknown} [module]
 * @property {boolean} [ok]
 * @property {number} [ts]
 */

/**
 * Map of canonical language id -> LanguageImportCacheEntry
 * @typedef {Map<string,LanguageImportCacheEntry>} LanguageImportCacheMap
 */

/**
 * Map of supported highlight.js language keys to canonical module name.
 * @type {Map<string,string>}
 */
/** @type {SupportedHljsMap} */
export const SUPPORTED_HLJS_MAP = new Map()

const DEFAULT_HLJS_SUPPORTED_URL =
  'https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md'

/** @type {Record<string,string>} */
export const HLJS_ALIAS_MAP = {
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  csharp: 'cs',
  'c#': 'cs'
}

HLJS_ALIAS_MAP.html = 'xml'
HLJS_ALIAS_MAP.xhtml = 'xml'
HLJS_ALIAS_MAP.markup = 'xml'


/**
 * Languages known to be invalid or undesirable for auto-registration.
 * @type {Set<string>}
 */
export const BAD_LANGUAGES = new Set(['magic', 'undefined'])

let loadSupportedLanguagesPromise = null

/**
 * Note: language import attempts now use the shared `runImportWithCache`
 * helper (backed by a shared LRU). The local LRU was removed so multiple
 * import sites reuse the same negative-cache/dedupe behavior.
 */

/**
 * Optional custom importer used for tests or bespoke loading strategies.
 * When set to a function `(candidate: string) => Promise<Module|null>` it
 * will be invoked instead of the internal import+CDN fallbacks. This
 * enables reliable unit tests and alternative loading strategies.
 * @type {((candidate: string) => Promise<unknown>)|null}
 */
export let languageImporter = null

/**
 * Milliseconds to retain a negative cache entry when import attempts fail.
 * @type {number}
 */
let NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Set a custom importer function for language modules.
 * @param {((candidate: string) => Promise<unknown>)|null} fn - Importer function or `null` to clear.
 * @returns {void}
 */
export function setLanguageImporter(fn) {
  languageImporter = (typeof fn === 'function') ? fn : null
}

/**
 * Clear internal language import cache (for tests).
 * @returns {void}
 */
export function clearLanguageImportCache() { clearImportCache() }

/**
 * Adjust negative-cache TTL (milliseconds) used when import attempts fail.
 * @param {number} ms - Milliseconds to use for negative caching.
 * @returns {void}
 */
export function setLanguageImportNegativeCacheTTL(ms) { NEGATIVE_CACHE_TTL_MS = Number(ms) || 0; setImportNegativeCacheTTL(ms) }

/**
 * Load the list of supported highlight.js languages from the canonical
 * GitHub markdown file and populate `SUPPORTED_HLJS_MAP`.  This is called
 * once at startup and caches the promise.
 *
 * @param {string} [url] - URL to the supported-languages markdown file to fetch.
 * @returns {Promise<void>} - Resolves once the supported languages map has been populated.
 */
export async function loadSupportedLanguages(url = DEFAULT_HLJS_SUPPORTED_URL) {
  if (!url) return
  if (loadSupportedLanguagesPromise) return loadSupportedLanguagesPromise
  loadSupportedLanguagesPromise = (async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) return
      const txt = await res.text()
      const lines = txt.split(/\r?\n/)
      let headerIdx = -1
      for (let i = 0; i < lines.length; i++) {
        if (/\|\s*Language\s*\|/i.test(lines[i])) { headerIdx = i; break }
      }
      if (headerIdx === -1) return
      const headerCols = lines[headerIdx]
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(c => c.trim().toLowerCase())
      let aliasesIdx = headerCols.findIndex(h => /alias|aliases|equivalent|alt|alternates?/i.test(h))
      if (aliasesIdx === -1) aliasesIdx = 1
      let canonicalIdx = headerCols.findIndex(h => /file|filename|module|module name|module-name|short|slug/i.test(h))
      if (canonicalIdx === -1) {
        const langCol = headerCols.findIndex(h => /language/i.test(h))
        canonicalIdx = (langCol !== -1) ? langCol : 0
      }
      let aliasesList = []
      for (let i = headerIdx + 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || !line.startsWith('|')) break
        const colsCheck = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
        if (colsCheck.every(c => /^-+$/.test(c))) continue
        const cols = colsCheck
        if (!cols.length) continue
        const canonicalRaw = (cols[canonicalIdx] || cols[0] || '').toString().trim()
        const langName = canonicalRaw.toLowerCase()
        if (!langName || /^-+$/.test(langName)) continue
        SUPPORTED_HLJS_MAP.set(langName, langName)
        const aliasesCol = cols[aliasesIdx] || ''
        if (aliasesCol) {
          const parts = String(aliasesCol)
            .split(',')
            .map(a => a.replace(/`/g, '').trim())
            .filter(Boolean)
          if (parts.length) {
            const rawPrimary = parts[0].toLowerCase()
            const primaryNorm = rawPrimary
              .replace(/^[:]+/, '')
              .replace(/[^a-z0-9_-]+/ig, '')
            if (primaryNorm && /[a-z0-9]/i.test(primaryNorm)) {
              SUPPORTED_HLJS_MAP.set(primaryNorm, primaryNorm)
              aliasesList.push(primaryNorm)
            }
          }
        }
      }
        try {
          const cleaned = []
        for (const a of aliasesList) {
          const norm = String(a || '')
            .replace(/^[:]+/, '')
            .replace(/[^a-z0-9_-]+/ig, '')
          if (norm && /[a-z0-9]/i.test(norm)) cleaned.push(norm)
          else SUPPORTED_HLJS_MAP.delete(a)
        }
        aliasesList = cleaned
      } catch (err) { debugWarn('[codeblocksManager] cleanup aliases failed', err) }
      try {
        let removed = 0
        for (const k of Array.from(SUPPORTED_HLJS_MAP.keys())) {
          if (!k || /^-+$/.test(k) || !/[a-z0-9]/i.test(k)) {
            SUPPORTED_HLJS_MAP.delete(k)
            removed++
            continue
          }
          if (/^[:]+/.test(k)) {
            const nk = k.replace(/^[:]+/, '')
            if (nk && /[a-z0-9]/i.test(nk)) {
              const v = SUPPORTED_HLJS_MAP.get(k)
              SUPPORTED_HLJS_MAP.delete(k)
              SUPPORTED_HLJS_MAP.set(nk, v)
            } else {
              SUPPORTED_HLJS_MAP.delete(k)
              removed++
            }
          }
        }
        for (const [k, v] of Array.from(SUPPORTED_HLJS_MAP.entries())) {
          if (!v || /^-+$/.test(v) || !/[a-z0-9]/i.test(v)) {
            SUPPORTED_HLJS_MAP.delete(k)
            removed++
          }
        }
        try {
          const sepKey = ':---------------------'
          if (SUPPORTED_HLJS_MAP.has(sepKey)) { SUPPORTED_HLJS_MAP.delete(sepKey); removed++ }
        } catch (err) { debugWarn('[codeblocksManager] remove sep key failed', err) }
        try {
          const keys = Array.from(SUPPORTED_HLJS_MAP.keys()).sort()
        } catch (err) { debugWarn('[codeblocksManager] compute supported keys failed', err) }
      } catch (_) { debugWarn('[codeblocksManager] ignored error', _) }
    } catch (err) { debugWarn('[codeblocksManager] loadSupportedLanguages failed', err) }
  })()
  return loadSupportedLanguagesPromise
}

/**
 * Set of highlight.js languages that have been registered with `hljs`.
 * @type {Set<string>}
 */
const registeredLangs = new Set()

/**
 * Dynamically import and register a highlight.js language definition.
 * Safe to call multiple times; returns `true` if the language is loaded or
 * already registered.
 *
 * @param {string} name - Language name or alias to register (e.g. 'javascript').
 * @param {string} [modulePath] - Optional explicit module path to import for the language.
 * @returns {Promise<boolean>} - Resolves to `true` when the language is registered.
 */
export async function registerLanguage(name, modulePath) {
  if (!loadSupportedLanguagesPromise) {
    ;(async () => {
      try {
        await loadSupportedLanguages()
      } catch (err) { debugWarn('[codeblocksManager] loadSupportedLanguages (IIFE) failed', err) }
    })()
  }
  if (loadSupportedLanguagesPromise) {
    try {
      await loadSupportedLanguagesPromise
    } catch (_) { /* ignore load failures; fallback behavior below */ }
  }
  
  name = (name === undefined || name === null) ? '' : String(name)
  name = name.trim()
  if (!name) return false
  const low = name.toLowerCase()
  if (BAD_LANGUAGES.has(low)) return false
  
  if (SUPPORTED_HLJS_MAP.size && !SUPPORTED_HLJS_MAP.has(low)) {
    const aliasMap = HLJS_ALIAS_MAP
    if (!aliasMap[low] && !aliasMap[name]) {
      return false
    }
  }
  if (registeredLangs.has(name)) return true
  const aliasMap = HLJS_ALIAS_MAP
  try {
    const base = (modulePath || name || '').toString().replace(/\.js$/i, '').trim()
    
    const mappedName = (aliasMap[name] || name || '').toString()
    const mappedBase = (aliasMap[base] || base || '').toString()
    let candidates = Array.from(new Set([
      mappedName,
      mappedBase,
      base,
      name,
      aliasMap[base],
      aliasMap[name]
    ].filter(Boolean))).map(c => String(c).toLowerCase()).filter(c => c && c !== 'undefined')
    if (SUPPORTED_HLJS_MAP.size) {
      candidates = candidates.filter(c => {
        if (SUPPORTED_HLJS_MAP.has(c)) return true
        const ali = HLJS_ALIAS_MAP[c]
        if (ali && SUPPORTED_HLJS_MAP.has(ali)) return true
        return false
      })
    }
    let mod = null
    let lastErr = null
    for (const candidate of candidates) {
      try {
        mod = await runImportWithCache(candidate, async () => {
          try {
            // If a custom importer has been provided (testing or alternative
            // loader), prefer it. It should resolve to the module or null.
            if (typeof languageImporter === 'function') {
              try { return await languageImporter(candidate) } catch (_liErr) { return null }
            }
            try {
              try { return await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}.js`) } catch (_withExt) { return await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}`) }
            } catch (_localErr) {
              try {
                const esmUrl = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${candidate}.js`
                return await import(esmUrl)
              } catch (_esmErr) {
                try {
                  const moduleUrl = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${candidate}.js`
                  return await import(moduleUrl)
                } catch (_cdnErr) { return null }
              }
            }
          } catch (err) { return null }
        })

        if (mod) {
          const langDef = mod.default || mod
          try {
            const registerName = (SUPPORTED_HLJS_MAP.size && SUPPORTED_HLJS_MAP.get(name)) || candidate || name
            hljs.registerLanguage(registerName, langDef)
            registeredLangs.add(registerName)
            if (registerName !== name) { hljs.registerLanguage(name, langDef); registeredLangs.add(name) }
            return true
          } catch (_e) {
            lastErr = _e
                    
          }
        } else {
          try {
            if (SUPPORTED_HLJS_MAP.has(candidate) || SUPPORTED_HLJS_MAP.has(name)) {
              const noopDef = () => ({})
              try {
                hljs.registerLanguage(candidate, noopDef)
                registeredLangs.add(candidate)
              } catch (e) {}
              try {
                if (candidate !== name) { hljs.registerLanguage(name, noopDef); registeredLangs.add(name) }
              } catch (e) {}
              return true
            }
          } catch (e) {
            /* ignore */
          }
        }
      } catch (_e) {
        lastErr = _e
        
      }
    }
    if (lastErr) {
      throw lastErr
    }
    return false
  } catch (_) {
    return false
  }
}

 
/** @type {IntersectionObserver|null} */
let __hlObserver = null

/**
 * Observe and lazy-highlight `<pre><code>` blocks, registering languages as needed.
 * @param {ParentNode} [root=document] - Root node in which to observe code blocks.
 * @returns {void}
 */
export function observeCodeBlocks(root) {
  
  const effectiveRoot = (root && root.querySelector) ? root : (typeof document !== 'undefined' ? document : null)

  if (!loadSupportedLanguagesPromise) {
    ;(async () => {
      try { await loadSupportedLanguages() } catch (_) { debugWarn('[codeblocksManager] loadSupportedLanguages (observer) failed', _) }
    })()
  }
  const aliasMapLocal = HLJS_ALIAS_MAP
  const ensureObserver = () => {
    if (__hlObserver) return __hlObserver
    if (typeof IntersectionObserver === 'undefined') return null
    __hlObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        try { obs.unobserve(el) } catch (err) { debugWarn('[codeblocksManager] observer unobserve failed', err) }
        ;(async () => {
          try {
            const cls = (el.getAttribute && el.getAttribute('class')) || el.className || ''
            const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
            if (match && match[1]) {
              const l = (match[1] || '').toLowerCase()
              const mapped = aliasMapLocal[l] || l
              const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(mapped) || SUPPORTED_HLJS_MAP.get(String(mapped).toLowerCase()))) || mapped
              try {
                await registerLanguage(canonical)
              } catch (err) { debugWarn('[codeblocksManager] registerLanguage failed', err) }
              try {
                try {
                  const raw = el.textContent || el.innerText || ''
                  if (raw != null) el.textContent = raw
                } catch (e) { /* ignore */ }
                try { if (el && el.dataset && el.dataset.highlighted) delete el.dataset.highlighted } catch (_) {}
                hljs.highlightElement(el)
              } catch (err) { debugWarn('[codeblocksManager] hljs.highlightElement failed', err) }
            } else {
              try {
                const code = el.textContent || ''
                try {
                  
                  if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
                    const out = hljs.highlight(code, { language: 'plaintext' })
                    if (out && out.value) {
                      try {
                        if (typeof document !== 'undefined' && document.createRange && typeof document.createRange === 'function') {
                          const frag = document.createRange().createContextualFragment(out.value)
                          if (typeof el.replaceChildren === 'function') el.replaceChildren(...Array.from(frag.childNodes))
                          else {
                            while (el.firstChild) el.removeChild(el.firstChild)
                            el.appendChild(frag)
                          }
                        } else {
                          el.innerHTML = out.value
                        }
                      } catch (err) {
                        try { el.innerHTML = out.value } catch (_) {}
                      }
                    }
                  }
                } catch (err) {
                  try { hljs.highlightElement(el) } catch (e) { debugWarn('[codeblocksManager] fallback highlightElement failed', e) }
                }
              } catch (err) { debugWarn('[codeblocksManager] auto-detect plaintext failed', err) }
            }
          } catch (err) { debugWarn('[codeblocksManager] observer entry processing failed', err) }
        })()
      })
    }, { root: null, rootMargin: '300px', threshold: 0.1 })
    return __hlObserver
  }

  const obs = ensureObserver()
  const blocks = (effectiveRoot && effectiveRoot.querySelectorAll) ? effectiveRoot.querySelectorAll('pre code') : []
  if (!obs) {
    
    blocks.forEach(async (el) => {
      try {
        const cls = (el.getAttribute && el.getAttribute('class')) || el.className || ''
        const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
        if (match && match[1]) {
          const l = (match[1] || '').toLowerCase()
          const mapped = aliasMapLocal[l] || l
          const canonical = (SUPPORTED_HLJS_MAP.size && (SUPPORTED_HLJS_MAP.get(mapped) || SUPPORTED_HLJS_MAP.get(String(mapped).toLowerCase()))) || mapped
          try {
            await registerLanguage(canonical)
          } catch (err) { debugWarn('[codeblocksManager] registerLanguage failed (no observer)', err) }
        }
        try {
          try {
            const raw = el.textContent || el.innerText || ''
            if (raw != null) el.textContent = raw
          } catch (e) {}
          try { if (el && el.dataset && el.dataset.highlighted) delete el.dataset.highlighted } catch (_) {}
          hljs.highlightElement(el)
        } catch (err) { debugWarn('[codeblocksManager] hljs.highlightElement failed (no observer)', err) }
      } catch (_) { debugWarn('[codeblocksManager] loadSupportedLanguages fallback ignored error', _) }
    })
    return
  }
  blocks.forEach(b => { try { obs.observe(b) } catch (err) { debugWarn('[codeblocksManager] observe failed', err) } })
}
/**
 * Switch highlight.js CSS theme, optionally loading from CDN.
 * If `theme` is `'monokai'` (the default) the existing theme is removed.
 * @param {string} theme - Name of the highlight.js theme to apply.
 * @param {{useCdn?:boolean}} [opts] - Options object; `useCdn` controls CDN loading.
 * @returns {void}
 */
export function setHighlightTheme(theme, { useCdn = true } = {}) {
  const existing = (typeof document !== 'undefined' && document.head && document.head.querySelector) ? document.head.querySelector('link[data-hl-theme]') : (typeof document !== 'undefined' ? document.querySelector('link[data-hl-theme]') : null)
  const existingTheme = existing && existing.getAttribute ? existing.getAttribute('data-hl-theme') : null

  const requested = (theme === undefined || theme === null) ? 'default' : String(theme)
  const requestedLower = (requested && String(requested).toLowerCase()) || ''
  if (requestedLower === 'default' || requestedLower === 'monokai') {
    try { if (existing && existing.parentNode) existing.parentNode.removeChild(existing) } catch (e) { /* ignore */ }
    return
  }

  if (existingTheme && existingTheme.toLowerCase() === requestedLower) return

  if (!useCdn) {
    try { debugWarn('Requested highlight theme not bundled; set useCdn=true to load theme from CDN') } catch (e) {}
    return
  }

  const currentHighlightTheme = requestedLower
  const href = `https://cdn.jsdelivr.net/npm/highlight.js@${HIGHLIGHT_JS_VERSION}/styles/${currentHighlightTheme}.css`
  const newLink = document.createElement('link')
  newLink.rel = 'stylesheet'
  newLink.href = href
  newLink.setAttribute('data-hl-theme', currentHighlightTheme)

  newLink.addEventListener('load', () => {
    try {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing)
    } catch (e) { /* ignore */ }
  })
  document.head.appendChild(newLink)
}
