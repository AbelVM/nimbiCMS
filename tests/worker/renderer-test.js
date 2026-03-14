import { marked } from 'marked'
import { parseFrontmatter } from '../../src/utils/frontmatter.js'

// A test-specific renderer variant that uses local test hljs core.
const HLJS_CDN_BASE = new URL('./hljs-core.js', import.meta.url).href

let hljs = null
async function ensureHljs() {
  if (hljs) return hljs
  try {
    const mod = await import(HLJS_CDN_BASE)
    hljs = mod.default || mod
  } catch (e) {
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

marked.setOptions({ gfm: true, headerIds: true, mangle: false })

export async function handleMessage(ev) {
  const msg = ev.data || {}
  if (msg.type === 'register') {
    const { name, url } = msg
    try {
      await ensureHljs()
      const mod = await import(url)
      const lang = mod.default || mod
      hljs.registerLanguage(name, lang)
      globalThis.postMessage({ type: 'registered', name })
    } catch (e) {
      globalThis.postMessage({ type: 'register-error', name, error: String(e) })
    }
    return
  }

  const { id, md } = msg
  const { content, data } = parseFrontmatter(md || '')
  const html = marked.parse(content)
  const toc = extractToc(content)
  globalThis.postMessage({ id, result: { html, meta: data || {}, toc } })
}
