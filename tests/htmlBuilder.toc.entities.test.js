import { test, expect } from 'vitest'
import { buildTocElement } from '../src/htmlBuilder.js'
import { slugify } from '../src/slugManager.js'

test('buildTocElement decodes HTML entities in TOC text', () => {
  const t = k => k
  const toc = [
    { level: 2, text: 'AT&amp;T &amp; Co.' },
    { level: 3, text: 'He said &quot;Hello&quot; &amp; world' }
  ]
  const tocEl = buildTocElement(t, toc)
  expect(tocEl).toBeTruthy()
  const anchors = tocEl.querySelectorAll('a')
  expect(anchors.length).toBeGreaterThanOrEqual(2)
  const first = anchors[0]
  const second = anchors[1]
  expect(first.textContent).toBe('AT&T & Co.')
  expect(second.textContent).toBe('He said "Hello" & world')
  // href should use slugified decoded text
  expect(first.getAttribute('href')).toBe(`#${encodeURIComponent(slugify('AT&T & Co.'))}`)
  expect(second.getAttribute('href')).toBe(`#${encodeURIComponent(slugify('He said "Hello" & world'))}`)
})
