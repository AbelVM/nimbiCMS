import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

/**
 * Worker entrypoint for slug-related background tasks.
 *
 * Accepted messages (via `postMessage`):
 * - `{ type: 'buildSearchIndex', id: string, contentBase: string }` -> posts `{id, result}`
 * - `{ type: 'crawlForSlug', id: string, slug: string, base?: string, maxQueue?: number }` -> posts `{id, result}`
 *
 * On error the worker posts `{id, error: string}`.
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  console.debug('[slugWorker] received message', msg)
  try {
    if (msg.type === 'buildSearchIndex') {
      const { id, contentBase, indexDepth, noIndexing } = msg
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing)
        postMessage({ id, result: res })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
    if (msg.type === 'crawlForSlug') {
      const { id, slug, base, maxQueue } = msg
      try {
        const res = await crawlForSlug(slug, base, maxQueue)
        postMessage({ id, result: res === undefined ? null : res })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}
