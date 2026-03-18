import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as mdModule from '../src/markdown.js'
import { marked } from 'marked'

describe('markdown plugin registration branches', () => {
  beforeEach(() => {
    // reset plugin list
    mdModule.markdownPlugins.length = 0
  })

  it('addMarkdownExtension accepts object plugins and calls marked.use', () => {
    const useSpy = vi.spyOn(marked, 'use').mockImplementation(() => {})
    const plugin = { renderer: {} }
    mdModule.addMarkdownExtension(plugin)
    expect(mdModule.markdownPlugins.includes(plugin)).toBe(true)
    expect(useSpy).toHaveBeenCalled()
    useSpy.mockRestore()
  })

  it('addMarkdownExtension ignores invalid plugin values', () => {
    mdModule.addMarkdownExtension(null)
    mdModule.addMarkdownExtension(undefined)
    expect(mdModule.markdownPlugins.length).toBe(0)
  })

  it('setMarkdownExtensions filters non-object entries and applies marked.use safely', () => {
    const useSpy = vi.spyOn(marked, 'use').mockImplementation(() => {})
    mdModule.setMarkdownExtensions([ { a: 1 }, null, () => {} ])
    expect(mdModule.markdownPlugins.length).toBe(1)
    expect(useSpy).toHaveBeenCalled()
    useSpy.mockRestore()
  })

  it('setMarkdownExtensions swallows marked.use errors', () => {
    const bad = vi.spyOn(marked, 'use').mockImplementation(() => { throw new Error('fail') })
    expect(() => mdModule.setMarkdownExtensions([ { x: 1 } ])).not.toThrow()
    bad.mockRestore()
  })
})
