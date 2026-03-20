import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Strict URL pattern conversions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '' } catch (e) {}
    vi.resetModules()
  })

  async function setupMocks() {
    vi.mock('../src/router.js', () => ({
      fetchPageData: async (raw) => ({ data: { raw: '# Title\n\nContent' }, pagePath: raw, anchor: null })
    }))
  }

  it('`?page=slug` converts exactly to `#/slug` and canonical contains ?page=slug', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/?page=foo') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    expect(location.hash).toBe('#/foo')
    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()
    expect(canon.getAttribute('href')).toContain('?page=foo')
    expect(canon.getAttribute('href')).not.toContain('#')
  })

  it('`?page=slug#anchor` converts to `#/slug#anchor` and canonical contains ?page=slug', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/?page=foo#bar') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    expect(location.hash).toBe('#/foo#bar')
    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()
    expect(canon.getAttribute('href')).toContain('?page=foo')
    expect(canon.getAttribute('href')).not.toContain('#')
  })

  it('`#/slug` passive load preserves `#/slug` and canonical contains ?page=slug', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/') } catch (e) {}
    location.hash = '#/baz'

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    expect(location.hash).toBe('#/baz')
    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()
    expect(canon.getAttribute('href')).toContain('?page=baz')
  })

  it('`#/slug#anchor` passive load preserves fragment and canonical contains ?page=slug', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/') } catch (e) {}
    location.hash = '#/qux#frag'

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    expect(location.hash).toBe('#/qux#frag')
    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()
    expect(canon.getAttribute('href')).toContain('?page=qux')
    expect(canon.getAttribute('href')).not.toContain('#')
  })
})
