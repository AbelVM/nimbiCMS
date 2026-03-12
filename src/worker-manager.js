/**
 * Generic worker manager to centralize Worker lifecycle and messaging.
 *
 * @module worker-manager
 */

/**
 * Create a worker manager that lazily instantiates a Worker and provides
 * request/response semantics with timeout and automatic cleanup on errors.
 *
 * @param {function(): (Worker|null)} createWorker - Function that returns a new Worker instance when called.
 * @param {string} [name='worker'] - Friendly name used in console warnings.
 * @returns {{get: function(): (Worker|null), send: function(object, number=): Promise<any>, terminate: function(): void}}
 *   - `get()` returns the Worker instance or null.
 *   - `send(msg, timeoutMs?)` sends a message and returns a Promise that resolves with the worker reply or rejects on timeout/error.
 *   - `terminate()` forcefully terminates the worker and clears internal state.
 */
export function makeWorkerManager(createWorker, name = 'worker') {
  let _w = null

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
              console.warn('[' + name + '] worker termination failed', err)
            }
          })
        }
      } catch (e) {
        _w = null
        console.warn('[' + name + '] worker init failed', e)
      }
    }
    return _w
  }

  function terminate() {
    try {
      if (_w) {
        _w.terminate && _w.terminate()
        _w = null
      }
    } catch (e) {
      console.warn('[' + name + '] worker termination failed', e)
    }
  }

  function send(msg, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const w = get()
      if (!w) return reject(new Error('worker unavailable'))
      const id = String(Math.random())
      msg.id = id

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
        console.warn('[' + name + '] worker error event', ev)
        try {
          if (_w === w) { _w = null; w.terminate && w.terminate() }
        } catch (err) { console.warn('[' + name + '] worker termination failed', err) }
        reject(new Error(ev && ev.message || 'worker error'))
      }

      timeoutId = setTimeout(() => {
        cleanup()
        console.warn('[' + name + '] worker timed out')
        try { if (_w === w) { _w = null; w.terminate && w.terminate() } } catch (err) { console.warn('[' + name + '] worker termination on timeout failed', err) }
        reject(new Error('worker timeout'))
      }, timeout)

      w.addEventListener('message', handler)
      w.addEventListener('error', errHandler)
      try { w.postMessage(msg) } catch (e) { cleanup(); reject(e) }
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
      const blob = new Blob([code], { type: 'application/javascript' })
      const workerUrl = URL.createObjectURL(blob)
      return new Worker(workerUrl, { type: 'module' })
    }
  } catch (err) {
    // fall through to null
    console.warn('[worker-manager] createWorkerFromRaw failed', err)
  }
  return null
}
