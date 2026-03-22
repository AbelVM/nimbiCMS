import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SUPPORTED_HLJS_MAP, setHighlightTheme, loadSupportedLanguages, observeCodeBlocks, hljs } from '../src/codeblocksManager.js'
import * as debug from '../src/utils/debug.js'

describe('codeblocksManager extra', () => {
  let origFetch
  let origIO
  let origWarn

  beforeEach(() => {
    origFetch = global.fetch
    origIO = global.IntersectionObserver
    origWarn = console.warn
    // ensure no theme link remains
    document.querySelectorAll('link[data-hl-theme]').forEach(l => l.remove())
  })
  afterEach(() => {
    global.fetch = origFetch
    global.IntersectionObserver = origIO
    console.warn = origWarn
    SUPPORTED_HLJS_MAP.clear()
    vi.restoreAllMocks()
  })

  it('setHighlightTheme: default is no-op, other theme with useCdn=false warns, useCdn=true appends link', () => {
    // default -> no link (revert to bundled default)
    setHighlightTheme('default')
    expect(document.querySelector('link[data-hl-theme]')).toBeNull()

    const warnSpy = vi.spyOn(debug, 'debugWarn').mockImplementation(() => {})
    setHighlightTheme('solarized', { useCdn: false })
    expect(warnSpy).toHaveBeenCalled()
    expect(document.querySelector('link[data-hl-theme]')).toBeNull()

    // real append
    setHighlightTheme('solarized', { useCdn: true })
    const el = document.querySelector('link[data-hl-theme="solarized"]')
    expect(el).toBeTruthy()
    expect(el.href).toMatch(/highlight\.js.*solarized\.css/)
  })

  it('loadSupportedLanguages parses markdown and populates SUPPORTED_HLJS_MAP', async () => {
    const md = `| Language | Module | Aliases\n| --- | --- | ---\n| JavaScript | javascript | js\n| Python | python | py`;
    global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => md })
    SUPPORTED_HLJS_MAP.clear()
    await loadSupportedLanguages('https://example.test/md')
    expect(SUPPORTED_HLJS_MAP.has('javascript')).toBe(true)
    expect(SUPPORTED_HLJS_MAP.has('python')).toBe(true)
    // null/empty url should be a no-op
    await loadSupportedLanguages(null)
    expect(SUPPORTED_HLJS_MAP.size).toBeGreaterThan(0)
  })

  it('observeCodeBlocks fallback path calls hljs.highlightElement when no IntersectionObserver', async () => {
    global.IntersectionObserver = undefined
    // stub hljs.highlightElement
    const highlightSpy = vi.spyOn(hljs, 'highlightElement').mockImplementation(() => {})

    const root = document.createElement('div')
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.className = 'language-javascript'
    code.textContent = 'const a = 1;'
    pre.appendChild(code)
    root.appendChild(pre)
    document.body.appendChild(root)

    // ensure supported map is empty so code goes through register+highlight guard
    SUPPORTED_HLJS_MAP.clear()

    observeCodeBlocks(root)
    // allow async handlers to run
    await new Promise(r => setTimeout(r, 50))

    expect(highlightSpy).toHaveBeenCalled()
  })
})
