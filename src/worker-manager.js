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
      console.warn('[' + name + '] worker termination failed', e)
    }
  }

  /**
  * Send a message to the worker and wait for a response.
  * @param {WorkerRequest} msg - Message payload for the worker.
  * @param {number} [timeout=1000] - Timeout in milliseconds.
  * @returns {Promise<unknown>} - Promise resolving to the worker response `result`.
  */
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
        /** @type {WorkerResponse} */
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

  /** @type {WorkerManager} */
  const api = { get, send, terminate }
  return api
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
    console.warn('[worker-manager] createWorkerFromRaw failed', err)
  }
  return null
}
