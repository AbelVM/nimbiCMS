import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/router.js', () => ({
  fetchPageData: vi.fn()
}))

vi.mock('../src/htmlBuilder.js', () => ({
  prepareArticle: vi.fn(),
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

vi.mock('../src/seoManager.js', () => ({
  applyPageMeta: vi.fn()
}))

vi.mock('../src/imagePreview.js', () => ({
  attachImagePreview: vi.fn()
}))

const { createUI } = await import('../src/ui.js')
const router = await import('../src/router.js')
const htmlBuilder = await import('../src/htmlBuilder.js')

function delayResolve(value, ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

describe('ui loading-time regressions', () => {
  let contentWrap
  let navWrap
  let container
  let originalAddEventListener
  let originalRemoveEventListener
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
    navWrap = document.createElement('div')
    container = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)
    document.body.appendChild(container)
  })

  afterEach(() => {
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    vi.useRealTimers()
  })

  it('cold load completes within fetch+prepare budget and does not wait for deferred 250ms task', async () => {
    router.fetchPageData.mockImplementation(() =>
      delayResolve({ data: { raw: '# A' }, pagePath: 'a.md', anchor: null }, 80)
    )

    htmlBuilder.prepareArticle.mockImplementation(() => {
      const article = document.createElement('article')
      return delayResolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' }, 40)
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

    let settled = false
    const p = ui.renderByQuery().then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(119)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(settled).toBe(true)
    expect(contentWrap.querySelector('article')).toBeTruthy()

    // Deferred eager-image refresh (250ms) must not gate render completion.
    expect(router.fetchPageData).toHaveBeenCalledTimes(1)
    expect(htmlBuilder.prepareArticle).toHaveBeenCalledTimes(1)
  })

  it('transition queue processes promptly: second render starts after first without extra delay', async () => {
    let fetchCall = 0
    router.fetchPageData.mockImplementation(() => {
      fetchCall += 1
      const lag = fetchCall === 1 ? 90 : 60
      return delayResolve({ data: { raw: `# ${fetchCall}` }, pagePath: `${fetchCall}.md`, anchor: null }, lag)
    })

    htmlBuilder.prepareArticle.mockImplementation(() => {
      const article = document.createElement('article')
      return delayResolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' }, 20)
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

    let settled = false
    const first = ui.renderByQuery()
    const second = ui.renderByQuery()
    const done = Promise.all([first, second]).then(() => {
      settled = true
    })

    // First render budget: 90 + 20 = 110ms
    await vi.advanceTimersByTimeAsync(109)
    expect(settled).toBe(false)

    // Total for queued transition: 110 + (60 + 20) = 190ms
    await vi.advanceTimersByTimeAsync(81)
    await done

    expect(settled).toBe(true)
    expect(router.fetchPageData).toHaveBeenCalledTimes(2)
    expect(htmlBuilder.prepareArticle).toHaveBeenCalledTimes(2)
  })

  it('repeat render of same page uses prepared cache and avoids prepare latency', async () => {
    router.fetchPageData.mockImplementation(() =>
      delayResolve({ data: { raw: '# Same' }, pagePath: 'same.md', anchor: null }, 30)
    )

    htmlBuilder.prepareArticle.mockImplementation(() => {
      const article = document.createElement('article')
      return delayResolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' }, 70)
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

    let firstDone = false
    const first = ui.renderByQuery().then(() => {
      firstDone = true
    })
    await vi.advanceTimersByTimeAsync(99)
    expect(firstDone).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await first
    expect(firstDone).toBe(true)

    let secondDone = false
    const second = ui.renderByQuery().then(() => {
      secondDone = true
    })
    await vi.advanceTimersByTimeAsync(29)
    expect(secondDone).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await second
    expect(secondDone).toBe(true)

    expect(router.fetchPageData).toHaveBeenCalledTimes(2)
    // Second render should reuse cached prepared article template.
    expect(htmlBuilder.prepareArticle).toHaveBeenCalledTimes(1)
  })

  it('hashchange during active render queues a transition and resolves on combined budget', async () => {
    let fetchCall = 0
    router.fetchPageData.mockImplementation(() => {
      fetchCall += 1
      const lag = fetchCall === 1 ? 60 : 40
      return delayResolve({ data: { raw: `# h${fetchCall}` }, pagePath: `h${fetchCall}.md`, anchor: null }, lag)
    })

    htmlBuilder.prepareArticle.mockImplementation(() => {
      const article = document.createElement('article')
      return delayResolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' }, 20)
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

    let settled = false
    const p = ui.renderByQuery().then(() => {
      settled = true
    })

    // Route-change event while first render is active should queue another render.
    expect(typeof uiEventHandlers.hashchange).toBe('function')
    uiEventHandlers.hashchange(new HashChangeEvent('hashchange'))

    // Combined timing: (60+20) + (40+20) = 140ms
    await vi.advanceTimersByTimeAsync(139)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await p

    expect(settled).toBe(true)
    expect(router.fetchPageData).toHaveBeenCalledTimes(2)
    expect(htmlBuilder.prepareArticle).toHaveBeenCalledTimes(2)
  })

  it('popstate during active render queues one transition within expected budget', async () => {
    let fetchCall = 0
    router.fetchPageData.mockImplementation(() => {
      fetchCall += 1
      const lag = fetchCall === 1 ? 75 : 45
      return delayResolve({ data: { raw: `# p${fetchCall}` }, pagePath: `p${fetchCall}.md`, anchor: null }, lag)
    })

    htmlBuilder.prepareArticle.mockImplementation(() => {
      const article = document.createElement('article')
      return delayResolve({ article, parsed: {}, toc: null, topH1: null, h1Text: '', slugKey: '' }, 15)
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

    let settled = false
    const p = ui.renderByQuery().then(() => {
      settled = true
    })

    expect(typeof uiEventHandlers.popstate).toBe('function')
    uiEventHandlers.popstate(new PopStateEvent('popstate'))

    // Combined timing: (75 + 15) + (45 + 15) = 150ms
    await vi.advanceTimersByTimeAsync(149)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await p

    expect(settled).toBe(true)
    expect(router.fetchPageData).toHaveBeenCalledTimes(2)
    expect(htmlBuilder.prepareArticle).toHaveBeenCalledTimes(2)
  })
})
