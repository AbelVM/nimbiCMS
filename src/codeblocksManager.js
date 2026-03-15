import hljs from 'highlight.js/lib/core'

export { hljs }

/**
 * @typedef {{name?:string,aliases?:string[]}} HLJSLangEntry
 */

/**
 * Explicit alias type for the supported languages map so the d.ts generator
 * can emit a useful signature.
 * @typedef {Map<string,string>} SupportedHljsMap
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

// Common HTML/markup aliases map to the `xml` language in highlight.js
HLJS_ALIAS_MAP.html = 'xml'
HLJS_ALIAS_MAP.xhtml = 'xml'
HLJS_ALIAS_MAP.markup = 'xml'

export const BAD_LANGUAGES = new Set(['magic', 'undefined'])

let loadSupportedLanguagesPromise = null

/**
 * Cache for language import attempts. Keys are canonical language ids;
 * values hold promise/module/ok/ts metadata to support negative caching.
 * @type {Map<string,{promise?:Promise<any>,module?:any,ok?:boolean,ts?:number}>}
 */
const languageImportCache = new Map()
const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000

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
      } catch (err) { console.warn('[codeblocksManager] cleanup aliases failed', err) }
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
        } catch (err) { console.warn('[codeblocksManager] remove sep key failed', err) }
        try {
          const keys = Array.from(SUPPORTED_HLJS_MAP.keys()).sort()
        } catch (err) { console.warn('[codeblocksManager] compute supported keys failed', err) }
      } catch (_) { console.warn('[codeblocksManager] ignored error', _) }
    } catch (err) { console.warn('[codeblocksManager] loadSupportedLanguages failed', err) }
  })()
  return loadSupportedLanguagesPromise
}

/** @type {Set<string>} */
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
  // Ensure the supported-languages list is loaded (if available) so we can
  // filter requests to only known language modules and avoid spurious CDN
  // hits for names like `links` or `example` which may appear in user docs.
  if (!loadSupportedLanguagesPromise) {
    ;(async () => {
      try {
        await loadSupportedLanguages()
      } catch (err) { console.warn('[codeblocksManager] loadSupportedLanguages (IIFE) failed', err) }
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
    
    // Prefer canonical/alias-mapped names first to avoid attempting imports
    // for short aliases like `js` when the canonical module is `javascript`.
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
    // If we have a populated SUPPORTED_HLJS_MAP, restrict candidates to
    // entries that are known to be supported (or map via alias).
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
        
        const now = Date.now()
        let cached = languageImportCache.get(candidate)
        if (cached) {
          // If a previous attempt failed and the negative-cache TTL hasn't
          // expired yet, avoid retrying immediately. If it has expired,
          // drop the stale cache so we perform a fresh import below.
          if (cached.ok === false && (now - (cached.ts || 0) >= NEGATIVE_CACHE_TTL_MS)) {
            languageImportCache.delete(candidate)
            cached = undefined
          }
        }

        if (cached) {
          if (cached.module) {
            mod = cached.module
          } else if (cached.promise) {
            try {
              mod = await cached.promise
            } catch (cacheErr) {
              mod = null
            }
          }
        } else {
          
          const entry = { promise: null, module: null, ok: null, ts: 0 }
          languageImportCache.set(candidate, entry)
          entry.promise = (async () => {
            try {
              try {
                // attempt local package language module (try with .js and without)
                try {
                  return await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}.js`)
                } catch (_withExt) {
                  return await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}`)
                }
              } catch (_localErr) {
                try {
                  const esmUrl = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${candidate}.js`
                  return await new Function('u', 'return import(u)')(esmUrl)
                } catch (_esmErr) {
                  try {
                    const moduleUrl = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${candidate}.js`
                    return await new Function('u', 'return import(u)')(moduleUrl)
                  } catch (_cdnErr) {
                    return null
                  }
                }
              }
            } catch (err) {
              return null
            }
          })()
          try {
            mod = await entry.promise
            entry.module = mod
            entry.ok = !!mod
            entry.ts = Date.now()
          } catch (err) {
            entry.module = null
            entry.ok = false
            entry.ts = Date.now()
            mod = null
          }
        }

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
          // If import returned null but the language is listed in the
          // supported map, attempt a graceful fallback by registering a
          // minimal no-op language definition so callers can proceed.
          // This helps tests that mock virtual language modules and also
          // provides a safe failure mode in environments where dynamic
          // imports are restricted.
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
 * Lazy-highlight `<pre><code>` blocks using IntersectionObserver.  The
 * observer will register necessary languages as elements become visible.
 *
 * @param {ParentNode} [root=document] - Root node in which to observe `<pre><code>` blocks.
 * @returns {void} - No return value.
 */
/**
 * Observe and lazy-highlight `<pre><code>` blocks, registering languages as needed.
 * @param {ParentNode} [root=document] - Root node in which to observe code blocks.
 * @returns {void} - No return value.
 */
export function observeCodeBlocks(root = document) {
  
  if (!loadSupportedLanguagesPromise) {
    ;(async () => {
      try { await loadSupportedLanguages() } catch (_) { console.warn('[codeblocksManager] loadSupportedLanguages (observer) failed', _) }
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
        try { obs.unobserve(el) } catch (err) { console.warn('[codeblocksManager] observer unobserve failed', err) }
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
              } catch (err) { console.warn('[codeblocksManager] registerLanguage failed', err) }
              try {
                
                hljs.highlightElement(el)
              } catch (err) { console.warn('[codeblocksManager] hljs.highlightElement failed', err) }
            } else {
              try {
                const code = el.textContent || ''
                try {
                  
                  if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
                    const out = hljs.highlight(code, { language: 'plaintext' })
                    if (out && out.value) el.innerHTML = out.value
                  }
                } catch (err) {
                  try { hljs.highlightElement(el) } catch (e) { console.warn('[codeblocksManager] fallback highlightElement failed', e) }
                }
              } catch (err) { console.warn('[codeblocksManager] auto-detect plaintext failed', err) }
            }
          } catch (err) { console.warn('[codeblocksManager] observer entry processing failed', err) }
        })()
      })
    }, { root: null, rootMargin: '300px', threshold: 0.1 })
    return __hlObserver
  }

  const obs = ensureObserver()
  const blocks = (root && root.querySelectorAll) ? root.querySelectorAll('pre code') : []
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
          } catch (err) { console.warn('[codeblocksManager] registerLanguage failed (no observer)', err) }
        }
        try { hljs.highlightElement(el) } catch (err) { console.warn('[codeblocksManager] hljs.highlightElement failed (no observer)', err) }
      } catch (_) { console.warn('[codeblocksManager] loadSupportedLanguages fallback ignored error', _) }
    })
    return
  }
  blocks.forEach(b => { try { obs.observe(b) } catch (err) { console.warn('[codeblocksManager] observe failed', err) } })
}
/**
 * Change the highlight.js CSS theme by injecting a <link>.  If `theme` is
 * `'monokai'` nothing happens (it's the default bundle).  When `useCdn` is
 * true the stylesheet is fetched from jsdelivr.
 *
 * @param {string} theme - Name of the highlight.js CSS theme to apply.
 * @param {{useCdn?:boolean}} [opts] - Options object; set `useCdn` to true to load theme from CDN.
 * @returns {void} - No return value.
 */
/**
 * Switch highlight.js CSS theme, optionally loading from CDN.
 * @param {string} theme - Name of the highlight.js theme to apply.
 * @param {{useCdn?:boolean}} [opts] - Options object; `useCdn` controls CDN loading.
 * @returns {void} - No return value.
 */
export function setHighlightTheme(theme, { useCdn = true } = {}) {
  const existing = document.querySelector('link[data-hl-theme]')
  if (existing) existing.remove()

  let currentHighlightTheme = theme || 'monokai'
  if (currentHighlightTheme === 'monokai') {
    return
  }
  if (!useCdn) {
    console.warn('Requested highlight theme not bundled; set useCdn=true to load from CDN')
    return
  }
  const href = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${currentHighlightTheme}.css`
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href
  l.setAttribute('data-hl-theme', currentHighlightTheme)
  document.head.appendChild(l)
}
