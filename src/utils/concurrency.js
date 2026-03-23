/**
 * Simple concurrency runner for async tasks.
 * @module utils/concurrency
 */

/**
 * Run items through an async worker function with limited concurrency.
 * @template T,U
 * @param {T[]} items - Array of items to process
 * @param {(item:T, index:number)=>Promise<U>} worker - Async worker function
 * @param {number} [concurrency=4] - Max concurrent workers
 * @returns {Promise<Array<U>>}
 */
export async function runWithConcurrency(items, worker, concurrency = 4) {
  if (!Array.isArray(items) || items.length === 0) return []
  const results = new Array(items.length)
  let i = 0
  const runners = []
  const limit = Math.max(1, Number(concurrency) || 1)

  async function runner() {
    while (true) {
      const idx = i++
      if (idx >= items.length) return
      try {
        results[idx] = await worker(items[idx], idx)
      } catch (err) {
        results[idx] = undefined
      }
    }
  }

  for (let j = 0; j < Math.min(limit, items.length); j++) runners.push(runner())
  await Promise.all(runners)
  return results
}
