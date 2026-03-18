import { describe, it, expect } from 'vitest'
import { buildTocElement } from '../src/htmlBuilder.js'
import { slugify } from '../src/slugManager.js'

describe('buildTocElement entity decoding and edgecases', () => {
  it('decodes HTML entities in toc text and produces slug hrefs', () => {
    const t = (k) => k
    const toc = [
      { level: 2, text: 'AT&amp;T &quot;X&quot; &#39;Y&#39;' },
      { level: 2, text: 'Second heading' }
    ]

    const aside = buildTocElement(t, toc, '')
    expect(aside).toBeTruthy()
    const anchors = aside.querySelectorAll('a')
    expect(anchors.length).toBeGreaterThanOrEqual(2)
    const firstText = anchors[0].textContent || ''
    expect(firstText).toContain('AT&T')
    expect(firstText).toContain('"X"')

    const expected = slugify('AT&T "X" \u0027Y\u0027')
    expect(anchors[0].href).toContain('#' + encodeURIComponent(expected))
  })

  it('returns null when toc has one or fewer items', () => {
    const t = (k) => k
    const toc = [{ level: 2, text: 'Only one' }]
    const aside = buildTocElement(t, toc, '')
    expect(aside).toBeNull()
  })
})
