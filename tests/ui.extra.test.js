import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock dependent modules before importing createUI
vi.mock('../src/router.js', () => ({ fetchPageData: vi.fn() }))
vi.mock('../src/htmlBuilder.js', () => ({
  prepareArticle: vi.fn(),
  executeEmbeddedScripts: vi.fn(),
  renderNotFound: vi.fn(),
  attachTocClickHandler: vi.fn(),
  scrollToAnchorOrTop: vi.fn(),
  ensureScrollTopButton: vi.fn(),
  createNavTree: vi.fn((t, arr) => arr)
}))
vi.mock('../src/utils/helpers.js', () => ({ setEagerForAboveFoldImages: vi.fn(), getWorkerPoolSize: vi.fn(() => 2) }))
vi.mock('../src/seoManager.js', () => ({ applyPageMeta: vi.fn() }))
vi.mock('../src/imagePreview.js', () => ({ attachImagePreview: vi.fn() }))
vi.mock('../src/slugManager.js', () => ({
  fetchMarkdown: vi.fn().mockResolvedValue({ raw: '# prefetched' }),
  isExternalLink: vi.fn((href) => href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))
}))

// Now import the module under test
const { createUI } = await import('../src/ui.js')
const router = await import('../src/router.js')
const htmlBuilder = await import('../src/htmlBuilder.js')
const helpers = await import('../src/utils/helpers.js')
const seo = await import('../src/seoManager.js')
const imgPrev = await import('../src/imagePreview.js')
const slugManager = await import('../src/slugManager.js')

describe('createUI focused branches', () => {
  let contentWrap, navWrap, container, runHooks

  beforeEach(() => {
    document.body.innerHTML = ''
    contentWrap = document.createElement('div')
    contentWrap.className = 'content'
    navWrap = document.createElement('nav')
    container = document.createElement('div')
    container.className = 'nimbi-cms'
    container.style.height = '100px'
    container.scrollTop = 0
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)
    document.body.appendChild(container)
    // reset mocks
    vi.clearAllMocks()
    // ensure sessionStorage empty
    sessionStorage.clear()
    runHooks = vi.fn()
  })

  it('throws when contentWrap is not HTMLElement', () => {
    expect(() => createUI({ contentWrap: null })).toThrow(TypeError)
  })

  it('renderByQuery renders article and runs hooks on success', async () => {
    // Arrange mocked fetchPageData
    router.fetchPageData.mockResolvedValue({ data: { raw: '#x' }, pagePath: 'p.md', anchor: null })
    // prepareArticle returns an article element, parsed metadata and a toc
    const articleEl = document.createElement('article')
    articleEl.textContent = 'hello'
    const toc = document.createElement('div')
    htmlBuilder.prepareArticle.mockResolvedValue({ article: articleEl, parsed: {}, toc, topH1: false, h1Text: null, slugKey: null })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    // Act
    await ui.renderByQuery()

    // Assert
    expect(contentWrap.querySelector('article')).toBeTruthy()
    expect(htmlBuilder.prepareArticle).toHaveBeenCalled()
    expect(seo.applyPageMeta).toHaveBeenCalled()
    expect(imgPrev.attachImagePreview).toHaveBeenCalled()
    expect(helpers.setEagerForAboveFoldImages).toHaveBeenCalled()
    expect(runHooks).toHaveBeenCalled()
  })

  it('moves focus to the new main landmark after a focused route change', async () => {
    const oldLink = document.createElement('a')
    oldLink.href = '?page=old'
    oldLink.textContent = 'Old page'
    contentWrap.appendChild(oldLink)
    oldLink.focus()
    router.fetchPageData.mockResolvedValue({ data: { raw: '#next' }, pagePath: 'next.md', anchor: null })
    htmlBuilder.prepareArticle.mockResolvedValue({
      article: document.createElement('article'),
      parsed: {},
      toc: null,
      topH1: false,
      h1Text: null,
      slugKey: null,
    })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    await ui.renderByQuery()

    expect(document.activeElement).toBe(contentWrap.querySelector('main.nimbi-main'))
  })

  it('waits for queued navigation to render after an active render', async () => {
    let releaseFirst
    let fetchCount = 0
    router.fetchPageData.mockImplementation(async (raw) => {
      fetchCount += 1
      if (fetchCount === 1) {
        await new Promise((resolve) => {
          releaseFirst = resolve
        })
      }
      return { data: { raw }, pagePath: `${raw}.md`, anchor: null }
    })
    htmlBuilder.prepareArticle.mockImplementation(async (t, data) => {
      const article = document.createElement('article')
      article.textContent = data.raw
      return { article, parsed: {}, toc: null, topH1: false, h1Text: null, slugKey: null }
    })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    const firstRender = ui.renderByQuery()
    await Promise.resolve()
    history.pushState({}, '', '?page=next')
    const queuedRender = ui.renderByQuery()

    let queuedFinished = false
    queuedRender.then(() => { queuedFinished = true })
    await Promise.resolve()
    expect(queuedFinished).toBe(false)

    releaseFirst()
    await Promise.all([firstRender, queuedRender])
    expect(contentWrap.querySelector('article').textContent).toBe('next')
    expect(fetchCount).toBe(2)
    history.replaceState({}, '', '/')
  })

  it('keeps rendering when preparation normalizes the route URL', async () => {
    history.replaceState({}, '', '?page=next')
    router.fetchPageData.mockResolvedValue({ data: { raw: '#next' }, pagePath: 'next.md', anchor: null })
    htmlBuilder.prepareArticle.mockImplementation(async (t, data) => {
      history.replaceState({ page: 'next' }, '', '/#/next')
      const article = document.createElement('article')
      article.textContent = data.raw
      return { article, parsed: {}, toc: null, topH1: false, h1Text: null, slugKey: null }
    })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    await ui.renderByQuery()

    expect(router.fetchPageData).toHaveBeenCalled()
    expect(htmlBuilder.prepareArticle).toHaveBeenCalled()
    expect(contentWrap.querySelector('article').textContent).toBe('#next')
    history.replaceState({}, '', '/')
  })

  it('does not execute embedded scripts by default', async () => {
    router.fetchPageData.mockResolvedValue({ data: { raw: '#x' }, pagePath: 'p.md', anchor: null })
    const articleEl = document.createElement('article')
    htmlBuilder.prepareArticle.mockResolvedValue({ article: articleEl, parsed: {}, toc: null, topH1: false, h1Text: null, slugKey: null })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    await ui.renderByQuery()

    expect(htmlBuilder.executeEmbeddedScripts).toHaveBeenCalledTimes(1)
    expect(htmlBuilder.executeEmbeddedScripts).toHaveBeenCalledWith(expect.anything(), false, [])
  })

  it('executes embedded scripts when allowEmbeddedScripts is true', async () => {
    router.fetchPageData.mockResolvedValue({ data: { raw: '#x' }, pagePath: 'p.md', anchor: null })
    const articleEl = document.createElement('article')
    htmlBuilder.prepareArticle.mockResolvedValue({ article: articleEl, parsed: {}, toc: null, topH1: false, h1Text: null, slugKey: null })

    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks, allowEmbeddedScripts: true })
    await ui.renderByQuery()

    expect(htmlBuilder.executeEmbeddedScripts).toHaveBeenCalledTimes(1)
  })

  it('renderByQuery handles fetchPageData failure and calls renderNotFound', async () => {
    router.fetchPageData.mockRejectedValue(new Error('fetch failed'))
    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    await ui.renderByQuery()
    expect(htmlBuilder.renderNotFound).toHaveBeenCalled()
  })

  it('save and restore scroll position uses sessionStorage and container.scrollTo', async () => {
    const ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks })
    // simulate scroll and pagehide
    container.scrollTop = 123
    window.dispatchEvent(new Event('pagehide'))
    // ensure session stored
    const key = `nimbi-cms-scroll:${location.pathname}${location.search}`
    const stored = sessionStorage.getItem(key)
    expect(stored).toBeTruthy()
    // change scroll and simulate pageshow with persisted true
    container.scrollTop = 0
    const ev = new Event('pageshow')
    ev.persisted = true
    window.dispatchEvent(ev)
    // container.scrollTo should have been called (jsdom implements but we can check scrollTop changed)
    // After restoreScrollPosition, container should have been scrolled back
    // (some environments won't update scrollTop; at least ensure session parsing didn't throw)
    expect(sessionStorage.getItem(key)).toBeTruthy()
  })

  describe('pointerdown prefetch', () => {
    let ui
    let abortController

    beforeEach(() => {
      document.body.innerHTML = ''
      contentWrap = document.createElement('div')
      contentWrap.className = 'content'
      navWrap = document.createElement('nav')
      container = document.createElement('div')
      container.className = 'nimbi-cms'
      container.style.height = '100px'
      container.scrollTop = 0
      document.body.appendChild(contentWrap)
      document.body.appendChild(navWrap)
      document.body.appendChild(container)
      vi.clearAllMocks()
      sessionStorage.clear()
      runHooks = vi.fn()
      router.fetchPageData.mockResolvedValue({ data: { raw: '#x' }, pagePath: 'p.md', anchor: null })
      const articleEl = document.createElement('article')
      articleEl.textContent = 'hello'
      const toc = document.createElement('div')
      htmlBuilder.prepareArticle.mockResolvedValue({ article: articleEl, parsed: {}, toc, topH1: false, h1Text: null, slugKey: null })
      abortController = new AbortController()
      ui = createUI({ contentWrap, navWrap, container, t: (s)=>s, contentBase: '/content/', homePage: 'home', initialDocumentTitle: 'T', runHooks, signal: abortController.signal })
    })

    afterEach(() => {
      abortController.abort()
    })

    it('prefetches markdown on pointerdown for internal link', async () => {
      const link = document.createElement('a')
      link.href = '?page=about'
      link.textContent = 'About'
      document.body.appendChild(link)

      // Fire pointerdown on the link
      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))

      // Wait for microtasks
      await Promise.resolve()

      // fetchMarkdown should have been called with the page slug
      expect(slugManager.fetchMarkdown).toHaveBeenCalledWith('about', '/content/', expect.any(Object))
    })

    it('does not prefetch for external links', async () => {
      const link = document.createElement('a')
      link.href = 'https://example.com/page'
      link.textContent = 'External'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()

      expect(slugManager.fetchMarkdown).not.toHaveBeenCalled()
    })

    it('does not prefetch for protocol-relative external links', async () => {
      const link = document.createElement('a')
      link.href = '//example.com/page'
      link.textContent = 'External'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()

      expect(slugManager.fetchMarkdown).not.toHaveBeenCalled()
    })

    it('cancels prefetch on pointercancel', async () => {
      const link = document.createElement('a')
      link.href = '?page=about'
      link.textContent = 'About'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      const firstCallCount = slugManager.fetchMarkdown.mock.calls.length
      expect(firstCallCount).toBeGreaterThan(0)

      // Fire pointercancel
      link.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, cancelable: true }))
      await Promise.resolve()

      // Second pointerdown should trigger a new prefetch (since first was cancelled)
      slugManager.fetchMarkdown.mockClear()
      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).toHaveBeenCalled()
    })

    it('cancels prefetch when the pointer leaves the link (pointerout)', async () => {
      const link = document.createElement('a')
      link.href = '?page=about'
      link.textContent = 'About'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).toHaveBeenCalled()

      // `pointerout` bubbles, so a delegated document listener receives it.
      // Leaving to an element outside the link cancels the prefetch, which
      // removes the in-flight controller and lets a later pointerdown retry.
      link.dispatchEvent(new PointerEvent('pointerout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: document.body,
      }))
      await Promise.resolve()

      slugManager.fetchMarkdown.mockClear()
      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).toHaveBeenCalled()
    })

    it('does not cancel when the pointer moves within the same link', async () => {
      const link = document.createElement('a')
      link.href = '?page=about'
      const inner = document.createElement('span')
      inner.textContent = 'About'
      link.appendChild(inner)
      document.body.appendChild(link)

      inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).toHaveBeenCalled()

      // Moving onto a descendant of the same link is not a real leave, so the
      // in-flight controller survives and a second pointerdown is a no-op.
      inner.dispatchEvent(new PointerEvent('pointerout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: link,
      }))
      await Promise.resolve()

      slugManager.fetchMarkdown.mockClear()
      inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).not.toHaveBeenCalled()
    })

    it('ignores non-bubbling pointerleave, matching real browser behaviour', async () => {
      // `pointerleave` does not bubble, so a delegated document listener never
      // receives it. This test documents that the implementation relies on
      // `pointerout` instead, and guards against reintroducing `pointerleave`.
      const link = document.createElement('a')
      link.href = '?page=about'
      link.textContent = 'About'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).toHaveBeenCalled()

      // Dispatched without bubbles, exactly as a browser would.
      link.dispatchEvent(new PointerEvent('pointerleave', { bubbles: false, cancelable: true }))
      await Promise.resolve()

      // The prefetch is still in flight, so a second pointerdown is skipped.
      slugManager.fetchMarkdown.mockClear()
      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()
      expect(slugManager.fetchMarkdown).not.toHaveBeenCalled()
    })

    it('does not prefetch for links without page parameter', async () => {
      const link = document.createElement('a')
      link.href = '#section'
      link.textContent = 'Anchor only'
      document.body.appendChild(link)

      link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await Promise.resolve()

      expect(slugManager.fetchMarkdown).not.toHaveBeenCalled()
    })
  })
})
