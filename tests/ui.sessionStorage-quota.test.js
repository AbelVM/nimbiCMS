import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

// Mock dependent modules before importing createUI
vi.mock('../src/router.js', () => ({ fetchPageData: vi.fn() }))
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
vi.mock('../src/seoManager.js', () => ({ applyPageMeta: vi.fn() }))
vi.mock('../src/imagePreview.js', () => ({ attachImagePreview: vi.fn() }))

const { createUI } = await import('../src/ui.js')

describe('ui sessionStorage QuotaExceededError handling', () => {
  let contentWrap, navWrap, container
  let originalAddEventListener, originalRemoveEventListener
  let uiEventHandlers
  let mockSS
  let originalSessionStorage

  beforeEach(() => {
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
    container.scrollTop = 42
    container.scrollLeft = 7
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    // Replace sessionStorage with a controllable mock (jsdom 30: getter-only)
    originalSessionStorage = window.sessionStorage
    mockSS = {
      _store: {},
      getItem(key) { return Object.prototype.hasOwnProperty.call(this._store, key) ? this._store[key] : null },
      setItem(key, value) { this._store[key] = String(value) },
      removeItem(key) { delete this._store[key] },
      clear() { this._store = {} }
    }
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSS,
      configurable: true,
      writable: true,
      enumerable: true
    })
  })

  afterEach(() => {
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      configurable: true,
      writable: true,
      enumerable: true
    })
  })

  it('saveScrollPosition falls back to in-memory storage when sessionStorage.setItem throws QuotaExceededError', () => {
    const quotaError = new Error('Quota exceeded')
    quotaError.name = 'QuotaExceededError'
    const setItemSpy = vi.fn(() => { throw quotaError })
    mockSS.setItem = setItemSpy

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

    expect(typeof uiEventHandlers.pagehide).toBe('function')
    // pagehide triggers saveScrollPosition; must not throw
    expect(() => uiEventHandlers.pagehide(new Event('pagehide'))).not.toThrow()
    // setItem was attempted and threw
    expect(setItemSpy).toHaveBeenCalled()

    // In-memory fallback should restore the scroll position on a persisted pageshow
    container.scrollTo = vi.fn()
    const scrollToSpy = vi.spyOn(container, 'scrollTo')
    expect(typeof uiEventHandlers.pageshow).toBe('function')
    const persistedEvent = { type: 'pageshow', persisted: true }
    expect(() => uiEventHandlers.pageshow(persistedEvent)).not.toThrow()

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 42, left: 7, behavior: 'auto' })
  })

  it('saveScrollPosition persists to sessionStorage when setItem succeeds', () => {
    const setItemSpy = vi.fn()
    mockSS.setItem = setItemSpy

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

    expect(() => uiEventHandlers.pagehide(new Event('pagehide'))).not.toThrow()
    expect(setItemSpy).toHaveBeenCalled()
    const [key, value] = setItemSpy.mock.calls[0]
    expect(key).toContain('nimbi-cms-scroll:')
    const parsed = JSON.parse(value)
    expect(parsed.top).toBe(42)
    expect(parsed.left).toBe(7)
  })
})