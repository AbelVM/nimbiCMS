import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('URL pattern normalization', () => {
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
    // do not mock htmlBuilder; allow real prepareArticle/computeSlug to run so URL normalization occurs
  }

  it('converts ?page=slug -> #/slug on load', async () => {
    await setupMocks()
    // set initial URL with query
    try { history.replaceState(null, '', '/?page=foo') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    // visible URL should be a cosmetic fragment starting with '#/'
    expect(location.hash.startsWith('#/')).toBe(true)
    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()
    // canonical should include a page query (value may be slug derived from content)
    expect(canon.getAttribute('href')).toContain('?page=')
  })

  it('converts ?page=slug#anchor -> #/slug#anchor on load', async () => {
    await setupMocks()
    // include hash after query
    try { history.replaceState(null, '', '/?page=bar#section') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    // should show a cosmetic fragment and include the anchor
    expect(location.hash.startsWith('#/')).toBe(true)
    expect(location.hash).toContain('#section')
  })

  it('preserves existing #-style slug URLs', async () => {
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

    // still a cosmetic fragment and must not duplicate the fragment
    expect(location.hash.startsWith('#/')).toBe(true)
    // should remain exactly the same (no double-fragment like '#/baz#/baz')
    expect(location.hash).toBe('#/baz')
  })

  it('does not duplicate cosmetic fragment on load', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/') } catch (e) {}
    // simulate a pre-existing cosmetic fragment
    location.hash = '#/dup'

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    // ensure the hash is unchanged and the '#/' fragment occurs only once
    expect(location.hash).toBe('#/dup')
    const occurrences = (location.href.match(/#\//g) || []).length
    expect(occurrences).toBe(1)
  })

  it('moves extra query params into fragment when converting', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/?page=qux&lang=fr') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    // fragment should include the lang param after the slug
    expect(location.hash.startsWith('#/')).toBe(true)
    expect(location.hash).toContain('?lang=fr')
  })

  it('normalizes legacy duplicate cosmetic fragment on load', async () => {
    await setupMocks()
    try { history.replaceState(null, '', '/#/dup#/dup') } catch (e) {}

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container: document.createElement('div'), t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    expect(location.hash).toBe('#/dup')
    expect((location.href.match(/#\//g) || []).length).toBe(1)
  })
})
