/**
 * @module utils/renderer-manager
 */
import RendererWorker from '../worker/renderer.js?worker&inline'
import * as RendererModule from '../worker/renderer.js'
import { makeWorkerPool } from '../worker-manager.js'

const poolSize = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2

function _createRendererInstance() {
  if (typeof Worker !== 'undefined') {
    try { return new RendererWorker() } catch (e) { /* fallthrough to inline */ }
  }

  const listeners = { message: [], error: [] }
  const w = {
    addEventListener(type, fn) { if (!listeners[type]) listeners[type] = []; listeners[type].push(fn) },
    removeEventListener(type, fn) { if (!listeners[type]) return; const i = listeners[type].indexOf(fn); if (i !== -1) listeners[type].splice(i,1) },
    postMessage(msg) {
      setTimeout(async () => {
        try {
          const out = await RendererModule.handleWorkerMessage(msg)
          const ev = { data: out }
          (listeners.message || []).forEach(fn => fn(ev))
        } catch (e) {
          const ev = { data: { id: msg && msg.id, error: String(e) } }
          (listeners.message || []).forEach(fn => fn(ev))
        }
      }, 0)
    },
    terminate() { Object.keys(listeners).forEach(k => listeners[k].length = 0) }
  }
  return w
}

const _rendererManager = makeWorkerPool(() => _createRendererInstance(), 'markdown', poolSize)

export function initRendererWorker() { return _rendererManager.get() }
export function _sendToRenderer(msg) { return _rendererManager.send(msg, 3000) }
