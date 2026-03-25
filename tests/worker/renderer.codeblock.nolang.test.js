import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock hljs core so plaintext highlighting is available
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({
  default: {
    registerLanguage: vi.fn(),
    getLanguage: (name) => name === 'plaintext',
    highlight: (code, { language } = {}) => ({ value: `<span>HL:${language||'plaintext'}:${code}</span>` })
  }
}), { virtual: true })

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer code block without language', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('renders fenced code without language and does not crash', async () => {
    const md = '```\nno-lang content\n```\n'
    const res = await handleWorkerMessage({ id: 'cnl', md })
    expect(res).toHaveProperty('id', 'cnl')
    expect(res.result.html).toContain('no-lang content')
  })
})
