import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('worker/renderer.handleWorkerMessage', () => {
  it('returns register-error when hljs unavailable', async () => {
    const res = await handleWorkerMessage({ type: 'register', name: 'x', url: 'http://example.com/lang.js' })
    expect(res).toHaveProperty('type', 'register-error')
    expect(res).toHaveProperty('name', 'x')
  })

  it('detects fenced languages and respects supported list', async () => {
    const md = '```javascript\n1+1\n```\n```mycustom\nhi\n```'
    const res = await handleWorkerMessage({ type: 'detect', id: 'd1', md, supported: ['mycustom'] })
    expect(res).toHaveProperty('id', 'd1')
    expect(Array.isArray(res.result)).toBe(true)
    expect(res.result).toEqual(expect.arrayContaining(['javascript','mycustom']))
  })

  it('renders markdown and returns html with lazy images and toc', async () => {
    const md = '# Title\n\n## Sub\n\n<img src="img.png">\n'
    const res = await handleWorkerMessage({ id: 'r1', md })
    expect(res).toHaveProperty('id', 'r1')
    expect(res.result).toHaveProperty('html')
    expect(res.result).toHaveProperty('toc')
    expect(res.result.toc.some(h => h.level === 2)).toBe(true)
    expect(res.result.html).toContain('loading="lazy"')
  })
})
