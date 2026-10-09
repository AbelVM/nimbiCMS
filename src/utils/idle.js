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
  if (typeof globalThis.scheduler?.yield === "function") {
    try {
      return globalThis.scheduler.yield();
    } catch (e) {}
  }
  if (typeof requestIdleCallback === "function") {
    return new Promise((resolve) => {
      try {
        requestIdleCallback(resolve, { timeout: 50 });
      } catch (e) {
        // requestIdleCallback threw: fall back to a macrotask.
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

/**
 * Create a time-budgeted yield gate.
 *
 * The count-based {@link yieldIfNeeded} yields every N iterations regardless
 * of how long each iteration takes. That is a poor proxy: a loop doing cheap
 * string work yields far more often than it needs to, while a loop doing
 * per-iteration I/O can block for seconds between yields. The nine call sites
 * in this codebase use thresholds from 8 to 128, which is the symptom.
 *
 * A gate created here yields once per `budgetMs` of *elapsed time* instead,
 * so the yield rate adapts to the actual cost of the work.
 *
 * @param {number} [budgetMs=16] - Minimum elapsed time between yields. 16ms
 *   is roughly one animation frame, which keeps the main thread responsive
 *   without yielding so often that throughput collapses.
 * @returns {() => Promise<void>} Call once per loop iteration.
 */
export function createYieldGate(budgetMs = 16) {
  const budget = Number.isFinite(budgetMs) && budgetMs > 0 ? budgetMs : 16;
  const now = () =>
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  let last = now();
  return async function gate() {
    const t = now();
    if (t - last < budget) return;
    last = t;
    await yieldToEventLoop();
  };
}
