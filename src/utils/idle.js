/**
 * Utilities to yield to the event loop / scheduler to keep the UI responsive
 * during long-running synchronous loops. Uses `requestIdleCallback` when
 * available, falling back to `setTimeout(..., 0)`.
 * @module utils/idle
 */

/**
 * Yield once to the event loop. Uses `requestIdleCallback` if present,
 * otherwise falls back to a microtask via `setTimeout(..., 0)`.
 * @returns {Promise<void>}
 */
export function yieldToEventLoop() {
  if (typeof requestIdleCallback === "function") {
    return new Promise((resolve) => {
      try {
        requestIdleCallback(resolve, { timeout: 50 });
      } catch (e) {
        setTimeout(resolve, 0);
      }
    });
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Conditionally yield based on an iteration counter. Call this from tight
 * loops to periodically yield control and avoid blocking the main thread.
 * @param {number} iteration - Current loop iteration (1-based or 0-based ok).
 * @param {number} [threshold=50] - Yield once every `threshold` iterations.
 * @returns {Promise<void>}
 */
export async function yieldIfNeeded(iteration, threshold = 50) {
  try {
    if (!iteration || !threshold) return;
    if (iteration % threshold === 0) await yieldToEventLoop();
  } catch (_) {
    /* best effort */
  }
}
