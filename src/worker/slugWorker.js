/**
 * @module worker/slugWorker
 */
import { u82o, o2u8 } from "performance-helpers/powerBuffer";
import { buildSearchIndex, crawlForSlug } from "../slugSearchRuntime.js";

function _decodeMsg(data) {
  try {
    return u82o(data);
  } catch (_) {
    return data || {};
  }
}

/**
 * Worker `onmessage` handler for slug-related background tasks.
 * Accepts both plain objects (legacy) and binary Uint8Array payloads (PowerPool protocol).
 * @param {MessageEvent} ev - Message event; `ev.data` should be the request.
 * @returns {Promise<void>} Posts `{correlationId, response}` (PowerPool) or `{id, result}` (legacy).
 */
onmessage = async (ev) => {
  const msg = _decodeMsg(ev.data);
  const { correlationId } = msg;
  const _reply = (result) => {
    if (correlationId != null) {
      const u8 = o2u8({ correlationId, response: result });
      postMessage(u8, [u8.buffer]);
    } else {
      postMessage({ id: msg.id, result });
    }
  };
  const _replyErr = (error) => {
    if (correlationId != null) {
      const u8 = o2u8({ correlationId, response: { error: String(error) } });
      postMessage(u8, [u8.buffer]);
    } else {
      postMessage({ id: msg.id, error: String(error) });
    }
  };
  try {
    if (msg.type === "buildSearchIndex") {
      const { contentBase, indexDepth, noIndexing } = msg;
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing);
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
      const { id, contentBase, indexDepth, noIndexing } = msg;
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing);
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
