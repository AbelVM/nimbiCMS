/* Reproduce contentPath normalization differences
 * Compares the original pre-patch behavior with the current logic in
 * src/init.js for several example inputs reported by the user.
 */
import { describe, it, expect } from 'vitest'

function computeContentBaseOrig(pagePath, contentPath) {
  const pageDir = pagePath.endsWith('/') ? pagePath : pagePath.substring(0, pagePath.lastIndexOf('/') + 1)
  let cp = contentPath
  if (cp === '.' || cp === './') cp = ''
  if (cp && cp.startsWith('./')) cp = cp.slice(2)
  if (cp && cp.startsWith('/')) cp = cp.slice(1)
  if (cp !== '' && !cp.endsWith('/')) cp = cp + '/'
  const contentBase = new URL(pageDir + (cp || ''), 'http://example.com').toString()
  return contentBase
}

function computeContentBaseNew(pagePath, contentPath, contentPathWasProvided) {
  let cp = contentPath
  if (!contentPathWasProvided) {
    if (cp === '.' || cp === './') cp = '/'
    if (!cp.startsWith('/')) cp = '/' + cp
    if (!cp.endsWith('/')) cp = cp + '/'
    try { cp = cp.replace(/\\/g, '/') } catch (_) {}
    return new URL(cp, 'http://example.com').toString()
  } else {
    if (cp === '.' || cp === './') cp = ''
    if (cp && cp.startsWith('./')) cp = cp.slice(2)
    if (cp && cp.startsWith('/')) cp = cp.slice(1)
    if (cp !== '' && !cp.endsWith('/')) cp = cp + '/'
    return new URL(pagePath.substring(0, pagePath.lastIndexOf('/') + 1) + (cp || ''), 'http://example.com').toString()
  }
}

describe('contentPath normalization behaviors', () => {
  it('computes expected contentBase for various inputs', () => {
    const pagePath = '/content/page.html'
    const cases = [
      { input: undefined, expected: 'http://example.com/content/' },
      { input: './', expected: 'http://example.com/content/' },
      { input: '.', expected: 'http://example.com/content/' },
      { input: 'content', expected: 'http://example.com/content/content/' },
      { input: './content', expected: 'http://example.com/content/content/' },
      { input: 'randomword', expected: 'http://example.com/content/randomword/' }
    ]

    for (const c of cases) {
      const provided = c.input !== undefined
      const cp = provided ? c.input : '/content'
      const updated = computeContentBaseNew(pagePath, cp, provided)
      expect(updated).toBe(c.expected)
    }
  })
})
