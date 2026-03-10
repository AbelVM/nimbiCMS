// helper utilities for working with Markdown content
import { parseFrontmatter } from './utils/frontmatter.js'
import { slugify } from './filesManager.js'
import hljs from 'highlight.js/lib/core'
import { BAD_LANGUAGES } from './codeblocksManager.js'

// parse markdown into HTML and gather TOC data
export async function parseMarkdownToHtml(md) {
  const { content, data } = parseFrontmatter(md || '')
  // configure marked options here if needed
  const marked = (await import('marked')).marked
  marked.setOptions({
    gfm: true,
    mangle: false,
    headerIds: false,
    headerPrefix: ''
  })
  let html = marked.parse(content)

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    heads.forEach(h => { if (!h.id) h.id = slugify(h.textContent || '') })

    // prefer lazy-loading images to reduce initial network pressure
    try {
      const imgs = doc.querySelectorAll('img')
      imgs.forEach(img => { try { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy') } catch (e) { } })
    } catch (e) { }

    // don't block: leave language-tagged blocks for the IntersectionObserver
    try {
      const codes = doc.querySelectorAll('pre code')
      codes.forEach(codeEl => {
        try {
          const cls = (codeEl.getAttribute && codeEl.getAttribute('class')) || codeEl.className || ''
          const match = cls.match(/language-([a-zA-Z0-9_+-]+)/) || cls.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/)
          if (!match || !match[1]) {
            try { hljs.highlightElement(codeEl) } catch (e) { }
          }
        } catch (e) { }
      })
    } catch (e) { }

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
export function extractToc(md) {
  const lines = md.split('\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

// identify fenced-code languages in raw markdown
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
      if (supportedMap && supportedMap.size && name.length < 3 && !supportedMap.has(name)) continue
      if (supportedMap && supportedMap.size) {
        if (supportedMap.has(name)) {
          const canonical = supportedMap.get(name)
          if (canonical) set.add(canonical)
          continue
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
