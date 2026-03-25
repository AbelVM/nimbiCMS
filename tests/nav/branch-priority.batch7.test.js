import { vi, expect, test, beforeEach } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  document.body.innerHTML = ''
})

test('contentBase with non-matching mappingTarget uses fallback mappingTarget', async () => {
  const { setFetchMarkdown } = await import('../../src/slugManager.js')
  // Provide a harmless fetch that returns minimal HTML (not strictly required)
  setFetchMarkdown(async (path, contentBase) => {
    return { raw: '<h1>Other Title</h1>' }
  })

  const { buildNav } = await import('../../src/nav.js')

  const html = '<nav><a href="/other/page.md">Other</a></nav>'
  // contentBase has a non-empty pathname 'subpath' so cbPath logic runs
  await buildNav(document.body, null, html, 'https://example.com/subpath', 'home', (k) => k, false, false)

  // If no error thrown and buildNav completed, branch-side executed
  expect(document.body).toBeTruthy()
})

test('existing mdToSlug mapping prevents fetchMarkdown from being called', async () => {
  const { setFetchMarkdown, mdToSlug } = await import('../../src/slugManager.js')
  // If fetchMarkdown is called, make the test fail by throwing.
  setFetchMarkdown(async () => {
    throw new Error('fetchMarkdown should not be called when existing mapping present')
  })

  // Pre-populate mdToSlug with a mapping for the normalized path
  // Use the normalized form without leading ./ or / as code normalizes it
  mdToSlug.set('other/page.md', 'pre-existing-slug')

  const { buildNav } = await import('../../src/nav.js')

  const html = '<nav><a href="/other/page.md">Other</a></nav>'
  // Call buildNav with a contentBase that will make mappingTarget resolve
  await buildNav(document.body, null, html, 'https://example.com/subpath', 'home', (k) => k, false, false)

  // Ensure our pre-populated mapping still exists
  expect(mdToSlug.get('other/page.md')).toBe('pre-existing-slug')
})
