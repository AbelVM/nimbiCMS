import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependent modules before importing createUI
vi.mock('../src/router.js', () => ({ fetchPageData: vi.fn() }))
vi.mock('../src/htmlBuilder.js', () => ({
  prepareArticle: vi.fn(),
  renderNotFound: vi.fn(),
  attachTocClickHandler: vi.fn(),
  scrollToAnchorOrTop: vi.fn(),
  ensureScrollTopButton: vi.fn(),
  createNavTree: vi.fn((t, arr) => arr)
}))
vi.mock('../src/utils/helpers.js', () => ({ setEagerForAboveFoldImages: vi.fn(), getWorkerPoolSize: vi.fn(() => 2) }))
vi.mock('../src/seoManager.js', () => ({ applyPageMeta: vi.fn() }))
vi.mock('../src/imagePreview.js', () => ({ attachImagePreview: vi.fn() }))

const { createUI } = await import('../src/ui.js')
const router = await import('../src/router.js')
const htmlBuilder = await import('../src/htmlBuilder.js')

describe('repro: 404 fallback', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('renders not-found when fetchPageData rejects for a requested page', async () => {
    router.fetchPageData.mockRejectedValue(new Error('no page'))
    const contentWrap = document.createElement('div')
    const navWrap = document.createElement('nav')
    const container = document.createElement('div')
    document.body.appendChild(contentWrap)
    document.body.appendChild(navWrap)
    document.body.appendChild(container)

    const ui = createUI({ contentWrap, navWrap, container, t: (s) => s, contentBase: '/content/', homePage: 'home.md', initialDocumentTitle: 'T', runHooks: vi.fn() })
    history.replaceState({}, '', '?page=missing')
    await ui.renderByQuery()
    expect(htmlBuilder.renderNotFound).toHaveBeenCalled()
  })
})
