import { describe, it, expect, beforeEach } from 'vitest'
import { setStructuredData, getSiteNameFromMeta } from '../src/seoManager.js'

describe('seoManager structured data', () => {
  beforeEach(() => {
    try {
      const existing = document.getElementById('nimbi-jsonld')
      if (existing) existing.remove()
    } catch (e) {}
    try {
      document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove())
    } catch (e) {}
  })

  it('dispatches @type from meta.type when provided', () => {
    setStructuredData(
      { meta: { type: 'BlogPosting', title: 'Hello' } },
      '/blog/post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    expect(el).toBeTruthy()
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed['@type']).toBe('BlogPosting')
  })

  it('infers AboutPage from /about path', () => {
    setStructuredData(
      { meta: { title: 'About' } },
      '/about',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed['@type']).toBe('AboutPage')
  })

  it('infers ContactPage from /contact path', () => {
    setStructuredData(
      { meta: { title: 'Contact' } },
      '/contact',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed['@type']).toBe('ContactPage')
  })

  it('defaults to Article for content paths', () => {
    setStructuredData(
      { meta: { title: 'Post' } },
      '/blog/2024/01/my-post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed['@type']).toBe('Article')
  })

  it('adds author when meta.author is present', () => {
    setStructuredData(
      { meta: { title: 'Post', author: 'Abel' } },
      '/blog/post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed.author).toEqual({ '@type': 'Person', name: 'Abel' })
  })

  it('adds publisher from site name meta when available', () => {
    const siteMeta = document.createElement('meta')
    siteMeta.setAttribute('name', 'site-name')
    siteMeta.setAttribute('content', 'nimbiCMS')
    document.head.appendChild(siteMeta)
    setStructuredData(
      { meta: { title: 'Post' } },
      '/blog/post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed.publisher).toEqual({ '@type': 'Organization', name: 'nimbiCMS' })
    siteMeta.remove()
  })

  it('adds mainEntityOfPage pointing to canonical', () => {
    setStructuredData(
      { meta: { title: 'Post' } },
      '/blog/post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    const parsed = JSON.parse(el.textContent || '{}')
    expect(parsed.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': expect.stringContaining('?page='),
    })
  })

  it('escapes </script> in JSON-LD textContent', () => {
    setStructuredData(
      { meta: { title: '</script><script>alert(1)</script>' } },
      '/blog/post',
      null,
      null,
      null,
      'Site',
    )
    const el = document.getElementById('nimbi-jsonld')
    expect(el.textContent).not.toContain('</script>')
    expect(el.textContent).toContain('<\\/script>')
  })
})
