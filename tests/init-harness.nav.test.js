import { test, expect, vi } from 'vitest'

test('initCMS runtime nav slug mapping harness', async () => {
  vi.resetModules()
  document.body.innerHTML = '<div id="app"></div>'
  if (!(global.location && typeof global.location === 'object')) global.location = new URL('http://localhost/')

  const slugMgr = await import('../src/slugManager.js')
  // Reset maps
  try { slugMgr.slugToMd.clear() } catch (_) {}
  try { slugMgr.mdToSlug.clear() } catch (_) {}
  try { slugMgr._setAllMd({}) } catch (_) {}

  const manifest = {
    '/docs/README.md': '# nimbi-cms\n\nRoot docs README',
    '/docs/nimbi-cms/README.md': '# nimbi-cms\n\nModule README',
    '/assets/navigation.md': '[Root](/docs/README.md)\n\n[Module](/docs/nimbi-cms/README.md)',
    '/assets/brochure.md': '# Brochure\n\ncontent',
    '/assets/404.md': '# Not Found\n\n404'
  }

  // Shim fetchMarkdown to return manifest entries
  try {
    slugMgr.setFetchMarkdown(async (path, base) => {
      // Resolve to a pathname using URL when possible so absolute bases
      // (e.g. http://localhost:3000/) are handled correctly.
      let key = null
      try {
        const u = new URL(String(path ?? ''), String(base || 'http://localhost/'))
        key = u.pathname || ('/' + String(path ?? '').replace(/^\//, ''))
      } catch (_) {
        key = '/' + String(path ?? '').replace(/^\//, '')
      }
      const raw = manifest[key]
      if (!raw) throw new Error('manifest missing: ' + key)
      return { raw }
    })
  } catch (e) {
    // ignore
  }

  // Register in-memory manifest so init applies it
  try { slugMgr._setAllMd(manifest) } catch (_) {}

  const { default: initCMS } = await import('../src/nimbi-cms.js')

  const options = {
    el: '#app',
    contentPath: './',
    indexDepth: 3,
    bulmaCustomize: 'materia',
    homePage: 'assets/brochure.md',
    notFoundPage: 'assets/404.md',
    navigationPage: 'assets/navigation.md',
    debugLevel: 3,
    manifest: manifest
  }

  await initCMS(options)
  // Allow any background tasks a moment
  await new Promise(r => setTimeout(r, 50))

  // Dump mappings & anchors for debugging
  const sm = await import('../src/slugManager.js')
  // eslint-disable-next-line no-console
  console.log('slugToMd:', Array.from(sm.slugToMd.entries()))
  // eslint-disable-next-line no-console
  console.log('mdToSlug:', Array.from(sm.mdToSlug.entries()))
  const anchors = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent && a.textContent.trim(), href: a.getAttribute('href') }))
  // eslint-disable-next-line no-console
  console.log('anchors:', anchors)

  // Ensure the two README manifest paths map to distinct slugs in mdToSlug
  const candidates = sm.mdToSlug || new Map()
  const findSlug = (p) => {
    const variants = [p, '/' + p, p.replace(/^\//, ''), '/' + p.replace(/^\//, '')]
    for (const v of variants) {
      try { if (candidates.has(v)) return candidates.get(v) } catch (_) {}
    }
    return undefined
  }
  const s1 = findSlug('docs/README.md')
  const s2 = findSlug('docs/nimbi-cms/README.md')
  expect(s1).toBeDefined()
  expect(s2).toBeDefined()
  expect(s1).not.toBe(s2)
}, 20000)
