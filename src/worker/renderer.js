import { marked } from 'marked'
import { parseFrontmatter } from '../utils/frontmatter.js'

/**
 * Worker entrypoint for rendering markdown to HTML and registering
 * highlight.js languages on demand.
 *
 * Accepted messages:
 * - `{ type: 'register', name: string, url: string }` — dynamically import
 *   a highlight.js language module and register it. Replies with
 *   `{ type: 'registered', name }` or `{ type: 'register-error', name, error }`.
 * - `{ id: string, md: string }` — render `md` (which may contain frontmatter)
 *   and reply with `{ id, result: { html: string, meta: Record<string,string>, toc: Array<{level:number,text:string}> } }`.
 *
 * On error the worker posts `{ id, error: string }`.
 */

let hljs = null
const HLJS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/highlight.js@11.8.0'

async function ensureHljs() {
  if (hljs) return hljs
  try {
    const mod = await import(HLJS_CDN_BASE + '/lib/core.js')
    hljs = mod.default || mod
  } catch (e) {
    // if the CDN import fails we fall back to leaving `hljs` null and render code blocks without syntax highlighting.
    hljs = null
  }
  return hljs
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

marked.setOptions({
  gfm: true,
  headerIds: true,
  mangle: false,
    highlighted: (code, lang) => {
    try {
      if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
      // Prefer plaintext if available; otherwise return raw code
      if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
        return hljs.highlight(code, { language: 'plaintext' }).value
      }
      return code
    } catch (e) {
      return code
    }
  }
})

onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'register') {
      const { name, url } = msg
      try {
        await ensureHljs()
        const mod = await import(url)
        const lang = mod.default || mod
        hljs.registerLanguage(name, lang)
        postMessage({ type: 'registered', name })
      } catch (e) {
        postMessage({ type: 'register-error', name, error: String(e) })
      }
      return
    }

    const { id, md } = msg
    const { content, data } = parseFrontmatter(md || '')
    const html = marked.parse(content)
    const toc = extractToc(content)
    postMessage({ id, result: { html, meta: data || {}, toc } })
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}
