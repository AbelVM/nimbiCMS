/**
 * @module worker/anchorWorker
 */
import { rewriteAnchorsHtml } from './anchorRuntime.js'
import { u82o, o2u8 } from 'performance-helpers/powerBuffer'

/**
 * Worker entrypoint for rewriting anchor hrefs inside rendered HTML.
 *
 * Accepted messages:
 * - `{ type: 'rewriteAnchors', id: string, html: string, contentBase?: string, pagePath?: string }`
 *   -> posts `{ correlationId, response }` (PowerPool) or `{ id, result }` (legacy).
 */

/**
 * Worker `onmessage` handler for anchor rewrite messages.
 * Accepts both plain objects (legacy) and binary Uint8Array payloads (PowerPool protocol).
 * @param {MessageEvent} ev
 * @returns {Promise<void>}
 */
onmessage = async (ev) => {
  let msg
  try { msg = u82o(ev.data) } catch (_) {}
  msg = msg || ev.data || {}
  const { correlationId } = msg
  const _reply = (result) => {
    if (correlationId != null) {
      const u8 = o2u8({ correlationId, response: result })
      postMessage(u8, [u8.buffer])
    } else {
      postMessage({ id: msg.id, result })
    }
  }
  const _replyErr = (error) => {
    if (correlationId != null) {
      const u8 = o2u8({ correlationId, response: { error: String(error) } })
      postMessage(u8, [u8.buffer])
    } else {
      postMessage({ id: msg.id, error: String(error) })
    }
  }
  try {
    if (msg.type === 'rewriteAnchors') {
      const { html, contentBase, pagePath, snapshot } = msg
      try {
        const result = await rewriteAnchorsHtml(html, contentBase, pagePath, snapshot)
        _reply(result)
      } catch (e) {
        _replyErr(e)
      }
      return
    }
  } catch (e) {
    _replyErr(e)
  }
}


