/**
 * Generic worker manager to centralize Worker lifecycle and messaging.
 *
 * @module worker-manager
 */

/**
 * @typedef {Object} WorkerManager
 * @property {() => (Worker|null)} get - Return the Worker instance or null.
 * @property {(msg: any, timeout?: number) => Promise<unknown>} send - Send a message to the worker and await a response.
 * @property {() => void} terminate - Terminate the worker and clear internal state.
 */

import { debugWarn } from './utils/debug.js'

/**
 * Shape of a request sent to the worker manager. `type` is the worker action
 * name and `id` is injected by the manager when sending.
 * @typedef {{type:string,id?:string} & Record<string, unknown>} WorkerRequest
 */

/**
 * Shape of a worker response message. `id` matches the request id and
 * either `result` or `error` is present.
 * @typedef {{id?:string,result?:unknown,error?:string}} WorkerResponse
 */
/**
 * Create a worker manager that lazily instantiates a Worker and provides
 * request/response semantics with timeout and automatic cleanup on errors.
 * @param {function(): (Worker|null)} createWorker - Function that returns a new Worker instance when called.
 * @param {string} [name='worker'] - Friendly name used in console warnings.
 * @returns {WorkerManager} - The worker manager API with `get`, `send`, and `terminate` methods.
 */
export function makeWorkerManager(createWorker, name = 'worker') {
  let _w = null
  function _warn(...args) { try { debugWarn(...args) } catch (e) {} }

  /**
   * Return the underlying Worker instance, creating it lazily.
   * @returns {(Worker|null)}
   */
  function get() {
    if (!_w) {
      try {
        const w = createWorker()
        _w = w || null
        if (w) {
          w.addEventListener('error', () => {
              try {
                if (_w === w) {
                  _w = null
                  w.terminate && w.terminate()
                }
              } catch (err) {
                _warn('[' + name + '] worker termination failed', err)
              }
            })
        }
      } catch (e) {
        _w = null
        _warn('[' + name + '] worker init failed', e)
      }
    }
    return _w
  }

  /**
   * Terminate and clear the managed worker.
   * @returns {void}
   */
  function terminate() {
    try {
      if (_w) {
        _w.terminate && _w.terminate()
        _w = null
      }
    } catch (e) {
      _warn('[' + name + '] worker termination failed', e)
    }
  }

  /**
  * Send a message to the worker and wait for a response.
  * @param {WorkerRequest} msg - Message payload for the worker.
  * @param {number} [timeout=10000] - Timeout in milliseconds.
  * @returns {Promise<unknown>} - Promise resolving to the worker response `result`.
  */
  function send(msg, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const w = get()
      if (!w) return reject(new Error('worker unavailable'))
      const id = String(Math.random())
      const outMsg = Object.assign({}, msg, { id })

      let timeoutId = null
      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        w.removeEventListener('message', handler)
        w.removeEventListener('error', errHandler)
      }

      const handler = (ev) => {
        /** @type {WorkerResponse} */
        const data = ev.data || {}
        if (data.id !== id) return
        cleanup()
        if (data.error) reject(new Error(data.error))
        else resolve(data.result)
      }

      const errHandler = (ev) => {
        cleanup()
        _warn('[' + name + '] worker error event', ev)
        try {
          if (_w === w) { _w = null; w.terminate && w.terminate() }
        } catch (err) { _warn('[' + name + '] worker termination failed', err) }
        reject(new Error(ev && ev.message || 'worker error'))
      }

        timeoutId = setTimeout(() => {
        cleanup()
        _warn('[' + name + '] worker timed out')
        try { if (_w === w) { _w = null; w.terminate && w.terminate() } } catch (err) { _warn('[' + name + '] worker termination on timeout failed', err) }
        reject(new Error('worker timeout'))
      }, timeout)

      w.addEventListener('message', handler)
      w.addEventListener('error', errHandler)
      try { w.postMessage(outMsg) } catch (e) { cleanup(); reject(e) }
    })
  }

  /** @type {WorkerManager} */
  const api = { get, send, terminate }
  return api
}

/**
 * Create a simple pool of workers to allow parallel work.
 * @param {function(): (Worker|null)} createWorker - factory for a single Worker instance
 * @param {string} [name='worker-pool'] - friendly name
 * @param {number} [size=2] - number of workers in the pool
 * @returns {Object} - manager with `get`, `send`, and `terminate`
 */
export function makeWorkerPool(createWorker, name = 'worker-pool', size = 2) {
  const _ws = new Array(size).fill(null)
  let _idx = 0

  function _poolWarn(...args) { try { debugWarn(...args) } catch (e) {} }

  function _create(i) {
    if (!_ws[i]) {
      try {
        const w = createWorker()
        _ws[i] = w || null
        if (w) {
          w.addEventListener('error', () => {
            try { if (_ws[i] === w) { _ws[i] = null; w.terminate && w.terminate() } } catch (err) { _poolWarn('[' + name + '] worker termination failed', err) }
          })
        }
      } catch (e) { _ws[i] = null; _poolWarn('[' + name + '] worker init failed', e) }
    }
    return _ws[i]
  }

  const _lastUsed = new Array(size).fill(0)
  const _idleTimers = new Array(size).fill(null)
  const IDLE_MS = 30 * 1000 // 30s default idle timeout

  function _markUsed(i) {
    try {
      _lastUsed[i] = Date.now()
      if (_idleTimers[i]) { clearTimeout(_idleTimers[i]); _idleTimers[i] = null }
      _idleTimers[i] = setTimeout(() => {
        try {
          if (_ws[i]) { _ws[i].terminate && _ws[i].terminate(); _ws[i] = null }
        } catch (e) { _poolWarn('[' + name + '] idle termination failed', e) }
        _idleTimers[i] = null
      }, IDLE_MS)
    } catch (e) { /* swallow */ }
  }

  function get() {
    for (let i = 0; i < _ws.length; i++) {
      const w = _create(i)
      if (w) return w
    }
    return null
  }

  function terminate() {
    for (let i = 0; i < _ws.length; i++) {
      try { if (_ws[i]) { _ws[i].terminate && _ws[i].terminate(); _ws[i] = null } } catch (e) { _poolWarn('[' + name + '] worker termination failed', e) }
    }
  }

  function send(msg, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = (_idx++) % _ws.length
      const trySend = (attempt) => {
        const i = (start + attempt) % _ws.length
        const w = _create(i)
        if (!w) {
          if (attempt + 1 < _ws.length) return trySend(attempt + 1)
          return reject(new Error('worker pool unavailable'))
        }

        const id = String(Math.random())
        const outMsg = Object.assign({}, msg, { id })
        let timeoutId = null
        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId)
          w.removeEventListener('message', handler)
          w.removeEventListener('error', errHandler)
        }

        const handler = (ev) => {
          const data = ev.data || {}
          if (data.id !== id) return
          cleanup()
          if (data.error) reject(new Error(data.error))
          else resolve(data.result)
        }

        const errHandler = (ev) => {
          cleanup()
          _poolWarn('[' + name + '] worker error event', ev)
          try { if (_ws[i] === w) { _ws[i] = null; w.terminate && w.terminate() } } catch (err) { _poolWarn('[' + name + '] worker termination failed', err) }
          reject(new Error(ev && ev.message || 'worker error'))
        }

        timeoutId = setTimeout(() => {
          cleanup()
          _poolWarn('[' + name + '] worker timed out')
          try { if (_ws[i] === w) { _ws[i] = null; w.terminate && w.terminate() } } catch (err) { _poolWarn('[' + name + '] worker termination on timeout failed', err) }
          reject(new Error('worker timeout'))
        }, timeout)

        w.addEventListener('message', handler)
        w.addEventListener('error', errHandler)
        try {
          _markUsed(i)
          w.postMessage(outMsg)
        } catch (e) { cleanup(); reject(e) }
      }

      trySend(0)
    })
  }

  return { get, send, terminate }
}

/**
 * Convenience helper that builds a `Blob` URL from a raw worker source string
 * and returns a newly constructed `Worker`. If the environment does not
 * support `Blob`/`URL.createObjectURL` this returns `null`.
 *
 * @param {string} code - JavaScript source code for the worker as a string.
 * @returns {(Worker|null)} A Worker instance configured with `type: 'module'`, or `null` if creation failed.
 */
export function createWorkerFromRaw(code) {
  try {
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && code) {
      try {
        if (!createWorkerFromRaw._blobUrlCache) createWorkerFromRaw._blobUrlCache = new Map()
        const cache = createWorkerFromRaw._blobUrlCache
        let workerUrl = cache.get(code)
        if (!workerUrl) {
          const blob = new Blob([code], { type: 'application/javascript' })
          workerUrl = URL.createObjectURL(blob)
          cache.set(code, workerUrl)
        }
        return new Worker(workerUrl, { type: 'module' })
      } catch (err) {
        try { debugWarn('[worker-manager] createWorkerFromRaw failed', err) } catch (e) {}
      }
    }
  } catch (err) {
    try { debugWarn('[worker-manager] createWorkerFromRaw failed', err) } catch (e) {}
  }
  return null
}
