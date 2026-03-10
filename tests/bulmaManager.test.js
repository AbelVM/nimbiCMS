import { describe, it, expect, beforeEach } from 'vitest'
import { setStyle, setThemeVars } from '../src/bulmaManager.js'

describe('bulmaManager theming helpers', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.classList.remove('is-dark')
    document.documentElement.style.cssText = ''
  })

  it('setStyle toggles dark/light correctly', () => {
    setStyle('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.body.classList.contains('is-dark')).toBe(true)

    setStyle('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.body.classList.contains('is-dark')).toBe(false)
  })

  it('setThemeVars applies CSS variables', () => {
    setThemeVars({ foo: 'bar', color: 'red' })
    const style = document.documentElement.style
    expect(style.getPropertyValue('--foo')).toBe('bar')
    expect(style.getPropertyValue('--color')).toBe('red')
  })
})