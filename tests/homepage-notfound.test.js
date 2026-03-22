import { describe, it, expect, beforeEach, vi } from 'vitest'

beforeEach(async () => {
  vi.resetModules()
  document.body.innerHTML = '<div id="app"></div>'
  if (!(global.location && typeof global.location === 'object')) {
    global.location = new URL('http://localhost/')
  }
  document.querySelectorAll('.nimbi-cms, .nimbi-overlay, .nimbi-version-label').forEach(el => el.remove())
})

describe('homePage derivation', () => {
  it('derives homePage from first navigation .md link', async () => {
    vi.resetModules()
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      const s = String(u || '')
      if (s.includes('_navigation.md')) {
        return { ok: true, text: () => Promise.resolve('[Home](assets/brochure.md)') }
      }
      if (s.includes('assets/brochure.md')) {
        return { ok: true, text: () => Promise.resolve('# Brochure') }
      }
      return { ok: true, text: () => Promise.resolve('# Fallback') }
    })

    const nav = await import('../src/nav.js')
    const buildNavSpy = vi.spyOn(nav, 'buildNav').mockResolvedValue({ navbar: document.createElement('div'), linkEls: [] })
    const ui = await import('../src/ui.js')
    const createUISpy = vi.spyOn(ui, 'createUI').mockReturnValue({ renderByQuery: async () => {} })

    const init = (await import('../src/nimbi-cms.js')).default
    await init({ el: '#app', searchIndex: false })

    const joined = calls.join('\n')
    expect(joined).toContain('assets/brochure.md')

    buildNavSpy.mockRestore()
    createUISpy.mockRestore()
  })
})

describe('renderNotFound fallback', () => {
  it('shows inline home link when notFoundPage is null', async () => {
    vi.resetModules()
    document.body.innerHTML = '<div id="content"></div>'
    const slugMgr = await import('../src/slugManager.js')
    const htmlBuilder = await import('../src/htmlBuilder.js')

    slugMgr.setHomePage('assets/brochure.md')
    slugMgr.setNotFoundPage(null)

    const contentWrap = document.querySelector('#content')
    htmlBuilder.renderNotFound(contentWrap, null, new Error('missing'))

    const a = contentWrap.querySelector('a')
    expect(a).toBeTruthy()
    const search = (new URL(a.href)).search || ''
    expect(decodeURIComponent(search)).toContain('page=assets/brochure.md')
  })

  it('does not show inline home link when notFoundPage is configured', async () => {
    vi.resetModules()
    document.body.innerHTML = '<div id="content2"></div>'
    const slugMgr = await import('../src/slugManager.js')
    const htmlBuilder = await import('../src/htmlBuilder.js')

    slugMgr.setHomePage('assets/brochure.md')
    slugMgr.setNotFoundPage('_404.md')

    const contentWrap = document.querySelector('#content2')
    htmlBuilder.renderNotFound(contentWrap, null, new Error('missing'))

    const a = contentWrap.querySelector('a')
    expect(a).toBeNull()
  })
})
