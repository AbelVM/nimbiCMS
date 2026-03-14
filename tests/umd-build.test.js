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
})
