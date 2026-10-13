/**
 * @module worker/anchorWorker
 */
import { rewriteAnchorsHtml } from "./anchorRuntime.js";
import { decodeInbound, announceCapabilities } from "performance-helpers/powerMessageCodec";

// Announce native structured-clone support so PowerPool can use native
// envelopes when available. Guarded for test environments where `postMessage`
// may not be the worker-style single-argument form yet.
try {
  if (typeof postMessage === "function") {
    postMessage(announceCapabilities({ native: true }));
  }
} catch (_) {}

/**
 * Worker `onmessage` handler for anchor rewrite messages.
 * Uses `decodeInbound` to handle native envelopes, framed v2 messages,
 * and legacy bare JSON transparently.
 * @param {MessageEvent} ev
 * @returns {Promise<void>}
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
    if (msg.type === "rewriteAnchors") {
      const { html, contentBase, pagePath, snapshot } = msg;
      try {
        const result = await rewriteAnchorsHtml(
          html,
          contentBase,
          pagePath,
          snapshot,
        );
        _reply(result);
      } catch (e) {
        _replyErr(e);
      }
      return;
    }
  } catch (e) {
    _replyErr(e);
  }
};
