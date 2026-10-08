const pools = new Map()
const fallbackReasons = new Map()
const fallbackDurations = new Map()

export function recordWorkerFallback(reason = "unknown", durationMs = 0) {
  const key = String(reason || "unknown")
  fallbackReasons.set(key, (fallbackReasons.get(key) || 0) + 1)
  const duration = Number(durationMs)
  if (Number.isFinite(duration) && duration > 0) {
    fallbackDurations.set(key, (fallbackDurations.get(key) || 0) + duration)
  }
}

export function registerWorkerPool(name, pool) {
  if (name && pool) pools.set(name, pool)
  return pool
}

export function unregisterWorkerPool(name, pool) {
  if (pools.get(name) === pool) pools.delete(name)
}

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
