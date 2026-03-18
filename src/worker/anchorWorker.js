import { _rewriteAnchors } from '../htmlBuilder.js'

/**
 * Worker entrypoint for rewriting anchor hrefs inside rendered HTML.
 *
 * Accepted messages:
 * - `{ type: 'rewriteAnchors', id: string, html: string, contentBase?: string, pagePath?: string }`
 *   -> posts `{ id, result: string }` where `result` is the rewritten HTML string.
 *
 * On error the worker posts `{ id, error: string }`.
 */

/**
 * Worker `onmessage` handler for anchor rewrite messages.
 * @param {MessageEvent} ev - Message event whose `data` should contain the worker request
 * (e.g. `{ type: 'rewriteAnchors', id, html, contentBase?, pagePath? }`).
 * @returns {Promise<void>} Posts a `{id, result}` or `{id, error}` message.
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath)
        postMessage({ id, result: doc.body.innerHTML })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process an anchor-worker style message outside of a Worker.
 * @param {Object} msg - Message object (expects `type === 'rewriteAnchors'` and fields `id`, `html`, `contentBase`, `pagePath`).
 * @returns {Promise<Object>} Response shaped like the worker postMessage (contains `id` and `result` or `error`).
 */
export async function handleAnchorWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath)
        return { id, result: doc.body.innerHTML }
      } catch (e) {
        return { id, error: String(e) }
      }
    }
    return { id: msg && msg.id, error: 'unsupported message' }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
