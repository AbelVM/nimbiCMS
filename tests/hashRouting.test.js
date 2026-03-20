import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('cosmetic hash routing (client-only)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // reset history state and url
    try { history.replaceState(null, '', '/') } catch (e) {}
    try { location.hash = '' } catch (e) {}
    vi.resetModules()
  })

  it('nav click pushes cosmetic #/slug and stores canonical page::anchor in history.state', async () => {
    const navHtml = `<a href="?page=foo#bar">Foo</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    let a = wrap.querySelector('.navbar-start .navbar-item')
    if (!a) a = document.querySelector('.navbar-item')
    // fallback: find any anchor that targets the foo page
    if (!a) a = document.querySelector('a[href*="page=foo"]')
    expect(a).toBeTruthy()

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/foo#bar')
    expect(history.state && typeof history.state.page === 'string' && history.state.page.startsWith('foo')).toBe(true)
  })

  it('container link click pushes cosmetic #/slug and stores canonical page::anchor in history.state', async () => {
    const navHtml = `<a href="?page=home">Home</a>`
    const wrap = document.createElement('div')
    const container = document.createElement('main')
    document.body.appendChild(wrap)
    document.body.appendChild(container)
    const renderByQuery = vi.fn()
    const nav = await import('../src/nav.js')
    await nav.buildNav(wrap, container, navHtml, '/', 'home', (k) => k, renderByQuery, false)

    const a = document.createElement('a')
    a.href = '?page=other#frag'
    a.textContent = 'inpage'
    container.appendChild(a)

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/other#frag')
    expect(history.state && history.state.page).toBe('other::frag')
  })

  it('page load with #/slug renders page and sets canonical ?page=slug', async () => {
    vi.resetModules()
    try { history.replaceState(null, '', '/') } catch (e) {}
    location.hash = '#/foo'

    vi.mock('../src/router.js', () => ({
      fetchPageData: async (raw) => ({ data: { raw: 'raw content' }, pagePath: raw, anchor: null })
    }))

    vi.mock('../src/htmlBuilder.js', () => ({
      prepareArticle: async (t, data, pagePath) => {
        const article = document.createElement('article')
        article.innerHTML = '<h1>Title</h1>'
        return { article, parsed: { meta: { description: 'A test description' } }, toc: null, topH1: article.querySelector('h1'), h1Text: null, slugKey: pagePath }
      },
      executeEmbeddedScripts: () => {},
      renderNotFound: (contentWrap) => { contentWrap.textContent = '404' },
      attachTocClickHandler: () => {},
      scrollToAnchorOrTop: () => {},
      ensureScrollTopButton: () => {},
      createNavTree: () => document.createElement('nav')
    }))

    const { createUI } = await import('../src/ui.js')

    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container, t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })

    await ui.renderByQuery()

    expect(location.hash).toBe('#/foo')

    const canon = document.querySelector('link[rel="canonical"]')
    expect(canon).toBeTruthy()

    const expectedCanon = location.origin + location.pathname + '?page=' + encodeURIComponent('foo')
    expect(canon.getAttribute('href')).toBe(expectedCanon)
    expect(canon.getAttribute('href')).not.toContain('#')

    const metaDesc = document.querySelector('meta[name="description"]')
    expect(metaDesc).toBeTruthy()
    expect(metaDesc.getAttribute('content')).toBe('A test description')

    const ogUrl = document.querySelector('meta[property="og:url"]')
    expect(ogUrl).toBeTruthy()
    expect(ogUrl.getAttribute('content')).toBe(expectedCanon)

    const jsonld = document.getElementById('nimbi-jsonld')
    expect(jsonld).toBeTruthy()
    expect(jsonld.textContent).toContain(`"url": "${expectedCanon}"`)

    expect(document.title).toBe('Site - Title')
    expect(history.state == null).toBe(true)

    const art = contentWrap.querySelector('article')
    expect(art).toBeTruthy()
    expect(art.querySelector('h1').textContent).toBe('Title')
  })

  it('clicking the same #/slug link does not append duplicate fragment', async () => {
    vi.resetModules()
    try { history.replaceState(null, '', '/') } catch (e) {}
    location.hash = '#/dup'

    vi.mock('../src/router.js', () => ({
      fetchPageData: async (raw) => ({ data: { raw: 'raw content' }, pagePath: raw, anchor: null })
    }))

    vi.mock('../src/htmlBuilder.js', () => ({
      prepareArticle: async (t, data, pagePath) => {
        const article = document.createElement('article')
        article.innerHTML = '<h1>Title</h1>'
        return { article, parsed: { meta: { description: 'A test description' } }, toc: null, topH1: article.querySelector('h1'), h1Text: null, slugKey: pagePath }
      },
      executeEmbeddedScripts: () => {},
      renderNotFound: (contentWrap) => { contentWrap.textContent = '404' },
      attachTocClickHandler: () => {},
      scrollToAnchorOrTop: () => {},
      ensureScrollTopButton: () => {},
      createNavTree: () => document.createElement('nav')
    }))

    const { createUI } = await import('../src/ui.js')
    const contentWrap = document.createElement('main')
    const navWrap = document.createElement('div')
    const container = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)

    const ui = createUI({ contentWrap, navWrap, container, t: (k) => k, contentBase: '/', homePage: 'home', initialDocumentTitle: 'Site', runHooks: async () => {} })
    await ui.renderByQuery()

    const a = document.createElement('a')
    a.href = '#/dup'
    a.textContent = 'dup'
    document.body.appendChild(a)

    a.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(location.hash).toBe('#/dup')
    expect((location.href.match(/#\//g) || []).length).toBe(1)
  })
})
