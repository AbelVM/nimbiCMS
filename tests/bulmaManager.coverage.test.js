import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ensureBulma, setStyle, setThemeVars, registerThemedElement } from '../src/bulmaManager.js'

describe('bulmaManager coverage', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    // provide a predictable location object
    try { delete window.location } catch (e) {}
    global.window = Object.assign(global.window || {}, { location: { protocol: 'http:' } })
    // reset fetch mock
    global.fetch = undefined
  })

  it('ensureBulma none injects base link and removes theme/overrides', async () => {
    // pre-create a theme link and override style which should be removed
    const tl = document.createElement('link')
    tl.setAttribute('data-bulmaswatch-theme', 'x')
    document.head.appendChild(tl)
    const s = document.createElement('style')
    s.setAttribute('data-bulma-override', 'p')
    document.head.appendChild(s)

    await ensureBulma('none')

    // bundled CSS should be used; do not inject a separate Bulma base link
    const base = document.querySelector('link[data-bulma-base]')
    expect(base).toBeNull()
    // theme and overrides should be removed
    expect(document.querySelector('link[data-bulmaswatch-theme]')).toBeNull()
    expect(document.querySelector('style[data-bulma-override]')).toBeNull()
  })

  it('ensureBulma local fetches local css and injects override style', async () => {
    // mock fetch to return ok text
    global.fetch = vi.fn(async (p, opts) => {
      return { ok: true, text: async () => 'body { /* local css */ }' }
    })

    await ensureBulma('local', '/foo/')

    const s = document.querySelector('style[data-bulma-override]')
    expect(s).toBeTruthy()
    expect(s.textContent).toContain('local css')
    // ensure fetch called with candidates
    expect(global.fetch).toHaveBeenCalled()
  })

  it('ensureBulma theme name injects bulmaswatch link', async () => {
    // mock fetch not needed; injectLink path will create link element
    await ensureBulma('solarized')
    const l = document.querySelector('link[data-bulmaswatch-theme]')
    expect(l).toBeTruthy()
    expect(l.getAttribute('data-bulmaswatch-theme')).toBe('solarized')
  })

  it('setStyle applies to mounts or root', () => {
    const mount = document.createElement('div')
    mount.className = 'nimbi-mount'
    document.body.appendChild(mount)

    setStyle('dark')
    expect(mount.getAttribute('data-theme')).toBe('dark')

    // remove mounts -> should apply to documentElement
    mount.parentNode.removeChild(mount)
    setStyle('system')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('setThemeVars sets CSS custom properties', () => {
    setThemeVars({ color: '#123456', spacing: '4px' })
    expect(document.documentElement.style.getPropertyValue('--color')).toBe('#123456')
    expect(document.documentElement.style.getPropertyValue('--spacing')).toBe('4px')
  })

  it('registerThemedElement sets data-theme on nearest mount and returns unregister fn', () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'nimbi-mount'
    const child = document.createElement('span')
    wrapper.appendChild(child)
    document.body.appendChild(wrapper)

    setStyle('dark')
    const off = registerThemedElement(child)
    expect(wrapper.getAttribute('data-theme')).toBe('dark')
    expect(typeof off).toBe('function')
  })
})
