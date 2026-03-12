import { marked } from 'marked'
// Renderer worker is inlined so the library ships as a single JS file.
import RendererWorker from './worker/renderer.js?worker&inline'
import { makeWorkerManager } from './worker-manager.js'

const _rendererManager = makeWorkerManager(() => new RendererWorker(), 'markdown')

/**
 * lazily return or create a renderer worker instance (may return null)
 */
export function initRendererWorker() {
  return _rendererManager.get()
}

function _sendToRenderer(msg) {
  return _rendererManager.send(msg, 1000)
}

// user-provided marked plugin objects will be stored here; each entry is an
// object that can contain `tokenizer`, `renderer`, `walkTokens`, etc., as
// defined by the marked plugin API.
export const markdownPlugins = []

/**
 * Register a new marked plugin.  The object is passed directly to
 * `marked.use()` which merges its fields into the global parser.
 * @param {object} plugin
 */
export function addMarkdownExtension(plugin) {
    if (plugin && typeof plugin === 'object') {
    markdownPlugins.push(plugin)
    try { marked.use(plugin) } catch (e) { console.warn('[markdown] failed to apply plugin', e) }
  }
}

/**
 * Replace the full plugin list.  Existing list is cleared first.
 * @param {Array<object>} plugins
 */
export function setMarkdownExtensions(plugins) {
  markdownPlugins.length = 0
  if (Array.isArray(plugins)) {
    markdownPlugins.push(...plugins.filter(p=>p && typeof p === 'object'))
  }
  try {
    markdownPlugins.forEach(p => marked.use(p))
  } catch (e) { console.warn('[markdown] failed to apply markdown extensions', e) }
}
import { parseFrontmatter } from './utils/frontmatter.js'
import { slugify } from './filesManager.js'
import hljs from 'highlight.js/lib/core'
import { BAD_LANGUAGES, HLJS_ALIAS_MAP } from './codeblocksManager.js'

// parse markdown into HTML and gather TOC data
/**
 * Convert markdown string to HTML and extract a table-of-contents list.
 * Preserves frontmatter metadata.
 *
 * @param {string} md
 * @returns {Promise<{html:string,meta:Object,toc:Array<{level:number,text:string,id:string}>}>}
 */
export async function parseMarkdownToHtml(md) {
  // attempt to offload to worker if available
  const w = initRendererWorker && initRendererWorker()
  if (w) {
    try {
      const res = await _sendToRenderer({ type: 'render', md })
      if (res && res.html !== undefined) {
        // post-process worker HTML the same as inline path so tests and
        // runtime behavior match (assign heading ids, lazy-load images,
        // clean code classes, and allow hljs fallback behavior).
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(res.html, 'text/html')
          const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
          heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })

          try {
            const imgs = doc.querySelectorAll('img')
            imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (e) { console.warn('[markdown] set image loading attribute failed', e) } })
          } catch (e) { console.warn('[markdown] query images failed', e) }

          try {
            const codes = doc.querySelectorAll('pre code')
            codes.forEach(codeEl => {
              try {
                const rawCls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
                const cleanedCls = String(rawCls || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
                if (cleanedCls) {
                  try { codeEl.setAttribute && codeEl.setAttribute('class', cleanedCls) } catch (_) { codeEl.className = cleanedCls }
                } else {
                  try { codeEl.removeAttribute && codeEl.removeAttribute('class') } catch (_) { codeEl.className = '' }
                }
                const cls = cleanedCls
                const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
                if (!match || !match[1]) {
                  try {
                    const code = codeEl.textContent || ''
                    try {
                      if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
                        const out = hljs.highlight(code, { language: 'plaintext' })
                        if (out && out.value) codeEl.innerHTML = out.value
                      }
                    } catch (err) {
                      try { hljs.highlightElement(codeEl) } catch (e) { console.warn('[markdown] hljs.highlightElement failed', e) }
                    }
                  } catch (e) { console.warn('[markdown] code auto-detect failed', e) }
                }
              } catch (e) { console.warn('[markdown] processing code blocks failed', e) }
            })
          } catch (e) { console.warn('[markdown] query code blocks failed', e) }

          const outHtml = doc.body.innerHTML
          const docToc = []
          heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
          return { html: outHtml, meta: res.meta || {}, toc: docToc }
        } catch (e) {
          console.warn('[markdown] post-process worker HTML failed', e)
          return res
        }
      }
    } catch (e) {
      console.warn('[markdown] worker render failed', e)
      // fall through to inline parsing
    }
  }

  const { content, data } = parseFrontmatter(md || '')
  // configure marked options here if needed
  marked.setOptions({
    gfm: true,
    mangle: false,
    headerIds: false,
    headerPrefix: ''
  })
  // ensure any registered plugins are applied; marked ignores duplicates
  if (markdownPlugins && markdownPlugins.length) {
    try { markdownPlugins.forEach(p=>marked.use(p)) } catch (e) { console.warn('[markdown] apply plugins failed', e) }
  }
  let html = marked.parse(content)

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })

    // prefer lazy-loading images to reduce initial network pressure
    try {
      const imgs = doc.querySelectorAll('img')
      imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (e) { console.warn('[markdown] set image loading attribute failed', e) } })
    } catch (e) { console.warn('[markdown] query images failed', e) }

    // don't block: leave language-tagged blocks for the IntersectionObserver
    try {
      const codes = doc.querySelectorAll('pre code')
      codes.forEach(codeEl => {
        try {
          // strip any accidental "undefined" tokens that some markdown
          // renderers attach when no language was provided.  Prefer an
          // empty class rather than `language-undefined` which later
          // confuses dynamic loaders.
          const rawCls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
          const cleanedCls = String(rawCls || '').replace(/\blanguage-undefined\b|\blang-undefined\b/g, '').trim()
          if (cleanedCls) {
            try { codeEl.setAttribute && codeEl.setAttribute('class', cleanedCls) } catch (_) { codeEl.className = cleanedCls }
          } else {
            try { codeEl.removeAttribute && codeEl.removeAttribute('class') } catch (_) { codeEl.className = '' }
          }
          const cls = cleanedCls
          const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
          if (!match || !match[1]) {
            try {
              const code = codeEl.textContent || ''
              try {
                // Prefer rendering as plain text without auto-detection.
                // If the runtime includes a registered 'plaintext' language
                // use it; otherwise avoid `highlightAuto` and leave the
                // code unchanged so no dynamic language import is attempted.
                if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
                  const out = hljs.highlight(code, { language: 'plaintext' })
                  if (out && out.value) codeEl.innerHTML = out.value
                }
              } catch (err) {
                try { hljs.highlightElement(codeEl) } catch (e) { console.warn('[markdown] hljs.highlightElement failed', e) }
              }
            } catch (e) { console.warn('[markdown] code auto-detect failed', e) }
          }
        } catch (e) { console.warn('[markdown] processing code blocks failed', e) }
      })
    } catch (e) { console.warn('[markdown] query code blocks failed', e) }

    html = doc.body.innerHTML
    const docToc = []
    heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
    return { html: doc.body.innerHTML, meta: data || {}, toc: docToc }
  } catch (e) {
    console.warn('post-process markdown failed', e)
  }

  return { html, meta: data || {}, toc: [] }
}

// shallow TOC extraction; used in worker earlier but exported for reuse
function extractToc(md) {
  const lines = md.split('\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

// identify fenced-code languages in raw markdown
/**
 * Scan markdown text for fenced code blocks and return a set of language
 * identifiers.  Uses heuristics to discard false positives and can consult
 * a map of supported languages to be stricter.
 *
 * @param {string} md
 * @param {Map<string,string>} [supportedMap]
 * @returns {Set<string>}
 */
export function detectFenceLanguages(md, supportedMap) {
  const set = new Set()
  const re = /```\s*([a-zA-Z0-9_\-+]+)?/g
  // words unlikely to be languages
  const STOP = new Set([
    'then', 'now', 'if', 'once', 'so', 'and', 'or', 'but', 'when', 'the', 'a', 'an', 'as',
    'let', 'const', 'var', 'export', 'import', 'from', 'true', 'false', 'null', 'npm',
    'run', 'echo', 'sudo', 'this', 'that', 'have', 'using', 'some', 'return', 'returns',
    'function', 'console', 'log', 'error', 'warn', 'class', 'new', 'undefined',
    'with', 'select', 'from', 'where', 'join', 'on', 'group', 'order', 'by', 'having', 'as', 'into', 'values',
    'like', 'limit', 'offset', 'create', 'table', 'index', 'view', 'insert', 'update', 'delete', 'returning',
    'and', 'or', 'not', 'all', 'any', 'exists', 'case', 'when', 'then', 'else', 'end', 'distance', 'geometry',
    'you', 'which', 'would', 'why', 'cool', 'other', 'same', 'everything', 'check'
  ])
  const FALLBACK_KNOWN = new Set(['bash', 'sh', 'zsh', 'javascript', 'js', 'python', 'py', 'php', 'java', 'c', 'cpp', 'rust', 'go', 'ruby', 'perl', 'r', 'scala', 'swift', 'kotlin', 'cs', 'csharp', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'dockerfile', 'docker'])
  let m
  while ((m = re.exec(md))) {
    if (m[1]) {
      const name = m[1].toLowerCase()
      // skip anything we've explicitly banned
      if (BAD_LANGUAGES.has(name)) continue
      // if we were given a map of supported names, only apply the
      // length check when the map has already been populated; this
      // avoids dropping common two-letter names like "js" during
      // initial page load when the asynchronous language list hasn't
      // arrived yet.
      if (supportedMap && supportedMap.size && name.length < 3 && !supportedMap.has(name) && !(HLJS_ALIAS_MAP && HLJS_ALIAS_MAP[name] && supportedMap.has(HLJS_ALIAS_MAP[name]))) continue
      if (supportedMap && supportedMap.size) {
        if (supportedMap.has(name)) {
          const canonical = supportedMap.get(name)
          if (canonical) set.add(canonical)
          continue
        }
        // handle common short aliases (e.g. 'js' -> 'javascript') using
        // the alias map from the codeblocks manager
        if (HLJS_ALIAS_MAP && HLJS_ALIAS_MAP[name]) {
          const mapped = HLJS_ALIAS_MAP[name]
          if (supportedMap.has(mapped)) {
            const canonical = supportedMap.get(mapped) || mapped
            set.add(canonical)
            continue
          }
        }
      }
      const isKnown = FALLBACK_KNOWN.has(name)
      if (isKnown) set.add(name)
      else if (
        name.length >= 5 && name.length <= 30 &&
        /^[a-z][a-z0-9_\-+]*$/.test(name) &&
        !STOP.has(name)
      ) set.add(name)
    }
  }
  return set
}
