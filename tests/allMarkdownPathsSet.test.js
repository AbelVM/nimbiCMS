import { describe, it, expect, beforeEach } from 'vitest'
import { _setAllMd, setContentBase, allMarkdownPaths, allMarkdownPathsSet } from '../src/slugManager.js'

describe('allMarkdownPathsSet derived set', () => {
  beforeEach(() => {
    _setAllMd({})
    try { setContentBase() } catch (e) {}
  })

  it('mirrors allMarkdownPaths contents after setContentBase', () => {
    _setAllMd({'/content/a.md': '# A', '/content/sub/b.md': '# B'})
    setContentBase('/content/')
    expect(Array.isArray(allMarkdownPaths)).toBe(true)
    expect(allMarkdownPaths.length).toBe(2)
    expect(allMarkdownPathsSet.size).toBe(2)
    for (const p of allMarkdownPaths) {
      expect(allMarkdownPathsSet.has(p)).toBe(true)
    }
  })
})
