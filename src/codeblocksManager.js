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

export const BAD_LANGUAGES = new Set(['magic', 'undefined'])

let loadSupportedLanguagesPromise = null

// Cache for candidate import attempts: candidate -> { promise, module, ok, ts }
const languageImportCache = new Map()
// Negative cache TTL (ms) - avoid retrying failing CDN imports for this duration
const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Load the list of supported highlight.js languages from the canonical
 * GitHub markdown file and populate `SUPPORTED_HLJS_MAP`.  This is called
 * once at startup and caches the promise.
 *
 * @param {string} [url]
 * @returns {Promise<void>}
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
        // Log the supported languages list for debugging/visibility.
        try {
          const keys = Array.from(SUPPORTED_HLJS_MAP.keys()).sort()
        } catch (err) { console.warn('[codeblocksManager] compute supported keys failed', err) }
      } catch (_) { console.warn('[codeblocksManager] ignored error', _) }
    } catch (err) { console.warn('[codeblocksManager] loadSupportedLanguages failed', err) }
  })()
  return loadSupportedLanguagesPromise
}

const registeredLangs = new Set()

/**
 * Dynamically import and register a highlight.js language definition.
 * Safe to call multiple times; returns `true` if the language is loaded or
 * already registered.
 *
 * @param {string} name
 * @param {string} [modulePath]
 * @returns {Promise<boolean>}
 */
export async function registerLanguage(name, modulePath) {
  // ensure supported list is fetched lazily the first time we attempt
  // any registration (useful when initCMS didn't pre-load it).
  if (!loadSupportedLanguagesPromise) {
    // fire-and-forget, swallow errors using async IIFE
    ;(async () => {
      try {
        await loadSupportedLanguages()
      } catch (err) { console.warn('[codeblocksManager] loadSupportedLanguages (IIFE) failed', err) }
    })()
  }
  // normalize missing values to an empty string so callers that pass
  // `undefined` don't end up attempting to import the literal
  // 'undefined' module.
  name = (name === undefined || name === null) ? '' : String(name)
  name = name.trim()
  if (!name) return false
  const low = name.toLowerCase()
  if (BAD_LANGUAGES.has(low)) return false
  // if we have a populated list of supported languages and the requested
  // one isn't in it (and isn't an alias), skip early to avoid needless
  // dynamic imports that will 404.
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
    // Try the explicit name/module first, then aliases.  This ensures
    // valid names like `pgsql` are attempted before falling back to
    // broader aliases such as `sql`.
    const candidates = Array.from(new Set([
      base,
      name,
      aliasMap[base],
      aliasMap[name]
    ].filter(Boolean))).map(c => String(c).toLowerCase()).filter(c => c && c !== 'undefined')
    let mod = null
    let lastErr = null
    for (const candidate of candidates) {
      try {
        // Reuse cached import attempts (including in-flight promises)
        const now = Date.now()
        const cached = languageImportCache.get(candidate)
        if (cached) {
          // If negative cache still valid, skip retrying this candidate
          if (cached.ok === false && (now - (cached.ts || 0) < NEGATIVE_CACHE_TTL_MS)) {
            mod = null
          } else if (cached.module) {
            mod = cached.module
          } else if (cached.promise) {
            try {
              mod = await cached.promise
            } catch (cacheErr) {
              mod = null
            }
          }
        } else {
          // create a cache entry and perform the import; store in entry so
          // concurrent requests share the same promise
          const entry = { promise: null, module: null, ok: null, ts: 0 }
          languageImportCache.set(candidate, entry)
          entry.promise = (async () => {
            try {
              try {
                return await import(/* @vite-ignore */ `highlight.js/lib/languages/${candidate}.js`)
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
                    // registration failed for this candidate
          }
        } else {
          // negative result cached; proceed to next candidate
        }
      } catch (_e) {
        lastErr = _e
        // import attempt failed for this candidate
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

// IntersectionObserver-based lazy highlighter for code blocks
let __hlObserver = null
/**
 * Lazy-highlight `<pre><code>` blocks using IntersectionObserver.  The
 * observer will register necessary languages as elements become visible.
 *
 * @param {ParentNode} [root=document]
 * @returns {void}
 */
export function observeCodeBlocks(root = document) {
  // make sure we have fetched supported languages list lazily when we start
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
                // highlightElement may mutate the element's class (adding
                // language-<name>). Only use highlightElement when an
                // explicit language class is present. For auto-detection we
                // use highlightAuto and write the HTML without changing
                // the element's language class.
                hljs.highlightElement(el)
              } catch (err) { console.warn('[codeblocksManager] hljs.highlightElement failed', err) }
            } else {
              try {
                const code = el.textContent || ''
                try {
                  // Do not run auto-detection. Prefer `plaintext` if
                  // available; otherwise skip highlighting to avoid
                  // unnecessary imports or mis-detections.
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
    // no IntersectionObserver - highlight immediately (but register languages non-blocking)
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
 * @param {string} theme
 * @param {{useCdn?:boolean}} [opts]
 * @returns {void}
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
