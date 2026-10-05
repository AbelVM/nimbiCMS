import { it, expect, vi } from 'vitest'

// Integration-style test: ensure `initCMS` actually uses the provided
// `navigationPage` when fetching the navigation markdown. We mock only
// the modules that `init.js` interacts with so the test runs in-node.
//
// vi.mock must be hoisted to the top level (Vitest 5 makes nested calls
// throw). These static mocks are file-scoped and active for every test.

vi.mock('../src/bulmaManager.js', () => ({ ensureBulma: async () => {}, setStyle: () => {}, registerThemedElement: () => {} }))
vi.mock('../src/markdown.js', async () => ({ parseMarkdownToHtml: async (md) => ({ html: String(md ?? '') }), detectFenceLanguages: () => new Set(), addMarkdownExtension: () => {} }))
vi.mock('../src/router.js', () => ({ setResolutionCacheTtl: () => {}, setResolutionCacheMax: () => {}, RESOLUTION_CACHE_TTL: 0, RESOLUTION_CACHE_MAX: 0 }))
vi.mock('../src/nav.js', () => ({ buildNav: async (wrap, container) => ({ navbar: document.createElement('nav'), linkEls: [] }) }))
vi.mock('../src/ui.js', () => ({ createUI: () => ({ renderByQuery: async () => {} }) }))

it('initCMS fetches configured navigationPage (option)', async () => {
  const fetched = []

  // Provide a simple DOM mount
  document.body.innerHTML = '<div id="app"></div>'

  // Use slugManager.setFetchMarkdown to intercept markdown fetches in a
  // deterministic way before loading `initCMS`.
  const slug = await import('../src/slugManager.js')
  slug.setFetchMarkdown(async (path, base) => {
    fetched.push(String(path || path === 0 ? path : ''))
    return { raw: '# page' }
  })

  const { default: initCMS } = await import('../src/nimbi-cms.js')
  await expect(initCMS({ el: '#app', searchIndex: false, navigationPage: 'custom_nav.md' })).resolves.toBeUndefined()

  // Ensure navigationPage was requested (slugManager receives the path)
  expect(fetched.some(u => String(u ?? '').includes('custom_nav.md'))).toBe(true)
})

it('initCMS respects navigationPage URL override when allowed', async () => {
  const fetched = []
  vi.resetModules()

  const origHref = window.location.href
  try {
    history.pushState({}, '', '?navigationPage=param_nav.md')
    document.body.innerHTML = '<div id="app"></div>'

    // Use real slugManager and intercept its markdown loader
    const slug = await import('../src/slugManager.js')
    slug.setFetchMarkdown(async (path, base) => { fetched.push(String(path ?? '')); return { raw: '# page' } })

    const { default: initCMS } = await import('../src/nimbi-cms.js')
    await expect(initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })).resolves.toBeUndefined()
    expect(fetched.some(u => String(u ?? '').includes('param_nav.md'))).toBe(true)
  } finally {
    history.pushState({}, '', origHref)
  }
})