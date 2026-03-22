import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'

beforeEach(async () => {
  vi.resetModules()
  document.body.innerHTML = '<div id="app"></div>'
  if (!(global.location && typeof global.location === 'object')) {
    global.location = new URL('http://localhost/')
  }
  document.querySelectorAll('.nimbi-cms, .nimbi-overlay, .nimbi-version-label').forEach(el => el.remove())
  const slugMgr = await import('../src/slugManager.js')
  try { if (slugMgr && typeof slugMgr.setHomePage === 'function') slugMgr.setHomePage(null) } catch (_) {}
})

describe('initCMS homePage derivation from navigation', () => {
  it('derives homePage from first navigation link when not provided', async () => {
    vi.resetModules()
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      const s = String(u || '')
      if (s.includes('_navigation.md')) {
        return { ok: true, text: () => Promise.resolve('[Home](index.html)') }
      }
      if (s.includes('index.html')) {
        return { ok: true, text: () => Promise.resolve('<html><body><h1>Index</h1></body></html>') }
      }
      return { ok: true, text: () => Promise.resolve('# Fallback') }
    })

    const nav = await import('../src/nav.js')
    const buildNavSpy = vi.spyOn(nav, 'buildNav').mockResolvedValue({ navbar: document.createElement('div'), linkEls: [] })
    const ui = await import('../src/ui.js')
    const createUISpy = vi.spyOn(ui, 'createUI').mockReturnValue({ renderByQuery: async () => {} })

    await initCMS({ el: '#app', searchIndex: false })

    const joined = calls.join('\n')
    expect(joined).toContain('index.html')

    buildNavSpy.mockRestore()
    createUISpy.mockRestore()
  })
})
