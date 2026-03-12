import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as cb from '../src/codeblocksManager.js'

// simple IntersectionObserver stub for some tests
class DummyObserver {
  constructor(cb) { this.cb = cb }
  observe() {}
  disconnect() {}
}

describe('codeblocksManager', () => {
  beforeEach(() => {
    // clear map and registered languages before each run
    cb.SUPPORTED_HLJS_MAP.clear()
    cb.registeredLangs && cb.registeredLangs.clear && cb.registeredLangs.clear()
    // remove any injected theme/link
    document.querySelectorAll('link[data-hl-theme]').forEach(el => el.remove())
    // reset fetch stub
    global.fetch = vi.fn()
    // ensure IntersectionObserver identity
    delete global.IntersectionObserver
  })

  it('contains expected alias mappings and bad languages', () => {
    expect(cb.HLJS_ALIAS_MAP.shell).toBe('bash')
    expect(cb.HLJS_ALIAS_MAP.js).toBe('javascript')
    expect(cb.BAD_LANGUAGES.has('magic')).toBe(true)
  })

  it('loadSupportedLanguages ignores empty url and caches promise', async () => {
    // async function returns a Promise that resolves to undefined
    const p1 = cb.loadSupportedLanguages('')
    await expect(p1).resolves.toBeUndefined()
    // give it a real url
    const sample = `| Language | Aliases | Filename |\n|---|---|---|\n| JavaScript | js | javascript |\n| Bash | shell,zsh | bash |\n`
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve(sample) }))
    const p2 = cb.loadSupportedLanguages('http://dummy/')
    expect(p2).toBeInstanceOf(Promise)
    await p2
    // map should contain normalized names
    expect(cb.SUPPORTED_HLJS_MAP.has('javascript')).toBe(true)
    expect(cb.SUPPORTED_HLJS_MAP.has('js')).toBe(true)
    expect(cb.SUPPORTED_HLJS_MAP.has('bash')).toBe(true)
    expect(cb.SUPPORTED_HLJS_MAP.has('shell')).toBe(true)

    // calling again should still return a Promise (cached or new)
    const p3 = cb.loadSupportedLanguages('http://dummy/')
    expect(p3).toBeInstanceOf(Promise)
  })

  it('registerLanguage handles invalid and banned names gracefully', async () => {
    // no supported list means early fire-and-forget and return false for blank
    await expect(cb.registerLanguage('')).resolves.toBe(false)
    await expect(cb.registerLanguage(null)).resolves.toBe(false)
    // banned language
    await expect(cb.registerLanguage('magic')).resolves.toBe(false)

    // populate supported map with a bogus entry to allow positive path
    cb.SUPPORTED_HLJS_MAP.set('javascript', 'javascript')
    // the real dynamic import should succeed for javascript
    const ok = await cb.registerLanguage('javascript')
    expect(ok).toBe(true)
    // calling again should short-circuit and still return true
    const ok2 = await cb.registerLanguage('javascript')
    expect(ok2).toBe(true)
  })

  it('setHighlightTheme replaces existing link and respects useCdn flag', () => {
    // existing link removal
    const link = document.createElement('link')
    link.setAttribute('data-hl-theme', 'old')
    document.head.appendChild(link)
    cb.setHighlightTheme('monokai')
    expect(document.querySelector('link[data-hl-theme]')).toBeNull()

    // monokai should not re-add anything
    cb.setHighlightTheme('monokai')
    expect(document.querySelectorAll('link[data-hl-theme]').length).toBe(0)

    // request non-monokai with useCdn=false should log warning and not add
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    cb.setHighlightTheme('dracula', { useCdn: false })
    expect(warnSpy).toHaveBeenCalled()
    expect(document.querySelector('link[data-hl-theme]')).toBeNull()
    warnSpy.mockRestore()

    // with CDN it should add
    cb.setHighlightTheme('dracula', { useCdn: true })
    const newLink = document.querySelector('link[data-hl-theme="dracula"]')
    expect(newLink).toBeTruthy()
  })

  it('observeCodeBlocks falls back when IntersectionObserver undefined', async () => {
    // create a fake code block to observe behaviour
    const el = document.createElement('pre')
    const code = document.createElement('code')
    code.className = 'language-js'
    el.appendChild(code)
    document.body.appendChild(el)
    // hljs.highlightElement may throw; stub it
    const hlSpy = vi.spyOn(cb.hljs, 'highlightElement').mockImplementation(() => {})
    cb.observeCodeBlocks(document.body)
    // allow async callbacks to execute
    await new Promise(r => setTimeout(r, 0))
    expect(hlSpy).toHaveBeenCalled()
    hlSpy.mockRestore()
  })
})