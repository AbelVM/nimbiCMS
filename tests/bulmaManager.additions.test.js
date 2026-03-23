import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ensureBulma, setStyle, setThemeVars, registerThemedElement } from '../src/bulmaManager.js'

describe('bulmaManager additional branches', () => {
  let origFetch

  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    origFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = origFetch
  })

  it('ensureBulma none injects base and removes theme/overrides', async () => {
    const themeLink = document.createElement('link')
    themeLink.setAttribute('data-bulmaswatch-theme', 'x')
    document.head.appendChild(themeLink)

    const overrideStyle = document.createElement('style')
    overrideStyle.setAttribute('data-bulma-override', '/path')
    document.head.appendChild(overrideStyle)

    await ensureBulma('none', '/')

    expect(document.querySelector('link[data-bulmaswatch-theme]')).toBeNull()
    expect(document.querySelector('style[data-bulma-override]')).toBeNull()
    expect(document.querySelector('link[data-bulma-base]')).toBeTruthy()
  })

  it('ensureBulma local fetches and injects override style', async () => {
    global.fetch = vi.fn(async (url, opts) => ({ ok: true, text: async () => 'body{color:red}' }))

    await ensureBulma('local', '/prefix/')

    const s = document.querySelector('style[data-bulma-override]')
    expect(s).toBeTruthy()
    expect(s.getAttribute('data-bulma-override')).toContain('/prefix/bulma.css')
    expect(s.textContent).toContain('bulma override')
  })

  it('ensureBulma theme name injects bulmaswatch link', async () => {
    await ensureBulma('solarized', '/')
    const l = document.querySelector('link[data-bulmaswatch-theme="solarized"]')
    expect(l).toBeTruthy()
    expect(l.href).toContain('bulmaswatch/solarized')
  })

  it('setStyle applies themes to mounts and root', () => {
    const mount = document.createElement('div')
    mount.className = 'nimbi-mount'
    document.body.appendChild(mount)

    setStyle('dark')
    expect(mount.getAttribute('data-theme')).toBe('dark')

    mount.remove()
    setStyle('system')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('setThemeVars sets CSS variables on :root', () => {
    setThemeVars({ color: '#fff', 'font-size': '12px' })
    expect(document.documentElement.style.getPropertyValue('--color')).toBe('#fff')
    expect(document.documentElement.style.getPropertyValue('--font-size')).toBe('12px')
  })

  it('registerThemedElement respects current style', () => {
    setStyle('dark')
    const mount = document.createElement('div')
    mount.className = 'nimbi-mount'
    document.body.appendChild(mount)
    const child = document.createElement('div')
    mount.appendChild(child)

    const unregister = registerThemedElement(child)
    expect(mount.getAttribute('data-theme')).toBe('dark')
    expect(typeof unregister).toBe('function')

    const noOp = registerThemedElement(null)
    expect(typeof noOp).toBe('function')
  })
})
