/**
 * a11y-runner.js — run accessibility checks using Puppeteer + axe-core.
 *
 * Usage:
 *   node scripts/a11y-runner.js [options]
 *
 * Notes:
 *   - Expects a local dev server to be running or will serve the project locally.
 *   - Set `CHROME_PATH` or `BROWSER_PATH` env var to point to a Chrome binary if needed.
 */
import fs from 'fs'
import path from 'path'
import http from 'http'
import url from 'url'
import handler from 'serve-handler'

async function runWithPuppeteer() {
  const puppeteer = await import('puppeteer')
  const axe = await import('axe-core')

  // Try to find an installed Chrome/Chromium binary. Allow override via env.
  const candidates = [process.env.CHROME_PATH, process.env.CHROMIUM_PATH, process.env.BROWSER_PATH, '/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/snap/bin/chromium', '/usr/bin/chrome']
  let exe = null
  for (const p of candidates) {
    try { if (p && fs.existsSync(p)) { exe = p; break } } catch (e) {}
  }

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
  if (exe) launchOpts.executablePath = exe

  const browser = await puppeteer.default.launch(launchOpts)
  const page = await browser.newPage()
  const port = process.env.SERVE_PORT || process.env.PORT
  const base = port ? `http://localhost:${port}/` : 'http://localhost:5173/'
  const target = base + 'index.html'
  console.log('Opening', target)
  await page.goto(target, { waitUntil: 'networkidle2' })
  // Inject axe into the page. Prefer `axe.source` if available; otherwise
  // load the packaged `axe.min.js` from the module.
  try {
    if (axe && typeof axe.source === 'string') {
      await page.addScriptTag({ content: axe.source })
    } else {
      const { createRequire } = await import('module')
      const require = createRequire(import.meta.url)
      const axePath = require.resolve('axe-core/axe.min.js')
      await page.addScriptTag({ path: axePath })
    }
  } catch (e) {
    // If injection fails, let the outer try/catch handle fallback to JSDOM
    throw e
  }
  const fixtures = [
    { width: 320, height: 800 },
    { width: 375, height: 812, textZoom: true },
    { width: 768, height: 1024 },
    { width: 1280, height: 900, reducedMotion: true },
  ]
  const reports = []
  for (const fixture of fixtures) {
    await page.setViewport({ width: fixture.width, height: fixture.height })
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: fixture.reducedMotion ? 'reduce' : 'no-preference' },
    ])
    await page.evaluate((textZoom) => {
      document.documentElement.style.fontSize = textZoom ? '200%' : ''
    }, fixture.textZoom === true)
    reports.push({
      fixture,
      result: await page.evaluate(async () => {
        let cumulativeLayoutShift = 0
        if (typeof PerformanceObserver !== 'undefined') {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) cumulativeLayoutShift += entry.value
            }
          })
          try {
            observer.observe({ type: 'layout-shift', buffered: true })
          } catch (e) {}
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          observer.disconnect()
        }
        let markdownLink = document.querySelector('article a[href], main a[href], .content a[href]')
        let injectedMarkdownFixture = false
        if (!markdownLink) {
          const fixtureArticle = document.createElement('article')
          fixtureArticle.innerHTML = '<a href="fixture.md">Markdown fixture</a>'
          document.body.append(fixtureArticle)
          markdownLink = fixtureArticle.querySelector('a')
          injectedMarkdownFixture = true
        }
        let markdownInteraction = false
        if (markdownLink) {
          markdownLink.addEventListener('click', (event) => event.preventDefault(), { once: true })
          markdownLink.focus()
          markdownLink.click()
          markdownInteraction = document.activeElement === markdownLink
        }
        const axeResult = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
        axeResult.horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth
        axeResult.cumulativeLayoutShift = cumulativeLayoutShift
        axeResult.markdownInteraction = markdownInteraction
        axeResult.injectedMarkdownFixture = injectedMarkdownFixture
        return axeResult
      }),
    })
  }
  const results = {
    testEnvironments: reports.map(({ fixture }) => fixture),
    layoutChecks: reports.map(({ fixture, result }) => ({
      fixture,
      horizontalOverflow: result.horizontalOverflow === true,
      cumulativeLayoutShift: result.cumulativeLayoutShift || 0,
    })),
    interactionChecks: reports.map(({ fixture, result }) => ({
      fixture,
      markdownInteraction: result.markdownInteraction === true,
      injectedMarkdownFixture: result.injectedMarkdownFixture === true,
    })),
    violations: reports.flatMap(({ result }) => result.violations),
    incomplete: reports.flatMap(({ result }) => result.incomplete),
    passes: reports.flatMap(({ result }) => result.passes),
  }
  await browser.close()
  return results
}

async function runWithJSDOM() {
  const { JSDOM } = await import('jsdom')
  const axe = await import('axe-core')
  const filePath = path.resolve('index.html')
  // If a server port is provided, fetch the page over HTTP so JSDOM can
  // load external scripts from the running server. Otherwise fall back to
  // local file content and strip external script tags.
  const serverPort = process.env.SERVE_PORT || process.env.PORT || null
  let html
  let baseUrl = 'http://localhost/'
  if (serverPort) {
    baseUrl = `http://localhost:${serverPort}/`
    const target = baseUrl + 'index.html'
    html = await fetchUrl(target)
  } else {
    html = fs.readFileSync(filePath, 'utf8')
    // Strip external script tags so JSDOM doesn't attempt to load missing bundles
    html = html.replace(/<script[^>]*src=["'][^"']*["'][^>]*>(?:<\/script>)?/gi, '')
  }

  // Provide a fetch polyfill on the window so scripts that call `fetch`
  // (the app code) work inside JSDOM when loading resources from the
  // local static server.
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: baseUrl,
    beforeParse(window) {
      window.fetch = function (target, opts) {
        return new Promise((resolve, reject) => {
          try {
            const u = new URL(target, baseUrl)
            const getter = u.protocol === 'https:' ? http.get : http.get
            const req = getter(u, (res) => {
              let data = ''
              res.setEncoding('utf8')
              res.on('data', chunk => data += chunk)
              res.on('end', () => {
                resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, text: async () => data, json: async () => JSON.parse(data) })
              })
            })
            req.on('error', reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    }
  })

  // Small delay to allow resources and inline scripts to run
  await new Promise((res) => setTimeout(res, 250))

  // Prefer injecting axe into the page context if possible (axe.source or axe.min.js).
  try {
    if (axe && typeof axe.source === 'string') {
      dom.window.eval(axe.source)
      // run via injected global
      const results = await dom.window.axe.run(dom.window.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
      return results
    }
  } catch (e) {
    // fall through to trying axe.run in Node
  }

  // Fallback: call axe.run from the imported module, temporarily providing globals
  const runFn = (axe && typeof axe.run === 'function') ? axe.run : (axe && axe.default && typeof axe.default.run === 'function' ? axe.default.run : null)
  if (!runFn) {
    // As a last resort, try to load axe.min.js from the package and inject
    try {
      const { createRequire } = await import('module')
      const require = createRequire(import.meta.url)
      const axePath = require.resolve('axe-core/axe.min.js')
      const code = fs.readFileSync(axePath, 'utf8')
      dom.window.eval(code)
      const results = await dom.window.axe.run(dom.window.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
      return results
    } catch (e) {
      throw new Error('axe.run is not available')
    }
  }

  // Axe-core expects `window`/`document` globals. Temporarily bind JSDOM globals.
  const oldWindow = global.window
  const oldDocument = global.document
  try {
    global.window = dom.window
    global.document = dom.window.document
    const results = await runFn(dom.window.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
    return results
  } finally {
    try { if (typeof oldWindow === 'undefined') delete global.window; else global.window = oldWindow } catch (e) {}
    try { if (typeof oldDocument === 'undefined') delete global.document; else global.document = oldDocument } catch (e) {}
  }
  return results
}

function startStaticServer(root) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => handler(req, res, { public: root }))
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      const port = addr && typeof addr === 'object' ? addr.port : null
      resolve({ port, close: () => new Promise((res, rej) => server.close(err => err ? rej(err) : res())) })
    })
    server.on('error', reject)
  })
}

function fetchUrl(target) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(target)
      const getter = u.protocol === 'https:' ? http.get : http.get
      const req = getter(u, (res) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve(data))
      })
      req.on('error', reject)
    } catch (e) {
      reject(e)
    }
  })
}

function awaitImport(mod) {
  return import(mod)
}

;(async () => {
  try {
    // Start a lightweight static server on a random port and set SERVE_PORT
    const server = await startStaticServer(process.cwd())
    process.env.SERVE_PORT = String(server.port)
    let results = null
    try {
      results = await runWithPuppeteer()
    } catch (err) {
      console.warn('Puppeteer run failed, falling back to JSDOM:', err && err.message)
      results = await runWithJSDOM()
    } finally {
      try { await server.close() } catch (e) {}
    }

    const outPath = path.resolve('a11y-report.json')
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8')
    console.log('A11Y scan complete — report saved to', outPath)

    if (results.violations && results.violations.length) {
      console.log('Violations:', results.violations.length)
      results.violations.forEach(v => {
        console.log('-', v.id, v.impact, v.help)
      })
      process.exit(2)
    }

    if (results.layoutChecks?.some(({ cumulativeLayoutShift }) => cumulativeLayoutShift > 0.1)) {
      console.log('Cumulative layout shift exceeded the 0.1 budget')
      process.exit(2)
    }

    process.exit(0)
  } catch (err) {
    console.error('A11Y scan failed:', err)
    process.exit(1)
  }
})()
