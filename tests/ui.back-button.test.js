import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

// Mock dependent modules before importing createUI
vi.mock('../src/router.js', () => ({
  fetchPageData: vi.fn().mockResolvedValue({ data: {}, pagePath: 'home.md', anchor: null })
}))
vi.mock('../src/htmlBuilder.js', () => ({
  prepareArticle: vi.fn().mockResolvedValue({
    article: document.createElement('article'),
    parsed: {},
    toc: null,
    topH1: null,
    h1Text: '',
    slugKey: ''
  }),
  executeEmbeddedScripts: vi.fn(),
  renderNotFound: vi.fn(),
  attachTocClickHandler: vi.fn(),
  scrollToAnchorOrTop: vi.fn(),
  ensureScrollTopButton: vi.fn(),
  createNavTree: vi.fn(() => document.createElement('nav'))
}))
vi.mock('../src/utils/helpers.js', () => ({
  setEagerForAboveFoldImages: vi.fn(),
  getWorkerPoolSize: vi.fn(() => 2)
}))
vi.mock('../src/seoManager.js', () => ({ applyPageMeta: vi.fn() }))
vi.mock('../src/imagePreview.js', () => ({ attachImagePreview: vi.fn() }))

const { createUI } = await import('../src/ui.js')

describe('ui navigation back-button behavior', () => {
  let contentWrap, navWrap, container
  let originalAddEventListener, originalRemoveEventListener
  let uiEventHandlers

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    document.body.innerHTML = ''
    uiEventHandlers = {}

    originalAddEventListener = window.addEventListener
    originalRemoveEventListener = window.removeEventListener
    window.addEventListener = (type, handler, options) => {
      if (type === 'hashchange' || type === 'popstate' || type === 'pageshow' || type === 'pagehide') {
        uiEventHandlers[type] = handler
        return
      }
      return originalAddEventListener.call(window, type, handler, options)
    }
    window.removeEventListener = (type, handler, options) => {
      if (uiEventHandlers[type] === handler) {
        delete uiEventHandlers[type]
        return
      }
      return originalRemoveEventListener.call(window, type, handler, options)
    }

    contentWrap = document.createElement('div')
    navWrap = document.createElement('nav')
    container = document.createElement('div')
    container.className = 'nimbi-cms'
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    Object.defineProperty(globalThis, 'location', {
      value: {
        href: 'http://example.com/?page=home',
        search: '?page=home',
        pathname: '/',
        origin: 'http://example.com'
      },
      configurable: true
    })
  })

  afterEach(() => {
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    vi.useRealTimers()
  })

  it('popstate event triggers a new render for back-button navigation', async () => {
    const routerModule = await import('../src/router.js')
    const htmlBuilderModule = await import('../src/htmlBuilder.js')

    // Reset mocks to track calls after createUI
    vi.mocked(routerModule.fetchPageData).mockClear()
    vi.mocked(htmlBuilderModule.prepareArticle).mockClear()

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      t: (s) => s,
      contentBase: '/content/',
      homePage: 'home.md',
      initialDocumentTitle: 'T',
      runHooks: async () => {}
    })

    // Wait for the initial render triggered by createUI
    await vi.advanceTimersByTimeAsync(0)

    const callsAfterInit = vi.mocked(routerModule.fetchPageData).mock.calls.length

    // Simulate back-button: dispatch popstate
    const popEvent = new PopStateEvent('popstate', { state: { page: 'home' } })
    expect(typeof uiEventHandlers.popstate).toBe('function')
    uiEventHandlers.popstate(popEvent)

    // Wait for the queued render
    await vi.advanceTimersByTimeAsync(0)

    // fetchPageData should have been called again for the back-button navigation
    expect(vi.mocked(routerModule.fetchPageData).mock.calls.length).toBeGreaterThan(callsAfterInit)
  })

  it('popstate during active render queues one transition', async () => {
    const routerModule = await import('../src/router.js')
    const htmlBuilderModule = await import('../src/htmlBuilder.js')

    let fetchCall = 0
    vi.mocked(routerModule.fetchPageData).mockImplementation(() => {
      fetchCall += 1
      // Use a promise that resolves after a microtask + timer
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { raw: `# p${fetchCall}` }, pagePath: `p${fetchCall}.md`, anchor: null })
        }, 10)
      })
    })

    vi.mocked(htmlBuilderModule.prepareArticle).mockImplementation(() => {
      const article = document.createElement('article')
      return Promise.resolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' })
    })

    const ui = createUI({
      contentWrap,
      navWrap,
      container,
      t: (s) => s,
      contentBase: '/content/',
      homePage: 'home.md',
      initialDocumentTitle: 'T',
      runHooks: async () => {}
    })

    // Start a render after initialization (don't await yet)
    const firstRender = ui.renderByQuery()

    // While rendering, simulate back-button popstate
    const popEvent = new PopStateEvent('popstate', { state: { page: 'home' } })
    uiEventHandlers.popstate(popEvent)

    // Advance timers to let the first render complete
    await vi.advanceTimersByTimeAsync(20)

    // Wait for the queued popstate render
    await vi.advanceTimersByTimeAsync(20)

    // fetchPageData should have been called twice: once for the initial render,
    // once for the queued popstate render
    expect(vi.mocked(routerModule.fetchPageData).mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})
