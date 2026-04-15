#!/usr/bin/env node
import { spawn, execSync } from 'child_process'
import http from 'http'
import https from 'https'
import net from 'net'
import tls from 'tls'
import { URL } from 'url'
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'

/*
  Benchmarks (CDP) script moved to `benchmarks/`.
  - Produces JSON reports into the `benchmarks/` folder
  - Captures navigation duration, TTFB and LCP using an injected PerformanceObserver
  Usage:
    node benchmarks/benchmark-cdp.js --runs=5 --targets="http://localhost:5544/,https://abelvm.github.io/nimbiCMS/"
*/

const DEFAULT_RUNS = 5
const DEFAULT_HOSTS = [
  'http://localhost:5544/',
  'https://abelvm.github.io/nimbiCMS/'
]

const OUTPUT_DIR = path.join(process.cwd(), 'benchmarks')
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

function argvGet(name, defaultValue) {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`))
  if (!arg) return defaultValue
  return arg.split('=')[1]
}

const runs = Number(argvGet('runs', DEFAULT_RUNS)) || DEFAULT_RUNS
const targets = (argvGet('targets', '') || '').split(',').filter(Boolean)
const sites = targets.length ? targets : DEFAULT_HOSTS

function findChrome() {
  const candidates = ['google-chrome-stable','google-chrome','chrome','chromium-browser','chromium']
  for (const name of candidates) {
    try {
      const p = execSync(`command -v ${name}`, { stdio: 'pipe' }).toString().trim()
      if (p) return p
    } catch (e) {}
  }
  throw new Error('Chrome binary not found. Install Chrome/Chromium or ensure it is on PATH.')
}

async function getFreePort() {
  return new Promise((res, rej) => {
    const srv = net.createServer()
    srv.listen(0, () => {
      const port = srv.address().port
      srv.close(() => res(port))
    })
    srv.on('error', rej)
  })
}

function httpRequestJson(method, url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url)
      const opts = { method, hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + (u.search || '') }
      const req = (u.protocol === 'https:' ? https.request : http.request)(opts, res => {
        const bufs = []
        res.on('data', b => bufs.push(b))
        res.on('end', () => {
          const s = Buffer.concat(bufs).toString('utf8')
          try { resolve(JSON.parse(s)) } catch (err) {
            const dumpPath = path.join(os.tmpdir(), `bench-raw-${Date.now()}.txt`)
            try { fs.writeFileSync(dumpPath, s, 'utf8') } catch (e) {}
            const e2 = new Error(`Failed to parse JSON from ${url}: ${err.message}. Raw saved to ${dumpPath}`)
            e2.raw = s
            reject(e2)
          }
        })
      })
      req.on('error', reject)
      req.setTimeout(timeout, () => { req.destroy(new Error('timeout')) })
      req.end()
    } catch (e) { reject(e) }
  })
}

class MinimalWebSocket {
  constructor(wsUrl) {
    this.wsUrl = wsUrl
    this.socket = null
    this.buffer = Buffer.alloc(0)
    this.listeners = new Map()
    this.pending = new Map()
    this.id = 1
  }

  async connect(timeout = 10000) {
    const u = new URL(this.wsUrl)
    const isSecure = u.protocol === 'wss:'
    const port = u.port || (isSecure ? 443 : 80)
    const host = u.hostname
    const path = u.pathname + (u.search || '')
    const key = crypto.randomBytes(16).toString('base64')
    const headers = []
    headers.push(`GET ${path} HTTP/1.1`)
    headers.push(`Host: ${host}:${port}`)
    headers.push('Upgrade: websocket')
    headers.push('Connection: Upgrade')
    headers.push(`Sec-WebSocket-Key: ${key}`)
    headers.push('Sec-WebSocket-Version: 13')
    headers.push('\r\n')
    const connectOpts = { host, port }
    this.socket = isSecure ? tls.connect(connectOpts) : net.connect(connectOpts)
    return new Promise((resolve, reject) => {
      const onError = (err) => { cleanup(); reject(err) }
      const onData = (chunk) => {
        this.buffer = Buffer.concat([this.buffer, chunk])
        const s = this.buffer.toString('utf8')
        if (s.indexOf('\r\n\r\n') !== -1) {
          const header = s.slice(0, s.indexOf('\r\n\r\n'))
          if (!/^HTTP\/\d+\.\d+\s+101\b/i.test(header) && !/101\s+Switching\s+Protocols/i.test(header)) {
            cleanup()
            return reject(new Error('WebSocket handshake failed: ' + header.split('\r\n')[0]))
          }
          const idx = s.indexOf('\r\n\r\n') + 4
          this.buffer = Buffer.from(s.slice(idx), 'utf8')
          this.socket.on('data', d => this._onSocketData(d))
          this.socket.on('close', () => this._emit('close'))
          this.socket.on('error', e => this._emit('error', e))
          cleanup()
          console.log('WebSocket handshake complete')
          resolve()
        }
      }
      const cleanup = () => {
        this.socket.removeListener('error', onError)
        this.socket.removeListener('data', onData)
      }
      this.socket.once('error', onError)
      this.socket.once('data', onData)
      this.socket.on('end', () => this._emit('end'))
      this.socket.write(headers.join('\r\n'))
      setTimeout(() => { cleanup(); reject(new Error('WebSocket handshake timeout')) }, timeout)
    })
  }

  _onSocketData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk])
    while (true) {
      if (this.buffer.length < 2) return
      const first = this.buffer[0]
      const second = this.buffer[1]
      const opcode = first & 0x0f
      let masked = !!(second & 0x80)
      let payloadLen = second & 0x7f
      let offset = 2
      if (payloadLen === 126) {
        if (this.buffer.length < offset + 2) return
        payloadLen = this.buffer.readUInt16BE(offset)
        offset += 2
      } else if (payloadLen === 127) {
        if (this.buffer.length < offset + 8) return
        payloadLen = Number(this.buffer.readBigUInt64BE(offset))
        offset += 8
      }
      let maskKey = null
      if (masked) {
        if (this.buffer.length < offset + 4) return
        maskKey = this.buffer.slice(offset, offset + 4)
        offset += 4
      }
      if (this.buffer.length < offset + payloadLen) return
      let payload = this.buffer.slice(offset, offset + payloadLen)
      if (masked && maskKey) {
        const unmasked = Buffer.alloc(payload.length)
        for (let i = 0; i < payload.length; i++) unmasked[i] = payload[i] ^ maskKey[i % 4]
        payload = unmasked
      }
      this.buffer = this.buffer.slice(offset + payloadLen)
      if (opcode === 0x1) {
        const text = payload.toString('utf8')
        try { const obj = JSON.parse(text); this._handleMessage(obj) } catch (e) { this._emit('message', text) }
      } else if (opcode === 0x8) { this._emit('close') } else if (opcode === 0x9) { this._sendFrame(Buffer.alloc(0), 0xA) }
    }
  }

  _handleMessage(obj) {
    if (obj.id && this.pending.has(obj.id)) {
      const cb = this.pending.get(obj.id)
      this.pending.delete(obj.id)
      cb.resolve(obj)
      return
    }
    if (obj.method) { this._emit(obj.method, obj.params); this._emit('event', obj) }
  }

  _emit(name, ...args) {
    const ls = this.listeners.get(name)
    if (ls) for (const fn of ls.slice()) try { fn(...args) } catch (e) { console.error('listener error', e) }
  }

  on(name, fn) { const ls = this.listeners.get(name) || []; ls.push(fn); this.listeners.set(name, ls); return () => { const cur = this.listeners.get(name) || []; this.listeners.set(name, cur.filter(x => x !== fn)) } }

  _sendFrame(payloadBuf, opcode = 0x1) {
    const finAndOpcode = 0x80 | (opcode & 0x0f)
    const len = payloadBuf.length
    if (len <= 125) {
      const header = Buffer.alloc(2 + 4)
      header[0] = finAndOpcode
      header[1] = 0x80 | len
      const mask = crypto.randomBytes(4)
      mask.copy(header, 2)
      this.socket.write(Buffer.concat([header, this._mask(payloadBuf, mask)]))
      return
    }
    if (len < 65536) {
      let header = Buffer.alloc(4 + 4)
      header[0] = finAndOpcode
      header[1] = 0x80 | 126
      header.writeUInt16BE(len, 2)
      const mask = crypto.randomBytes(4)
      header = Buffer.concat([header, mask])
      this.socket.write(Buffer.concat([header, this._mask(payloadBuf, mask)]))
      return
    }
    const header = Buffer.alloc(10 + 4)
    header[0] = finAndOpcode
    header[1] = 0x80 | 127
    header.writeBigUInt64BE(BigInt(len), 2)
    const mask = crypto.randomBytes(4)
    mask.copy(header, 10)
    this.socket.write(Buffer.concat([header, this._mask(payloadBuf, mask)]))
  }

  _mask(buf, mask) { const out = Buffer.alloc(buf.length); for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ mask[i % 4]; return out }

  sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++
      this.pending.set(id, { resolve, reject })
      const payloadObj = { id, method, params }
      const payload = JSON.stringify(payloadObj)
      try { console.log('[WS send]', method, 'id=' + id) } catch (e) {}
      this._sendFrame(Buffer.from(payload, 'utf8'), 0x1)
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('CDP response timeout for ' + method)) } }, 20000)
    })
  }

  connectClose() { try { this.socket.end() } catch (e) {} }
}

async function waitForJsonEndpoint(baseUrl, path, timeout = 10000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try { const json = await httpRequestJson('GET', `${baseUrl}${path}`, 2000); return json } catch (e) { await new Promise(r => setTimeout(r, 200)) }
  }
  throw new Error('Timeout waiting for ' + path)
}

async function launchChrome(remotePort, userDataDir, extraArgs = []) {
  const chrome = findChrome()
  const args = [
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-sync',
    '--disable-translate',
    '--enable-automation',
    '--disable-component-extensions-with-background-pages',
    '--window-size=1200,900',
    ...extraArgs
  ]
  const child = spawn(chrome, args, { detached: false, stdio: 'ignore' })
  return { child, chrome }
}

async function createTargetAndConnect(port, url) {
  const base = `http://127.0.0.1:${port}`
  const newUrl = url ? `${base}/json/new?${encodeURIComponent(url)}` : `${base}/json/new`
  const info = await httpRequestJson('PUT', newUrl, 5000)
  if (!info.webSocketDebuggerUrl) throw new Error('no webSocketDebuggerUrl')
  const ws = new MinimalWebSocket(info.webSocketDebuggerUrl)
  console.log('Connecting to CDP websocket:', info.webSocketDebuggerUrl)
  await ws.connect()
  console.log('CDP websocket connected')
  return ws
}

async function waitForEvent(ws, method, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const off = ws.on(method, (params) => { off(); resolve(params) })
    setTimeout(() => { off(); reject(new Error('timeout waiting for ' + method)) }, timeout)
  })
}

const LCP_SCRIPT = `(function(){try{window.__nimbi_bench_lcp=null;const po=new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__nimbi_bench_lcp=Math.round(e.renderTime||e.loadTime||e.startTime||0)}});po.observe({type:'largest-contentful-paint', buffered:true});}catch(e){}})();`

async function getPageMetrics(ws) {
  try {
    const expr = `(function(){var nav = performance.getEntriesByType('navigation')[0]; var navDuration = Math.round((nav && nav.duration) || (performance.timing.loadEventEnd - performance.timing.navigationStart)); var ttfb = Math.round((nav && nav.responseStart) || (performance.timing.responseStart - performance.timing.navigationStart)); var lcp = (window.__nimbi_bench_lcp==null?null:Math.round(window.__nimbi_bench_lcp)); return {navDuration: navDuration, ttfb: ttfb, lcp: lcp};})()`
    const r = await ws.sendCommand('Runtime.evaluate', { expression: expr, returnByValue: true })
    if (r && r.result && r.result.value) return r.result.value
  } catch (e) {}
  return { navDuration: null, ttfb: null, lcp: null }
}

async function runColdLoadOnce(siteUrl) {
  const port = await getFreePort()
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-bench-'))
  const { child } = await launchChrome(port, userDataDir)
  try {
    const base = `http://127.0.0.1:${port}`
    await waitForJsonEndpoint(base, '/json/version', 10000)
    const ws = await createTargetAndConnect(port)
    // enable Page domain before adding the script so it takes effect
    await ws.sendCommand('Page.enable')
    await ws.sendCommand('Page.addScriptToEvaluateOnNewDocument', { source: LCP_SCRIPT })
    await ws.sendCommand('Network.enable')
    await ws.sendCommand('Runtime.enable')
    await new Promise(r => setTimeout(r, 200))
    await ws.sendCommand('Page.navigate', { url: siteUrl })
    await waitForEvent(ws, 'Page.loadEventFired', 60000)
    const metrics = await getPageMetrics(ws)
    ws.connectClose()
    return metrics
  } finally {
    try { process.kill(child.pid) } catch (e) {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }) } catch (e) {}
  }
}

async function runTransitionOnce(port, baseUrl, internalLink) {
  const ws = await createTargetAndConnect(port)
    try {
      await ws.sendCommand('Page.enable')
      await ws.sendCommand('Page.addScriptToEvaluateOnNewDocument', { source: LCP_SCRIPT })
      await ws.sendCommand('Network.enable')
      await ws.sendCommand('Runtime.enable')
      await ws.sendCommand('Page.navigate', { url: baseUrl })
      await waitForEvent(ws, 'Page.loadEventFired', 60000)
      await ws.sendCommand('Page.navigate', { url: internalLink })
      await waitForEvent(ws, 'Page.loadEventFired', 60000)
      const metrics = await getPageMetrics(ws)
      ws.connectClose()
      return metrics
  } finally {
    try { ws.connectClose() } catch (e) {}
  }
}

function percentile(arr, p) { if (!arr.length) return 0; const a = arr.slice().sort((x, y) => x - y); const idx = Math.ceil(p * a.length) - 1; return a[Math.max(0, Math.min(a.length - 1, idx))] }

async function runBenchForSite(site) {
  console.log('Benchmarking', site)
  const cold = []
  for (let i = 0; i < runs; i++) {
    process.stdout.write(`Cold run ${i + 1}/${runs}... `)
    try { const m = await runColdLoadOnce(site); cold.push(m); console.log(JSON.stringify(m)) } catch (e) { console.log('error', e.message); cold.push({navDuration:null,ttfb:null,lcp:null}) }
  }

  const port = await getFreePort()
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-bench-'))
  const { child } = await launchChrome(port, userDataDir)
  try {
    const base = `http://127.0.0.1:${port}`
    await waitForJsonEndpoint(base, '/json/version', 10000)
    const ctl = await createTargetAndConnect(port)
    await ctl.sendCommand('Page.addScriptToEvaluateOnNewDocument', { source: LCP_SCRIPT })
    await ctl.sendCommand('Page.enable')
    await ctl.sendCommand('Runtime.enable')
    await ctl.sendCommand('Network.enable')
    await ctl.sendCommand('Page.navigate', { url: site })
    await waitForEvent(ctl, 'Page.loadEventFired', 60000)
    let internalLink = site
    try {
      const r = await ctl.sendCommand('Runtime.evaluate', { expression: `(function(){const a=Array.from(document.querySelectorAll('a[href]'));const v=a.map(x=>x.href).find(h=>{try{const u=new URL(h,location.href);return u.origin===location.origin && u.href!==location.href && !/^mailto:/i.test(h) && !h.includes('#')}catch(e){return false}});return v||location.href})()`, returnByValue: true })
      if (r && r.result && typeof r.result.value === 'string' && r.result.value) internalLink = r.result.value
    } catch (e) {}
    ctl.connectClose()

    const trans = []
    for (let i = 0; i < runs; i++) {
      process.stdout.write(`Transition run ${i + 1}/${runs}... `)
      try { const m = await runTransitionOnce(port, site, internalLink); trans.push(m); console.log(JSON.stringify(m)) } catch (e) { console.log('error', e.message); trans.push({navDuration:null,ttfb:null,lcp:null}) }
    }

    return { site, cold, trans }
  } finally {
    try { process.kill(child.pid) } catch (e) {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }) } catch (e) {}
  }
}

function median(arr) { if (!arr.length) return 0; const a = arr.slice().sort((x, y) => x - y); const mid = Math.floor(a.length / 2); return a.length % 2 ? a[mid] : Math.round((a[mid - 1] + a[mid]) / 2) }

async function main() {
  console.log('Using runs =', runs)
  const results = []
  for (const s of sites) { const r = await runBenchForSite(s); results.push(r) }
  const report = { timestamp: new Date().toISOString(), runs, results }
  const outName = path.join(OUTPUT_DIR, `bench-report-${Date.now()}.json`)
  fs.writeFileSync(outName, JSON.stringify(report, null, 2), 'utf8')
  console.log('\nSummary:')
  for (const r of results) {
    const coldVals = r.cold.map(x => x && typeof x.navDuration === 'number' ? x.navDuration : null).filter(v => v !== null)
    const transVals = r.trans.map(x => x && typeof x.navDuration === 'number' ? x.navDuration : null).filter(v => v !== null)
    console.log(`\nSite: ${r.site}`)
    console.log(`Cold runs: ${JSON.stringify(r.cold)}`)
    console.log(`  median navDuration: ${median(coldVals)}  p90: ${percentile(coldVals, 0.9)}`)
    console.log(`Transition runs: ${JSON.stringify(r.trans)}`)
    console.log(`  median navDuration: ${median(transVals)}  p90: ${percentile(transVals, 0.9)}`)
  }
  console.log('\nFull report saved to', outName)
}

main().catch(err => { console.error('Error:', err); process.exitCode = 2 })
