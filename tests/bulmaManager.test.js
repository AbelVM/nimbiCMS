import { describe, it, expect, beforeEach } from 'vitest'
import { setStyle, setThemeVars } from '../src/bulmaManager.js'

describe('bulmaManager theming helpers', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.classList.remove('is-dark')
    document.documentElement.style.cssText = ''
    // clear any previously injected links or styles
    document.querySelectorAll('link[data-bulmaswatch-theme], style[data-bulma-override]').forEach(el => el.remove())
    global.fetch = vi.fn()
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

  // additional tests covering CSS injection and remote/local themes
  it('does nothing when bulmaCustomize is falsy or "none"', async () => {
    // call twice to exercise early return path
    await import('../src/bulmaManager.js').then(m => m.ensureBulma())
    await import('../src/bulmaManager.js').then(m => m.ensureBulma('none'))
    expect(document.querySelector('link[data-bulmaswatch-theme]')).toBeNull()
  })

  it('injects remote theme link when a valid theme is provided', async () => {
    const { ensureBulma } = await import('../src/bulmaManager.js')
    await ensureBulma('solarized')
    const link = document.querySelector('link[data-bulmaswatch-theme="solarized"]')
    expect(link).toBeTruthy()
    expect(link.href).toContain('bulmaswatch.min.css')
  })

  it('loads a local override stylesheet when fetch succeeds', async () => {
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('body{color:red}') }))
    const { ensureBulma } = await import('../src/bulmaManager.js')
    await ensureBulma('local', '/base/')
    const style = document.querySelector('style[data-bulma-override]')
    expect(style).toBeTruthy()
    expect(style.textContent).toContain('color:red')
  })

  it('skips local override if fetch fails for all candidates', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, status: 404, text: () => Promise.resolve('') }))
    const { ensureBulma } = await import('../src/bulmaManager.js')
    await ensureBulma('local', '/base/')
    expect(document.querySelector('style[data-bulma-override]')).toBeNull()
  })
})