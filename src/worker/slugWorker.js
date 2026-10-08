/**
 * @module worker/slugWorker
 */
import { decodeInbound, announceCapabilities } from "performance-helpers/powerMessageCodec";
import { buildSearchIndex, crawlForSlug } from "../slugSearchRuntime.js";

// Announce native structured-clone support so PowerPool can use native
// envelopes when available. Guarded for test environments where `postMessage`
// may not be the worker-style single-argument form yet.
try {
  if (typeof postMessage === "function") {
    postMessage(announceCapabilities({ native: true }));
  }
} catch (_) {}

/**
 * Worker `onmessage` handler for slug-related background tasks.
 * Uses `decodeInbound` to handle native envelopes, framed v2 messages,
 * and legacy bare JSON transparently.
 * @param {MessageEvent} ev - Message event; `ev.data` should be the request.
 * @returns {Promise<void>} Posts `{correlationId, response}` (PowerPool) or `{id, result}` (legacy).
 */
onmessage = async (ev) => {
  const decoded = decodeInbound(ev.data);
  const msg = decoded.value;
  const correlationId = decoded.correlationId ?? msg.correlationId;
  const _reply = (result) => {
    if (correlationId != null) {
      postMessage({ correlationId, response: result });
    } else {
      postMessage({ id: msg.id, result });
    }
  };
  const _replyErr = (error) => {
    if (correlationId != null) {
      postMessage({ correlationId, response: { error: String(error) } });
    } else {
      postMessage({ id: msg.id, error: String(error) });
    }
  };
  try {
    if (msg.type === "buildSearchIndex") {
      const { contentBase, indexDepth, noIndexing, seedPaths } = msg;
      try {
        const res = await buildSearchIndex(
          contentBase,
          indexDepth,
          noIndexing,
          seedPaths,
        );
        _reply(res);
      } catch (e) {
        _replyErr(e);
      }
      return;
    }
    if (msg.type === "crawlForSlug") {
      const { slug, base, maxQueue } = msg;
      try {
        const res = await crawlForSlug(slug, base, maxQueue);
        _reply(res === undefined ? null : res);
      } catch (e) {
        _replyErr(e);
      }
      return;
    }
  } catch (e) {
    _replyErr(e);
  }
};

/**
 * Helper to process slug-worker messages outside of a Worker.
 * @param {Object} msg - Message object for slug worker (see onmessage shapes above).
 * @returns {Promise<Object>} Response object matching worker posts (`{id, result}` or `{id, error}`).
 */
export async function handleSlugWorkerMessage(msg) {
  try {
    if (msg.type === "buildSearchIndex") {
      const { id, contentBase, indexDepth, noIndexing, seedPaths } = msg;
      try {
        const res = await buildSearchIndex(
          contentBase,
          indexDepth,
          noIndexing,
          seedPaths,
        );
        return { id, result: res };
      } catch (e) {
        return { id, error: String(e) };
      }
    }
    if (msg.type === "crawlForSlug") {
      const { id, slug, base, maxQueue } = msg;
      try {
        const res = await crawlForSlug(slug, base, maxQueue);
        return { id, result: res === undefined ? null : res };
      } catch (e) {
        return { id, error: String(e) };
      }
    }
    return { id: msg?.id, error: "unsupported message" };
  } catch (e) {
    return { id: msg?.id, error: String(e) };
  }
}
