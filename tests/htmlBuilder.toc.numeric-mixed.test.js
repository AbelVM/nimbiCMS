import { test, expect } from 'vitest'
import { _parseHtml, buildTocElement } from '../src/htmlBuilder.js'
import { slugify } from '../src/slugManager.js'

test('parseHtml + buildTocElement handle numeric entities and inline tags', () => {
  const raw = '<h2>It&#39;s fine</h2><h2><em>Tag</em> &amp; More</h2>'
  const parsed = _parseHtml(raw)
  const tocEl = buildTocElement(k => k, parsed.toc)
  expect(tocEl).toBeTruthy()
  const anchors = tocEl.querySelectorAll('a')
  expect(anchors[0].textContent).toBe("It's fine")
  expect(anchors[1].textContent).toBe('Tag & More')
  expect(anchors[0].getAttribute('href')).toBe(`#${encodeURIComponent(slugify("It's fine"))}`)
})
