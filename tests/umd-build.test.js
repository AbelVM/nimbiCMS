import { it, expect } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import vm from 'vm'

it('build:umd produces a usable UMD bundle', () => {
  // Run normal build (UMD is now always emitted)
  execSync('npm run build', { stdio: 'inherit' })

  const bundlePath = 'dist/nimbi-cms.js'
  expect(fs.existsSync(bundlePath)).toBe(true)

  const src = fs.readFileSync(bundlePath, 'utf8')

  // Basic sanity: bundle should contain a UMD-like wrapper and the library global name
  expect(src.includes('typeof exports') || src.includes('typeof exports==') || src.includes('function(root')).toBe(true)
  expect(src.includes('nimbiCMS')).toBe(true)

  // Check for evidence of dynamic-imported modules (highlight.js language loaders)
  // which should be present or inlined in the bundle for the UMD build.
  const hasHljsDynamic = src.includes('highlight.js/lib/languages') || src.includes('HLJS_CDN_BASE') || src.includes('highlight.js')
  expect(hasHljsDynamic).toBe(true)

  // Try to execute bundle in a headless DOM to ensure it initializes a global
  const dom = new JSDOM('', { runScripts: 'outside-only' })
  const context = vm.createContext(dom.window)
  const script = new vm.Script(src, { filename: bundlePath })

  // Running the bundle may touch DOM APIs; JSDOM provides minimal environment
  script.runInContext(context)

  // The UMD should expose the library under the `nimbiCMS` global
  const lib = dom.window.nimbiCMS
  expect(lib).toBeDefined()

  // Ensure expected API surface is available (init entry required)
  const hasInit = typeof lib.initCMS === 'function' || typeof lib.default === 'function'
  expect(hasInit).toBe(true)
}, 120000)

it('umd runtime: registerLanguage and theming APIs exist and are callable', async () => {
  // Ensure build (no-op if already built by previous test)
  execSync('npm run build', { stdio: 'inherit' })

  const bundlePath = 'dist/nimbi-cms.js'
  const src = fs.readFileSync(bundlePath, 'utf8')

  const dom = new JSDOM('<div id="app"></div>', { runScripts: 'outside-only' })
  const context = vm.createContext(dom.window)
  const script = new vm.Script(src, { filename: bundlePath })
  script.runInContext(context)

  const lib = dom.window.nimbiCMS
  expect(lib).toBeDefined()

  // locate helpers on the UMD global; some builds attach APIs to `default`
  const getApi = (name) => {
    if (!lib) return undefined
    if (typeof lib[name] === 'function') return lib[name]
    if (lib.default && typeof lib.default[name] === 'function') return lib.default[name]
    return undefined
  }

  // registerLanguage should be callable (may be on `default` export)
  const registerLanguage = getApi('registerLanguage')
  expect(typeof registerLanguage === 'function').toBe(true)
  const maybePromise = registerLanguage('javascript')
  // It may attempt dynamic imports which can fail in Node; ensure it returns a thenable
  expect(maybePromise && typeof maybePromise.then === 'function').toBe(true)

  // theming: setStyle should update document attributes/classes
  const setStyle = getApi('setStyle')
  if (typeof setStyle === 'function') {
    setStyle('dark')
    // implementation toggles a data attribute or class; accept either
    const hasDataTheme = dom.window.document.documentElement.getAttribute('data-theme') === 'dark'
    const hasIsDark = dom.window.document.documentElement.classList.contains('is-dark')
    expect(hasDataTheme || hasIsDark).toBe(true)
  } else {
    // if not present, fail the test to signal missing API
    throw new Error('setStyle API not found on UMD bundle')
  }

  // Await the registerLanguage promise but tolerate rejections (no network guaranteed)
  try {
    const res = await Promise.race([maybePromise, new Promise(r => setTimeout(() => r(null), 2000))])
    // If it resolved truthy, assert language loaded; otherwise continue without failing
    if (res) expect(res).toBeTruthy()
  } catch (err) {
    // swallow dynamic import errors — test ensures API surface and callability only
  }
})

it('umd runtime: bulmaCustomize (local and remote) injects styles/links', async () => {
  // Build to ensure dist artifacts exist
  execSync('npm run build', { stdio: 'inherit' })

  const bundlePath = 'dist/nimbi-cms.js'
  const src = fs.readFileSync(bundlePath, 'utf8')

  const dom = new JSDOM('<div id="app"></div>', { runScripts: 'outside-only' })
  const context = vm.createContext(dom.window)
  const script = new vm.Script(src, { filename: bundlePath })
  script.runInContext(context)

  const lib = dom.window.nimbiCMS
  expect(lib).toBeDefined()

  const getApi = (name) => {
    if (!lib) return undefined
    if (typeof lib[name] === 'function') return lib[name]
    if (lib.default && typeof lib.default[name] === 'function') return lib.default[name]
    return undefined
  }

  const ensureBulma = getApi('ensureBulma')
  expect(typeof ensureBulma === 'function').toBe(true)

  // Mock fetch for the `local` path test
  dom.window.fetch = async (url, opts) => ({ ok: true, text: async () => '/* local bulma override */ body{background:#000}' })

  // Local override should create a <style data-bulma-override="...">
  await ensureBulma('local', '/')
  const styleEl = dom.window.document.querySelector('style[data-bulma-override]')
  expect(styleEl).toBeTruthy()
  expect(styleEl.textContent.includes('local bulma override')).toBe(true)

  // Remote theme should inject a link[data-bulmaswatch-theme="cerulean"]
  await ensureBulma('cerulean', '/')
  const linkEl = dom.window.document.querySelector('link[data-bulmaswatch-theme="cerulean"]')
  expect(linkEl).toBeTruthy()
  const href = linkEl.getAttribute('href') || linkEl.href
  expect(href).toContain('bulmaswatch/cerulean')

  // Perform a real network GET to the theme URL to ensure it's downloadable.
  // Use native https to avoid extra dependencies.
  const { get: httpGet } = await import('https')
  const themeUrl = href
  const status = await new Promise((resolve, reject) => {
    try {
      const req = httpGet(themeUrl, (res) => {
        const code = res.statusCode || 0
        // drain a small amount and then destroy to avoid long downloads
        res.once('data', () => { req.destroy() })
        resolve(code)
      })
      req.on('error', (e) => reject(e))
      req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')) })
    } catch (err) { reject(err) }
  })
  expect(status).toBeGreaterThan(0)
  // accept successful or redirect responses from the CDN
  expect(status >= 200 && status < 400).toBe(true)
})
