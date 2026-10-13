/**
 * Worker-pool diagnostics.
 *
 * Aggregates per-pool `getStats()` snapshots and worker-fallback counters into
 * a single object for host pages and debugging tools. Also subscribes to each
 * registered PowerPool's `pool:worker:exit` event so a worker dying mid-flight
 * is recorded as a fallback rather than staying silent.
 *
 * ## Event wiring
 *
 * `PowerPool.addEventListener(type, cb)` proxies to the pool's internal
 * `PowerEventBus`. v2.1.0 emits `pool:worker:exit` from `_handleWorkerExit`
 * with `{ id, code, completedTask, remaining }`. We subscribe at
 * registration time and unsubscribe at teardown time, so a pool that is
 * discarded cannot leave a dangling listener behind.
 *
 * The fallback counter is keyed by a stable reason string. The pool emits one
 * event per dead worker, so the counter is the number of workers that died
 * while the pool was live — which is what the diagnostics are for.
 *
 * @module utils/workerPoolDiagnostics
 */

const pools = new Map()
const fallbackReasons = new Map()
const fallbackDurations = new Map()

/**
 * Reason used when a worker exits while the pool is live.
 * @type {string}
 */
const WORKER_EXIT_REASON = "worker-exit"

/**
 * Record a worker-fallback event.
 *
 * @param {string} [reason="unknown"] - Stable reason key (e.g. "worker-exit").
 * @param {number} [durationMs=0] - Optional duration in ms; only counted when finite and > 0.
 * @returns {void}
 */
export function recordWorkerFallback(reason = "unknown", durationMs = 0) {
  const key = String(reason || "unknown")
  fallbackReasons.set(key, (fallbackReasons.get(key) || 0) + 1)
  const duration = Number(durationMs)
  if (Number.isFinite(duration) && duration > 0) {
    fallbackDurations.set(key, (fallbackDurations.get(key) || 0) + duration)
  }
}

/**
 * Handler installed on each registered pool's `pool:worker:exit` event.
 *
 * @param {{ id?: unknown, code?: unknown, completedTask?: unknown, remaining?: unknown }} detail
 */
function _onWorkerExit(detail) {
  try {
    const id = detail && detail.id != null ? String(detail.id) : "unknown"
    const code = detail && detail.code != null ? String(detail.code) : "unknown"
    recordWorkerFallback(
      `${WORKER_EXIT_REASON}:${id}:code-${code}`,
    )
  } catch (_) {
    // Never let a diagnostic handler throw out of an event callback.
    recordWorkerFallback(WORKER_EXIT_REASON)
  }
}

/**
 * Register a pool for diagnostics and subscribe to its worker-exit events.
 *
 * Accepts any object that exposes `addEventListener(type, cb)` (a PowerPool)
 * as well as the legacy stub pools used when construction fails — those have
 * no `addEventListener`, which is handled gracefully.
 *
 * @param {string} name - Stable pool name (e.g. "slug", "renderer", "anchor").
 * @param {*} pool - Pool instance or stub.
 * @returns {*} The registered pool, for chaining.
 */
export function registerWorkerPool(name, pool) {
  if (name && pool) pools.set(name, pool)
  // Subscribe to dead-worker events when the pool exposes the API. The stub
  // pools returned on construction failure have no event bus, so guard.
  if (
    pool &&
    typeof pool.addEventListener === "function" &&
    typeof _onWorkerExit === "function"
  ) {
    try {
      pool.addEventListener("pool:worker:exit", _onWorkerExit)
    } catch (_) {
      // Some pool implementations reject unknown event types; ignore.
    }
  }
  return pool
}

/**
 * Unregister a pool and remove its worker-exit listener.
 *
 * @param {string} name - Pool name previously passed to `registerWorkerPool`.
 * @param {*} pool - Pool instance that was registered.
 * @returns {void}
 */
export function unregisterWorkerPool(name, pool) {
  if (pools.get(name) === pool) pools.delete(name)
  if (
    pool &&
    typeof pool.removeEventListener === "function" &&
    typeof _onWorkerExit === "function"
  ) {
    try {
      pool.removeEventListener("pool:worker:exit", _onWorkerExit)
    } catch (_) {
      // removeEventListener is best-effort; a torn-down pool may already be gone.
    }
  }
}

/**
 * Return a snapshot of per-pool stats and accumulated fallback counters.
 *
 * @returns {Object} Diagnostics object keyed by pool name, plus `_fallbacks`
 *   and `_fallbackDurationMs` maps when any fallback has been recorded.
 */
export function getWorkerPoolDiagnostics() {
  const result = {}
  for (const [name, pool] of pools) {
    let stats = null
    try {
      stats = typeof pool.getStats === "function" ? pool.getStats() : null
    } catch (_) {}
    result[name] = {
      queueLength: Number(stats?.queueLength) || 0,
      queuePressure: Number(stats?.queuePressure) || 0,
      activeTasks: Number(stats?.activeTasks) || 0,
      workerCount: Number(stats?.workerCount ?? pool.workers?.length) || 0,
    }
  }
  if (fallbackReasons.size) result._fallbacks = Object.fromEntries(fallbackReasons)
  if (fallbackDurations.size)
    result._fallbackDurationMs = Object.fromEntries(fallbackDurations)
  return result
}