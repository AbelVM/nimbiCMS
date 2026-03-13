import { marked } from 'marked'
import RendererWorker from './worker/renderer.js?worker&inline'
import { makeWorkerManager } from './worker-manager.js'

const _rendererManager = makeWorkerManager(() => new RendererWorker(), 'markdown')

const SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

/**
 * @typedef {{level:number,text:string,id?:string}} TocEntry
 */

/**
 * @typedef {{html:string,meta:Object,toc:Array<TocEntry>}} ParseResult
 */

/**
 * @typedef {Object} MarkdownPlugin
 * @property {Function} [tokenizer]
 * @property {Object} [renderer]
 * @property {Function} [walkTokens]
 * @property {Function} [transform]
 */

/**
 * @typedef {{html:string,meta?:Object}} RendererResult
 */

/**
 * Lazily return or create a renderer worker instance (may return null).
 * @returns {Worker|null}
 */
export function initRendererWorker() {
  return _rendererManager.get()
}

function _sendToRenderer(msg) {
  /** @returns {Promise<RendererResult>} */
  return _rendererManager.send(msg, 1000)
}

/** Registered marked plugins. */
/** @type {Array<MarkdownPlugin>} */
export const markdownPlugins = []

/**
 * Register a new marked plugin.  The object is passed directly to
 * `marked.use()` which merges its fields into the global parser.
 * @param {MarkdownPlugin} plugin
 */
export function addMarkdownExtension(plugin) {
    if (plugin && typeof plugin === 'object') {
    markdownPlugins.push(plugin)
    try { marked.use(plugin) } catch (e) { console.warn('[markdown] failed to apply plugin', e) }
  }
}

/**
 * Replace the full plugin list.  Existing list is cleared first.
 * @param {MarkdownPlugin[]} plugins
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
import { slugify } from './slugManager.js'
import hljs from 'highlight.js/lib/core'
import { BAD_LANGUAGES, HLJS_ALIAS_MAP } from './codeblocksManager.js'

/**
 * Convert markdown string to HTML and extract a table-of-contents list.
 * Preserves frontmatter metadata.
 *
 * @param {string} md
 * @returns {Promise<ParseResult>}
 */
export async function parseMarkdownToHtml(md) {
  const w = initRendererWorker && initRendererWorker()
  if (w) {
    try {
      const res = await _sendToRenderer({ type: 'render', md })
      if (res && res.html !== undefined) {
          try {
          const parser = SHARED_DOM_PARSER || new DOMParser()
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
      
    }
  }

  const { content, data } = parseFrontmatter(md || '')
  marked.setOptions({
    gfm: true,
    mangle: false,
    headerIds: false,
    headerPrefix: ''
  })
  
  if (markdownPlugins && markdownPlugins.length) {
    try { markdownPlugins.forEach(p=>marked.use(p)) } catch (e) { console.warn('[markdown] apply plugins failed', e) }
  }
  let html = marked.parse(content)

  try {
    const parser = SHARED_DOM_PARSER || new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
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

    html = doc.body.innerHTML
    const docToc = []
    heads.forEach(h => { docToc.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || '').trim(), id: h.id }) })
    return { html: doc.body.innerHTML, meta: data || {}, toc: docToc }
  } catch (e) {
    console.warn('post-process markdown failed', e)
  }

  return { html, meta: data || {}, toc: [] }
}

function extractToc(md) {
  const lines = md.split('\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

/**
 * Scan markdown text for fenced code blocks and return a set of language
 * identifiers.  Uses heuristics to discard false positives and can consult
 * a map of supported languages to be stricter.
 */
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
      
      if (BAD_LANGUAGES.has(name)) continue
      
      if (supportedMap && supportedMap.size && name.length < 3 && !supportedMap.has(name) && !(HLJS_ALIAS_MAP && HLJS_ALIAS_MAP[name] && supportedMap.has(HLJS_ALIAS_MAP[name]))) continue
      if (supportedMap && supportedMap.size) {
        if (supportedMap.has(name)) {
          const canonical = supportedMap.get(name)
          if (canonical) set.add(canonical)
          continue
        }
        
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
