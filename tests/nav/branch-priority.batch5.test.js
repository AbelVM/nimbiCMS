import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('seedNavSlugMappings async upgrade pass', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('stores h1-derived slug for markdown child path', async () => {
    const slugManager = await import('../../src/slugManager.js')
    const { setFetchMarkdown, slugToMd, mdToSlug } = slugManager
    try { slugToMd.clear() } catch (_) {}
    try { mdToSlug.clear() } catch (_) {}

    setFetchMarkdown(async (path, base) => {
      if (String(path) === 'child.md') return { raw: '# Hello World\n\ncontent', isHtml: false }
      return { raw: '', isHtml: false }
    })

    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath/child.md">Child</a>'

    await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)

    const expected = 'hello-world'
    let ok = false
    for (let i = 0; i < 200; i++) {
      if (slugToMd && slugToMd.has(expected)) { ok = true; break }
      await new Promise(r => setTimeout(r, 10))
    }
    expect(ok).toBe(true)
    expect(slugToMd.get(expected)).toBe('child.md')
  })

  it('stores h1-derived slug for HTML pages (isHtml true)', async () => {
    const slugManager = await import('../../src/slugManager.js')
    const { setFetchMarkdown, slugToMd } = slugManager
    try { slugToMd.clear() } catch (_) {}

    setFetchMarkdown(async (path, base) => {
      if (String(path) === 'child.html' || String(path) === 'child.md') return { raw: '<!doctype html><html><body><h1>Page Title</h1></body></html>', isHtml: true }
      return { raw: '', isHtml: false }
    })

    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = '<a href="/subpath/child.html">ChildHTML</a>'

    await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)

    const expected = 'page-title'
    let ok = false
    for (let i = 0; i < 200; i++) {
      if (slugToMd && slugToMd.has(expected)) { ok = true; break }
      await new Promise(r => setTimeout(r, 10))
    }
    expect(ok).toBe(true)
    expect(slugToMd.get(expected)).toBe('child.html')
  })
})
