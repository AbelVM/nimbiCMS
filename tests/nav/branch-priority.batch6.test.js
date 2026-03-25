import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('seedNavSlugMappings mixed href patterns', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('handles many href permutations and existing mappings', async () => {
    const slugManager = await import('../../src/slugManager.js')
    const { setFetchMarkdown, mdToSlug, slugToMd } = slugManager
    try { mdToSlug.clear() } catch (_) {}
    try { slugToMd.clear() } catch (_) {}

    // Pre-populate an existing mapping to hit the "existing" branch
    try { mdToSlug.set('existing.md', 'existing-slug') } catch (_) {}
    try { slugToMd.set('existing-slug', 'existing.md') } catch (_) {}

    setFetchMarkdown(async (path, base) => {
      const p = String(path || '')
      if (p.endsWith('child.md') || p.endsWith('child.html')) return { raw: '# Hello Child\n', isHtml: false }
      if (p.indexOf('page.md') !== -1) return { raw: '<!doctype html><html><body><h1>Page</h1></body></html>', isHtml: true }
      return { raw: '', isHtml: false }
    })

    const nav = await import('../../src/nav.js')
    const { buildNav } = nav

    const navbarWrap = document.createElement('div')
    const container = document.createElement('main')
    const navHtml = [
      '<a href="/subpath">Home</a>',
      '<a href="/subpath/child.md">Child</a>',
      '<a href="child.md">ChildBare</a>',
      '<a href="?page=page.md">PageToken</a>',
      '<a href="/existing.md">Existing</a>',
      '<a href="http://external.example/">External</a>'
    ].join('')

    await buildNav(navbarWrap, container, navHtml, 'https://example.com/subpath', 'home', (k) => k, async () => {}, false)

    // Wait for async upgrade workers to populate slug maps
    const expectedChild = 'hello-child'
    const expectedPage = 'page'
    let ok = false
    for (let i = 0; i < 300; i++) {
      if ((slugToMd && slugToMd.has(expectedChild)) && (slugToMd && slugToMd.has(expectedPage))) { ok = true; break }
      await new Promise(r => setTimeout(r, 10))
    }
    expect(ok).toBe(true)
    expect(slugToMd.get(expectedChild)).toMatch(/child\.md|subpath\/child\.md/)
    expect(slugToMd.get(expectedPage)).toMatch(/page\.md|page/)

    // ensure pre-existing mapping was preserved
    expect(mdToSlug.get('existing.md')).toBe('existing-slug')
  })
})
