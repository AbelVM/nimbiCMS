/**
 * @module utils/renderer-manager
 */
import RendererWorker from '../worker/renderer.entry.js?worker&inline'
import { PowerPool } from 'performance-helpers/powerPool'

const poolSize = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2

const _rendererPool = new PowerPool(RendererWorker, { size: poolSize, minSize: 1, autoScale: true })

/**
 * Return the underlying renderer worker instance, creating the pool lazily.
 * @returns {(Worker|null)} Worker instance or null when unavailable.
 */
export function initRendererWorker() { return _rendererPool.workers?.[0]?.worker?._underlying ?? null }

/**
 * Send a message to the renderer worker and await a response.
 * @param {Object} msg - Message payload to send to the renderer.
 * @param {number} [timeout] - Timeout in milliseconds (default: 3000).
 * @returns {Promise<unknown>} Promise resolving with the worker's result.
 */
export function _sendToRenderer(msg, timeout = 3000) {
  return _rendererPool.postMessage(msg, undefined, { awaitResponse: true, timeout })
    .then(result => {
      if (result && typeof result === 'object' && result.error) throw new Error(result.error)
      return result
    })
    .catch(e => {
      const m = e?.message || ''
      if (m.includes('postMessage response timeout')) throw new Error('worker timeout')
      throw e
    })
}
