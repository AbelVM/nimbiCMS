#!/usr/bin/env node
import fs from 'fs/promises'
import fsSync from 'fs'
import { spawn, spawnSync } from 'child_process'
import http from 'http'
import net from 'net'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const REPORT_DIR = join(process.cwd(), 'benchmarks', 'reports')
const PROFILE_BASE = join(process.cwd(), 'benchmarks', 'profiles')
const DEPLOYED_URL = 'https://abelvm.github.io/nimbiCMS/'

// Robustness settings for lighthouse runs
const MAX_ATTEMPTS = 4
const BASE_TIMEOUT_MS = 180000 // 3 minutes
const BACKOFF_MS = 30000 // 30s

const delay = ms => new Promise(r => setTimeout(r, ms))

function isMetricsValid(metrics) {
  if (!metrics) return false
  return metrics.performance != null || metrics.fcp != null || metrics.lcp != null || metrics.interactive != null
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, () => {
      const port = srv.address().port
      srv.close(err => {
        if (err) reject(err)
        else resolve(port)
      })
    })
    srv.on('error', reject)
  })
}

function startServe(port) {
  // start the server in a detached process group so we can reliably kill
  // the whole group on exit. Use inherit so logs appear in the terminal.
  const proc = spawn('npx', ['serve', '-L', '-p', String(port), '.'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    detached: true
  })
  // allow the parent to exit independently; we'll kill the group explicitly
  try { proc.unref() } catch (e) {}
  return proc
}

function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    ;(function ping() {
      http.get(url, res => {
        res.resume()
        if (res.statusCode && res.statusCode < 400) return resolve()
        if (Date.now() - start > timeoutMs) return reject(new Error('timeout waiting for ' + url))
        setTimeout(ping, 500)
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('timeout waiting for ' + url))
        setTimeout(ping, 500)
      })
    })()
  })
}

async function runLighthouseWithRetries(url, outputPath, extraArgs = [], outputType = 'json') {
  let timeoutMs = BASE_TIMEOUT_MS
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`lighthouse attempt ${attempt}/${MAX_ATTEMPTS} (${outputType}) -> ${outputPath} (timeout ${timeoutMs}ms)`)
    const args = ['lighthouse', url, ...extraArgs, '--no-enable-error-reporting', `--output=${outputType}`, '--output-path', outputPath]
    try {
      const r = spawnSync('npx', args, { stdio: 'inherit', timeout: timeoutMs })
      if (r.status === 0) {
        if (outputType === 'json') {
          const metrics = extractMetricsFromJson(outputPath)
          if (isMetricsValid(metrics)) return
          console.warn('Lighthouse JSON produced but metrics appear invalid — will retry')
        } else {
          return
        }
      } else {
        console.warn('Lighthouse returned non-zero status', r.status, r.error ? r.error.message : '')
      }
    } catch (err) {
      console.warn('Lighthouse attempt error:', err && err.message ? err.message : err)
    }

    if (attempt < MAX_ATTEMPTS) {
      const backoff = BACKOFF_MS * attempt
      console.log(`Retrying in ${Math.round(backoff/1000)}s...`)
      await delay(backoff)
      timeoutMs += BACKOFF_MS
    } else {
      throw new Error(`Lighthouse ${outputType} failed after ${MAX_ATTEMPTS} attempts: ${outputPath}`)
    }
  }
}

async function runLighthouseFormat(url, outputPath, extraArgs = []) {
  await runLighthouseWithRetries(url, outputPath, extraArgs, 'json')
}

async function runLighthouseHtml(url, outputPath, extraArgs = []) {
  await runLighthouseWithRetries(url, outputPath, extraArgs, 'html')
}

async function warmProfileWithPuppeteer(profileDir, url) {
  try {
    const mod = await import('puppeteer')
    const puppeteer = mod && mod.default ? mod.default : mod
    // Puppeteer >= 25 returns a Promise from executablePath(); await keeps this
    // compatible with both the sync (v24) and async (v25+) signatures.
    const chromeExe = typeof puppeteer.executablePath === 'function' ? await puppeteer.executablePath() : null
    const launchOpts = {
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800'],
      userDataDir: profileDir
    }
    if (chromeExe) launchOpts.executablePath = chromeExe
    const browser = await puppeteer.launch(launchOpts)
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })
    // Give SPA navigation a moment to populate caches and service worker (if any)
    if (typeof page.waitForTimeout === 'function') {
      await page.waitForTimeout(1500)
    } else {
      await new Promise(r => setTimeout(r, 1500))
    }
    await browser.close()
    return chromeExe
  } catch (err) {
    console.warn('Puppeteer warm step failed:', err && err.message ? err.message : err)
    return null
  }
}

async function getPuppeteerExecutablePath() {
  try {
    const mod = await import('puppeteer')
    const puppeteer = mod && mod.default ? mod.default : mod
    if (typeof puppeteer.executablePath === 'function') return await puppeteer.executablePath()
  } catch (e) {
    // ignore
  }
  return null
}

function copyIfExists(src, dest) {
  try {
    if (fsSync.existsSync(src)) fsSync.copyFileSync(src, dest)
  } catch (e) {}
}

function extractMetricsFromJson(jsonPath) {
  try {
    const txt = fsSync.readFileSync(jsonPath, 'utf8')
    const obj = JSON.parse(txt)
    const lc = obj.lighthouseResult || obj
    const categories = lc.categories || {}
    const audits = lc.audits || {}
    const perf = categories.performance && categories.performance.score != null ? Math.round(categories.performance.score * 100) : null
    return {
      performance: perf,
      fcp: audits['first-contentful-paint']?.numericValue ?? null,
      lcp: audits['largest-contentful-paint']?.numericValue ?? null,
      cls: audits['cumulative-layout-shift']?.numericValue ?? null,
      interactive: audits['interactive']?.numericValue ?? null,
      tbt: audits['total-blocking-time']?.numericValue ?? null,
      speedIndex: audits['speed-index']?.numericValue ?? null
    }
  } catch (e) {
    return null
  }
}

function fmt(val, metric) {
  if (val == null) return '—'
  if (metric === 'performance') return String(val)
  if (metric === 'cls') return String(Number(val).toFixed(3))
  return String(Math.round(val)) + ' ms'
}

async function generateResultsMd(results, outPath) {
  const lines = ['# Lighthouse Benchmark — dev vs deployed', '']
  for (const device of ['desktop', 'mobile']) {
    lines.push(`## ${device[0].toUpperCase() + device.slice(1)}`)
    for (const cache of ['cold', 'warm']) {
      lines.push('')
      lines.push(`### ${cache}`)
      lines.push('')
      lines.push('| Metric | Dev | Deployed |')
      lines.push('|---|---:|---:|')
      const dev = results.dev?.[device]?.[cache]
      const dep = results.deployed?.[device]?.[cache]
      const metrics = ['performance', 'fcp', 'lcp', 'interactive', 'tbt', 'speedIndex', 'cls']
      for (const m of metrics) {
        const dv = dev ? dev[m] : null
        const pv = dep ? dep[m] : null
        let dvFmt = fmt(dv, m)
        let pvFmt = fmt(pv, m)
        // determine better: higher for performance, lower for timings
        let devBetter = null
        if (dv != null && pv != null) {
          if (m === 'performance') devBetter = dv > pv
          else devBetter = dv < pv
        }
        if (devBetter === true) dvFmt = `\`${dvFmt}\``
        if (devBetter === false) pvFmt = `\`${pvFmt}\``
        lines.push(`| ${m} | ${dvFmt} | ${pvFmt} |`)
      }
    }
  }
  await fs.writeFile(outPath, lines.join('\n'))
}

async function main() {
  await ensureDir(REPORT_DIR)
  await ensureDir(PROFILE_BASE)

  const port = await findFreePort()
  const localUrl = `http://localhost:${port}`
  console.log('Starting local server on port', port)
  const serveProc = startServe(port)

  try {
    console.log('Waiting for server to be ready...')
    await waitForUrl(localUrl)
    console.log('Server ready at', localUrl)

    const results = { dev: { desktop: {}, mobile: {} }, deployed: { desktop: {}, mobile: {} } }

    // detect Puppeteer's Chromium executable (if available) and use it for
    // Lighthouse via --chrome-path to avoid launcher mismatches
    const PUPPETEER_CHROME_PATH = await getPuppeteerExecutablePath()

    const targets = [ { name: 'dev', url: localUrl }, { name: 'deployed', url: DEPLOYED_URL } ]

    for (const target of targets) {
      for (const device of ['desktop', 'mobile']) {
        const profileDir = join(PROFILE_BASE, `${target.name}-${device}`)
        // ensure profile dir exists for lighthouse to reuse
        await ensureDir(profileDir)

        // cold run (will clear storage by default)
        const coldJson = join(REPORT_DIR, `${target.name}_${device}_cold.json`)
        const coldHtml = join(REPORT_DIR, `${target.name}_${device}_cold.html`)
        const chromeFlagsBase = `--user-data-dir=${profileDir} --no-sandbox --disable-dev-shm-usage --window-size=1280,800`
        const baseArgs = [`--chrome-flags=${chromeFlagsBase}`, '--quiet']
        if (PUPPETEER_CHROME_PATH) baseArgs.push(`--chrome-path=${PUPPETEER_CHROME_PATH}`)
        if (device === 'desktop') baseArgs.push('--preset=desktop')

        console.log(`Running cold ${device} for ${target.name} -> ${target.url}`)
        await runLighthouseFormat(target.url, coldJson, baseArgs)
        await runLighthouseHtml(target.url, coldHtml, baseArgs)

        // warm run (reuse profile, disable storage reset so cache is used)
        const warmJson = join(REPORT_DIR, `${target.name}_${device}_warm.json`)
        const warmHtml = join(REPORT_DIR, `${target.name}_${device}_warm.html`)
        const warmArgs = [...baseArgs, '--disable-storage-reset']
        console.log(`Running warm ${device} for ${target.name} -> ${target.url}`)
        // For deployed targets, pre-warm the Chrome profile (populate cache)
        if (target.name === 'deployed') {
          console.log('Warming browser profile to populate cache for warm run...')
          await warmProfileWithPuppeteer(profileDir, target.url)
        }
        try {
          await runLighthouseFormat(target.url, warmJson, warmArgs)
          await runLighthouseHtml(target.url, warmHtml, warmArgs)
        } catch (err) {
          // Some sites (service-worker driven, fully cached responses) can produce
          // Lighthouse JSON with no timing/network records which makes metrics
          // invalid. First try disabling Service Workers; if that still fails,
          // attempt a cache-bypass URL as a last resort.
          console.warn('Warm run failed with standard flags; retrying with ServiceWorker disabled')
          const swDisabledChromeFlagsBase = `${chromeFlagsBase} --disable-features=ServiceWorker`
          const fallbackArgs = warmArgs.map(a => a.startsWith('--chrome-flags=') ? `--chrome-flags=${swDisabledChromeFlagsBase}` : a)
          try {
            await runLighthouseFormat(target.url, warmJson, fallbackArgs)
            await runLighthouseHtml(target.url, warmHtml, fallbackArgs)
          } catch (err2) {
            console.warn('ServiceWorker-disabled fallback failed; trying cache-bypass URL')
            const cbUrl = target.url + (target.url.includes('?') ? '&' : '?') + `__lhcb=${Date.now()}`
            try {
              await runLighthouseFormat(cbUrl, warmJson, fallbackArgs)
              await runLighthouseHtml(cbUrl, warmHtml, fallbackArgs)
            } catch (err3) {
              // rethrow the original failure so caller knows warm run couldn't be
              // produced after all fallbacks.
              throw err
            }
          }
        }

        // create canonical filenames (cold) without timestamps/suffix as requested
        const canonJson = join(REPORT_DIR, `${target.name}_${device}.json`)
        const canonHtml = join(REPORT_DIR, `${target.name}_${device}.html`)
        copyIfExists(coldJson, canonJson)
        copyIfExists(coldHtml, canonHtml)

        // extract metrics
        const coldMetrics = extractMetricsFromJson(coldJson)
        const warmMetrics = extractMetricsFromJson(warmJson)
        results[target.name][device].cold = coldMetrics
        results[target.name][device].warm = warmMetrics
      }
    }

    // write results.md
    const resultsPath = join(REPORT_DIR, 'results.md')
    await generateResultsMd(results, resultsPath)
    console.log('Benchmark complete — reports in', REPORT_DIR)
    // explicitly exit successfully to avoid lingering event-loop handles
    process.exit(0)
  } finally {
    // Attempt to kill the detached serve process group first, then the proc.
    try {
      if (serveProc && serveProc.pid) {
        try {
          // negative pid kills the process group on POSIX
          process.kill(-serveProc.pid)
        } catch (e) {
          try { serveProc.kill() } catch (e2) {}
        }
      }
    } catch (e) {}
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
