import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { parseMarkdownToHtml } from '../src/markdown.js'

describe('markdown moved-logo removal', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-nimbi-logo-moved')
  })
  afterEach(() => {
    document.documentElement.removeAttribute('data-nimbi-logo-moved')
  })

  it('removes the moved logo image from parsed HTML when data-nimbi-logo-moved is set', async () => {
    const imgPath = new URL('images/first.png', location.href).toString()
    document.documentElement.setAttribute('data-nimbi-logo-moved', imgPath)

    const md = '![](images/first.png)\n\n# Heading\nSome text.'
    const res = await parseMarkdownToHtml(md)
    // Parse returned HTML to ensure no <img> remains
    const parser = new DOMParser()
    const doc = parser.parseFromString(res.html, 'text/html')
    const img = doc.querySelector('img')
    expect(img).toBeNull()
  })

  it('keeps images when no moved-logo attribute is set', async () => {
    const md = '![](images/first.png)\n\n# Heading\nSome text.'
    const res = await parseMarkdownToHtml(md)
    const parser = new DOMParser()
    const doc = parser.parseFromString(res.html, 'text/html')
    const img = doc.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toMatch(/images\/first.png$/)
  })
})
