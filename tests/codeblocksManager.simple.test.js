import { describe, it, expect } from 'vitest'
import { setHighlightTheme, BAD_LANGUAGES } from '../src/codeblocksManager.js'

describe('codeblocksManager simple behaviors', () => {
  it('setHighlightTheme injects link for non-default theme when useCdn true', () => {
    const before = document.querySelectorAll('link[data-hl-theme]').length
    setHighlightTheme('solarized-dark', { useCdn: true })
    const found = document.querySelector('link[data-hl-theme]')
    expect(found).toBeTruthy()
    expect(found.getAttribute('data-hl-theme')).toBe('solarized-dark')
  })

  it('registerLanguage quickly rejects BAD_LANGUAGES', async () => {
    expect(BAD_LANGUAGES.has('magic')).toBe(true)
  })
})
