import { beforeEach, describe, expect, it, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'

describe('initCMS validation branches (high-yield)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
  })

  it('rejects invalid option types for core fields', async () => {
    await expect(initCMS({ el: '#app', contentPath: '' })).rejects.toThrow(/contentPath/i)
    await expect(initCMS({ el: '#app', searchIndex: 'yes' })).rejects.toThrow(/searchIndex/i)
    await expect(initCMS({ el: '#app', searchIndexMode: 'auto' })).rejects.toThrow(/searchIndexMode/i)
    await expect(initCMS({ el: '#app', defaultStyle: 'neon' })).rejects.toThrow(/defaultStyle/i)
    await expect(initCMS({ el: '#app', bulmaCustomize: 7 })).rejects.toThrow(/bulmaCustomize/i)
    await expect(initCMS({ el: '#app', lang: 7 })).rejects.toThrow(/lang/i)
    await expect(initCMS({ el: '#app', l10nFile: 7 })).rejects.toThrow(/l10nFile/i)
  })

  it('rejects invalid option types for advanced fields', async () => {
    await expect(initCMS({ el: '#app', cacheTtlMinutes: -1 })).rejects.toThrow(/cacheTtlMinutes/i)
    await expect(initCMS({ el: '#app', cacheMaxEntries: 1.5 })).rejects.toThrow(/cacheMaxEntries/i)
    await expect(initCMS({ el: '#app', markdownExtensions: [null] })).rejects.toThrow(/markdownExtensions/i)
    await expect(initCMS({ el: '#app', availableLanguages: ['en', ''] })).rejects.toThrow(/availableLanguages/i)
    await expect(initCMS({ el: '#app', noIndexing: ['ok', ''] })).rejects.toThrow(/noIndexing/i)
    await expect(initCMS({ el: '#app', skipRootReadme: 'no' })).rejects.toThrow(/skipRootReadme/i)
    await expect(initCMS({ el: '#app', allowEmbeddedScripts: 'yes' })).rejects.toThrow(/allowEmbeddedScripts/i)
    await expect(initCMS({ el: '#app', fetchConcurrency: 0 })).rejects.toThrow(/fetchConcurrency/i)
    await expect(initCMS({ el: '#app', negativeFetchCacheTTL: -1 })).rejects.toThrow(/negativeFetchCacheTTL/i)
  })
})
