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

onmessage = async (ev) => {
  const msg = ev.data || {}
  console.debug('[anchorWorker] received message', msg)
  try {
    if (msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        // parse the HTML string into a temporary document body
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
